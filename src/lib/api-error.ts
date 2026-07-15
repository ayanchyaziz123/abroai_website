export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(extractMessage(body) || `Request failed (${status})`);
    this.status = status;
    this.body = body;
  }
}

function extractMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.detail === "string") return b.detail;
  // DRF field errors: { field: ["message"] } — surface the first one.
  for (const key of Object.keys(b)) {
    const val = b[key];
    if (Array.isArray(val) && typeof val[0] === "string") return val[0];
  }
  return null;
}
