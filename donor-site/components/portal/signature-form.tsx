"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { signatureSchema } from "@/lib/full-app";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Values = z.input<typeof signatureSchema>;

export function SignatureForm({
  submitted,
  missing,
  onSubmitted,
}: {
  submitted: boolean;
  missing: string[];
  onSubmitted: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(signatureSchema) });

  if (submitted) {
    return (
      <div role="status" className="bg-primary-soft rounded-xl p-6">
        <CheckCircle2 className="text-primary size-8" aria-hidden />
        <p className="mt-2 font-semibold">Your application has been submitted.</p>
        <p className="text-muted text-sm">
          Your coordinator will review it and reach out with next steps.
        </p>
      </div>
    );
  }

  if (missing.length) {
    return (
      <div className="bg-accent-soft rounded-xl p-5 text-sm">
        <p className="font-semibold">Almost there! Please complete these sections first:</p>
        <ul className="mt-2 list-disc pl-5">
          {missing.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
    );
  }

  const onSubmit = async (v: Values) => {
    setServerError(null);
    const res = await fetch("/api/portal/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });
    if (res.ok) onSubmitted();
    else {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setServerError(j.error ?? "Could not submit");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="border-border bg-muted-bg rounded-xl border p-4 text-sm">
        I certify that the information in this application is true and complete to the best of my
        knowledge. I understand that providing false information may disqualify me, that
        pre-screening does not guarantee acceptance, and that final eligibility is determined by
        partner medical providers. I consent to my application being shared with partner clinics and
        sperm banks for screening purposes.
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-1 size-4 accent-[var(--primary)]"
          aria-invalid={!!errors.attest}
          {...register("attest")}
        />
        <span>
          I have read and agree to the statement above.<span className="text-destructive"> *</span>
        </span>
      </label>
      {errors.attest && (
        <p role="alert" className="text-destructive text-sm">
          {errors.attest.message}
        </p>
      )}
      <Field
        id="signedName"
        label="Type your full legal name as your electronic signature"
        required
        error={errors.signedName?.message}
      >
        <Input
          id="signedName"
          autoComplete="name"
          className="font-serif text-lg italic"
          aria-invalid={!!errors.signedName}
          {...register("signedName")}
        />
      </Field>
      {serverError && (
        <p role="alert" className="text-destructive text-sm">
          {serverError}
        </p>
      )}
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Sign & Submit Application"}
      </Button>
    </form>
  );
}
