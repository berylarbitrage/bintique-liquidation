/**
 * Full (stage 2) application: section definitions. The portal form, the
 * server validation and the admin detail view are all generated from this.
 */
import { z } from "zod";
import type { DonorType } from "@/config/eligibility";

export type FieldKind = "text" | "textarea" | "select" | "yesno" | "multi" | "number";

export interface FieldDef {
  name: string;
  label: string;
  kind: FieldKind;
  options?: readonly string[];
  required?: boolean;
  hint?: string;
  min?: number;
  max?: number;
  onlyFor?: DonorType;
}

export interface FormSectionDef {
  id: FormSectionId;
  title: string;
  description: string;
  fields: FieldDef[];
}

export const FORM_SECTION_IDS = ["background", "appearance", "medical", "family", "reproductive"] as const;
export type FormSectionId = (typeof FORM_SECTION_IDS)[number];
export const ALL_SECTION_IDS = [...FORM_SECTION_IDS, "photos", "signature"] as const;
export type SectionId = (typeof ALL_SECTION_IDS)[number];

export const SECTION_TITLES: Record<SectionId, string> = {
  background: "Personal background",
  appearance: "Physical characteristics",
  medical: "Personal medical history",
  family: "Family medical history",
  reproductive: "Reproductive health",
  photos: "Photos",
  signature: "Review & sign",
};

const YES_NO_NA = ["Yes", "No"] as const;
const PERSONAL_CONDITIONS = [
  "Asthma",
  "Diabetes",
  "Heart condition",
  "High blood pressure",
  "Cancer",
  "Seizures / epilepsy",
  "Depression or anxiety",
  "Bipolar disorder",
  "Schizophrenia",
  "ADHD",
  "Autoimmune disorder",
  "Thyroid disorder",
  "Sexually transmitted infection",
  "None of these",
] as const;
const FAMILY_CONDITIONS = [
  "Heart disease before age 55",
  "Diabetes",
  "Cancer",
  "Alzheimer's / dementia",
  "Mental illness",
  "Substance use disorder",
  "Birth defects",
  "Genetic disorder (e.g. cystic fibrosis, sickle cell, Tay-Sachs)",
  "Intellectual disability",
  "Hearing or vision loss before age 50",
  "None of these",
] as const;

export const FORM_SECTIONS: FormSectionDef[] = [
  {
    id: "background",
    title: SECTION_TITLES.background,
    description: "Help intended parents get to know you.",
    fields: [
      { name: "occupation", label: "Occupation or field of study", kind: "text", required: true, max: 120 },
      { name: "hobbies", label: "Hobbies and interests", kind: "textarea", required: true, max: 1500 },
      { name: "personality", label: "Describe your personality", kind: "textarea", required: true, max: 1500 },
      { name: "whyDonate", label: "Why would you like to become a donor?", kind: "textarea", required: true, max: 1500 },
    ],
  },
  {
    id: "appearance",
    title: SECTION_TITLES.appearance,
    description: "Used only for anonymous profile matching.",
    fields: [
      { name: "eyeColor", label: "Eye color", kind: "select", required: true, options: ["Brown", "Hazel", "Green", "Blue", "Gray", "Other"] },
      { name: "hairColor", label: "Natural hair color", kind: "select", required: true, options: ["Black", "Dark brown", "Light brown", "Blonde", "Red", "Gray", "Other"] },
      { name: "hairTexture", label: "Hair texture", kind: "select", required: true, options: ["Straight", "Wavy", "Curly", "Coily"] },
      { name: "skinTone", label: "Skin tone", kind: "select", required: true, options: ["Very fair", "Fair", "Medium", "Olive", "Brown", "Dark"] },
      { name: "build", label: "Body build", kind: "select", required: true, options: ["Slim", "Athletic", "Average", "Curvy / stocky"] },
      { name: "glasses", label: "Do you wear glasses or contacts?", kind: "yesno", required: true },
    ],
  },
  {
    id: "medical",
    title: SECTION_TITLES.medical,
    description: "Confidential. Shared only with partner medical providers.",
    fields: [
      { name: "conditions", label: "Have you ever been diagnosed with any of the following?", kind: "multi", required: true, options: PERSONAL_CONDITIONS },
      { name: "conditionDetails", label: "Details about any conditions above", kind: "textarea", max: 2000 },
      { name: "medications", label: "Current medications (or 'None')", kind: "textarea", required: true, max: 1000 },
      { name: "surgeries", label: "Past surgeries or hospitalizations (or 'None')", kind: "textarea", required: true, max: 1000 },
      { name: "allergies", label: "Allergies (or 'None')", kind: "text", required: true, max: 300 },
      { name: "mentalHealthTreatment", label: "Have you ever received treatment for a mental health condition?", kind: "yesno", required: true },
      { name: "alcohol", label: "Alcohol use", kind: "select", required: true, options: ["None", "Occasional", "Weekly", "Daily"] },
      { name: "recreationalDrugs", label: "Have you used recreational drugs in the past 12 months?", kind: "yesno", required: true },
      { name: "recentTattoo", label: "Have you had a tattoo or piercing in the past 12 months?", kind: "yesno", required: true },
    ],
  },
  {
    id: "family",
    title: SECTION_TITLES.family,
    description: "Three generations: parents, siblings and grandparents. Share what you know.",
    fields: [
      { name: "adopted", label: "Were you adopted?", kind: "yesno", required: true },
      { name: "familyConditions", label: "Has any blood relative had any of the following?", kind: "multi", required: true, options: FAMILY_CONDITIONS },
      { name: "mother", label: "Mother — health conditions, or age and cause of death", kind: "textarea", required: true, max: 1000 },
      { name: "father", label: "Father — health conditions, or age and cause of death", kind: "textarea", required: true, max: 1000 },
      { name: "siblings", label: "Siblings — health conditions (or 'None')", kind: "textarea", required: true, max: 1000 },
      { name: "maternalGrandparents", label: "Maternal grandparents — health conditions / cause of death", kind: "textarea", required: true, max: 1000 },
      { name: "paternalGrandparents", label: "Paternal grandparents — health conditions / cause of death", kind: "textarea", required: true, max: 1000 },
    ],
  },
  {
    id: "reproductive",
    title: SECTION_TITLES.reproductive,
    description: "Confidential. Shared only with partner medical providers.",
    fields: [
      { name: "ageFirstPeriod", label: "Age at first period", kind: "number", required: true, min: 8, max: 20, onlyFor: "egg" },
      { name: "cycleLength", label: "Typical cycle length (days)", kind: "number", required: true, min: 15, max: 60, onlyFor: "egg" },
      { name: "pregnancies", label: "Number of pregnancies", kind: "number", required: true, min: 0, max: 20, onlyFor: "egg" },
      { name: "liveBirths", label: "Number of live births", kind: "number", required: true, min: 0, max: 20, onlyFor: "egg" },
      { name: "childrenFathered", label: "Number of biological children", kind: "number", required: true, min: 0, max: 50, onlyFor: "sperm" },
      { name: "vasectomy", label: "Have you had a vasectomy?", kind: "yesno", required: true, onlyFor: "sperm" },
      { name: "stdHistory", label: "Have you ever been diagnosed with an STI?", kind: "yesno", required: true },
      { name: "reproductiveConditions", label: "Any reproductive conditions or concerns (or 'None')", kind: "textarea", required: true, max: 1500, hint: "For example: PCOS, endometriosis, varicocele, undescended testicle." },
    ],
  },
];

