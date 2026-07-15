export const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000/api";

export const ACCESS_COOKIE = "zb_access";
export const REFRESH_COOKIE = "zb_refresh";

// Mirrors backend SIMPLE_JWT lifetimes (settings.py): access=30min, refresh=7d.
// The access cookie expires a few minutes early so a request never races an
// about-to-die token — the proxy route refreshes proactively instead.
export const ACCESS_COOKIE_MAX_AGE = 60 * 25; // 25 minutes
export const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
