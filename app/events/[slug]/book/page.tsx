import Image from "next/image";
import BookingForm from "@/components/BookingForm";
import { formatEventDate, formatEventTime } from "@/lib/utils";
import { getBaseUrl } from "@/lib/server-url";

// Temporarily force dynamic rendering until site is working
// TODO: Switch back to ISR caching later (export const revalidate = 60)
export const dynamic = 'force-dynamic';

export default async function BookEventPage({params}: {params: Promise<{slug: string}>}) {
    const {slug} = await params;

    let event = null;
    let errorMessage = null;

    try {
        // Use absolute URL for Vercel deployment
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : await getBaseUrl();

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
            <section id="book-event">
                <h1>Event Not Found</h1>
                <p className="mt-2">
                    {errorMessage || "The event you're trying to book could not be found."}
                </p>
            </section>
        );
    }

    const formattedDate = formatEventDate(event.date, event.timezone, event.startAtUtc);
    const formattedTime = formatEventTime(event.time, event.timezone, event.startAtUtc);

    return (
        <section id="book-event">
            <div className="mb-6">
                <h1 className="mb-3">Book Your Spot</h1>
                <p className="text-light-200 text-lg">
                    Reserve your attendance at {event.title}
                </p>
            </div>

            <div className="bg-dark-100 border-dark-200 card-shadow rounded-[10px] border p-6 mb-6">
                <div className="flex flex-col gap-4">
                    <h3 className="text-2xl font-bold">{event.title}</h3>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <Image src="/icons/calendar.svg" alt="Date" width={20} height={20} />
                            <p className="text-light-200">{formattedDate}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Image src="/icons/clock.svg" alt="Time" width={20} height={20} />
                            <p className="text-light-200">{formattedTime}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Image src="/icons/pin.svg" alt="Location" width={20} height={20} />
                            <p className="text-light-200">{event.location}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Image src="/icons/mode.svg" alt="Mode" width={20} height={20} />
                            <p className="text-light-200 capitalize">{event.mode}</p>
                        </div>
                    </div>
                </div>
            </div>

            <BookingForm eventId={event._id} eventSlug={slug} />
        </section>
    )
}
