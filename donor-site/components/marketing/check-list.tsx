import { Check } from "lucide-react";

export function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="bg-card flex items-start gap-3 rounded-xl p-4 shadow-sm">
          <span className="bg-primary-soft text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
            <Check className="size-4" aria-hidden />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
