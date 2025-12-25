import Image from "next/image";
import Link from "next/link";
import { formatEventDate, formatEventTime, parseArrayField } from "@/lib/utils";
import { getBaseUrl } from "@/lib/server-url";

export const revalidate = 60;

const EventDetailItem = ({icon, alt, label} : {icon: string, alt: string, label: string}) => (
    <div className="flex flex-row items-center gap-3 py-1">
        <Image src={icon} alt={alt} width={17} height={17} />
        <p className="text-light-200 text-sm font-light">{label}</p>
    </div>
)

export default async function EventDetailsPage({params} : {params: Promise<{slug: string}>}) {
    const {slug} = await params;

    let event = null;
    let errorMessage = null;

    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/events/${slug}`, {
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            errorMessage = `Failed to fetch event (${response.status})`;
        } else {
            const data = await response.json();
            event = data.event;
        }
    } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'Failed to load event';
    }

    if (errorMessage || !event) {
        return (
            <section id="event">
                <div className="header">
                    <h1>Event Not Found</h1>
                    <p className="mt-2">
                        {errorMessage || `The event "${slug}" could not be found.`}
                    </p>
                </div>
            </section>
        );
    }

    const formattedDate = formatEventDate(event.date, event.timezone, event.startAtUtc);
    const formattedTime = formatEventTime(event.time, event.timezone, event.startAtUtc);

    // Parse agenda and tags safely
    const agendaItems = parseArrayField(event.agenda || []);
    const tagItems = parseArrayField(event.tags || []);

    return (
        <section id="event" className="py-2">
            <div className="header mb-4">
                <h1 className="mb-2">{event.title}</h1>
                <p className="text-lg leading-relaxed">{event.description}</p>
            </div>

            <div className="details">
                <div className="content">
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
                                {agendaItems.map((item: string, index: number) => {
                                    const parts = item.split('|');
                                    const time = parts[0]?.trim();
                                    const description = parts[1]?.trim();

                                    return (
                                        <li key={index} className="leading-relaxed flex gap-4">
                                            {time && description ? (
                                                <>
                                                    <span className="inline-block w-28 flex-shrink-0">{time}</span>
                                                    <span className="text-light-200">|</span>
                                                    <span>{description}</span>
                                                </>
                                            ) : (
                                                <span>{item}</span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    )}

                    <section className="flex-col-gap-2 mb-3">
                        <h2 className="mb-2">Organizer</h2>
                        <p className="leading-relaxed">{event.organizer}</p>
                    </section>

                    {tagItems && tagItems.length > 0 && (
                        <section className="flex-col-gap-2 mb-6">
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

                    <Link
                        href={`/events/${slug}/book`}
                        className="bg-primary hover:bg-primary/90 w-full max-w-md cursor-pointer flex items-center justify-center rounded-[6px] px-6 py-3 text-lg font-semibold text-black transition-colors"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </section>
    )
}
