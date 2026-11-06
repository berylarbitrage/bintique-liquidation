/**
 * Pre-screen eligibility rules. Edit values here; the landing pages, the
 * questionnaire and the server-side evaluator all read from this file.
 */
export const EDUCATION_LEVELS = [
  "High school",
  "Some college",
  "Currently in college",
  "Bachelor's",
  "Graduate",
] as const;
export type EducationLevel = (typeof EDUCATION_LEVELS)[number];

export const ELIGIBILITY = {
  egg: {
    minAge: 21,
    maxAge: 31,
    maxBmi: 28,
    requireNonSmoker: true,
    requireRegularCycles: true,
    minEducation: "High school",
  },
  sperm: {
    minAge: 19,
    maxAge: 38,
    maxBmi: 30,
    minHeightInches: 68,
    requireNonSmoker: true,
    minEducation: "Currently in college",
    requireWithin60Min: true,
    requireCommit6Months: true,
  },
} as const;

export type DonorType = keyof typeof ELIGIBILITY;
export const DONOR_TYPES = ["egg", "sperm"] as const satisfies readonly DonorType[];

export function isDonorType(v: unknown): v is DonorType {
  return v === "egg" || v === "sperm";
}

/** Absolute minimum age to start the questionnaire at all. */
export const MIN_APPLICANT_AGE = 18;

function inchesToFeet(inches: number): string {
  return `${Math.floor(inches / 12)}'${inches % 12}"`;
}

/** Human-readable requirement list used on landing pages (rendered, not hard-coded). */
export function requirementsList(type: DonorType): string[] {
  if (type === "egg") {
    const r = ELIGIBILITY.egg;
    return [
      `Age ${r.minAge}–${r.maxAge}`,
      `BMI under ${r.maxBmi}`,
      ...(r.requireNonSmoker ? ["Non-smoker (including vaping and nicotine products)"] : []),
      ...(r.requireRegularCycles ? ["Regular menstrual cycles"] : []),
      `${r.minEducation} diploma or higher`,
      "Able to commit to about 3–6 weeks of screening appointments and medication",
    ];
  }
  const r = ELIGIBILITY.sperm;
  return [
    `Age ${r.minAge}–${r.maxAge}`,
    `Height ${inchesToFeet(r.minHeightInches)} or taller`,
    `BMI under ${r.maxBmi}`,
    `${r.minEducation === "Currently in college" ? "Currently enrolled in college" : r.minEducation} or higher education`,
    ...(r.requireNonSmoker ? ["Non-smoker (including vaping and nicotine products)"] : []),
    ...(r.requireWithin60Min ? ["Live within 60 minutes of a partner sperm bank"] : []),
    ...(r.requireCommit6Months ? ["Able to donate weekly for at least 6 months"] : []),
  ];
}
