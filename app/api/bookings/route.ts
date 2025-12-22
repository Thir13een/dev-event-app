import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/database/booking.model";
import Event from "@/database/event.model";

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

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        // Check if user already booked this event
        const existingBooking = await Booking.findOne({
            eventId,
            email: email.toLowerCase(),
        });

        if (existingBooking) {
            return NextResponse.json(
                { message: "You have already booked this event" },
                { status: 409 }
            );
        }

        // Create booking
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
        console.error("Error creating booking:", error);
        return NextResponse.json(
            {
                message: "Failed to create booking",
                error: error instanceof Error ? error.message : "Unknown error",
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
        console.error("Error fetching bookings:", error);
        return NextResponse.json(
            {
                message: "Failed to fetch bookings",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
