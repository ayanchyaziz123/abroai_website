"use client";

import { ApiError } from "./api-error";

/**
 * Fetch helper for Client Components — always goes through /api/proxy so the
 * JWT never has to live in browser-accessible storage.
 */
export async function fetchClient<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && typeof init.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`/api/proxy/${path.replace(/^\//, "")}`, {
    ...init,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json().catch(() => null) : null;

  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}
