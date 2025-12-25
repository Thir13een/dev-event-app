export function getBaseUrl(): string {
    // Use NEXT_PUBLIC_BASE_URL if explicitly set
    if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL;
    }

    // On Vercel, use VERCEL_URL (automatically provided)
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // Fallback to localhost for development
    return "http://localhost:3000";
}
