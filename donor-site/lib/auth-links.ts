import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteUrl } from "@/config/site";

/** Find an auth user by email (service role only). */
export async function findUserIdByEmail(email: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("user_id_by_email", { p_email: email });
  if (error) throw error;
  return (data as string | null) ?? null;
}

/** Find or create a passwordless auth user for this email. */
export async function ensureUser(email: string): Promise<string> {
  const existing = await findUserIdByEmail(email);
  if (existing) return existing;
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({ email, email_confirm: true });
  if (error || !data.user) throw error ?? new Error("createUser returned no user");
  return data.user.id;
}

/**
 * Generate a one-time sign-in link that lands on our /auth/confirm route
 * (server-side token verification, works with cookie-based SSR sessions).
 */
export async function createMagicLink(email: string, next = "/portal"): Promise<string> {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  if (error || !data.properties?.hashed_token) throw error ?? new Error("generateLink failed");
  const params = new URLSearchParams({
    token_hash: data.properties.hashed_token,
    type: "magiclink",
    next,
  });
  return siteUrl(`/auth/confirm?${params.toString()}`);
}

/** Only allow same-site relative redirects. */
export function safeNext(next: string | null | undefined, fallback = "/portal"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
