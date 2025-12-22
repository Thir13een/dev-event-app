"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface BookingFormProps {
    eventId: string;
    eventSlug: string;
}

export default function BookingForm({ eventId, eventSlug }: BookingFormProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    eventId,
                    email,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to book event");
            }

            setSuccess(true);
            setEmail("");

            // Redirect to event page after 2 seconds
            setTimeout(() => {
                router.push(`/events/${eventSlug}`);
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-dark-100 border-dark-200 card-shadow rounded-[10px] border p-6">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-primary">Booking Confirmed!</h3>
                    <p className="text-light-200">
                        Your spot has been reserved. A confirmation email will be sent to you shortly.
                    </p>
                    <p className="text-light-200 text-sm">Redirecting you back to the event page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-dark-100 border-dark-200 card-shadow rounded-[10px] border p-6">
            <h3 className="text-xl font-bold mb-4">Enter Your Details</h3>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="text-light-200 text-sm mb-2 block">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        disabled={loading}
                        className="w-full"
                    />
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-[6px] p-3 text-red-400 text-sm mt-4">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Booking..." : "Confirm Booking"}
                </button>
            </form>
        </div>
    );
}
