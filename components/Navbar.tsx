import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    return (
        <header>
            <nav>
                <Link href="/" className="logo">
                    <Image src="/icons/logo.png" alt="DevEvent Logo" width={24} height={24} />
                    <p>DevEvent</p>
                </Link>

                <ul>
                    <Link href="/">Home</Link>
                    <Link href="/events">Events</Link>
                    <Link href="/create-event">Create Event</Link>
                </ul>
            </nav>
        </header>
    )
}