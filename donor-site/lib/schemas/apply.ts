/**
 * Pre-screen questionnaire schema. Shared by the client form (react-hook-form)
 * and the /api/apply route so validation is identical on both sides.
 */
import { z } from "zod";
import { EDUCATION_LEVELS, type DonorType } from "@/config/eligibility";
import { US_STATE_CODES } from "@/config/us-states";
import { ageOn, parseIsoDate } from "@/lib/dates";

export const HOW_HEARD = ["Google", "Instagram", "TikTok", "Facebook", "Friend", "Other"] as const;
export const BIRTH_CONTROL = ["None", "Pill", "IUD", "Implant", "Shot", "Other"] as const;
export const YES_NO = ["yes", "no"] as const;

const yesNo = z.enum(YES_NO, { error: "Please choose Yes or No" });
const num = (min: number, max: number, label: string) =>
  z
    .number({ error: `Please enter your ${label}` })
    .int(`Please enter a whole number`)
    .min(min, `Please enter a valid ${label}`)
    .max(max, `Please enter a valid ${label}`);

/** Normalise a US phone number to 10 digits, or return null if invalid. */
export function normalizeUsPhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(digits)) return null;
  return digits;
}

export const step1Schema = z.object({
  dateOfBirth: z
    .string()
    .min(1, "Please enter your date of birth")
    .refine((v) => {
      const d = parseIsoDate(v);
      if (!d) return false;
      const age = ageOn(v, new Date());
      return age >= 0 && age <= 100;
    }, "Please enter a valid date of birth"),
  state: z.enum(US_STATE_CODES, { error: "Please select your state" }),
  zip: z.string().regex(/^\d{5}$/, "Please enter a 5-digit ZIP code"),
  education: z.enum(EDUCATION_LEVELS, { error: "Please select your education level" }),
  howHeard: z.enum(HOW_HEARD).optional().or(z.literal("")),
});

const step2Common = {
  heightFt: num(4, 7, "height (feet)"),
  heightIn: num(0, 11, "height (inches)"),
  weightLb: num(70, 500, "weight"),
  smoker: yesNo,
  previousDonation: yesNo,
};

export const step2EggSchema = z.object({
  ...step2Common,
  regularCycles: yesNo,
  birthControl: z.enum(BIRTH_CONTROL, { error: "Please select an option" }),
});

export const step2SpermSchema = z.object({
  ...step2Common,
  within60Min: yesNo,
  canCommit6Months: yesNo,
});

export const step3Schema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name").max(60),
  lastName: z.string().trim().min(1, "Please enter your last name").max(60),
  email: z.string().trim().toLowerCase().email("Please enter a valid email").max(254),
  phone: z
    .string()
    .refine((v) => normalizeUsPhone(v) !== null, "Please enter a valid US mobile number"),
  smsConsent: z.boolean(),
  privacyConsent: z.literal(true, { error: "You must agree to the Privacy Policy" }),
  ref: z
    .string()
    .regex(/^[A-Za-z0-9]{8}$/)
    .optional()
    .or(z.literal("")),
});

export const eggApplicationSchema = step1Schema
  .extend(step2EggSchema.shape)
  .extend(step3Schema.shape);
export const spermApplicationSchema = step1Schema
  .extend(step2SpermSchema.shape)
  .extend(step3Schema.shape);

export type EggApplication = z.infer<typeof eggApplicationSchema>;
export type SpermApplication = z.infer<typeof spermApplicationSchema>;
export type Application = EggApplication | SpermApplication;

export function applicationSchema(type: DonorType) {
  return type === "egg" ? eggApplicationSchema : spermApplicationSchema;
}

export function stepSchemas(type: DonorType) {
  return [step1Schema, type === "egg" ? step2EggSchema : step2SpermSchema, step3Schema] as const;
}

/** Request body for POST /api/apply (form data + type + anti-spam fields). */
export const applyRequestSchema = z.object({
  donorType: z.enum(["egg", "sperm"]),
  data: z.record(z.string(), z.unknown()),
  turnstileToken: z.string().optional(),
  website: z.string().optional(), // honeypot — must be empty
});
