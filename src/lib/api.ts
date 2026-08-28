import { API_BASE } from "./config";

const ACCESS_KEY = "abrofy_access";
const REFRESH_KEY = "abrofy_refresh";

export function getTokens() {
  if (typeof window === "undefined") return { access: null, refresh: null };
  return {
    access: localStorage.getItem(ACCESS_KEY),
    refresh: localStorage.getItem(REFRESH_KEY),
  };
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type ApiOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean; // attach Authorization header (default true)
};

async function doFetch(path: string, opts: ApiOptions, accessOverride?: string) {
  const { method = "GET", body, auth = true } = opts;
  const headers: Record<string, string> = {};
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (!isFormData && body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = accessOverride ?? getTokens().access;
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
  });
  return res;
}

async function tryRefresh(): Promise<string | null> {
  const { refresh } = getTokens();
  if (!refresh) return null;
  const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.access) return null;
  localStorage.setItem(ACCESS_KEY, data.access);
  return data.access;
}

// Mirrors the mobile app's api() helper: JWT bearer auth, JSON by default
// (raw FormData passes through for image uploads), and one silent
// refresh-and-retry on a 401 before giving up and surfacing the error.
export async function api(path: string, opts: ApiOptions = {}) {
  let res = await doFetch(path, opts);

  if (res.status === 401 && opts.auth !== false) {
    const newAccess = await tryRefresh();
    if (newAccess) {
      res = await doFetch(path, opts, newAccess);
    } else {
      clearTokens();
    }
  }

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const hasDetail = !!data && typeof data === "object" && "detail" in data;
    const message = hasDetail
      ? String((data as { detail: unknown }).detail)
      : `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data);
  }
  return data;
}
