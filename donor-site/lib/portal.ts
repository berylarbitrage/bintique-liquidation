import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { FORM_SECTION_IDS } from "@/lib/full-app";

export interface OwnApplication {
  id: string;
  donor_type: "egg" | "sperm";
  first_name: string;
  last_name: string;
  status: string;
  eligible: boolean;
  created_at: string;
}

export interface FullAppRow {
  application_id: string;
  sections: Record<string, Record<string, unknown>>;
  completed_sections: string[];
  signed_name: string | null;
  signed_at: string | null;
  submitted_at: string | null;
}

/**
 * The signed-in applicant's most recent pre-qualified application.
 * Uses the user-scoped client, so RLS guarantees ownership.
 */
export async function getOwnApplication(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("applications")
    .select("id,donor_type,first_name,last_name,status,eligible,created_at")
    .eq("user_id", userId)
    .eq("eligible", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as OwnApplication | null) ?? null;
}

export async function getFullApp(supabase: SupabaseClient, applicationId: string) {
  const { data } = await supabase
    .from("full_applications")
    .select("*")
    .eq("application_id", applicationId)
    .maybeSingle();
  return (data as FullAppRow | null) ?? null;
}

export function photosComplete(kinds: string[]): boolean {
  return kinds.includes("childhood") && kinds.includes("recent");
}

export function formSectionsComplete(completed: string[]): boolean {
  return FORM_SECTION_IDS.every((s) => completed.includes(s));
}

export function withSection(completed: string[], id: string, done: boolean): string[] {
  const set = new Set(completed);
  if (done) set.add(id);
  else set.delete(id);
  return [...set];
}
