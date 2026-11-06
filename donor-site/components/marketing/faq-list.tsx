import type { FaqItem } from "@/content/faq";
import { ChevronDown } from "lucide-react";

/** Accessible accordion built on <details>, works without JS. */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-border border-border bg-card divide-y rounded-2xl border">
      {items.map((item) => (
        <details
          key={item.q}
          className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
            <span>{item.q}</span>
            <ChevronDown
              aria-hidden
              className="text-primary size-5 shrink-0 transition-transform group-open:rotate-180"
            />
          </summary>
          <p className="text-muted mt-3">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
