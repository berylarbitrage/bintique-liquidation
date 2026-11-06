import { z } from "zod";
import { checkRateLimit, errorJson, json, parseBody } from "@/lib/api";
import { getAdminOrNull } from "@/lib/auth";
import { audit } from "@/lib/admin/audit";
import { STATUSES } from "@/lib/admin/constants";
import { createAdminClient, PHOTO_BUCKET } from "@/lib/supabase/admin";
import { findUserIdByEmail } from "@/lib/auth-links";
import { log } from "@/lib/log";

const idSchema = z.string().uuid();
const patchSchema = z
  .object({
    status: z.enum(STATUSES).optional(),
    note: z.string().trim().min(1).max(5000).optional(),
  })
  .refine((v) => v.status || v.note, "Nothing to update");

type Ctx = { params: Promise<{ id: string }> };

/** Change status and/or add an internal note. */
export async function PATCH(req: Request, { params }: Ctx) {
  const limited = checkRateLimit(req, "admin-write");
  if (limited) return limited;
  const admin = await getAdminOrNull();
  if (!admin) return errorJson("Not found", 404);
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return errorJson("Not found", 404);
  const body = await parseBody(req, patchSchema);
  if (!body.ok) return body.res;
  const { supabase, user } = admin;

  const { data: app } = await supabase.from("applications").select("id,status").eq("id", id).maybeSingle();
  if (!app) return errorJson("Not found", 404);

  if (body.data.status && body.data.status !== app.status) {
    const { error } = await supabase.from("applications").update({ status: body.data.status }).eq("id", id);
    if (error) {
      log.error("admin status update failed", error);
      return errorJson("Update failed", 500);
    }
    await audit(user.id, "update_status", id, { from: app.status, to: body.data.status });
  }
  if (body.data.note) {
    const { error } = await supabase
      .from("admin_notes")
      .insert({ application_id: id, author_id: user.id, body: body.data.note });
    if (error) {
      log.error("admin note insert failed", error);
      return errorJson("Could not save note", 500);
    }
    await audit(user.id, "add_note", id);
  }
  return json({ ok: true });
}

/**
 * Right to delete: removes every application for this applicant's email,
 * their photos in storage, and their login account.
 */
export async function DELETE(req: Request, { params }: Ctx) {
  const limited = checkRateLimit(req, "admin-write");
  if (limited) return limited;
  const admin = await getAdminOrNull();
  if (!admin) return errorJson("Not found", 404);
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return errorJson("Not found", 404);
  const confirm = new URL(req.url).searchParams.get("confirm");
  if (confirm !== "DELETE") return errorJson("Confirmation required", 400);

  const db = createAdminClient();
  const { data: app } = await db.from("applications").select("id,email,donor_type").eq("id", id).maybeSingle();
  if (!app) return errorJson("Not found", 404);

  const { data: allApps } = await db.from("applications").select("id").eq("email", app.email);
  const appIds = (allApps ?? []).map((a) => a.id as string);

  // 1. Storage objects (every file under each application's folder).
  for (const appId of appIds) {
    const { data: files } = await db.storage.from(PHOTO_BUCKET).list(appId, { limit: 100 });
    const paths = (files ?? []).map((f) => `${appId}/${f.name}`);
    if (paths.length) {
      const { error } = await db.storage.from(PHOTO_BUCKET).remove(paths);
      if (error) {
        log.error("delete: storage remove failed", error);
        return errorJson("Could not delete photos; nothing else was deleted.", 500);
      }
    }
  }
  // 2. Rows (photos, full_applications, notes cascade).
  const { error: delErr } = await db.from("applications").delete().in("id", appIds);
  if (delErr) {
    log.error("delete: rows failed", delErr);
    return errorJson("Delete failed", 500);
  }
  // 3. Auth account (unless it's an admin).
  try {
    const userId = await findUserIdByEmail(app.email);
    if (userId && userId !== admin.user.id) {
      const { data: profile } = await db.from("profiles").select("role").eq("id", userId).maybeSingle();
      if (profile?.role !== "admin") await db.auth.admin.deleteUser(userId);
    }
  } catch (err) {
    log.error("delete: auth user removal failed", err);
  }

  await audit(admin.user.id, "delete_applicant_data", id, { applications: appIds.length, donor_type: app.donor_type });
  return json({ ok: true });
}
