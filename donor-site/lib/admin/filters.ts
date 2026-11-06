import { z } from "zod";
import { STATUSES } from "@/lib/admin/constants";
import { US_STATE_CODES } from "@/config/us-states";

export const filtersSchema = z.object({
  type: z.enum(["egg", "sperm"]).optional().catch(undefined),
  status: z.enum(STATUSES).optional().catch(undefined),
  eligible: z.enum(["yes", "no"]).optional().catch(undefined),
  state: z.enum(US_STATE_CODES).optional().catch(undefined),
  q: z.string().trim().max(100).optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(10_000).optional().catch(undefined),
});
export type Filters = z.infer<typeof filtersSchema>;

export function parseFilters(sp: Record<string, string | string[] | undefined>): Filters {
  const flat = Object.fromEntries(
    Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v || undefined]),
  );
  return filtersSchema.parse(flat);
}

/** Strip characters that have meaning in PostgREST filter syntax or LIKE patterns. */
export function sanitizeSearch(q: string): string {
  return q
    .replace(/[%_,.()*\\:"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Minimal interface of the supabase query builder we use, for reuse across list + export. */
export interface Filterable<T> {
  eq(col: string, v: unknown): T;
  or(filter: string): T;
}

export function applyFilters<T extends Filterable<T>>(query: T, f: Filters): T {
  let q = query;
  if (f.type) q = q.eq("donor_type", f.type);
  if (f.status) q = q.eq("status", f.status);
  if (f.eligible) q = q.eq("eligible", f.eligible === "yes");
  if (f.state) q = q.eq("state", f.state);
  if (f.q) {
    const term = sanitizeSearch(f.q);
    if (term) {
      const like = `%${term}%`;
      q = q.or(`first_name.ilike.${like},last_name.ilike.${like},email.ilike.${like}`);
    }
  }
  return q;
}

export function filtersToQuery(f: Filters, overrides: Partial<Filters> = {}): string {
  const merged = { ...f, ...overrides };
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) if (v !== undefined && v !== "") p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : "";
}
