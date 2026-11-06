import "server-only";
import { env } from "@/lib/env";
import { log } from "@/lib/log";

/** Verify a Cloudflare Turnstile token. Skipped (returns true) if no secret is configured. */
export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  const secret = env("TURNSTILE_SECRET_KEY");
  if (!secret) {
    if (process.env.NODE_ENV === "production") log.warn("TURNSTILE_SECRET_KEY not set; skipping");
    return true;
  }
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch (err) {
    log.error("turnstile verify failed", err);
    return false;
  }
}
