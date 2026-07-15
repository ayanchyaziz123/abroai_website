import { NextResponse } from "next/server";
import { DJANGO_API_URL } from "@/lib/config";
import { getRefreshToken, clearTokens } from "@/lib/session";

export async function POST() {
  const refresh = await getRefreshToken();
  if (refresh) {
    await fetch(`${DJANGO_API_URL}/auth/logout/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
      cache: "no-store",
    }).catch(() => {});
  }
  await clearTokens();
  return NextResponse.json({ detail: "Logged out." });
}
