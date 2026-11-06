export function formatValue(v: unknown): string {
  if (v === null || v === undefined || v === "") return "–";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "–";
  return String(v);
}

export function DefList({ items }: { items: [string, unknown][] }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k}>
          <dt className="text-muted text-xs font-semibold tracking-wide uppercase">{k}</dt>
          <dd className="mt-0.5 whitespace-pre-wrap">{formatValue(v)}</dd>
        </div>
      ))}
    </dl>
  );
}
