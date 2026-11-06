"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowLeft, Clock, Lock } from "lucide-react";
import {
  applicationSchema,
  BIRTH_CONTROL,
  HOW_HEARD,
  type eggApplicationSchema,
  type spermApplicationSchema,
} from "@/lib/schemas/apply";
import { EDUCATION_LEVELS, MIN_APPLICANT_AGE, type DonorType } from "@/config/eligibility";
import { US_STATES } from "@/config/us-states";
import { SITE } from "@/config/site";
import { ageOn } from "@/lib/dates";
import { readRefCookie } from "@/lib/referral";
import { trackLead } from "@/lib/analytics";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { YesNo } from "@/components/forms/yes-no";
import { Honeypot } from "@/components/forms/honeypot";
import { Turnstile } from "@/components/forms/turnstile";

type FormValues = z.input<typeof eggApplicationSchema> &
  Partial<z.input<typeof spermApplicationSchema>>;
type FieldName = keyof FormValues;

const STEP_TITLES = ["About you", "Health basics", "Contact details"] as const;

function stepFields(type: DonorType): FieldName[][] {
  return [
    ["dateOfBirth", "state", "zip", "education", "howHeard"],
    type === "egg"
      ? [
          "heightFt",
          "heightIn",
          "weightLb",
          "smoker",
          "regularCycles",
          "birthControl",
          "previousDonation",
        ]
      : [
          "heightFt",
          "heightIn",
          "weightLb",
          "smoker",
          "previousDonation",
          "within60Min",
          "canCommit6Months",
        ],
    ["firstName", "lastName", "email", "phone", "smsConsent", "privacyConsent"],
  ];
}

const toNumber = (v: unknown) =>
  v === "" || v === null || v === undefined ? undefined : Number(v);

