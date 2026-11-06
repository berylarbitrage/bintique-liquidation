/**
 * Tiny in-memory stand-in for the subset of the supabase-js query builder
 * used by API routes. Good enough for route-level unit tests.
 */
type Row = Record<string, unknown>;

export class FakeDb {
  tables: Record<string, Row[]> = {};
  rpcResults: Record<string, unknown> = {};

  from(table: string) {
    this.tables[table] ??= [];
    return new Query(this, table);
  }
  async rpc(name: string) {
    return { data: this.rpcResults[name] ?? null, error: null };
  }
}

class Query implements PromiseLike<{ data: unknown; error: null; count?: number }> {
  private filters: ((r: Row) => boolean)[] = [];
  private op: "select" | "insert" | "update" | "upsert" | "delete" = "select";
  private payload: Row | Row[] | null = null;
  private isSingle = false;
  private maybe = false;
  private head = false;

  constructor(
    private db: FakeDb,
    private table: string,
  ) {}

  select(_cols?: string, opts?: { count?: string; head?: boolean }) {
    if (this.op === "select") this.head = !!opts?.head;
    return this;
  }
  insert(p: Row | Row[]) {
    this.op = "insert";
    this.payload = p;
    return this;
  }
  update(p: Row) {
    this.op = "update";
    this.payload = p;
    return this;
  }
  upsert(p: Row | Row[]) {
    this.op = "upsert";
    this.payload = p;
    return this;
  }
  delete() {
    this.op = "delete";
    return this;
  }
  eq(col: string, v: unknown) {
    this.filters.push((r) => r[col] === v);
    return this;
  }
  gte(col: string, v: string) {
    this.filters.push((r) => String(r[col]) >= v);
    return this;
  }
  single() {
    this.isSingle = true;
    return this;
  }
  in(col: string, vals: unknown[]) {
    this.filters.push((r) => vals.includes(r[col]));
    return this;
  }
  or(_f: string) {
    return this;
  }
  order(_c: string, _o?: unknown) {
    return this;
  }
  range(_a: number, _b: number) {
    return this;
  }
  limit(_n: number) {
    return this;
  }
  maybeSingle() {
    this.maybe = true;
    return this;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  then(resolve: (v: any) => any) {
    return Promise.resolve(this.run()).then(resolve);
  }
  private run() {
    const rows = this.db.tables[this.table]!;
    const match = (r: Row) => this.filters.every((f) => f(r));
    if (this.op === "upsert") {
      const items = Array.isArray(this.payload) ? this.payload : [this.payload!];
      for (const p of items) {
        const key = "application_id" in p ? "application_id" : "id";
        const existing = rows.find((r) => r[key] === p[key]);
        if (existing) Object.assign(existing, p);
        else rows.push({ sections: {}, completed_sections: [], ...p });
      }
      return { data: null, error: null };
    }
    if (this.op === "insert") {
      const items = (Array.isArray(this.payload) ? this.payload : [this.payload!]).map((p) => ({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        ...p,
      }));
      rows.push(...items);
      return { data: this.isSingle ? items[0] : items, error: null };
    }
    if (this.op === "update") {
      rows.filter(match).forEach((r) => Object.assign(r, this.payload));
      return { data: null, error: null };
    }
    if (this.op === "delete") {
      this.db.tables[this.table] = rows.filter((r) => !match(r));
      return { data: null, error: null };
    }
    const found = rows.filter(match).map((r) => structuredClone(r));
    if (this.head) return { data: null, error: null, count: found.length };
    if (this.isSingle || this.maybe) return { data: found[0] ?? null, error: null };
    return { data: found, error: null };
  }
}
