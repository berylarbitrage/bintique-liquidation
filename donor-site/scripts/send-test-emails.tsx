/**
 * Send all transactional email templates to one address via Resend.
 * Usage: pnpm email:test you@example.com
 * In Resend test mode (from onboarding@resend.dev) you can only send to the
 * email address that owns the Resend account.
 */
import { Resend } from "resend";
import { render } from "@react-email/components";
import EligibleEmail from "../emails/eligible";
import IneligibleEmail from "../emails/ineligible";
import AdminNewApplicationEmail from "../emails/admin-new-application";

const to = process.argv[2];
const key = process.env.RESEND_API_KEY;
if (!to || !key) {
  console.error("Usage: RESEND_API_KEY=... pnpm email:test you@example.com");
  process.exit(1);
}
const resend = new Resend(key);
const from = process.env.EMAIL_FROM || "Test <onboarding@resend.dev>";

const templates = [
  ["[Test] Eligible — next steps", <EligibleEmail key="a" firstName="Jane" donorType="egg" />],
  ["[Test] Not eligible — thank you", <IneligibleEmail key="b" firstName="Jane" />],
  ["[Test] Admin — new application", <AdminNewApplicationEmail key="c" name="Jane Doe" />],
] as const;

for (const [subject, el] of templates) {
  const { error } = await resend.emails.send({ from, to, subject, html: await render(el) });
  console.log(error ? `✗ ${subject}: ${error.message}` : `✓ ${subject}`);
}
