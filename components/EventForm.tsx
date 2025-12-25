"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import CustomSelect from "@/components/CustomSelect";
import DateTimePickerFields from "@/components/DateTimePickerFields";

export default function EventForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const defaultTimezone = "UTC";

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        overview: "",
        venue: "",
        location: "",
        mode: "offline" as "online" | "offline" | "hybrid",
        audience: "",
        organizer: "",
        timezone: defaultTimezone,
    });

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const timeZoneOptions = useMemo(() => {
        const intlWithTimezones = Intl as typeof Intl & {
            supportedValuesOf?: (key: "timeZone") => string[];
        };
        if (typeof intlWithTimezones.supportedValuesOf === "function") {
            const options = intlWithTimezones.supportedValuesOf("timeZone");
            if (options.length > 0) {
                return Array.from(new Set([formData.timezone, ...options]));
            }
        }

        return [formData.timezone || defaultTimezone];
    }, [formData.timezone]);

    useEffect(() => {
        const resolvedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (resolvedTimezone) {
            setFormData((prev) => ({ ...prev, timezone: resolvedTimezone }));
        }
    }, []);

    const [agenda, setAgenda] = useState<{ time: string; description: string }[]>([
        { time: "", description: "" }
    ]);
    const [tags, setTags] = useState<string[]>([""]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAgendaChange = (index: number, field: "time" | "description", value: string) => {
        const newAgenda = [...agenda];
        newAgenda[index][field] = value;
        setAgenda(newAgenda);
    };

    const addAgendaItem = () => {
        setAgenda([...agenda, { time: "", description: "" }]);
    };

    const removeAgendaItem = (index: number) => {
        if (agenda.length > 1) {
            setAgenda(agenda.filter((_, i) => i !== index));
        }
    };

    const handleTagsChange = (index: number, value: string) => {
        const newTags = [...tags];
        newTags[index] = value;
        setTags(newTags);
    };

    const addTag = () => {
        setTags([...tags, ""]);
    };

    const removeTag = (index: number) => {
        if (tags.length > 1) {
            setTags(tags.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            if (!selectedDate) {
                throw new Error("Date is required");
            }

            if (!selectedTime) {
                throw new Error("Time is required");
            }

            if (!formData.timezone) {
                throw new Error("Timezone is required");
            }

            // Concatenate time and description with "|" separator
            const formattedAgenda = agenda
                .filter(item => item.time.trim() !== "" && item.description.trim() !== "")
                .map(item => `${item.time.trim()} | ${item.description.trim()}`);

            const filteredTags = tags.filter(tag => tag.trim() !== "");

            if (formattedAgenda.length === 0) {
                throw new Error("At least one agenda item is required");
            }

            if (filteredTags.length === 0) {
                throw new Error("At least one tag is required");
            }

            const formattedDate = selectedDate;
            const formattedTime = selectedTime;

            // Create request body
            const body = {
                ...formData,
                date: formattedDate,
                time: formattedTime,
                agenda: formattedAgenda,
                tags: filteredTags,
            };

            const response = await fetch("/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create event");
            }

            const result = await response.json();
            setSuccess(true);

            // Redirect to the new event page after 2 seconds
            setTimeout(() => {
                router.push(`/events/${result.event.slug}`);
            }, 2000);

        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
                    {error}
                </div>
            )}

            <div className="p-3 bg-blue/10 border border-blue/30 rounded-lg text-light-100 text-sm">
                All fields are required
            </div>

            {/* Title */}
            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">
                    Event Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-dark-100 border border-dark rounded-lg focus:outline-none focus:border-blue"
                    placeholder="e.g. React Summit 2025"
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 bg-dark-100 border border-dark rounded-lg focus:outline-none focus:border-blue resize-none"
                    placeholder="Brief description of the event"
                />
            </div>

            {/* Overview */}
            <div className="space-y-2">
                <label htmlFor="overview" className="block text-sm font-medium">
                    Overview
                </label>
                <textarea
                    id="overview"
                    name="overview"
                    value={formData.overview}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 bg-dark-100 border border-dark rounded-lg focus:outline-none focus:border-blue resize-none"
                    placeholder="Detailed overview of what attendees can expect"
                />
            </div>

            {/* Venue and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="venue" className="block text-sm font-medium">
                        Venue
                    </label>
                    <input
                        type="text"
                        id="venue"
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-dark-100 border border-dark rounded-lg focus:outline-none focus:border-blue"
                        placeholder="e.g. RAI Amsterdam"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="location" className="block text-sm font-medium">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-dark-100 border border-dark rounded-lg focus:outline-none focus:border-blue"
                        placeholder="e.g. Amsterdam, Netherlands"
                    />
                </div>
            </div>

            {/* Date and Time */}
            <DateTimePickerFields
                date={selectedDate}
                time={selectedTime}
                onDateChange={setSelectedDate}
                onTimeChange={setSelectedTime}
            />

            {/* Timezone */}
            <div className="space-y-2">
                <label htmlFor="timezone" className="block text-sm font-medium">
                    Timezone
                </label>
                <CustomSelect
                    id="timezone"
                    value={formData.timezone}
                    options={timeZoneOptions.map((timezone) => ({
                        value: timezone,
                        label: timezone.replace(/_/g, " "),
                    }))}
                    onChange={(value) => setFormData((prev) => ({ ...prev, timezone: value }))}
                />
            </div>

            {/* Mode */}
            <div className="space-y-2">
                <label htmlFor="mode" className="block text-sm font-medium">
                    Event Mode
                </label>
                <CustomSelect
                    id="mode"
                    value={formData.mode}
                    options={[
                        { value: "offline", label: "Offline (In-person)" },
                        { value: "online", label: "Online (Virtual)" },
                        { value: "hybrid", label: "Hybrid (Both)" },
                    ]}
                    onChange={(value) =>
                        setFormData((prev) => ({ ...prev, mode: value as "online" | "offline" | "hybrid" }))
                    }
                />
            </div>

            {/* Audience and Organizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="audience" className="block text-sm font-medium">
                        Target Audience
                    </label>
                    <input
                        type="text"
                        id="audience"
                        name="audience"
                        value={formData.audience}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-dark-100 border border-dark rounded-lg focus:outline-none focus:border-blue"
                        placeholder="e.g. Developers, Students, etc."
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="organizer" className="block text-sm font-medium">
                        Organizer
                    </label>
                    <input
                        type="text"
                        id="organizer"
                        name="organizer"
                        value={formData.organizer}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-dark-100 border border-dark rounded-lg focus:outline-none focus:border-blue"
                        placeholder="e.g. React Community"
                    />
                </div>
            </div>

            {/* Agenda */}
            <div className="space-y-2">
                <label className="block text-sm font-medium">
                    Agenda (at least one item)
                </label>
                {agenda.map((item, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            value={item.time}
                            onChange={(e) => handleAgendaChange(index, "time", e.target.value)}
                            className="w-32 px-4 py-2 bg-dark-100 border border-dark rounded-lg focus:outline-none focus:border-blue"
                            placeholder="09:00 AM"
                        />
                        <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleAgendaChange(index, "description", e.target.value)}
                            className="flex-1 px-4 py-2 bg-dark-100 border border-dark rounded-lg focus:outline-none focus:border-blue"
                            placeholder="Registration and Coffee"
                        />
                        {agenda.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeAgendaItem(index)}
                                className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addAgendaItem}
                    className="px-4 py-2 bg-blue/20 text-blue rounded-lg hover:bg-blue/30"
                >
                    + Add Agenda Item
                </button>
            </div>

            {/* Tags */}
            <div className="space-y-2">
                <label className="block text-sm font-medium">
                    Tags (at least one tag)
                </label>
                {tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            value={tag}
                            onChange={(e) => handleTagsChange(index, e.target.value)}
                            className="flex-1 px-4 py-2 bg-dark-100 border border-dark rounded-lg focus:outline-none focus:border-blue"
                            placeholder={`Tag ${index + 1} (e.g. React, JavaScript, Conference)`}
                        />
                        {tags.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeTag(index)}
                                className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue/20 text-blue rounded-lg hover:bg-blue/30"
                >
                    + Add Tag
                </button>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 glass border-2 border-blue/30 font-medium rounded-lg hover:border-blue hover:shadow-lg hover:shadow-blue/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gradient"
            >
                {isSubmitting ? "Creating Event..." : "Create Event"}
            </button>

            {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-500 text-center">
                    Event created successfully! Redirecting...
                </div>
            )}
        </form>
    );
}
