import Link from "next/link";
import Image from "next/image";

interface Props {
    title: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

export default function EventCard({ title, slug, location, date, time } : Props) {
    return (
        <Link href={`/events/${slug}`} className="event-card">
            <p className="title">{title}</p>
            <div className="flex flex-row gap-2">
                <Image src="/icons/pin.svg" alt="Location" width={14} height={14} />
                <p>{location}</p>
            </div>

            <div className="datetime">
                <div>
                    <Image src="/icons/calendar.svg" alt="Date" width={14} height={14} />
                    <p>{date}</p>
                </div>
                <div>
                    <Image src="/icons/clock.svg" alt="Time" width={14} height={14} />
                    <p>{time}</p>
                </div>
            </div>
        </Link>
    )
}
