"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { contactSchema, CONTACT_TOPICS, type ContactInput } from "@/lib/schemas/contact";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Honeypot } from "@/components/forms/honeypot";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    setServerError(null);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) setStatus("sent");
    else {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setServerError(j.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="bg-primary-soft rounded-2xl p-6">
        <CheckCircle2 className="text-primary size-8" aria-hidden />
        <p className="mt-3 text-lg font-semibold">Thanks — we got your message.</p>
        <p className="text-muted">We usually reply within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-5">
      <Honeypot {...register("website")} />
      <Field id="name" label="Your name" required error={errors.name?.message}>
        <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
      </Field>
      <Field id="email" label="Email" required error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </Field>
      <Field id="topic" label="Topic" required error={errors.topic?.message}>
        <NativeSelect
          id="topic"
          defaultValue=""
          aria-invalid={!!errors.topic}
          {...register("topic")}
        >
          <option value="" disabled>
            Choose a topic
          </option>
          {CONTACT_TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </NativeSelect>
      </Field>
      <Field
        id="message"
        label="Message"
        required
        error={errors.message?.message}
        hint="Please don't include medical details here."
      >
        <Textarea id="message" rows={6} aria-invalid={!!errors.message} {...register("message")} />
      </Field>
      {serverError && (
        <p role="alert" className="text-destructive text-sm">
          {serverError}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting} size="lg">
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
