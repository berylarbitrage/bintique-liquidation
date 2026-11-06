/** Hidden field bots tend to fill in. Real users never see it. */
export function Honeypot(props: React.ComponentProps<"input">) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  );
}
