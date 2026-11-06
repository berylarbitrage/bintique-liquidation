import "server-only";
import { NextResponse } from "next/server";
import type { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export function json<T>(data: T, init?: number | ResponseInit) {
  return NextResponse.json(data, typeof init === "number" ? { status: init } : init);
}

export function errorJson(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

/** Apply the standard 10/min/IP write rate limit. Returns a 429 response or null. */
export function checkRateLimit(req: Request, scope: string) {
  const ip = clientIp(req.headers);
  const r = rateLimit(`${scope}:${ip}`);
  if (!r.ok) return errorJson("Too many requests. Please try again in a minute.", 429);
  return null;
}

/** Parse JSON body against a zod schema. */
export async function parseBody<S extends z.ZodType>(
  req: Request,
  schema: S,
): Promise<{ ok: true; data: z.infer<S> } | { ok: false; res: NextResponse }> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return { ok: false, res: errorJson("Invalid JSON", 400) };
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      res: errorJson("Validation failed", 400, {
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      }),
    };
  }
  return { ok: true, data: parsed.data };
}