export function sectionFields(id: FormSectionId, donorType: DonorType): FieldDef[] {
  const def = FORM_SECTIONS.find((s) => s.id === id)!;
  return def.fields.filter((f) => !f.onlyFor || f.onlyFor === donorType);
}

function fieldSchema(f: FieldDef, strict: boolean): z.ZodType {
  const requiredMsg = "This field is required";
  switch (f.kind) {
    case "text":
    case "textarea": {
      const base = z.string().trim().max(f.max ?? 2000, `Please keep this under ${f.max ?? 2000} characters`);
      return strict && f.required ? base.min(1, requiredMsg) : base.optional();
    }
    case "select": {
      const e = z.enum(f.options as [string, ...string[]], { error: "Please choose an option" });
      return strict && f.required ? e : e.optional().or(z.literal(""));
    }
    case "yesno": {
      const e = z.enum(YES_NO_NA, { error: "Please choose Yes or No" });
      return strict && f.required ? e : e.optional();
    }
    case "multi": {
      const arr = z.array(z.enum(f.options as [string, ...string[]])).max(f.options!.length);
      return strict && f.required ? arr.min(1, "Please select at least one option (or 'None of these')") : arr.optional();
    }
    case "number": {
      const n = z
        .number({ error: "Please enter a number" })
        .int()
        .min(f.min ?? 0, `Must be at least ${f.min ?? 0}`)
        .max(f.max ?? 1000, `Must be at most ${f.max ?? 1000}`);
      return strict && f.required ? n : n.optional().nullable();
    }
  }
}

/**
 * Zod schema for a section. `strict` = required fields enforced (save &
 * mark complete); non-strict = draft save (types/lengths still enforced).
 */
export function sectionSchema(id: FormSectionId, donorType: DonorType, strict: boolean) {
  const shape: Record<string, z.ZodType> = {};
  for (const f of sectionFields(id, donorType)) shape[f.name] = fieldSchema(f, strict);
  return z.object(shape).strict();
}

export const PHOTO_LIMITS = {
  maxCount: 6,
  maxBytes: 5 * 1024 * 1024,
  mimeTypes: ["image/jpeg", "image/png"] as const,
};

export function completionPercent(completed: readonly string[]): number {
  const done = ALL_SECTION_IDS.filter((s) => completed.includes(s)).length;
  return Math.round((done / ALL_SECTION_IDS.length) * 100);
}

export const signatureSchema = z.object({
  signedName: z.string().trim().min(3, "Please type your full legal name").max(120),
  attest: z.literal(true, { error: "Please confirm the statement above" }),
});
