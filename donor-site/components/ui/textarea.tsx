import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "border-border bg-card text-foreground placeholder:text-muted focus-visible:outline-ring aria-invalid:border-destructive flex min-h-24 w-full rounded-lg border px-3 py-2 text-base focus-visible:outline-2",
        className,
      )}
      {...props}
    />
  );
}
