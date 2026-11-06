/** Typed access to environment variables. Never import secrets into client code. */
export function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

export function requireEnv(name: string): string {
  const v = env(name);
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

export const isSupabaseConfigured = () =>
  !!env("NEXT_PUBLIC_SUPABASE_URL") && !!env("NEXT_PUBLIC_SUPABASE_ANON_KEY");
