import connectDB from "@/lib/mongodb";
import {NextRequest, NextResponse} from "next/server";
import Event from "@/database/event.model";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import mongoose from "mongoose";

dayjs.extend(utc);
dayjs.extend(timezone);

const normalizeStringArray = (items: unknown): string[] => {
    if (!Array.isArray(items)) {
        return [];
    }

    return items
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
};

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const eventData = await req.json();

        const eventDate = typeof eventData.date === "string" ? eventData.date.trim() : "";
        const eventTime = typeof eventData.time === "string" ? eventData.time.trim() : "";
        const eventTimezone = typeof eventData.timezone === "string" ? eventData.timezone.trim() : "";
        const startAt = dayjs.tz(
            `${eventDate} ${eventTime}`,
            "YYYY-MM-DD HH:mm",
            eventTimezone
        );

        if (!startAt.isValid()) {
            return NextResponse.json(
                { message: "Invalid date, time, or timezone" },
                { status: 400 }
            );
        }

        // Mongoose schema has trim: true for string fields
        // But arrays need manual trimming
        const processedData = {
            ...eventData,
            date: eventDate || eventData.date,
            time: eventTime || eventData.time,
            timezone: eventTimezone || eventData.timezone,
            startAtUtc: startAt.utc().toDate(),
            agenda: normalizeStringArray(eventData.agenda),
            tags: normalizeStringArray(eventData.tags),
        };

        const createdEvent = await Event.create(processedData);

        return NextResponse.json(
            { message: "Event created successfully", event: createdEvent },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
            return NextResponse.json(
                {
                    message: "Invalid event data",
                    error: error.message,
                },
                { status: 400 }
            );
        }

        // Log detailed error only in development
        if (process.env.NODE_ENV === "development") {
            console.error("Error creating event:", error);
        }

        return NextResponse.json(
            {
                message: "Failed to create event",
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

        // Get pagination parameters from query string
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '20', 10);

        // Validate pagination parameters
        const validPage = Math.max(1, page);
        const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page

        const skip = (validPage - 1) * validLimit;

        // Fetch events with pagination
        const [events, totalCount] = await Promise.all([
            Event.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(validLimit),
            Event.countDocuments()
        ]);

        const totalPages = Math.ceil(totalCount / validLimit);

        return NextResponse.json(
            {
                message: "Events fetched successfully",
                events,
                pagination: {
                    page: validPage,
                    limit: validLimit,
                    total: totalCount,
                    totalPages,
                    hasMore: validPage < totalPages
                }
            },
            { status: 200 }
        );
    } catch (error) {
        // Log detailed error only in development
        if (process.env.NODE_ENV === "development") {
            console.error("Error fetching events:", error);
        }

        return NextResponse.json(
            {
                message: "Failed to fetch events",
                ...(process.env.NODE_ENV === "development" && {
                    error: error instanceof Error ? error.message : "Unknown error"
                })
            },
            { status: 500 }
        );
    }
}

