import { NextRequest, NextResponse } from "next/server";
import { DJANGO_API_URL } from "@/lib/config";
import { getValidAccessToken } from "@/lib/session";

/**
 * Generic authenticated proxy to the Django API. The browser only ever talks
 * to this Next.js route — JWTs live in httpOnly cookies and never reach
 * client JS, and this sidesteps CORS entirely since it's a same-origin call
 * from the browser's point of view. Access-token refresh happens here too
 * (see getValidAccessToken), so callers never see a 401 from an expired
 * (but refreshable) session.
 */
async function forward(req: NextRequest, method: string, pathParts: string[]) {
  const path = pathParts.join("/");
  const url = `${DJANGO_API_URL}/${path}/${req.nextUrl.search}`;

  const headers: Record<string, string> = {};
  const token = await getValidAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (method !== "GET" && method !== "HEAD") {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      // Let fetch regenerate the multipart boundary for the outgoing request.
      body = await req.formData();
    } else if (contentType.includes("application/json")) {
      const text = await req.text();
      body = text || undefined;
      headers["Content-Type"] = "application/json";
    } else if (contentType) {
      body = await req.text();
      headers["Content-Type"] = contentType;
    }
  }

  let res: Response;
  try {
    res = await fetch(url, { method, headers, body, cache: "no-store" });
  } catch {
    return NextResponse.json(
      { detail: "Could not reach the API. Is the Django server running?" },
      { status: 502 }
    );
  }

  const resContentType = res.headers.get("content-type") || "";
  if (resContentType.includes("application/json")) {
    const data = await res.json().catch(() => null);
    return NextResponse.json(data, { status: res.status });
  }
  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }
  const buf = await res.arrayBuffer();
  return new NextResponse(buf, { status: res.status, headers: { "content-type": resContentType } });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  return forward(req, "GET", (await ctx.params).path);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return forward(req, "POST", (await ctx.params).path);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  return forward(req, "PATCH", (await ctx.params).path);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  return forward(req, "PUT", (await ctx.params).path);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return forward(req, "DELETE", (await ctx.params).path);
}
