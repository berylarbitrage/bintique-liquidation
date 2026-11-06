/**
 * Pure eligibility evaluator. Runs on the server for every submission (the
 * client result is never trusted) and in the browser only for UX hints.
 */
import { ELIGIBILITY, EDUCATION_LEVELS, type DonorType, type EducationLevel } from "@/config/eligibility";
import { ageOn } from "@/lib/dates";

export type FailReason =
  | "age_too_young"
  | "age_too_old"
  | "bmi"
  | "height"
  | "smoker"
  | "irregular_cycles"
  | "education"
  | "distance"
  | "commitment";

export const FAIL_REASON_LABELS: Record<FailReason, string> = {
  age_too_young: "Below the minimum age",
  age_too_old: "Above the maximum age",
  bmi: "BMI outside the program range",
  height: "Below the minimum height",
  smoker: "Uses nicotine products",
  irregular_cycles: "Irregular menstrual cycles",
  education: "Education requirement not met",
  distance: "Not within 60 minutes of a partner location",
  commitment: "Unable to commit to 6 months",
};

export interface EligibilityInput {
  dateOfBirth: string;
  education: string;
  heightFt: number;
  heightIn: number;
  weightLb: number;
  smoker: "yes" | "no";
  regularCycles?: "yes" | "no";
  within60Min?: "yes" | "no";
  canCommit6Months?: "yes" | "no";
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: FailReason[];
  bmi: number;
  age: number;
  heightInches: number;
}

export function totalHeightInches(ft: number, inches: number): number {
  return ft * 12 + inches;
}

/** BMI (imperial), rounded to one decimal place. */
export function computeBmi(weightLb: number, heightInches: number): number {
  if (heightInches <= 0) return NaN;
  return Math.round(((703 * weightLb) / (heightInches * heightInches)) * 10) / 10;
}

function educationRank(level: string): number {
  return EDUCATION_LEVELS.indexOf(level as EducationLevel);
}

export function evaluate(
  type: DonorType,
  data: EligibilityInput,
  now: Date = new Date(),
): EligibilityResult {
  const age = ageOn(data.dateOfBirth, now);
  const heightInches = totalHeightInches(data.heightFt, data.heightIn);
  const bmi = computeBmi(data.weightLb, heightInches);
  const reasons: FailReason[] = [];

  const rules = ELIGIBILITY[type];

  if (!(age >= rules.minAge)) reasons.push("age_too_young");
  else if (age > rules.maxAge) reasons.push("age_too_old");

  if (!(bmi < rules.maxBmi)) reasons.push("bmi");

  if (rules.requireNonSmoker && data.smoker !== "no") reasons.push("smoker");

  if (educationRank(data.education) < educationRank(rules.minEducation)) reasons.push("education");

  if (type === "egg") {
    const r = ELIGIBILITY.egg;
    if (r.requireRegularCycles && data.regularCycles !== "yes") reasons.push("irregular_cycles");
  } else {
    const r = ELIGIBILITY.sperm;
    if (!(heightInches >= r.minHeightInches)) reasons.push("height");
    if (r.requireWithin60Min && data.within60Min !== "yes") reasons.push("distance");
    if (r.requireCommit6Months && data.canCommit6Months !== "yes") reasons.push("commitment");
  }

  return { eligible: reasons.length === 0, reasons, bmi, age, heightInches };
}
