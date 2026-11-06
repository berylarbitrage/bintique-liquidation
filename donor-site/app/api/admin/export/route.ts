import { errorJson } from "@/lib/api";
import { getAdminOrNull } from "@/lib/auth";
import { applyFilters, parseFilters, type Filterable } from "@/lib/admin/filters";
import { EXPORT_HEADERS, EXPORT_SELECT, exportRow, type ExportRow } from "@/lib/admin/export";
import { audit } from "@/lib/admin/audit";
import { toCsv } from "@/lib/csv";
import { log } from "@/lib/log";

const MAX_ROWS = 10_000;

export async function GET(req: Request) {
  const admin = await getAdminOrNull();
  if (!admin) return errorJson("Not found", 404);

  const filters = parseFilters(Object.fromEntries(new URL(req.url).searchParams));
  const base = admin.supabase
    .from("applications")
    .select(EXPORT_SELECT)
    .order("created_at", { ascending: false })
    .limit(MAX_ROWS);
  type Loose = Filterable<Loose>;
  // Cast avoids deep generic instantiation in supabase-js types.
  const query = applyFilters(base as unknown as Loose, filters) as unknown as typeof base;
  const { data, error } = await query;
  if (error) {
    log.error("export failed", error);
    return errorJson("Export failed", 500);
  }
  const rows = (data ?? []) as unknown as ExportRow[];
  await audit(admin.user.id, "export_csv", null, { filters: { ...filters, q: filters.q ? "[search]" : undefined }, rows: rows.length });

  const csv = toCsv(EXPORT_HEADERS, rows.map((r) => exportRow(r)));
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="applications-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
