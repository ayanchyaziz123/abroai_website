import "server-only";
import { cookies } from "next/headers";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  ACCESS_COOKIE_MAX_AGE,
  REFRESH_COOKIE_MAX_AGE,
  DJANGO_API_URL,
} from "./config";

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

// Cookies can only be *written* from a Server Action or Route Handler — never
// during a Server Component's render (e.g. a page.tsx handling a plain GET).
// getValidAccessToken() below calls these mid-render whenever a page loads
// with an expired access token, so the write must be best-effort: the freshly
// refreshed token is still returned and used for the current request either
// way, it just won't persist to the cookie until the next Server Action or
// Route Handler runs (login, logout, or any mutation).
export async function setTokens(access: string, refresh?: string) {
  const store = await cookies();
  try {
    store.set(ACCESS_COOKIE, access, { ...cookieOpts, maxAge: ACCESS_COOKIE_MAX_AGE });
    if (refresh) {
      store.set(REFRESH_COOKIE, refresh, { ...cookieOpts, maxAge: REFRESH_COOKIE_MAX_AGE });
    }
  } catch {
    // best-effort during Server Component render — see comment above
  }
}

export async function clearTokens() {
  const store = await cookies();
  try {
    store.delete(ACCESS_COOKIE);
    store.delete(REFRESH_COOKIE);
  } catch {
    // best-effort during Server Component render — see comment above
  }
}

export async function getAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value ?? null;
}

/**
 * Returns a usable access token, transparently refreshing against Django if
 * the access cookie is missing/expired but a refresh cookie is still valid.
 * Refresh tokens rotate server-side (SIMPLE_JWT ROTATE_REFRESH_TOKENS), so
 * the new refresh token is always persisted back into the cookie.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const access = await getAccessToken();
  if (access) return access;

  const refresh = await getRefreshToken();
  if (!refresh) return null;

  const res = await fetch(`${DJANGO_API_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  });

  if (!res.ok) {
    await clearTokens();
    return null;
  }

  const data = await res.json();
  await setTokens(data.access, data.refresh);
  return data.access as string;
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getValidAccessToken()) !== null;
}
