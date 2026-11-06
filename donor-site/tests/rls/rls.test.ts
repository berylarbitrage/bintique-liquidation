/**
 * Integration tests against a REAL Supabase instance (local or a staging project).
 *
 *   supabase start            # local stack via Docker
 *   supabase db reset         # applies supabase/migrations
 *   SUPABASE_URL=http://127.0.0.1:54321 \
 *   SUPABASE_ANON_KEY=... SUPABASE_SERVICE_ROLE_KEY=... pnpm test:rls
 *
 * NEVER point this at production: it creates and deletes users.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const enabled = !!(url && anon && service);

const BUCKET = "donor-photos";
const PNG = Uint8Array.from(
  atob(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  ),
  (c) => c.charCodeAt(0),
);

describe.skipIf(!enabled)("RLS & storage (live Supabase)", () => {
  let admin: SupabaseClient;
  const run = Math.random().toString(36).slice(2, 8);
  const users: Record<
    "a" | "b",
    { id: string; email: string; client: SupabaseClient; appId: string }
  > = {} as never;
  const password = `Test-${run}-pw!`;

  async function makeApplicant(key: "a" | "b") {
    const email = `rls-${key}-${run}@example.com`;
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    const id = data.user!.id;
    const { data: app, error: appErr } = await admin
      .from("applications")
      .insert({
        user_id: id,
        donor_type: "egg",
        first_name: key.toUpperCase(),
        last_name: "Test",
        email,
        phone: "3125550199",
        date_of_birth: "2000-01-01",
        state: "IL",
        zip: "60601",
        eligible: true,
      })
      .select("id")
      .single();
    if (appErr) throw appErr;
    await admin
      .from("full_applications")
      .insert({ application_id: app.id, sections: { medical: { secret: key } } });
    await admin.storage
      .from(BUCKET)
      .upload(`${app.id}/photo.png`, PNG, { contentType: "image/png" });
    await admin
      .from("photos")
      .insert({ application_id: app.id, storage_path: `${app.id}/photo.png`, kind: "recent" });
    const client = createClient(url!, anon!, { auth: { persistSession: false } });
    const { error: signInErr } = await client.auth.signInWithPassword({ email, password });
    if (signInErr) throw signInErr;
    users[key] = { id, email, client, appId: app.id };
  }

  beforeAll(async () => {
    admin = createClient(url!, service!, { auth: { persistSession: false } });
    await makeApplicant("a");
    await makeApplicant("b");
  });

  afterAll(async () => {
    for (const u of Object.values(users)) {
      await admin.storage.from(BUCKET).remove([`${u.appId}/photo.png`, `${u.appId}/evil.png`]);
      await admin.from("applications").delete().eq("id", u.appId);
      await admin.auth.admin.deleteUser(u.id);
    }
  });

  it("applicant A only sees their own application", async () => {
    const { data } = await users.a.client.from("applications").select("id");
    expect(data?.map((r) => r.id)).toEqual([users.a.appId]);
  });

  it("applicant A cannot read applicant B's full application or photos", async () => {
    const full = await users.a.client
      .from("full_applications")
      .select("*")
      .eq("application_id", users.b.appId);
    expect(full.data).toEqual([]);
    const photos = await users.a.client
      .from("photos")
      .select("*")
      .eq("application_id", users.b.appId);
    expect(photos.data).toEqual([]);
  });

  it("applicant A cannot download, sign or upload B's storage objects", async () => {
    const dl = await users.a.client.storage.from(BUCKET).download(`${users.b.appId}/photo.png`);
    expect(dl.error).toBeTruthy();
    const signed = await users.a.client.storage
      .from(BUCKET)
      .createSignedUrl(`${users.b.appId}/photo.png`, 60);
    expect(signed.error).toBeTruthy();
    const up = await users.a.client.storage
      .from(BUCKET)
      .upload(`${users.b.appId}/evil.png`, PNG, { contentType: "image/png" });
    expect(up.error).toBeTruthy();
  });

  it("applicant A cannot write B's full application or change their own status/role", async () => {
    await users.a.client
      .from("full_applications")
      .update({ sections: { hacked: true } })
      .eq("application_id", users.b.appId);
    const b = await admin
      .from("full_applications")
      .select("sections")
      .eq("application_id", users.b.appId)
      .single();
    expect(b.data?.sections).toEqual({ medical: { secret: "b" } });

    await users.a.client
      .from("applications")
      .update({ status: "completed" })
      .eq("id", users.a.appId);
    await users.a.client.from("profiles").update({ role: "admin" }).eq("id", users.a.id);
    const a = await admin.from("applications").select("status").eq("id", users.a.appId).single();
    const p = await admin.from("profiles").select("role").eq("id", users.a.id).single();
    expect(a.data?.status).toBe("new");
    expect(p.data?.role).toBe("applicant");
  });

  it("anonymous clients cannot read or insert applications", async () => {
    const anonClient = createClient(url!, anon!, { auth: { persistSession: false } });
    const { data } = await anonClient.from("applications").select("id");
    expect(data ?? []).toEqual([]);
    const ins = await anonClient.from("applications").insert({
      donor_type: "egg",
      first_name: "x",
      last_name: "x",
      email: "x@x.com",
      phone: "1",
      date_of_birth: "2000-01-01",
      state: "IL",
      zip: "60601",
      eligible: true,
    });
    expect(ins.error).toBeTruthy();
  });

  it("photo bucket is private (no public URL access)", async () => {
    const pub = admin.storage.from(BUCKET).getPublicUrl(`${users.a.appId}/photo.png`)
      .data.publicUrl;
    const res = await fetch(pub);
    expect(res.ok).toBe(false);
  });

  it("signed photo URLs are issued for 10 minutes", async () => {
    const { data } = await users.a.client.storage
      .from(BUCKET)
      .createSignedUrl(`${users.a.appId}/photo.png`, 600);
    const token = new URL(data!.signedUrl).searchParams.get("token")!;
    const payload = JSON.parse(Buffer.from(token.split(".")[1]!, "base64url").toString());
    expect(payload.exp - payload.iat).toBe(600);
    expect((await fetch(data!.signedUrl)).ok).toBe(true);
  });

  it("signed URLs stop working after they expire", async () => {
    const { data } = await admin.storage
      .from(BUCKET)
      .createSignedUrl(`${users.a.appId}/photo.png`, 1);
    await new Promise((r) => setTimeout(r, 2500));
    expect((await fetch(data!.signedUrl)).ok).toBe(false);
  });
});
