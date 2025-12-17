import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";

const Page = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/events`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }

        const { events } = await response.json();

        return (
            <section>
                <h1 className="text-center">
                    The Hub for Every Dev <br /> Event You Can&apos;t Miss
                </h1>
                <p className="text-center mt-5">
                    Hackathons, Meetups, and Conferences, All in One Place
                </p>

                <ExploreBtn />

                <div className="mt-20 space-y-7">
                    <h3>Featured Events</h3>

                    {events && events.length > 0 ? (
                        <ul className="events">
                            {events.map((event: any) => (
                                <li key={event._id} className="list-none">
                                    <EventCard
                                        title={event.title}
                                        image={event.image}
                                        slug={event.slug}
                                        location={event.location}
                                        date={new Date(event.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        time={event.time}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500">No events available</p>
                    )}
                </div>
            </section>
        );
    } catch (error) {
        return (
            <section>
                <h1 className="text-center">
                    The Hub for Every Dev <br /> Event You Can&apos;t Miss
                </h1>
                <p className="text-center mt-5">
                    Hackathons, Meetups, and Conferences, All in One Place
                </p>

                <ExploreBtn />

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
