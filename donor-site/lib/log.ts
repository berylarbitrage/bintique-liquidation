/**
 * Server logger that redacts sensitive fields. Never log request bodies
 * directly — health data must not reach logs.
 */
const SENSITIVE =
  /^(email|phone|first_?name|last_?name|date_?of_?birth|dob|zip|height.*|weight.*|bmi|smoker|regular_?cycles|birth_?control|sections|signed_?name|body|message|password|token)$/i;

export function redact(value: unknown, depth = 0): unknown {
  if (depth > 4 || value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    out[k] = SENSITIVE.test(k) ? "[redacted]" : redact(v, depth + 1);
  }
  return out;
}

export const log = {
  info: (msg: string, meta?: Record<string, unknown>) =>
    console.info(`[info] ${msg}`, meta ? JSON.stringify(redact(meta)) : ""),
  warn: (msg: string, meta?: Record<string, unknown>) =>
    console.warn(`[warn] ${msg}`, meta ? JSON.stringify(redact(meta)) : ""),
  error: (msg: string, err?: unknown, meta?: Record<string, unknown>) =>
    console.error(
      `[error] ${msg}`,
      err instanceof Error
        ? err.message
        : typeof err === "object" && err && "message" in err
          ? (err as { message: string }).message
          : "",
      meta ? JSON.stringify(redact(meta)) : "",
    ),
};
