import { beforeEach, describe, expect, it, vi } from "vitest";
import { FakeDb } from "./fake-db";

const db = new FakeDb();
let currentUser: { id: string; email: string } | null = null;

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: (u: string) => {
    throw new Error(`REDIRECT:${u}`);
  },
}));
// The user-scoped client: same fake DB, plus auth.getUser().
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => Object.assign(Object.create(db), { auth: { getUser: async () => ({ data: { user: currentUser } }) }, from: db.from.bind(db) }),
}));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: () => db, PHOTO_BUCKET: "donor-photos" }));

process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service";

const { requireAdmin } = await import("@/lib/auth");
const { PATCH } = await import("@/app/api/admin/applications/[id]/route");
const { GET: exportCsv } = await import("@/app/api/admin/export/route");

const APP_ID = "11111111-1111-4111-8111-111111111111";
let ip = 0;
const patch = (body: unknown) =>
  PATCH(
    new Request(`http://x/api/admin/applications/${APP_ID}`, {
      method: "PATCH",
      headers: { "content-type": "application/json", "x-forwarded-for": `10.1.0.${++ip}` },
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ id: APP_ID }) },
  );

beforeEach(() => {
  db.tables = {
    profiles: [
      { id: "admin-1", role: "admin" },
      { id: "user-1", role: "applicant" },
    ],
    applications: [
      {
        id: APP_ID,
        created_at: "2026-11-01T00:00:00Z",
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@example.com",
        phone: "3125550199",
        donor_type: "egg",
        state: "IL",
        zip: "60601",
        date_of_birth: "2000-01-01",
        status: "new",
        eligible: true,
        bmi: 21.6,
        smoker: false,
        regular_cycles: true,
        birth_control: "Pill",
      },
    ],
    audit_log: [],
    admin_notes: [],
  };
  currentUser = null;
});

describe("admin access control", () => {
  it("requireAdmin -> 404 for anonymous visitors", async () => {
    await expect(requireAdmin()).rejects.toThrow("NEXT_NOT_FOUND");
  });
  it("requireAdmin -> 404 for signed-in applicants", async () => {
    currentUser = { id: "user-1", email: "u@x.com" };
    await expect(requireAdmin()).rejects.toThrow("NEXT_NOT_FOUND");
  });
  it("requireAdmin passes for admins", async () => {
    currentUser = { id: "admin-1", email: "a@x.com" };
    await expect(requireAdmin()).resolves.toMatchObject({ user: { id: "admin-1" } });
  });
  it("admin APIs return 404 to non-admins", async () => {
    currentUser = { id: "user-1", email: "u@x.com" };
    expect((await patch({ status: "contacted" })).status).toBe(404);
    expect((await exportCsv(new Request("http://x/api/admin/export"))).status).toBe(404);
    expect(db.tables.applications![0]!.status).toBe("new");
  });
});

describe("admin actions", () => {
  beforeEach(() => {
    currentUser = { id: "admin-1", email: "a@x.com" };
  });

  it("changing status writes to audit_log", async () => {
    const res = await patch({ status: "contacted" });
    expect(res.status).toBe(200);
    expect(db.tables.applications![0]!.status).toBe("contacted");
    expect(db.tables.audit_log).toEqual([
      expect.objectContaining({
        actor_id: "admin-1",
        action: "update_status",
        target_id: APP_ID,
        meta: { from: "new", to: "contacted" },
      }),
    ]);
  });

  it("adding a note stores the author and audits it", async () => {
    await patch({ note: "Called, left voicemail" });
    expect(db.tables.admin_notes![0]).toMatchObject({ author_id: "admin-1", body: "Called, left voicemail" });
    expect(db.tables.audit_log!.map((a) => a.action)).toEqual(["add_note"]);
  });

  it("rejects invalid statuses", async () => {
    expect((await patch({ status: "hacked" })).status).toBe(400);
  });

  it("CSV export excludes health fields and is audited", async () => {
    const res = await exportCsv(new Request("http://x/api/admin/export?type=egg"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/csv");
    const csv = await res.text();
    expect(csv.split("\r\n")[0]).toContain("Email");
    expect(csv).toContain("jane@example.com");
    expect(csv).not.toMatch(/Pill|regular|smok|birth control|medical/i);
    expect(db.tables.audit_log!.map((a) => a.action)).toEqual(["export_csv"]);
  });
});
