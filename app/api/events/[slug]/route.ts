import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

interface RouteContext {
    params: Promise<{
        slug: string;
    }>;
}

export async function GET(
    req: NextRequest,
    context: RouteContext
) {
    try {
        await connectDB();

        const { slug } = await context.params;

        if (!slug.trim()) {
            return NextResponse.json(
                { message: "Invalid slug parameter" },
                { status: 400 }
            );
        }

        const event = await Event.findOne({ slug: slug.trim() });

        if (!event) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Event fetched successfully", event },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching event by slug:", error);
        return NextResponse.json(
            {
                message: "Failed to fetch event",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
