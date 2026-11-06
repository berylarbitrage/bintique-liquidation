import { after } from "next/server";
import { cookies } from "next/headers";
import { createElement } from "react";
import { checkRateLimit, errorJson, json, parseBody } from "@/lib/api";
import { applicationSchema, applyRequestSchema, normalizeUsPhone } from "@/lib/schemas/apply";
import { evaluate } from "@/lib/eligibility";
import { MIN_APPLICANT_AGE } from "@/config/eligibility";
import { verifyTurnstile } from "@/lib/turnstile";
import { clientIp } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, env } from "@/lib/env";
import { REF_CODE_RE, REF_COOKIE } from "@/lib/referral";
import { createMagicLink, ensureUser } from "@/lib/auth-links";
import { sendEmail } from "@/lib/email";
import { log } from "@/lib/log";
import { SITE, siteUrl } from "@/config/site";
import EligibleEmail from "@/emails/eligible";
import IneligibleEmail from "@/emails/ineligible";
import AdminNewApplicationEmail from "@/emails/admin-new-application";

const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  const limited = checkRateLimit(req, "apply");
  if (limited) return limited;

  const body = await parseBody(req, applyRequestSchema);
  if (!body.ok) return body.res;
  const { donorType, data: raw, turnstileToken, website } = body.data;

  // Honeypot: pretend success, store nothing.
  if (website) return json({ ok: true, eligible: false });

  if (!(await verifyTurnstile(turnstileToken, clientIp(req.headers)))) {
    return errorJson("Verification failed. Please refresh and try again.", 400, { code: "turnstile" });
  }

  // Same zod schema as the client.
  const parsed = applicationSchema(donorType).safeParse(raw);
  if (!parsed.success) {
    return errorJson("Validation failed", 400, {
      issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }
  const d = parsed.data;

  // Eligibility is ALWAYS recomputed on the server.
  const result = evaluate(donorType, d);
  if (!(result.age >= MIN_APPLICANT_AGE)) {
    // Minors: reject and store nothing.
    return errorJson("You must be at least 18 years old to apply.", 400, { code: "underage" });
  }

  if (!isSupabaseConfigured() || !env("SUPABASE_SERVICE_ROLE_KEY")) {
    log.error("apply: Supabase is not configured");
    return errorJson("Applications are temporarily unavailable.", 503);
  }
  const db = createAdminClient();
  const email = d.email.toLowerCase();

  // One submission per email per 24 hours.
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
  const { count, error: dupErr } = await db
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", since);
  if (dupErr) {
    log.error("apply: duplicate check failed", dupErr);
    return errorJson("Something went wrong. Please try again.", 500);
  }
  if ((count ?? 0) > 0) {
    return errorJson(
      "We already received an application from this email in the last 24 hours. Please check your inbox.",
      409,
      { code: "duplicate" },
    );
  }

  // Referral code: form field first, then cookie. Only keep codes that exist and aren't self-referrals.
  const cookieStore = await cookies();
  const refCandidate = d.ref || cookieStore.get(REF_COOKIE)?.value || "";
  let referralCode: string | null = null;
  if (REF_CODE_RE.test(refCandidate)) {
    const { data: referrer } = await db
      .from("referrers")
      .select("code, email")
      .eq("code", refCandidate)
      .maybeSingle();
    if (referrer && referrer.email.toLowerCase() !== email) referralCode = referrer.code;
  }

  const yes = (v: string | undefined) => (v === undefined ? null : v === "yes");
  const isEgg = donorType === "egg";
  const row = {
    donor_type: donorType,
    first_name: d.firstName,
    last_name: d.lastName,
    email,
    phone: normalizeUsPhone(d.phone)!,
    sms_consent: d.smsConsent,
    date_of_birth: d.dateOfBirth,
    state: d.state,
    zip: d.zip,
    education: d.education,
    how_heard: d.howHeard || null,
    height_in: result.heightInches,
    weight_lb: d.weightLb,
    bmi: result.bmi,
    smoker: yes(d.smoker),
    previous_donation: yes(d.previousDonation),
    regular_cycles: isEgg ? yes((d as { regularCycles: string }).regularCycles) : null,
    birth_control: isEgg ? (d as { birthControl: string }).birthControl : null,
    within_60_min: !isEgg ? yes((d as { within60Min: string }).within60Min) : null,
    can_commit_6_months: !isEgg ? yes((d as { canCommit6Months: string }).canCommit6Months) : null,
    eligible: result.eligible,
    fail_reasons: result.reasons,
    referral_code: referralCode,
  };

  const { data: inserted, error: insErr } = await db
    .from("applications")
    .insert(row)
    .select("id")
    .single();
  if (insErr || !inserted) {
    log.error("apply: insert failed", insErr);
    return errorJson("Something went wrong. Please try again.", 500);
  }
  const applicationId = inserted.id as string;
  log.info("apply: stored", { applicationId, donorType, eligible: result.eligible });

  // Emails & account creation run after the response is sent.
  after(async () => {
    try {
      if (result.eligible) {
        const userId = await ensureUser(email);
        await db
          .from("applications")
          .update({ user_id: userId, status: "full_app_pending" })
          .eq("id", applicationId);
        await db.from("full_applications").upsert({ application_id: applicationId });
        const portalUrl = await createMagicLink(email, "/portal/application");
        await sendEmail({
          to: email,
          subject: `Next steps for your ${donorType} donor application`,
          react: createElement(EligibleEmail, { firstName: d.firstName, donorType, portalUrl }),
        });
      } else {
        await sendEmail({
          to: email,
          subject: `Thank you for applying to ${SITE.brand}`,
          react: createElement(IneligibleEmail, { firstName: d.firstName, referUrl: siteUrl("/refer") }),
        });
      }
      const adminTo = env("ADMIN_NOTIFY_EMAIL");
      if (adminTo) {
        await sendEmail({
          to: adminTo,
          subject: `New ${donorType} pre-screen: ${d.firstName} ${d.lastName.charAt(0)}.`,
          react: createElement(AdminNewApplicationEmail, {
            name: `${d.firstName} ${d.lastName}`,
            donorType,
            eligible: result.eligible,
            adminUrl: siteUrl(`/admin/applications/${applicationId}`),
          }),
        });
      }
    } catch (err) {
      log.error("apply: post-submit tasks failed", err, { applicationId });
    }
  });

  // Clear the referral cookie once it has been attributed.
  const res = json({ ok: true, eligible: result.eligible });
  if (referralCode) res.cookies.delete(REF_COOKIE);
  return res;
}