export function PrescreenForm({
  type,
  turnstileSiteKey,
}: {
  type: DonorType;
  turnstileSiteKey?: string;
}) {
  const router = useRouter();
  const storageKey = `prescreen:${type}`;
  const [step, setStep] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const restored = useRef(false);
  const stopPersisting = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(applicationSchema(type)) as unknown as Resolver<FormValues>,
    mode: "onTouched",
    defaultValues: {
      smsConsent: false,
      privacyConsent: false as unknown as true,
      ref: "",
      howHeard: "",
    },
  });
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  // Restore draft from sessionStorage (survives refresh, cleared on submit/close).
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const { step: s, values } = JSON.parse(saved) as { step: number; values: FormValues };
        reset({ ...values, privacyConsent: false as unknown as true });
        setStep(Math.min(Math.max(0, s), 2));
      }
    } catch {
      /* ignore corrupt drafts */
    }
    const ref = readRefCookie();
    if (ref) form.setValue("ref", ref);
    restored.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on every change.
  useEffect(() => {
    const sub = watch((values) => {
      if (!restored.current || stopPersisting.current) return;
      try {
        sessionStorage.setItem(storageKey, JSON.stringify({ step, values }));
      } catch {
        /* storage may be unavailable */
      }
    });
    return () => sub.unsubscribe();
  }, [watch, step, storageKey]);

  const goTo = (s: number) => {
    setStep(s);
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ step: s, values: getValues() }));
    } catch {}
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const next = async () => {
    const ok = await trigger(stepFields(type)[step], { shouldFocus: true });
    if (!ok) return;
    if (step === 0) {
      const age = ageOn(getValues("dateOfBirth"), new Date());
      if (age < MIN_APPLICANT_AGE) {
        // Under 18: stop here and keep nothing.
        stopPersisting.current = true;
        try {
          sessionStorage.removeItem(storageKey);
        } catch {}
        reset({});
        setBlocked(true);
        return;
      }
    }
    goTo(step + 1);
  };

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donorType: type,
        data: values,
        turnstileToken: token,
        website: honeypot,
      }),
    });
    const body = (await res.json().catch(() => ({}))) as {
      eligible?: boolean;
      error?: string;
      code?: string;
    };
    if (!res.ok) {
      if (body.code === "underage") {
        stopPersisting.current = true;
        try {
          sessionStorage.removeItem(storageKey);
        } catch {}
        setBlocked(true);
        return;
      }
      setServerError(body.error ?? "Something went wrong. Please try again.");
      return;
    }
    stopPersisting.current = true;
    try {
      sessionStorage.removeItem(storageKey);
    } catch {}
    trackLead(type);
    router.push(`/apply/result?status=${body.eligible ? "eligible" : "ineligible"}&type=${type}`);
  };

  if (blocked) {
    return (
      <div role="status" className="bg-card rounded-2xl p-8 text-center shadow-sm">
        <h2 className="text-2xl font-semibold">Thank you for your interest</h2>
        <p className="text-muted mt-3">
          You must be at least {MIN_APPLICANT_AGE} years old to apply to become a donor. We
          haven&apos;t saved any of your information. We&apos;d love to hear from you once you meet
          the age requirement.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  const pct = Math.round(((step + 1) / 3) * 100);
  const e = errors as Partial<Record<FieldName, { message?: string }>>;
  const err = (n: FieldName) => e[n]?.message;
  const inv = (n: FieldName) => ({
    "aria-invalid": !!e[n],
    "aria-describedby": e[n] ? `${n}-error` : undefined,
  });

  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm sm:p-8">
      <div className="mb-6">
        <div className="mb-2 flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium">
            Step {step + 1} of 3 · {STEP_TITLES[step]}
          </span>
          <span className="text-muted flex items-center gap-1">
            <Clock className="size-4" aria-hidden /> Takes about 3 minutes
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Application progress"
          className="bg-muted-bg h-2 overflow-hidden rounded-full"
        >
          <div
            className="bg-primary h-full rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-5">
        <Honeypot name="website" value={honeypot} onChange={(ev) => setHoneypot(ev.target.value)} />
        <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold outline-none">
          {STEP_TITLES[step]}
        </h2>

        {step === 0 && (
          <>
            <Field id="dateOfBirth" label="Date of birth" required error={err("dateOfBirth")}>
              <Input
                id="dateOfBirth"
                type="date"
                autoComplete="bday"
                {...inv("dateOfBirth")}
                {...register("dateOfBirth")}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="state" label="State" required error={err("state")}>
                <NativeSelect
                  id="state"
                  defaultValue=""
                  autoComplete="address-level1"
                  {...inv("state")}
                  {...register("state")}
                >
                  <option value="" disabled>
                    Select your state
                  </option>
                  {US_STATES.map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <Field id="zip" label="ZIP code" required error={err("zip")}>
                <Input
                  id="zip"
                  inputMode="numeric"
                  maxLength={5}
                  autoComplete="postal-code"
                  {...inv("zip")}
                  {...register("zip")}
                />
              </Field>
            </div>
            <Field id="education" label="Highest education" required error={err("education")}>
              <NativeSelect
                id="education"
                defaultValue=""
                {...inv("education")}
                {...register("education")}
              >
                <option value="" disabled>
                  Select one
                </option>
                {EDUCATION_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field id="howHeard" label="How did you hear about us?" error={err("howHeard")}>
              <NativeSelect id="howHeard" {...register("howHeard")}>
                <option value="">Prefer not to say</option>
                {HOW_HEARD.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </NativeSelect>
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">
                Height<span className="text-destructive"> *</span>
              </legend>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  id="heightFt"
                  label={<span className="sr-only">Feet</span>}
                  error={err("heightFt")}
                >
                  <NativeSelect
                    id="heightFt"
                    defaultValue=""
                    {...inv("heightFt")}
                    {...register("heightFt", { setValueAs: toNumber })}
                  >
                    <option value="" disabled>
                      Feet
                    </option>
                    {[4, 5, 6, 7].map((n) => (
                      <option key={n} value={n}>
                        {n} ft
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
                <Field
                  id="heightIn"
                  label={<span className="sr-only">Inches</span>}
                  error={err("heightIn")}
                >
                  <NativeSelect
                    id="heightIn"
                    defaultValue=""
                    {...inv("heightIn")}
                    {...register("heightIn", { setValueAs: toNumber })}
                  >
                    <option value="" disabled>
                      Inches
                    </option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {i} in
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
              </div>
            </fieldset>
            <Field id="weightLb" label="Weight (lbs)" required error={err("weightLb")}>
              <Input
                id="weightLb"
                type="number"
                inputMode="numeric"
                min={70}
                max={500}
                {...inv("weightLb")}
                {...register("weightLb", { setValueAs: toNumber })}
              />
            </Field>
            <YesNo
              name="smoker"
              legend="Do you smoke, vape, or use any nicotine products?"
              error={err("smoker")}
              register={register("smoker")}
            />
            {type === "egg" && (
              <>
                <YesNo
                  name="regularCycles"
                  legend="Are your menstrual cycles regular (roughly every 21–35 days)?"
                  error={err("regularCycles")}
                  register={register("regularCycles")}
                />
                <Field
                  id="birthControl"
                  label="Current birth control"
                  required
                  error={err("birthControl")}
                >
                  <NativeSelect
                    id="birthControl"
                    defaultValue=""
                    {...inv("birthControl")}
                    {...register("birthControl")}
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    {BIRTH_CONTROL.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
              </>
            )}
            <YesNo
              name="previousDonation"
              legend={`Have you donated ${type === "egg" ? "eggs" : "sperm"} before?`}
              error={err("previousDonation")}
              register={register("previousDonation")}
            />
            {type === "sperm" && (
              <>
                <YesNo
                  name="within60Min"
                  legend={`Do you live within 60 minutes of a partner location in ${SITE.serviceStates.join(", ")}?`}
                  error={err("within60Min")}
                  register={register("within60Min")}
                />
                <YesNo
                  name="canCommit6Months"
                  legend="Can you commit to donating weekly for at least 6 months?"
                  error={err("canCommit6Months")}
                  register={register("canCommit6Months")}
                />
              </>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="firstName" label="First name" required error={err("firstName")}>
                <Input
                  id="firstName"
                  autoComplete="given-name"
                  {...inv("firstName")}
                  {...register("firstName")}
                />
              </Field>
              <Field id="lastName" label="Last name" required error={err("lastName")}>
                <Input
                  id="lastName"
                  autoComplete="family-name"
                  {...inv("lastName")}
                  {...register("lastName")}
                />
              </Field>
            </div>
            <Field id="email" label="Email" required error={err("email")}>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...inv("email")}
                {...register("email")}
              />
            </Field>
            <Field id="phone" label="Mobile phone" required error={err("phone")}>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel-national"
                placeholder="(555) 555-5555"
                {...inv("phone")}
                {...register("phone")}
              />
            </Field>
            <input type="hidden" {...register("ref")} />
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 size-4 shrink-0 accent-[var(--primary)]"
                {...register("smsConsent")}
              />
              <span className="text-muted">
                By checking this box, I agree to receive recurring automated text messages from{" "}
                {SITE.brand} about my application at the number provided. Consent is not a condition
                of applying. Msg &amp; data rates may apply. Msg frequency varies. Reply STOP to opt
                out, HELP for help.
              </span>
            </label>
            <div>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  className="mt-1 size-4 shrink-0 accent-[var(--primary)]"
                  aria-invalid={!!e.privacyConsent}
                  {...register("privacyConsent")}
                />
                <span>
                  I agree to the{" "}
                  <Link href="/privacy" target="_blank" className="underline">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms" target="_blank" className="underline">
                    Terms of Use
                  </Link>
                  , and confirm the information I provided is accurate.
                  <span className="text-destructive"> *</span>
                </span>
              </label>
              {err("privacyConsent") && (
                <p role="alert" className="text-destructive mt-1 text-sm">
                  {err("privacyConsent")}
                </p>
              )}
            </div>
            <Turnstile siteKey={turnstileSiteKey} onToken={setToken} />
            <p className="text-muted flex items-center gap-2 text-xs">
              <Lock className="size-3.5" aria-hidden /> Your information is encrypted and never
              sold.
            </p>
          </>
        )}

        {serverError && (
          <p role="alert" className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
            {serverError}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={() => goTo(step - 1)}>
              <ArrowLeft /> Back
            </Button>
          ) : (
            <span />
          )}
          {step < 2 ? (
            <Button type="button" size="lg" onClick={next}>
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || (!!turnstileSiteKey && !token)}
            >
              {isSubmitting ? "Submitting…" : "Submit Application"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
