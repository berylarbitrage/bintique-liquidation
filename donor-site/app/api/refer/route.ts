import { checkRateLimit, errorJson, json, parseBody } from "@/lib/api";
import { referSchema } from "@/lib/schemas/refer";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateRefCode, referralLinks } from "@/lib/referral";
import { isSupabaseConfigured } from "@/lib/env";
import { log } from "@/lib/log";
import { siteUrl } from "@/config/site";

export async function POST(req: Request) {
  const limited = checkRateLimit(req, "refer");
  if (limited) return limited;
  const body = await parseBody(req, referSchema);
  if (!body.ok) return body.res;
  const { name, email, website } = body.data;
  if (website)
    return json({ code: generateRefCode(), links: referralLinks("XXXXXXXX", siteUrl()) });
  if (!isSupabaseConfigured()) return errorJson("Referrals are temporarily unavailable.", 503);

  const db = createAdminClient();

  // Re-use the existing code for this email so a referrer has one stable link.
  const { data: existing } = await db
    .from("referrers")
    .select("code")
    .eq("email", email)
    .limit(1)
    .maybeSingle();
  if (existing?.code) {
    return json({ code: existing.code, links: referralLinks(existing.code, siteUrl()) });
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateRefCode();
    const { error } = await db.from("referrers").insert({ code, name, email });
    if (!error) return json({ code, links: referralLinks(code, siteUrl()) });
    if (error.code !== "23505") {
      log.error("refer: insert failed", error);
      break;
    }
  }
  return errorJson("Could not create a referral link. Please try again.", 500);
}
