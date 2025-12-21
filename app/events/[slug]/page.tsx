import Image from "next/image";
import Link from "next/link";

const EventDetailItem = ({icon, alt, label} : {icon: string, alt: string, label: string}) => (
    <div className="flex flex-row items-center gap-3 py-1">
        <Image src={icon} alt={alt} width={17} height={17} />
        <p className="text-light-200 text-sm font-light">{label}</p>
    </div>
)

export default async function EventDetailsPage({params} : {params: Promise<{slug: string}>}) {
    const {slug} = await params;
    const request = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/events/${slug}`, {
        cache: 'no-store'
    });
    const {event} = await request.json();

    if(!event) return (
        <section id="event">
            <div className="header">
                <h1>Event Not Found</h1>
                <p className="mt-2">The event &quot;{slug}&quot; could not be found.</p>
            </div>
        </section>
    )

    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Format time to 12-hour format
    const [hours, minutes] = event.time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const formattedTime = `${displayHour}:${minutes} ${ampm}`;

    // Parse agenda - handle if it's stored as array with JSON string inside
    let agendaItems = event.agenda;
    if (Array.isArray(agendaItems) && agendaItems.length === 1 && typeof agendaItems[0] === 'string') {
        try {
            agendaItems = JSON.parse(agendaItems[0]);
        } catch (e) {
            // If parsing fails, keep original
        }
    }

    // Parse tags - handle if it's stored as array with JSON string inside
    let tagItems = event.tags;
    if (Array.isArray(tagItems) && tagItems.length === 1 && typeof tagItems[0] === 'string') {
        try {
            tagItems = JSON.parse(tagItems[0]);
        } catch (e) {
            // If parsing fails, keep original
        }
    }

    return (
        <section id="event" className="py-2">
            <div className="header mb-4">
                <h1 className="mb-2">{event.title}</h1>
                <p className="text-lg leading-relaxed">{event.description}</p>
            </div>

            <div className="details">
                <div className="content">
                    <Image
                        src={event.image}
                        alt={event.title}
                        width={800}
                        height={800}
                        className="banner mb-3"
                        priority
                    />

                    <section className="flex-col-gap-2 mb-3">
                        <h2 className="mb-2">Overview</h2>
                        <p className="leading-relaxed">{event.overview}</p>
                    </section>

                    <section className="flex-col-gap-2 mb-3">
                        <h2 className="mb-2">Event Details</h2>
                        <div className="flex flex-col gap-2">
                            <EventDetailItem
                                icon="/icons/pin.svg"
                                alt="Location"
                                label={event.location}
                            />
                            <EventDetailItem
                                icon="/icons/calendar.svg"
                                alt="Date"
                                label={formattedDate}
                            />
                            <EventDetailItem
                                icon="/icons/clock.svg"
                                alt="Time"
                                label={formattedTime}
                            />
                            <EventDetailItem
                                icon="/icons/mode.svg"
                                alt="Mode"
                                label={event.mode.charAt(0).toUpperCase() + event.mode.slice(1)}
                            />
                            {event.venue && (
                                <EventDetailItem
                                    icon="/icons/pin.svg"
                                    alt="Venue"
                                    label={event.venue}
                                />
                            )}
                            <EventDetailItem
                                icon="/icons/audience.svg"
                                alt="Audience"
                                label={event.audience}
                            />
                        </div>
                    </section>

                    {agendaItems && agendaItems.length > 0 && (
                        <section className="flex-col-gap-2 agenda mb-3">
                            <h2 className="mb-2">Agenda</h2>
                            <ul className="space-y-2">
                                {agendaItems.map((item: string, index: number) => (
                                    <li key={index} className="leading-relaxed">{item}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <section className="flex-col-gap-2 mb-3">
                        <h2 className="mb-2">Organizer</h2>
                        <p className="leading-relaxed">{event.organizer}</p>
                    </section>

                    {tagItems && tagItems.length > 0 && (
                        <section className="flex-col-gap-2">
                            <h2 className="mb-2">Tags</h2>
                            <div className="flex flex-row flex-wrap gap-3">
                                {tagItems.map((tag: string, index: number) => (
                                    <span key={index} className="pill">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <aside className="booking">
                    <div className="signup-card sticky top-24">
                        <div className="flex flex-col gap-2 pb-4 border-b border-gray-700">
                            <h3 className="text-xl font-bold">Book Your Spot</h3>
                            <p className="text-light-200 text-sm leading-relaxed">
                                Secure your attendance at this event
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 py-4">
                            <div className="flex items-center gap-3">
                                <Image src="/icons/calendar.svg" alt="Date" width={16} height={16} />
                                <p className="text-light-200 text-sm">{formattedDate}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Image src="/icons/clock.svg" alt="Time" width={16} height={16} />
                                <p className="text-light-200 text-sm">{formattedTime}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Image src="/icons/mode.svg" alt="Mode" width={16} height={16} />
                                <p className="text-light-200 text-sm capitalize">{event.mode}</p>
                            </div>
                        </div>

                        <Link
                            href={`/events/${slug}/book`}
                            className="bg-primary hover:bg-primary/90 w-full cursor-pointer flex items-center justify-center rounded-[6px] px-4 py-3 text-lg font-semibold text-black transition-colors mt-2"
                        >
                            Book Now
                        </Link>
                    </div>
                </aside>
            </div>
        </section>
    )
}
