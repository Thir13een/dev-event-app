import EventsListWithFilters from "@/components/EventsListWithFilters";
import { getEvents } from "@/lib/queries";

export const revalidate = 60;

const EventsPage = async () => {
    try {
        // Fetch all events directly from MongoDB for client-side filtering
        // EventsListWithFilters needs all events to filter/sort properly
        const { events } = await getEvents(100);

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
