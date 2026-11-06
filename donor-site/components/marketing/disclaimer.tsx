import { DISCLAIMER } from "@/config/site";

export function Disclaimer() {
  return (
    <aside className="mx-auto max-w-6xl px-4">
      <p className="border-border bg-muted-bg text-muted rounded-xl border p-4 text-sm">
        <strong className="text-foreground">Please note:</strong> {DISCLAIMER}
      </p>
    </aside>
  );
}
