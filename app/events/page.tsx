import EventsListWithFilters from "@/components/EventsListWithFilters";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { IEvent } from "@/database";

// Temporarily force dynamic rendering until site is working
// TODO: Switch back to ISR caching later (export const revalidate = 60)
export const dynamic = 'force-dynamic';

const EventsPage = async () => {
    try {
        // Query MongoDB directly (avoid HTTP fetch issues on Vercel)
        await connectDB();

        const dbEvents = await Event.find()
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        // Convert MongoDB documents to plain objects for client
        const events = dbEvents
            .filter(event => event.date && event.startAtUtc) // Only include events with required dates
            .map(event => ({
                ...event,
                _id: event._id.toString(),
                date: event.date.toISOString(),
                startAtUtc: event.startAtUtc.toISOString(),
                createdAt: event.createdAt?.toISOString() || new Date().toISOString(),
                updatedAt: event.updatedAt?.toISOString() || new Date().toISOString(),
            })) as unknown as IEvent[];

        return (
            <section>
                <div className="space-y-4 mb-12">
                    <h1 className="text-center">
                        Explore All Events
                    </h1>
                    <p className="text-center">
                        Discover hackathons, conferences, and meetups happening worldwide
                    </p>
                </div>

                {events && events.length > 0 ? (
                    <EventsListWithFilters events={events} />
                ) : (
                    <div className="text-center py-20">
                        <p className="text-light-200 text-lg">No events available at the moment.</p>
                        <p className="text-light-200/60 text-sm mt-2">Check back soon for upcoming events!</p>
                    </div>
                )}
            </section>
        );
    } catch (error) {
        console.error('Error fetching events:', error);
        return (
            <section>
                <div className="space-y-4 mb-12">
                    <h1 className="text-center">
                        Explore All Events
                    </h1>
                    <p className="text-center">
                        Discover hackathons, conferences, and meetups happening worldwide
                    </p>
                </div>

                <div className="text-center py-20 bg-dark-100 rounded-lg border border-red-500/30">
                    <p className="text-red-500 text-lg">
                        Failed to load events. Please try again later.
                    </p>
                </div>
            </section>
        );
    }
};

export default EventsPage;
