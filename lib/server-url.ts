import "server-only";

export async function getBaseUrl(): Promise<string> {
    // Vercel production/preview
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // Vercel production domain (if custom domain is set)
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }

    // Netlify
    if (process.env.URL) {
        return process.env.URL;
    }

    // Development fallback
    return "http://localhost:3000";
}
