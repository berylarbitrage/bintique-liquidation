import { createElement } from "react";
import { z } from "zod";
import { checkRateLimit, json, parseBody } from "@/lib/api";
import { createMagicLink, findUserIdByEmail, safeNext } from "@/lib/auth-links";
import { sendEmail } from "@/lib/email";
import { isSupabaseConfigured } from "@/lib/env";
import { log } from "@/lib/log";
import { SITE } from "@/config/site";
import LoginEmail from "@/emails/login";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  next: z.string().max(200).optional(),
});

/**
 * Sends a sign-in link to existing users only. Always returns { ok: true }
 * so the endpoint can't be used to discover who has applied.
 */
export async function POST(req: Request) {
  const limited = checkRateLimit(req, "magic-link");
  if (limited) return limited;
  const body = await parseBody(req, schema);
  if (!body.ok) return body.res;
  if (!isSupabaseConfigured()) return json({ ok: true });

  const { email } = body.data;
  const next = safeNext(body.data.next);
  try {
    const userId = await findUserIdByEmail(email);
    if (userId) {
      const url = await createMagicLink(email, next);
      await sendEmail({
        to: email,
        subject: `Your ${SITE.brand} sign-in link`,
        react: createElement(LoginEmail, { url }),
      });
    }
  } catch (err) {
    log.error("magic-link failed", err);
  }
  return json({ ok: true });
}
