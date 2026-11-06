import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-11 w-full min-w-0 rounded-lg border border-border bg-card px-3 text-base text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-ring aria-invalid:border-destructive disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
