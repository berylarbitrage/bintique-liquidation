export function Timeline({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="relative space-y-8 border-l-2 border-primary-soft pl-8">
      {steps.map((s, i) => (
        <li key={s.title} className="relative">
          <span className="absolute top-0 -left-[2.65rem] flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {i + 1}
          </span>
          <h3 className="font-sans text-lg font-semibold">{s.title}</h3>
          <p className="mt-1 text-muted">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
