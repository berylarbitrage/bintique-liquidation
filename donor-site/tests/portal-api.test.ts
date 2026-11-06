import { beforeEach, describe, expect, it, vi } from "vitest";
import { FakeDb } from "./fake-db";

const db = new FakeDb();
let currentUser: { id: string } | null = null;

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () =>
    Object.assign(Object.create(db), {
      auth: { getUser: async () => ({ data: { user: currentUser } }) },
      from: db.from.bind(db),
    }),
}));
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => db,
  PHOTO_BUCKET: "donor-photos",
}));
vi.mock("@/lib/email", () => ({ sendEmail: async () => true }));

process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service";

const { PATCH: saveSection } = await import("@/app/api/portal/section/route");
const { POST: submit } = await import("@/app/api/portal/submit/route");

let ip = 0;
const call = (fn: (r: Request) => Promise<Response>, method: string, body: unknown) =>
  fn(
    new Request("http://x/api/portal", {
      method,
      headers: { "content-type": "application/json", "x-forwarded-for": `10.2.0.${++ip}` },
      body: JSON.stringify(body),
    }),
  );

const background = {
  occupation: "Nurse",
  hobbies: "Hiking",
  personality: "Kind",
  whyDonate: "To help",
};

beforeEach(() => {
  db.tables = {
    applications: [
      {
        id: "app-a",
        user_id: "user-a",
        eligible: true,
        donor_type: "egg",
        first_name: "A",
        last_name: "A",
        status: "full_app_pending",
        created_at: "2026-01-01",
      },
      {
        id: "app-b",
        user_id: "user-b",
        eligible: true,
        donor_type: "egg",
        first_name: "B",
        last_name: "B",
        status: "full_app_pending",
        created_at: "2026-01-01",
      },
    ],
    full_applications: [],
    photos: [],
  };
  currentUser = { id: "user-a" };
});

describe("portal section save", () => {
  it("requires sign-in", async () => {
    currentUser = null;
    expect(
      (
        await call(saveSection, "PATCH", {
          section: "background",
          data: background,
          complete: true,
        })
      ).status,
    ).toBe(401);
  });

  it("saves a complete section to the user's own application", async () => {
    const res = await call(saveSection, "PATCH", {
      section: "background",
      data: background,
      complete: true,
    });
    expect(res.status).toBe(200);
    expect(db.tables.full_applications).toEqual([
      expect.objectContaining({ application_id: "app-a", completed_sections: ["background"] }),
    ]);
  });

  it("saves incomplete drafts without marking complete", async () => {
    await call(saveSection, "PATCH", {
      section: "background",
      data: { occupation: "Nurse" },
      complete: false,
    });
    expect(db.tables.full_applications![0]).toMatchObject({
      completed_sections: [],
      sections: { background: { occupation: "Nurse" } },
    });
  });

  it("rejects incomplete data when marking complete", async () => {
    const res = await call(saveSection, "PATCH", {
      section: "background",
      data: { occupation: "Nurse" },
      complete: true,
    });
    expect(res.status).toBe(400);
  });

  it("refuses edits after submission", async () => {
    db.tables.full_applications = [
      { application_id: "app-a", sections: {}, completed_sections: [], submitted_at: "2026-01-02" },
    ];
    expect(
      (
        await call(saveSection, "PATCH", {
          section: "background",
          data: background,
          complete: true,
        })
      ).status,
    ).toBe(409);
  });
});

describe("portal submit", () => {
  it("requires all sections and photos", async () => {
    db.tables.full_applications = [
      { application_id: "app-a", sections: {}, completed_sections: ["background"] },
    ];
    const res = await call(submit, "POST", { signedName: "Jane Doe", attest: true });
    expect(res.status).toBe(400);
  });

  it("submits, signs, and moves status to full_app_submitted", async () => {
    db.tables.full_applications = [
      {
        application_id: "app-a",
        sections: {},
        completed_sections: ["background", "appearance", "medical", "family", "reproductive"],
        submitted_at: null,
      },
    ];
    db.tables.photos = [
      { application_id: "app-a", kind: "childhood" },
      { application_id: "app-a", kind: "recent" },
    ];
    const res = await call(submit, "POST", { signedName: "Jane Doe", attest: true });
    expect(res.status).toBe(200);
    expect(db.tables.full_applications![0]).toMatchObject({ signed_name: "Jane Doe" });
    expect(db.tables.full_applications![0]!.submitted_at).toBeTruthy();
    expect(db.tables.applications!.find((a) => a.id === "app-a")!.status).toBe(
      "full_app_submitted",
    );
    expect(db.tables.applications!.find((a) => a.id === "app-b")!.status).toBe("full_app_pending");
  });

  it("requires the attestation checkbox", async () => {
    expect((await call(submit, "POST", { signedName: "Jane Doe", attest: false })).status).toBe(
      400,
    );
  });
});
