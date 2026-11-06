import { z } from "zod";

export const CONTACT_TOPICS = [
  "Egg donation",
  "Sperm donation",
  "Referral program",
  "My application",
  "Other",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(254),
  topic: z.enum(CONTACT_TOPICS, { error: "Please choose a topic" }),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least a few words")
    .max(3000, "Please keep your message under 3000 characters"),
  website: z.string().max(0).optional(), // honeypot
});
export type ContactInput = z.infer<typeof contactSchema>;
