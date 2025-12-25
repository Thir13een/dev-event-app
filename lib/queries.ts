import "server-only";
import connectDB from "@/lib/mongodb";
import { Event } from "@/database";

export async function getEvents(limit?: number) {
    try {
        await connectDB();

        const query = Event.find()
            .sort({ createdAt: -1 })
            .lean();

        if (limit) {
            query.limit(limit);
        }

        const events = await query.exec();
        const total = await Event.countDocuments();

        return {
            events: JSON.parse(JSON.stringify(events)),
            pagination: {
                total,
                limit: limit || total,
            },
        };
    } catch (error) {
        console.error("Error fetching events from database:", error);
        return {
            events: [],
            pagination: {
                total: 0,
                limit: limit || 0,
            },
        };
    }
}

export async function getEventBySlug(slug: string) {
    try {
        await connectDB();

        const event = await Event.findOne({ slug }).lean();

        if (!event) {
            return null;
        }

        return JSON.parse(JSON.stringify(event));
    } catch (error) {
        console.error(`Error fetching event with slug "${slug}":`, error);
        return null;
    }
}
