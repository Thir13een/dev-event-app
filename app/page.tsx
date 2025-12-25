import EventCard from "@/components/EventCard";
import Link from "next/link";
import { IEvent } from "@/database";
import { formatEventDate, formatEventTime } from "@/lib/utils";
import { getBaseUrl } from "@/lib/server-url";

export const revalidate = 60;

const Page = async () => {
    try {
        // Use absolute URL for Vercel deployment
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : await getBaseUrl();

        // Fetch only 6 events for featured section
        const response = await fetch(`${baseUrl}/api/events?limit=6`, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }

        const { events, pagination } = await response.json();

        // Use the fetched events directly (already limited to 6)
        const featuredEvents = events;

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
        console.error('Failed to fetch events:', error);
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
