import { cookies } from "next/headers";
import type { SessionData } from "./types";

/**
 * Get the current session from cookies (server-side only)
 * This function can only be used in Server Components or API routes
 */
export async function getServerSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return null;
    }

    const sessionData = JSON.parse(
      Buffer.from(authToken.value, "base64").toString()
    );

    // Check if session is expired (7 days)
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - sessionData.timestamp > maxAge) {
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error("Error getting server session:", error);
    return null;
  }
}
