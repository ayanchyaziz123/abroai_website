import "server-only";
import { DJANGO_API_URL } from "./config";
import { getValidAccessToken } from "./session";
import { ApiError } from "./api-error";

/**
 * Direct server-to-server call to Django — used from Server Components and
 * Route Handlers, where we already have the access token locally and can
 * skip the extra hop through /api/proxy.
 */
export async function fetchServer<T = unknown>(
  path: string,
  init: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = true, ...rest } = init;
  const headers = new Headers(rest.headers);

  if (auth) {
    const token = await getValidAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  if (rest.body && !headers.has("Content-Type") && typeof rest.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  const url = `${DJANGO_API_URL}/${path.replace(/^\//, "")}`;
  const res = await fetch(url, { ...rest, headers, cache: "no-store" });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json().catch(() => null) : null;

  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}
