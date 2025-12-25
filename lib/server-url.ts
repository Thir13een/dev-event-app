import "server-only";

export async function getBaseUrl(): Promise<string> {
    // For Netlify deployment, use environment variables
    if (process.env.URL) {
        return process.env.URL; // Netlify automatically sets this
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`; // Vercel support
    }

    // Fallback to localhost for development
    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}
