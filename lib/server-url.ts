import "server-only";
import { headers } from "next/headers";

export async function getBaseUrl(): Promise<string> {
    const requestHeaders = await headers();
    const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto") || "http";

    if (!host) {
        return "http://localhost:3000";
    }

    return `${protocol}://${host}`;
}
