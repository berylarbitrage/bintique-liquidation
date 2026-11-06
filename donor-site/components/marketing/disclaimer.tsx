import { DISCLAIMER } from "@/config/site";

export function Disclaimer() {
  return (
    <aside className="mx-auto max-w-6xl px-4">
      <p className="rounded-xl border border-border bg-muted-bg p-4 text-sm text-muted">
        <strong className="text-foreground">Please note:</strong> {DISCLAIMER}
      </p>
    </aside>
  );
}
