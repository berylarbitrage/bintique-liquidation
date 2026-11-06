"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sectionFields, sectionSchema, type FieldDef, type FormSectionId } from "@/lib/full-app";
import type { DonorType } from "@/config/eligibility";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Values = Record<string, unknown>;
const toNumber = (v: unknown) =>
  v === "" || v === null || v === undefined ? undefined : Number(v);

/** Drop empty values so a draft passes the lenient schema. */
function clean(values: Values, fields: FieldDef[]): Values {
  const out: Values = {};
  for (const f of fields) {
    let v = values[f.name];
    if (f.kind === "multi") v = Array.isArray(v) ? v : v ? [v] : [];
    if (v === "" || v === undefined || v === null || (typeof v === "number" && Number.isNaN(v)))
      continue;
    out[f.name] = v;
  }
  return out;
}

export function SectionForm({
  section,
  donorType,
  initial,
  readOnly,
  onSaved,
}: {
  section: FormSectionId;
  donorType: DonorType;
  initial: Values;
  readOnly: boolean;
  onSaved: (completed: string[], data: Values, advance: boolean) => void;
}) {
  const fields = sectionFields(section, donorType);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState<"draft" | "complete" | null>(null);
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(sectionSchema(section, donorType, true)) as unknown as Resolver<Values>,
    defaultValues: initial,
  });

  const save = async (values: Values, complete: boolean) => {
    setSaving(complete ? "complete" : "draft");
    setStatus(null);
    const data = clean(values, fields);
    const res = await fetch("/api/portal/section", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, data, complete }),
    });
    setSaving(null);
    const j = (await res.json().catch(() => ({}))) as {
      completed?: string[];
      error?: string;
      issues?: { path: string; message: string }[];
    };
    if (!res.ok) {
      j.issues?.forEach((i) => setError(i.path, { message: i.message }));
      setStatus(j.error ?? "Could not save");
      return;
    }
    setStatus(complete ? "Section saved" : "Draft saved");
    onSaved(j.completed ?? [], data, complete);
  };

  const e = errors as Record<string, { message?: string } | undefined>;

  return (
    <form onSubmit={handleSubmit((v) => save(v, true))} noValidate className="space-y-5">
      <fieldset disabled={readOnly} className="space-y-5">
        {fields.map((f) => {
          const err = e[f.name]?.message;
          const inv = {
            "aria-invalid": !!err,
            "aria-describedby": err ? `${f.name}-error` : undefined,
          };
          if (f.kind === "yesno" || f.kind === "multi") {
            const opts = f.kind === "yesno" ? ["Yes", "No"] : f.options!;
            return (
              <fieldset
                key={f.name}
                className="space-y-2"
                aria-describedby={err ? `${f.name}-error` : undefined}
              >
                <legend className="text-sm font-medium">
                  {f.label}
                  {f.required && <span className="text-destructive"> *</span>}
                </legend>
                <div
                  className={cn(
                    "grid gap-2",
                    f.kind === "multi" ? "sm:grid-cols-2" : "grid-cols-2",
                  )}
                >
                  {opts.map((o) => (
                    <label
                      key={o}
                      className="border-border bg-card has-[:checked]:border-primary has-[:checked]:bg-primary-soft flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm"
                    >
                      <input
                        type={f.kind === "yesno" ? "radio" : "checkbox"}
                        value={o}
                        className="accent-[var(--primary)]"
                        {...register(f.name)}
                      />
                      {o}
                    </label>
                  ))}
                </div>
                {err && (
                  <p id={`${f.name}-error`} role="alert" className="text-destructive text-sm">
                    {err}
                  </p>
                )}
              </fieldset>
            );
          }
          return (
            <Field
              key={f.name}
              id={f.name}
              label={f.label}
              required={f.required}
              error={err}
              hint={f.hint}
            >
              {f.kind === "textarea" ? (
                <Textarea id={f.name} rows={4} maxLength={f.max} {...inv} {...register(f.name)} />
              ) : f.kind === "select" ? (
                <NativeSelect id={f.name} defaultValue="" {...inv} {...register(f.name)}>
                  <option value="" disabled>
                    Select one
                  </option>
                  {f.options!.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </NativeSelect>
              ) : f.kind === "number" ? (
                <Input
                  id={f.name}
                  type="number"
                  inputMode="numeric"
                  min={f.min}
                  max={f.max}
                  {...inv}
                  {...register(f.name, { setValueAs: toNumber })}
                />
              ) : (
                <Input id={f.name} maxLength={f.max} {...inv} {...register(f.name)} />
              )}
            </Field>
          );
        })}
      </fieldset>
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="submit" size="lg" disabled={!!saving}>
            {saving === "complete" ? "Saving…" : "Save & Continue"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!!saving}
            onClick={() => save(getValues(), false)}
          >
            {saving === "draft" ? "Saving…" : "Save Draft"}
          </Button>
          {status && (
            <span role="status" className="text-muted text-sm">
              {status}
            </span>
          )}
        </div>
      )}
    </form>
  );
}
