import "server-only";
import { Resend } from "resend";
import { render } from "@react-email/components";
import type { ReactElement } from "react";
import { env } from "@/lib/env";
import { log } from "@/lib/log";
import { SITE } from "@/config/site";

let client: Resend | null = null;

/**
 * Send an email via Resend. Without RESEND_API_KEY the send is skipped and
 * only the subject is logged (never the body — it may contain PII).
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  react: ReactElement;
  replyTo?: string;
}): Promise<boolean> {
  const key = env("RESEND_API_KEY");
  if (!key) {
    log.info("email skipped (RESEND_API_KEY not set)", { subjectLine: opts.subject });
    return false;
  }
  client ??= new Resend(key);
  const from = env("EMAIL_FROM") ?? `${SITE.brand} <onboarding@resend.dev>`;
  try {
    const html = await render(opts.react);
    const text = await render(opts.react, { plainText: true });
    const { error } = await client.emails.send({
      from,
      to: opts.to,
      subject: opts.subject,
      html,
      text,
      replyTo: opts.replyTo,
    });
    if (error) {
      log.error("resend send failed", error, { subjectLine: opts.subject });
      return false;
    }
    return true;
  } catch (err) {
    log.error("resend send threw", err, { subjectLine: opts.subject });
    return false;
  }
}
