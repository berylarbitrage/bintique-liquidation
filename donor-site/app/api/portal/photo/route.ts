import { z } from "zod";
import { checkRateLimit, errorJson, json, parseBody } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";
import { PHOTO_LIMITS } from "@/lib/full-app";
import { getFullApp, getOwnApplication, photosComplete, withSection } from "@/lib/portal";
import { createAdminClient, PHOTO_BUCKET } from "@/lib/supabase/admin";
import { log } from "@/lib/log";

const bodySchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("sign"),
    kind: z.enum(["childhood", "recent"]),
    contentType: z.enum(PHOTO_LIMITS.mimeTypes),
    size: z.number().int().positive().max(PHOTO_LIMITS.maxBytes, "Photos must be 5 MB or smaller"),
  }),
  z.object({
    action: z.literal("confirm"),
    kind: z.enum(["childhood", "recent"]),
    path: z.string().max(200),
  }),
  z.object({ action: z.literal("delete"), id: z.string().uuid() }),
]);

async function syncPhotoCompletion(
  supabase: NonNullable<Awaited<ReturnType<typeof getSessionUser>>["supabase"]>,
  appId: string,
) {
  const [{ data: photos }, full] = await Promise.all([
    supabase.from("photos").select("kind").eq("application_id", appId),
    getFullApp(supabase, appId),
  ]);
  const done = photosComplete((photos ?? []).map((p) => p.kind as string));
  const completed = withSection(full?.completed_sections ?? [], "photos", done);
  await supabase
    .from("full_applications")
    .upsert({ application_id: appId, completed_sections: completed });
  return completed;
}

/**
 * Photo upload flow:
 *   1. sign    -> server checks limits, returns a one-time signed upload URL
 *   2. browser uploads directly to the private bucket
 *   3. confirm -> server verifies the object and records it
 */
export async function POST(req: Request) {
  const limited = checkRateLimit(req, "portal");
  if (limited) return limited;
  const { supabase, user } = await getSessionUser();
  if (!supabase || !user) return errorJson("Not signed in", 401);
  const body = await parseBody(req, bodySchema);
  if (!body.ok) return body.res;

  const app = await getOwnApplication(supabase, user.id);
  if (!app) return errorJson("No application found", 404);
  const full = await getFullApp(supabase, app.id);
  if (full?.submitted_at) return errorJson("Your application has already been submitted.", 409);
  const service = createAdminClient();
  const b = body.data;

  if (b.action === "sign") {
    const { count } = await supabase
      .from("photos")
      .select("id", { count: "exact", head: true })
      .eq("application_id", app.id);
    if ((count ?? 0) >= PHOTO_LIMITS.maxCount) {
      return errorJson(`You can upload up to ${PHOTO_LIMITS.maxCount} photos.`, 400);
    }
    const ext = b.contentType === "image/png" ? "png" : "jpg";
    const path = `${app.id}/${crypto.randomUUID()}.${ext}`;
    const { data, error } = await service.storage.from(PHOTO_BUCKET).createSignedUploadUrl(path);
    if (error || !data) {
      log.error("portal: signed upload url failed", error);
      return errorJson("Could not start upload", 500);
    }
    return json({ path: data.path, token: data.token });
  }

  if (b.action === "confirm") {
    // Path must be inside this applicant's folder.
    const [folder, file, ...rest] = b.path.split("/");
    if (folder !== app.id || !file || rest.length || !/^[0-9a-f-]{36}\.(jpg|png)$/.test(file)) {
      return errorJson("Invalid path", 400);
    }
    const { data: objs } = await service.storage.from(PHOTO_BUCKET).list(app.id, { search: file });
    const obj = objs?.find((o) => o.name === file);
    const meta = obj?.metadata as { size?: number; mimetype?: string } | undefined;
    if (!obj || !meta) return errorJson("Upload not found", 400);
    if (
      (meta.size ?? 0) > PHOTO_LIMITS.maxBytes ||
      !PHOTO_LIMITS.mimeTypes.includes(meta.mimetype as "image/jpeg")
    ) {
      await service.storage.from(PHOTO_BUCKET).remove([b.path]);
      return errorJson("Photos must be JPG or PNG and 5 MB or smaller", 400);
    }
    const { count } = await supabase
      .from("photos")
      .select("id", { count: "exact", head: true })
      .eq("application_id", app.id);
    if ((count ?? 0) >= PHOTO_LIMITS.maxCount) {
      await service.storage.from(PHOTO_BUCKET).remove([b.path]);
      return errorJson(`You can upload up to ${PHOTO_LIMITS.maxCount} photos.`, 400);
    }
    const { data: row, error } = await supabase
      .from("photos")
      .insert({ application_id: app.id, storage_path: b.path, kind: b.kind })
      .select("id")
      .single();
    if (error || !row) {
      log.error("portal: photo insert failed", error);
      return errorJson("Could not save photo", 500);
    }
    const completed = await syncPhotoCompletion(supabase, app.id);
    return json({ ok: true, id: row.id, completed });
  }

  // delete
  const { data: photo } = await supabase
    .from("photos")
    .select("id,storage_path")
    .eq("id", b.id)
    .eq("application_id", app.id)
    .maybeSingle();
  if (!photo) return errorJson("Not found", 404);
  await service.storage.from(PHOTO_BUCKET).remove([photo.storage_path]);
  await supabase.from("photos").delete().eq("id", photo.id);
  const completed = await syncPhotoCompletion(supabase, app.id);
  return json({ ok: true, completed });
}
