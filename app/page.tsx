import EventCard from "@/components/EventCard";
import Link from "next/link";
import { IEvent } from "@/database";
import { formatEventDate, formatEventTime } from "@/lib/utils";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";

// Temporarily force dynamic rendering until site is working
// TODO: Switch back to ISR caching later (export const revalidate = 60)
export const dynamic = 'force-dynamic';

const Page = async () => {
    try {
        // Query MongoDB directly (avoid HTTP fetch issues on Vercel)
        console.log('Connecting to MongoDB...');
        await connectDB();
        console.log('Connected to MongoDB successfully');

        console.log('Fetching events...');
        const events = await Event.find()
            .sort({ createdAt: -1 })
            .limit(6)
            .lean();

        console.log(`Found ${events.length} events`);

        const totalEvents = await Event.countDocuments();
        console.log(`Total events in database: ${totalEvents}`);

        // Convert MongoDB documents to plain objects for client
        const featuredEvents = events
            .filter(event => event.date && event.startAtUtc) // Only include events with required dates
            .map(event => ({
                ...event,
                _id: event._id.toString(),
                date: event.date.toISOString(),
                startAtUtc: event.startAtUtc.toISOString(),
                createdAt: event.createdAt?.toISOString() || new Date().toISOString(),
                updatedAt: event.updatedAt?.toISOString() || new Date().toISOString(),
            })) as unknown as IEvent[];

        console.log('Events converted successfully');

        const pagination = {
            total: totalEvents
        };

        return (
            <section>
                <h1 className="text-center">
                    The Hub for Every Dev <br /> Event You Can&apos;t Miss
                </h1>
                <p className="text-center mt-5">
                    Hackathons, Meetups, and Conferences, All in One Place
                </p>

                <div className="mt-20 space-y-7">
                    <h3>Featured Events</h3>

                    {featuredEvents && featuredEvents.length > 0 ? (
                        <>
                            <ul className="events">
                                {featuredEvents.map((event: IEvent) => (
                                    <li key={String(event._id)} className="list-none">
                                        <EventCard
                                            title={event.title}
                                            slug={event.slug}
                                            location={event.location}
                                            date={formatEventDate(event.date, event.timezone, event.startAtUtc)}
                                            time={formatEventTime(event.time, event.timezone, event.startAtUtc)}
                                        />
                                    </li>
                                ))}
                            </ul>

                            {pagination.total > 6 && (
                                <div className="flex justify-center mt-12">
                                    <Link
                                        href="/events"
                                        className="px-8 py-3 glass border-2 border-blue/30 font-medium rounded-lg hover:border-blue hover:shadow-lg hover:shadow-blue/20 transition-all text-gradient"
                                    >
                                        View All Events ({pagination.total})
                                    </Link>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-center text-gray-500">No events available</p>
                    )}
                </div>
            </section>
        );
    } catch (error) {
        // Log detailed error for debugging
        console.error('Error loading events:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            error
        });

        return (
            <section>
                <h1 className="text-center">
                    The Hub for Every Dev <br /> Event You Can&apos;t Miss
                </h1>
                <p className="text-center mt-5">
                    Hackathons, Meetups, and Conferences, All in One Place
                </p>

                <div className="mt-20 space-y-7">
                    <h3>Featured Events</h3>
                    <p className="text-center text-red-500">
                        Failed to load events. Please try again later.
                    </p>
                </div>
            </section>
        );
    }
};

export default Page;
