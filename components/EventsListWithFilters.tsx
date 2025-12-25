"use client";

import { useState, useMemo } from "react";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { formatEventDate, formatEventTime } from "@/lib/utils";
import CustomSelect from "@/components/CustomSelect";

interface EventsListWithFiltersProps {
    events: IEvent[];
}

export default function EventsListWithFilters({ events }: EventsListWithFiltersProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMode, setSelectedMode] = useState<string>("all");
    const [selectedTag, setSelectedTag] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"date-asc" | "date-desc">("date-asc");

    // Extract unique tags from all events
    const allTags = useMemo(() => {
        const tagsSet = new Set<string>();
        events.forEach(event => {
            if (Array.isArray(event.tags)) {
                event.tags.forEach(tag => {
                    if (typeof tag === 'string') {
                        tagsSet.add(tag);
                    }
                });
            }
        });
        return Array.from(tagsSet).sort();
    }, [events]);

    // Filter and sort events
    const filteredEvents = useMemo(() => {
        const filtered = events.filter(event => {
            // Search filter
            const matchesSearch = searchTerm === "" ||
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase());

            // Mode filter
            const matchesMode = selectedMode === "all" || event.mode === selectedMode;

            // Tag filter
            const matchesTag = selectedTag === "all" ||
                (Array.isArray(event.tags) && event.tags.includes(selectedTag));

            return matchesSearch && matchesMode && matchesTag;
        });

        // Sort events
        filtered.sort((a, b) => {
            const dateA = new Date(a.startAtUtc ?? a.date).getTime();
            const dateB = new Date(b.startAtUtc ?? b.date).getTime();
            return sortBy === "date-asc" ? dateA - dateB : dateB - dateA;
        });

        return filtered;
    }, [events, searchTerm, selectedMode, selectedTag, sortBy]);

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedMode("all");
        setSelectedTag("all");
        setSortBy("date-asc");
    };

    const hasActiveFilters = searchTerm !== "" || selectedMode !== "all" || selectedTag !== "all" || sortBy !== "date-asc";

    return (
        <div className="space-y-7">
            {/* Search and Filters */}
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search events by title, location, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 pl-12 bg-dark-100 border border-dark-200 rounded-lg focus:outline-none focus:border-blue transition-colors"
                    />
                    <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-3">
                    {/* Mode Filter */}
                    <CustomSelect
                        id="filter-mode"
                        value={selectedMode}
                        options={[
                            { value: "all", label: "All Modes" },
                            { value: "online", label: "Online" },
                            { value: "offline", label: "Offline" },
                            { value: "hybrid", label: "Hybrid" },
                        ]}
                        onChange={setSelectedMode}
                    />

                    {/* Tag Filter */}
                    <CustomSelect
                        id="filter-tag"
                        value={selectedTag}
                        options={[
                            { value: "all", label: "All Tags" },
                            ...allTags.map((tag) => ({ value: tag, label: tag })),
                        ]}
                        onChange={setSelectedTag}
                        fitWidthToLongestWord
                    />

                    {/* Sort By */}
                    <CustomSelect
                        id="filter-sort"
                        value={sortBy}
                        options={[
                            { value: "date-asc", label: "Date: Soonest First" },
                            { value: "date-desc", label: "Date: Latest First" },
                        ]}
                        onChange={(value) => setSortBy(value as "date-asc" | "date-desc")}
                    />

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <h3>
                    {filteredEvents.length === events.length
                        ? `All Events (${events.length})`
                        : `Showing ${filteredEvents.length} of ${events.length} events`
                    }
                </h3>
            </div>

            {/* Events Grid */}
            {filteredEvents.length > 0 ? (
                <ul className="events">
                    {filteredEvents.map((event: IEvent) => (
                        <li key={String(event._id)} className="list-none">
                            <EventCard
                                title={event.title}
                                slug={event.slug}
                                location={event.location}
                                date={formatEventDate(event.date, event.timezone, event.startAtUtc)}
                                time={formatEventTime(event.time, event.timezone, event.startAtUtc)}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-20 bg-dark-100 rounded-lg border border-dark-200">
                    <p className="text-light-200 text-lg mb-2">No events found</p>
                    <p className="text-light-200/60 text-sm">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
}
