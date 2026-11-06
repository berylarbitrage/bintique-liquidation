import { createElement } from "react";
import { checkRateLimit, errorJson, json, parseBody } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";
import { signatureSchema } from "@/lib/full-app";
import {
  formSectionsComplete,
  getFullApp,
  getOwnApplication,
  photosComplete,
  withSection,
} from "@/lib/portal";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { log } from "@/lib/log";
import { siteUrl } from "@/config/site";
import AdminNewApplicationEmail from "@/emails/admin-new-application";

/** Sign and submit the full application. */
export async function POST(req: Request) {
  const limited = checkRateLimit(req, "portal");
  if (limited) return limited;
  const { supabase, user } = await getSessionUser();
  if (!supabase || !user) return errorJson("Not signed in", 401);
  const body = await parseBody(req, signatureSchema);
  if (!body.ok) return body.res;

  const app = await getOwnApplication(supabase, user.id);
  if (!app) return errorJson("No application found", 404);
  const full = await getFullApp(supabase, app.id);
  if (!full) return errorJson("Please complete all sections first.", 400);
  if (full.submitted_at) return errorJson("Your application has already been submitted.", 409);

  const { data: photos } = await supabase
    .from("photos")
    .select("kind")
    .eq("application_id", app.id);
  if (!formSectionsComplete(full.completed_sections)) {
    return errorJson("Please complete all sections before signing.", 400);
  }
  if (!photosComplete((photos ?? []).map((p) => p.kind as string))) {
    return errorJson("Please upload at least one childhood photo and one recent photo.", 400);
  }

  const now = new Date().toISOString();
  const completed = withSection(
    withSection(full.completed_sections, "photos", true),
    "signature",
    true,
  );
  const { error } = await supabase
    .from("full_applications")
    .update({
      signed_name: body.data.signedName,
      signed_at: now,
      submitted_at: now,
      completed_sections: completed,
    })
    .eq("application_id", app.id);
  if (error) {
    log.error("portal: submit failed", error);
    return errorJson("Could not submit. Please try again.", 500);
  }
  // Applicants can't change their own status under RLS; do it with the service role.
  await createAdminClient()
    .from("applications")
    .update({ status: "full_app_submitted" })
    .eq("id", app.id);

  const adminTo = env("ADMIN_NOTIFY_EMAIL");
  if (adminTo) {
    await sendEmail({
      to: adminTo,
      subject: `Full application submitted: ${app.first_name} ${app.last_name.charAt(0)}.`,
      react: createElement(AdminNewApplicationEmail, {
        name: `${app.first_name} ${app.last_name}`,
        donorType: app.donor_type,
        eligible: app.eligible,
        adminUrl: siteUrl(`/admin/applications/${app.id}`),
        kind: "full application",
      }),
    });
  }
  return json({ ok: true });
}
