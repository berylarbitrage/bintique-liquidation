"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import {
  ALL_SECTION_IDS,
  completionPercent,
  FORM_SECTIONS,
  FORM_SECTION_IDS,
  SECTION_TITLES,
  type FormSectionId,
  type SectionId,
} from "@/lib/full-app";
import type { DonorType } from "@/config/eligibility";
import { SectionForm } from "@/components/portal/section-form";
import { PhotoUploader, type PortalPhoto } from "@/components/portal/photo-uploader";
import { SignatureForm } from "@/components/portal/signature-form";
import { cn } from "@/lib/utils";

export function FullApplication({
  donorType,
  initialSections,
  initialCompleted,
  photos,
  submitted,
}: {
  donorType: DonorType;
  initialSections: Record<string, Record<string, unknown>>;
  initialCompleted: string[];
  photos: PortalPhoto[];
  submitted: boolean;
}) {
  const router = useRouter();
  const [sections, setSections] = useState(initialSections);
  const [completed, setCompleted] = useState(initialCompleted);
  const firstOpen = ALL_SECTION_IDS.find((s) => !initialCompleted.includes(s)) ?? "background";
  const [active, setActive] = useState<SectionId>(submitted ? "background" : firstOpen);
  const pct = completionPercent(completed);

  const go = (s: SectionId) => {
    setActive(s);
    requestAnimationFrame(() => document.getElementById("section-heading")?.focus());
  };

  const def = FORM_SECTIONS.find((s) => s.id === active);

  return (
    <div className="grid gap-8 md:grid-cols-[16rem_1fr]">
      <aside>
        <div className="mb-4">
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span>{pct}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Application completion"
            className="bg-muted-bg h-2 rounded-full"
          >
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <nav aria-label="Application sections">
          <ol className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible">
            {ALL_SECTION_IDS.map((s, i) => {
              const done = completed.includes(s);
              return (
                <li key={s} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => go(s)}
                    aria-current={active === s ? "step" : undefined}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm",
                      active === s
                        ? "bg-primary-soft text-primary font-semibold"
                        : "hover:bg-muted-bg",
                    )}
                  >
                    {done ? (
                      <CheckCircle2
                        className="text-primary size-4 shrink-0"
                        aria-label="Complete"
                      />
                    ) : (
                      <Circle className="text-muted size-4 shrink-0" aria-label="Incomplete" />
                    )}
                    <span className="whitespace-nowrap">
                      {i + 1}. {SECTION_TITLES[s]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>

      <section
        className="bg-card rounded-2xl p-5 shadow-sm sm:p-8"
        aria-labelledby="section-heading"
      >
        <h2 id="section-heading" tabIndex={-1} className="text-2xl font-semibold outline-none">
          {SECTION_TITLES[active]}
        </h2>
        {def && <p className="text-muted mt-1 mb-6 text-sm">{def.description}</p>}
        {!def && <div className="mb-6" />}

        {def && (
          <SectionForm
            key={active}
            section={active as FormSectionId}
            donorType={donorType}
            initial={sections[active] ?? {}}
            readOnly={submitted}
            onSaved={(c, data, advance) => {
              setCompleted(c);
              setSections((prev) => ({ ...prev, [active]: data }));
              if (advance) {
                const idx = ALL_SECTION_IDS.indexOf(active);
                const nextId = ALL_SECTION_IDS[idx + 1];
                if (nextId) go(nextId);
              }
            }}
          />
        )}
        {active === "photos" && (
          <PhotoUploader
            photos={photos}
            readOnly={submitted}
            onChange={(c) => {
              if (c) setCompleted(c);
              router.refresh();
            }}
          />
        )}
        {active === "signature" && (
          <SignatureForm
            submitted={submitted}
            missing={[...FORM_SECTION_IDS, "photos" as const]
              .filter((s) => !completed.includes(s))
              .map((s) => SECTION_TITLES[s])}
            onSubmitted={() => router.refresh()}
          />
        )}
      </section>
    </div>
  );
}
