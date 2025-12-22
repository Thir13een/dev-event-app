import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format a date to a human-readable string
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "June 10, 2026")
 */
export function formatEventDate(date: Date | string): string {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format 24-hour time to 12-hour format with AM/PM
 * @param time - Time string in HH:MM format (24-hour)
 * @returns Formatted time string (e.g., "9:00 AM")
 */
export function formatEventTime(time: string): string {
    if (!time || !time.includes(':')) {
        return 'Time TBA';
    }

    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);

    if (isNaN(hour) || hour < 0 || hour > 23) {
        return 'Time TBA';
    }

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

/**
 * Safely parse JSON array from potentially nested array structure
 * @param data - Array that might contain JSON string
 * @returns Parsed array or original data
 */
export function parseArrayField(data: unknown): string[] {
    if (!Array.isArray(data)) return [];

    if (data.length === 1 && typeof data[0] === 'string') {
        try {
            const parsed = JSON.parse(data[0]);
            return Array.isArray(parsed) ? parsed : data;
        } catch {
            return data;
        }
    }

    return data as string[];
}
