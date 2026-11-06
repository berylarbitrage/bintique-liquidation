export function Timeline({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="border-primary-soft relative space-y-8 border-l-2 pl-8">
      {steps.map((s, i) => (
        <li key={s.title} className="relative">
          <span className="bg-primary text-primary-foreground absolute top-0 -left-[2.65rem] flex size-8 items-center justify-center rounded-full text-sm font-semibold">
            {i + 1}
          </span>
          <h3 className="font-sans text-lg font-semibold">{s.title}</h3>
          <p className="text-muted mt-1">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
