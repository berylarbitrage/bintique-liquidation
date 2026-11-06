"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

/** Accessible Yes/No radio group rendered as pill buttons. */
export function YesNo({
  name,
  legend,
  hint,
  error,
  register,
}: {
  name: string;
  legend: string;
  hint?: string;
  error?: string;
  register: UseFormRegisterReturn;
}) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined} className="space-y-2">
      <legend className="text-sm font-medium">
        {legend}
        <span className="text-destructive"> *</span>
      </legend>
      {hint && <p className="text-xs text-muted">{hint}</p>}
      <div className="flex gap-3">
        {(["yes", "no"] as const).map((v) => (
          <label
            key={v}
            className={cn(
              "flex h-11 flex-1 cursor-pointer items-center justify-center rounded-full border-2 border-border bg-card text-sm font-medium capitalize",
              "has-[:checked]:border-primary has-[:checked]:bg-primary-soft has-[:checked]:text-primary",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring",
            )}
          >
            <input type="radio" value={v} className="sr-only" {...register} />
            {v}
          </label>
        ))}
      </div>
      {error && (
        <p id={`${name}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
}
