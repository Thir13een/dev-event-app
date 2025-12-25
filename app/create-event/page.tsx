import EventForm from "@/components/EventForm";

export default function CreateEventPage() {
    return (
        <section className="py-10">
            <div className="space-y-4 mb-12">
                <h1 className="text-center">
                    Create New Event
                </h1>
                <p className="text-center text-gray-400">
                    Share your hackathon, conference, or meetup with the community
                </p>
            </div>

            <EventForm />
        </section>
    );
}
