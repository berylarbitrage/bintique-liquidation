import { describe, expect, it } from "vitest";
import { evaluate, computeBmi, type EligibilityInput } from "@/lib/eligibility";
import { ageOn } from "@/lib/dates";
import { ELIGIBILITY } from "@/config/eligibility";

// Fixed "today" so tests are deterministic.
const NOW = new Date(2026, 5, 15); // June 15, 2026 (local time)

/** Birth date such that the person turns exactly `age` today. */
function dobForAge(age: number, dayOffset = 0): string {
  const d = new Date(NOW.getFullYear() - age, NOW.getMonth(), NOW.getDate() + dayOffset);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** Weight (lb) that yields a BMI rounding to `bmi` for the given height. */
function weightFor(bmi: number, heightInches: number): number {
  // Search integer weights for an exact rounded BMI match.
  for (let w = 70; w < 500; w++) if (computeBmi(w, heightInches) >= bmi) return w;
  throw new Error("no weight");
}

const eggBase: EligibilityInput = {
  dateOfBirth: dobForAge(25),
  education: "High school",
  heightFt: 5,
  heightIn: 5,
  weightLb: 130,
  smoker: "no",
  regularCycles: "yes",
};

const spermBase: EligibilityInput = {
  dateOfBirth: dobForAge(25),
  education: "Currently in college",
  heightFt: 5,
  heightIn: 10,
  weightLb: 165,
  smoker: "no",
  within60Min: "yes",
  canCommit6Months: "yes",
};

describe("ageOn", () => {
  it("counts the birthday itself as the new age", () => {
    expect(ageOn(dobForAge(21), NOW)).toBe(21);
    expect(ageOn(dobForAge(21, 1), NOW)).toBe(20); // birthday is tomorrow
  });
  it("handles Feb 29 birthdays", () => {
    expect(ageOn("2004-02-29", new Date(2025, 1, 28))).toBe(20);
    expect(ageOn("2004-02-29", new Date(2025, 2, 1))).toBe(21);
  });
  it("returns NaN for invalid dates", () => {
    expect(ageOn("2001-02-30", NOW)).toBeNaN();
    expect(ageOn("nope", NOW)).toBeNaN();
  });
});

describe("computeBmi", () => {
  it("uses the imperial formula rounded to 1 decimal", () => {
    expect(computeBmi(130, 65)).toBe(21.6);
    expect(computeBmi(165, 70)).toBe(23.7);
  });
});

describe("evaluate: egg", () => {
  const r = ELIGIBILITY.egg;
  it("accepts a baseline eligible applicant", () => {
    const res = evaluate("egg", eggBase, NOW);
    expect(res).toMatchObject({ eligible: true, reasons: [], age: 25 });
  });

  it.each([
    [r.minAge - 1, false, "age_too_young"],
    [r.minAge, true, null],
    [r.maxAge, true, null],
    [r.maxAge + 1, false, "age_too_old"],
  ] as const)("age %i -> eligible=%s", (age, ok, reason) => {
    const res = evaluate("egg", { ...eggBase, dateOfBirth: dobForAge(age) }, NOW);
    expect(res.eligible).toBe(ok);
    if (reason) expect(res.reasons).toContain(reason);
  });

  it("age boundary: one day before 22nd birthday at max 31 + 1", () => {
    // Turns 32 tomorrow -> still 31 today -> eligible
    const res = evaluate("egg", { ...eggBase, dateOfBirth: dobForAge(r.maxAge + 1, 1) }, NOW);
    expect(res.age).toBe(r.maxAge);
    expect(res.eligible).toBe(true);
  });

  it("BMI must be strictly below the max", () => {
    const h = 65;
    const atMax = weightFor(r.maxBmi, h);
    const below = evaluate("egg", { ...eggBase, weightLb: atMax - 1 }, NOW);
    const at = evaluate("egg", { ...eggBase, weightLb: atMax }, NOW);
    expect(below.bmi).toBeLessThan(r.maxBmi);
    expect(below.eligible).toBe(true);
    expect(at.bmi).toBeGreaterThanOrEqual(r.maxBmi);
    expect(at.reasons).toContain("bmi");
  });

  it("rejects smokers", () => {
    expect(evaluate("egg", { ...eggBase, smoker: "yes" }, NOW).reasons).toEqual(["smoker"]);
  });

  it("rejects irregular cycles", () => {
    expect(evaluate("egg", { ...eggBase, regularCycles: "no" }, NOW).reasons).toEqual([
      "irregular_cycles",
    ]);
  });

  it("education: High school is the minimum and passes", () => {
    expect(evaluate("egg", { ...eggBase, education: "High school" }, NOW).eligible).toBe(true);
    expect(evaluate("egg", { ...eggBase, education: "Graduate" }, NOW).eligible).toBe(true);
    expect(evaluate("egg", { ...eggBase, education: "None" }, NOW).reasons).toContain("education");
  });

  it("does not apply sperm-only rules", () => {
    const res = evaluate("egg", { ...eggBase, heightFt: 4, heightIn: 11, weightLb: 100 }, NOW);
    expect(res.reasons).not.toContain("height");
  });

  it("collects multiple reasons", () => {
    const res = evaluate(
      "egg",
      { ...eggBase, smoker: "yes", regularCycles: "no", dateOfBirth: dobForAge(40) },
      NOW,
    );
    expect(res.reasons.sort()).toEqual(["age_too_old", "irregular_cycles", "smoker"]);
  });
});

describe("evaluate: sperm", () => {
  const r = ELIGIBILITY.sperm;
  it("accepts a baseline eligible applicant", () => {
    expect(evaluate("sperm", spermBase, NOW)).toMatchObject({ eligible: true, reasons: [] });
  });

  it.each([
    [r.minAge - 1, false],
    [r.minAge, true],
    [r.maxAge, true],
    [r.maxAge + 1, false],
  ] as const)("age %i -> eligible=%s", (age, ok) => {
    expect(evaluate("sperm", { ...spermBase, dateOfBirth: dobForAge(age) }, NOW).eligible).toBe(ok);
  });

  it("height boundary is inclusive of the minimum", () => {
    const ft = Math.floor(r.minHeightInches / 12);
    const inch = r.minHeightInches % 12;
    const at = evaluate(
      "sperm",
      { ...spermBase, heightFt: ft, heightIn: inch, weightLb: 150 },
      NOW,
    );
    const below = evaluate(
      "sperm",
      { ...spermBase, heightFt: ft, heightIn: inch - 1, weightLb: 150 },
      NOW,
    );
    expect(at.heightInches).toBe(r.minHeightInches);
    expect(at.eligible).toBe(true);
    expect(below.reasons).toEqual(["height"]);
  });

  it("BMI must be strictly below the max", () => {
    const h = 70;
    const atMax = weightFor(r.maxBmi, h);
    expect(evaluate("sperm", { ...spermBase, weightLb: atMax - 1 }, NOW).eligible).toBe(true);
    expect(evaluate("sperm", { ...spermBase, weightLb: atMax }, NOW).reasons).toContain("bmi");
  });

  it("education: Currently in college is the minimum", () => {
    expect(evaluate("sperm", { ...spermBase, education: "Some college" }, NOW).reasons).toEqual([
      "education",
    ]);
    expect(evaluate("sperm", { ...spermBase, education: "High school" }, NOW).reasons).toEqual([
      "education",
    ]);
    expect(
      evaluate("sperm", { ...spermBase, education: "Currently in college" }, NOW).eligible,
    ).toBe(true);
    expect(evaluate("sperm", { ...spermBase, education: "Bachelor's" }, NOW).eligible).toBe(true);
  });

  it("rejects smokers", () => {
    expect(evaluate("sperm", { ...spermBase, smoker: "yes" }, NOW).reasons).toEqual(["smoker"]);
  });

  it("requires living within 60 minutes", () => {
    expect(evaluate("sperm", { ...spermBase, within60Min: "no" }, NOW).reasons).toEqual([
      "distance",
    ]);
  });

  it("requires a 6-month commitment", () => {
    expect(evaluate("sperm", { ...spermBase, canCommit6Months: "no" }, NOW).reasons).toEqual([
      "commitment",
    ]);
  });

  it("does not apply egg-only rules", () => {
    expect(evaluate("sperm", { ...spermBase, regularCycles: "no" }, NOW).eligible).toBe(true);
  });
});
