import type { FaqItem } from "@/content/faq";
import { ChevronDown } from "lucide-react";

/** Accessible accordion built on <details>, works without JS. */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-card">
      {items.map((item) => (
        <details key={item.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
            <span>{item.q}</span>
            <ChevronDown
              aria-hidden
              className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180"
            />
          </summary>
          <p className="mt-3 text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
