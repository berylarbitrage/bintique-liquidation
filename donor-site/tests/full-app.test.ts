import { describe, expect, it } from "vitest";
import { completionPercent, sectionFields, sectionSchema } from "@/lib/full-app";

describe("full application sections", () => {
  it("filters donor-type-specific fields", () => {
    const egg = sectionFields("reproductive", "egg").map((f) => f.name);
    const sperm = sectionFields("reproductive", "sperm").map((f) => f.name);
    expect(egg).toContain("ageFirstPeriod");
    expect(egg).not.toContain("vasectomy");
    expect(sperm).toContain("vasectomy");
    expect(sperm).not.toContain("pregnancies");
  });

  it("strict mode enforces required fields; draft mode does not", () => {
    expect(sectionSchema("background", "egg", true).safeParse({}).success).toBe(false);
    expect(
      sectionSchema("background", "egg", false).safeParse({ occupation: "Nurse" }).success,
    ).toBe(true);
  });

  it("rejects unknown keys and wrong option values", () => {
    expect(sectionSchema("appearance", "egg", false).safeParse({ evil: 1 }).success).toBe(false);
    expect(
      sectionSchema("appearance", "egg", false).safeParse({ eyeColor: "Purple" }).success,
    ).toBe(false);
  });

  it("validates multi-select and numbers", () => {
    const s = sectionSchema("reproductive", "egg", true);
    const ok = {
      ageFirstPeriod: 12,
      cycleLength: 28,
      pregnancies: 0,
      liveBirths: 0,
      stdHistory: "No",
      reproductiveConditions: "None",
    };
    expect(s.safeParse(ok).success).toBe(true);
    expect(s.safeParse({ ...ok, cycleLength: 2 }).success).toBe(false);
    const m = sectionSchema("medical", "egg", true);
    expect(m.safeParse({ conditions: [] }).success).toBe(false);
  });

  it("computes completion percent over 7 sections", () => {
    expect(completionPercent([])).toBe(0);
    expect(completionPercent(["background"])).toBe(14);
    expect(
      completionPercent([
        "background",
        "appearance",
        "medical",
        "family",
        "reproductive",
        "photos",
        "signature",
      ]),
    ).toBe(100);
  });
});
