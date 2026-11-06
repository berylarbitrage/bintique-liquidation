import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  className,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("mx-auto max-w-6xl px-4 py-14 md:py-20", className)}>
      {(eyebrow || title || intro) && (
        <div className="mb-10 max-w-2xl">
          {eyebrow && (
            <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
              {eyebrow}
            </p>
          )}
          {title && <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>}
          {intro && <div className="text-muted mt-4 text-lg">{intro}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
