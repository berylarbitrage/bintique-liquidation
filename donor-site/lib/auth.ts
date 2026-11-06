import "server-only";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export async function getSessionUser() {
  if (!isSupabaseConfigured()) return { supabase: null, user: null } as const;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user } as const;
}

/** For applicant pages: redirect to login when signed out. */
export async function requireUser(next: string) {
  const { supabase, user } = await getSessionUser();
  if (!supabase || !user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return { supabase, user };
}

export async function isAdminUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<boolean> {
  const { data } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  return data?.role === "admin";
}

/** For admin pages: anyone who isn't an admin gets a 404 (the area "doesn't exist"). */
export async function requireAdmin() {
  const { supabase, user } = await getSessionUser();
  if (!supabase || !user || !(await isAdminUser(supabase, user.id))) notFound();
  return { supabase, user };
}

/** For admin API routes: returns null when the caller isn't an admin. */
export async function getAdminOrNull() {
  const { supabase, user } = await getSessionUser();
  if (!supabase || !user || !(await isAdminUser(supabase, user.id))) return null;
  return { supabase, user };
}
