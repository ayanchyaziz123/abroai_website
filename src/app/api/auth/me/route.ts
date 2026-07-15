import { NextResponse } from "next/server";
import { fetchServer } from "@/lib/api-server";
import { ApiError } from "@/lib/api-error";
import type { User } from "@/types";

export async function GET() {
  try {
    const user = await fetchServer<User>("auth/me/");
    return NextResponse.json({ user });
  } catch (e) {
    const status = e instanceof ApiError ? e.status : 401;
    return NextResponse.json({ user: null }, { status });
  }
}
