import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { fetchServer } from "./api-server";
import { ApiError } from "./api-error";
import { isAuthenticated } from "./session";
import type { User } from "@/types";

/**
 * Returns the current user, or null if not logged in. Never throws.
 * Wrapped in React's `cache()` so the layout (for the navbar) and a page
 * calling `requireUser()` share one /auth/me/ request per render pass
 * instead of both hitting Django separately.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  try {
    return await fetchServer<User>("auth/me/");
  } catch {
    return null;
  }
});

/**
 * Route-level auth guard for Server Components — this Next.js version
 * deprecates global middleware in favor of checking auth where data is
 * actually accessed, so protected pages call this at the top instead of
 * relying on a middleware/proxy file.
 */
export async function requireUser(nextPath?: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    const qs = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/login${qs}`);
  }
  return user;
}

export { isAuthenticated };
export { ApiError };
