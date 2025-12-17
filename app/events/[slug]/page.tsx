export default async function EventDetailsPage({params} : {params: Promise<{slug: string}>}) {
    const {slug} = await params;
    const request = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/events/${slug}`);
    const {event} = await request.json();

    if(!event) return (
        <section id="event">
            <h1>Event Details: <br /> {slug}</h1>
            <p>Event not found</p>
        </section>
    )

    return (
        <section id="event">
            <h1>Event Details: <br /> {slug}</h1>
        </section>
    )
}
