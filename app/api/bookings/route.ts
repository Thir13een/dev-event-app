import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/database/booking.model";
import Event from "@/database/event.model";
import { Types } from "mongoose";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { eventId, email } = body;

        // Validate required fields
        if (!eventId || !email) {
            return NextResponse.json(
                { message: "Event ID and email are required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Invalid email format" },
                { status: 400 }
            );
        }

        if (!Types.ObjectId.isValid(eventId)) {
            return NextResponse.json(
                { message: "Invalid event ID" },
                { status: 400 }
            );
        }

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        // Create booking (duplicate bookings prevented by unique compound index)
        // If duplicate, MongoDB will throw error code 11000, caught below
        const booking = await Booking.create({
            eventId,
            email: email.toLowerCase(),
        });

        return NextResponse.json(
            {
                message: "Booking created successfully",
                booking,
            },
            { status: 201 }
        );
    } catch (error) {
        if (error && typeof error === "object" && "code" in error) {
            const code = (error as { code?: number }).code;
            if (code === 11000) {
                return NextResponse.json(
                    { message: "You have already booked this event" },
                    { status: 409 }
                );
            }
        }

        // Log detailed error only in development
        if (process.env.NODE_ENV === "development") {
            console.error("Error creating booking:", error);
        }

        return NextResponse.json(
            {
                message: "Failed to create booking",
                ...(process.env.NODE_ENV === "development" && {
                    error: error instanceof Error ? error.message : "Unknown error"
                })
            },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const eventId = searchParams.get("eventId");

        if (eventId) {
            if (!Types.ObjectId.isValid(eventId)) {
                return NextResponse.json(
                    { message: "Invalid event ID" },
                    { status: 400 }
                );
            }

            // Get bookings for specific event
            const bookings = await Booking.find({ eventId }).sort({ createdAt: -1 });
            return NextResponse.json(
                {
                    message: "Bookings fetched successfully",
                    bookings,
                    count: bookings.length,
                },
                { status: 200 }
            );
        }

        // Get all bookings
        const bookings = await Booking.find().sort({ createdAt: -1 });
        return NextResponse.json(
            {
                message: "All bookings fetched successfully",
                bookings,
                count: bookings.length,
            },
            { status: 200 }
        );
    } catch (error) {
        // Log detailed error only in development
        if (process.env.NODE_ENV === "development") {
            console.error("Error fetching bookings:", error);
        }

        return NextResponse.json(
            {
                message: "Failed to fetch bookings",
                ...(process.env.NODE_ENV === "development" && {
                    error: error instanceof Error ? error.message : "Unknown error"
                })
            },
            { status: 500 }
        );
    }
}
