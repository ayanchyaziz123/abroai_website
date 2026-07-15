import { NextRequest, NextResponse } from "next/server";
import { DJANGO_API_URL } from "@/lib/config";
import { setTokens } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const res = await fetch(`${DJANGO_API_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return NextResponse.json(data ?? { detail: "Registration failed." }, { status: res.status });
  }

  await setTokens(data.access, data.refresh);
  return NextResponse.json({ user: data.user }, { status: res.status });
}
