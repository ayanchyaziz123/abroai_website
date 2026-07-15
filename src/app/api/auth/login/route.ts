import { NextRequest, NextResponse } from "next/server";
import { DJANGO_API_URL } from "@/lib/config";
import { setTokens } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { identifier, password } = await req.json();

  // The Django login endpoint is SimpleJWT's default TokenObtainPairView,
  // which expects a "username" field — but the custom EmailBackend accepts
  // either an email or a username as that value.
  const tokenRes = await fetch(`${DJANGO_API_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: identifier, password }),
    cache: "no-store",
  });
  const tokenData = await tokenRes.json().catch(() => null);
  if (!tokenRes.ok) {
    return NextResponse.json(tokenData ?? { detail: "Login failed." }, { status: tokenRes.status });
  }

  await setTokens(tokenData.access, tokenData.refresh);

  const meRes = await fetch(`${DJANGO_API_URL}/auth/me/`, {
    headers: { Authorization: `Bearer ${tokenData.access}` },
    cache: "no-store",
  });
  const user = await meRes.json().catch(() => null);

  return NextResponse.json({ user });
}
