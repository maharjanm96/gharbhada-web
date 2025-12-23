import { paths } from "./paths";
import type { SessionData } from "./types";

// Re-export types for convenience
export type { SessionData };

/**
 * Check if user is authenticated (client-side)
 */
export async function checkAuth(): Promise<{
  authenticated: boolean;
  admin: SessionData | null;
}> {
  try {
    const response = await fetch(paths.api.admin.session);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking auth:", error);
    return { authenticated: false, admin: null };
  }
}

/**
 * Logout user (client-side)
 */
export async function logout(): Promise<void> {
  try {
    await fetch(paths.api.admin.logout, {
      method: "POST",
    });
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

/**
 * Get user data from session (client-side)
 */
export async function getUserData(): Promise<{
  name: string;
  email: string;
  avatar: string;
} | null> {
  try {
    const { authenticated, admin } = await checkAuth();

    if (!authenticated || !admin) {
      return null;
    }

    return {
      name: admin.name,
      email: admin.email,
      avatar: `/placeholder-avatar.jpg`, // Can be extended to fetch from database
    };
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
}
