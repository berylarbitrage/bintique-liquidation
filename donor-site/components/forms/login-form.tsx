"use client";

import { useState } from "react";
import { MailCheck } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    setError(null);
    setState("sending");
    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, next }),
    });
    if (res.ok) setState("sent");
    else {
      setState("error");
      setError(
        res.status === 429 ? "Too many attempts. Please wait a minute." : "Something went wrong.",
      );
    }
  };

  if (state === "sent") {
    return (
      <div role="status" className="bg-primary-soft rounded-2xl p-6">
        <MailCheck className="text-primary size-8" aria-hidden />
        <p className="mt-3 font-semibold">Check your email</p>
        <p className="text-muted text-sm">
          If an account exists for {email}, we&apos;ve sent a secure sign-in link. It expires soon
          and can only be used once.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field id="login-email" label="Email" required error={error ?? undefined}>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
        />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Email Me a Sign-In Link"}
      </Button>
    </form>
  );
}
