import Link from "next/link";
import { Download } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { applyFilters, filtersToQuery, parseFilters, type Filterable } from "@/lib/admin/filters";
import { PAGE_SIZE, STATUSES, STATUS_LABELS, type Status } from "@/lib/admin/constants";
import { ageOn } from "@/lib/dates";
import { US_STATES } from "@/config/us-states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Row {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  donor_type: "egg" | "sperm";
  state: string;
  date_of_birth: string;
  bmi: number | null;
  eligible: boolean;
  status: Status;
  referral_code: string | null;
}

interface Stats {
  total: number;
  this_week: number;
  eligible: number;
  by_source: { source: string; count: number }[];
}

function startOfWeekUtc(now = new Date()): Date {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = (d.getUTCDay() + 6) % 7; // Monday = 0
  d.setUTCDate(d.getUTCDate() - day);
  return d;
}

export default async function AdminListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { supabase } = await requireAdmin();
  const filters = parseFilters(await searchParams);
  const page = filters.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;

  const base = supabase
    .from("applications")
    .select("id,created_at,first_name,last_name,donor_type,state,date_of_birth,bmi,eligible,status,referral_code", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);
  type Loose = Filterable<Loose>;
  // Cast avoids deep generic instantiation in supabase-js types.
  const listQuery = applyFilters(base as unknown as Loose, filters) as unknown as typeof base;

  const [{ data, count, error }, statsRes] = await Promise.all([
    listQuery,
    supabase.rpc("admin_stats", { p_week_start: startOfWeekUtc().toISOString() }),
  ]);
  const rows = (data ?? []) as Row[];
  const stats = statsRes.data as Stats | null;

  const codes = [...new Set(rows.map((r) => r.referral_code).filter(Boolean))] as string[];
  const referrers = new Map<string, string>();
  if (codes.length) {
    const { data: refs } = await supabase.from("referrers").select("code,name").in("code", codes);
    refs?.forEach((r) => referrers.set(r.code, r.name));
  }

  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const now = new Date();
  const rate = stats && stats.total > 0 ? Math.round((stats.eligible / stats.total) * 100) : 0;
  const sourceTotal = stats?.by_source.reduce((s, x) => s + x.count, 0) ?? 0;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Applications</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">New this week</p>
          <p className="mt-1 text-3xl font-semibold">{stats?.this_week ?? "–"}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Pre-qualification rate (all time)</p>
          <p className="mt-1 text-3xl font-semibold">{stats ? `${rate}%` : "–"}</p>
          <p className="text-xs text-muted">
            {stats?.eligible ?? 0} of {stats?.total ?? 0} applicants
          </p>
        </Card>
        <Card>
          <p className="mb-2 text-sm text-muted">Sources (how they heard)</p>
          <ul className="space-y-1.5">
            {stats?.by_source.map((s) => {
              const pct = sourceTotal ? Math.round((s.count / sourceTotal) * 100) : 0;
              return (
                <li key={s.source} className="text-sm">
                  <div className="flex justify-between">
                    <span>{s.source}</span>
                    <span className="text-muted">
                      {s.count} · {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted-bg">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <form className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-6" method="get">
        <Input name="q" defaultValue={filters.q} placeholder="Search name or email" aria-label="Search" className="lg:col-span-2" />
        <NativeSelect name="type" defaultValue={filters.type ?? ""} aria-label="Donor type">
          <option value="">All types</option>
          <option value="egg">Egg</option>
          <option value="sperm">Sperm</option>
        </NativeSelect>
        <NativeSelect name="status" defaultValue={filters.status ?? ""} aria-label="Status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </NativeSelect>
        <NativeSelect name="eligible" defaultValue={filters.eligible ?? ""} aria-label="Pre-qualified">
          <option value="">Pre-qualified: any</option>
          <option value="yes">Pre-qualified</option>
          <option value="no">Not pre-qualified</option>
        </NativeSelect>
        <NativeSelect name="state" defaultValue={filters.state ?? ""} aria-label="State">
          <option value="">All states</option>
          {US_STATES.map(([c, n]) => (
            <option key={c} value={c}>{n}</option>
          ))}
        </NativeSelect>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-6">
          <Button type="submit" variant="primary" size="sm">Apply filters</Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin">Reset</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="ml-auto">
            <a href={`/api/admin/export${filtersToQuery({ ...filters, page: undefined })}`}>
              <Download /> Export CSV
            </a>
          </Button>
        </div>
      </form>

      {error && <p role="alert" className="text-destructive">Could not load applications.</p>}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border bg-muted-bg text-xs uppercase text-muted">
            <tr>
              {["Submitted", "Name", "Type", "State", "Age", "BMI", "Pre-qualified", "Status", "Referrer"].map((h) => (
                <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-muted-bg/50">
                <td className="px-4 py-3 whitespace-nowrap">{new Date(r.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/applications/${r.id}`} className="font-medium text-primary underline">
                    {r.first_name} {r.last_name}
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize">{r.donor_type}</td>
                <td className="px-4 py-3">{r.state}</td>
                <td className="px-4 py-3">{ageOn(r.date_of_birth, now)}</td>
                <td className="px-4 py-3">{r.bmi ?? "–"}</td>
                <td className="px-4 py-3">
                  {r.eligible ? <Badge tone="success">Yes</Badge> : <Badge tone="danger">No</Badge>}
                </td>
                <td className="px-4 py-3"><Badge>{STATUS_LABELS[r.status] ?? r.status}</Badge></td>
                <td className="px-4 py-3">{r.referral_code ? referrers.get(r.referral_code) ?? r.referral_code : "–"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-muted">No applications match these filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <nav aria-label="Pagination" className="flex items-center justify-between text-sm">
        <span className="text-muted">
          {total} result{total === 1 ? "" : "s"} · page {page} of {pages}
        </span>
        <div className="flex gap-2">
          {page > 1 && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin${filtersToQuery(filters, { page: page - 1 })}`}>Previous</Link>
            </Button>
          )}
          {page < pages && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin${filtersToQuery(filters, { page: page + 1 })}`}>Next</Link>
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
}
