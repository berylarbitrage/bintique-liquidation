"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy } from "lucide-react";
import { referSchema, type ReferInput } from "@/lib/schemas/refer";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Honeypot } from "@/components/forms/honeypot";

function CopyRow({ label, url }: { label: string; url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex gap-2">
        <Input readOnly value={url} aria-label={label} onFocus={(e) => e.currentTarget.select()} />
        <Button
          type="button"
          variant="primary"
          size="icon"
          className="shrink-0"
          aria-label={`Copy ${label}`}
          onClick={async () => {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          {copied ? <Check /> : <Copy />}
        </Button>
      </div>
    </div>
  );
}

export function ReferForm() {
  const [links, setLinks] = useState<{ egg: string; sperm: string } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReferInput>({ resolver: zodResolver(referSchema) });

  const onSubmit = async (data: ReferInput) => {
    setServerError(null);
    const res = await fetch("/api/refer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const j = (await res.json().catch(() => ({}))) as {
      links?: { egg: string; sperm: string };
      error?: string;
    };
    if (res.ok && j.links) setLinks(j.links);
    else setServerError(j.error ?? "Something went wrong. Please try again.");
  };

  if (links) {
    return (
      <div className="bg-card space-y-5 rounded-2xl p-6 shadow-sm" role="status">
        <p className="text-lg font-semibold">Your referral links are ready!</p>
        <p className="text-muted text-sm">
          Share the link that fits your friend. We&apos;ll remember the referral for 30 days after
          they click it.
        </p>
        <CopyRow label="Egg donor link" url={links.egg} />
        <CopyRow label="Sperm donor link" url={links.sperm} />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="bg-card relative space-y-5 rounded-2xl p-6 shadow-sm"
    >
      <Honeypot {...register("website")} />
      <Field id="name" label="Your name" required error={errors.name?.message}>
        <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
      </Field>
      <Field
        id="email"
        label="Your email"
        required
        error={errors.email?.message}
        hint="We'll use this to contact you about your bonus."
      >
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </Field>
      {serverError && (
        <p role="alert" className="text-destructive text-sm">
          {serverError}
        </p>
      )}
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Creating…" : "Get My Referral Link"}
      </Button>
    </form>
  );
}
