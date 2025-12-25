import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Format timezone name for display (replace underscores with spaces)
 * @param timezone - IANA timezone (e.g., "America/New_York")
 * @returns Formatted timezone (e.g., "America/New York")
 */
function formatTimezoneForDisplay(timezone: string): string {
    return timezone.replace(/_/g, ' ');
}

/**
 * Format a date to a human-readable string
 * @param date - Date object or ISO string
 * @param timezone - IANA time zone (e.g., "Asia/Kolkata")
 * @param startAtUtc - UTC start time (Date or ISO string)
 * @returns Formatted date string (e.g., "June 10, 2026")
 */
export function formatEventDate(
    date: Date | string,
    eventTimezone?: string,
    startAtUtc?: Date | string
): string {
    if (eventTimezone && startAtUtc) {
        const localized = dayjs.utc(startAtUtc).tz(eventTimezone);
        if (localized.isValid()) {
            return localized.format("MMMM D, YYYY");
        }
    }

    const eventDate = new Date(date);
    return eventDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/**
 * Format 24-hour time to 12-hour format with AM/PM
 * @param time - Time string in HH:MM format (24-hour)
 * @param timezone - IANA time zone (e.g., "Asia/Kolkata")
 * @param startAtUtc - UTC start time (Date or ISO string)
 * @returns Formatted time string (e.g., "9:00 AM")
 */
export function formatEventTime(
    time: string,
    eventTimezone?: string,
    startAtUtc?: Date | string
): string {
    if (eventTimezone && startAtUtc) {
        const localized = dayjs.utc(startAtUtc).tz(eventTimezone);
        if (localized.isValid()) {
            const timeLabel = localized.format("h:mm A");
            return `${timeLabel} (${formatTimezoneForDisplay(eventTimezone)})`;
        }
    }

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
    const timeLabel = `${displayHour}:${minutes} ${ampm}`;
    return eventTimezone ? `${timeLabel} (${formatTimezoneForDisplay(eventTimezone)})` : timeLabel;
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
