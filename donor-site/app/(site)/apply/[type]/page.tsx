import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrescreenForm } from "@/components/apply/prescreen-form";
import { isDonorType } from "@/config/eligibility";
import { env } from "@/lib/env";

export function generateStaticParams() {
  return [{ type: "egg" }, { type: "sperm" }];
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  return {
    title: type === "egg" ? "Egg Donor Pre-Screen" : "Sperm Donor Pre-Screen",
    alternates: { canonical: `/apply/${type}` },
  };
}

export default async function ApplyPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isDonorType(type)) notFound();
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <p className="text-primary text-sm font-semibold">
        {type === "egg" ? "Egg donor" : "Sperm donor"} application
      </p>
      <h1 className="mt-1 mb-6 text-3xl font-semibold md:text-4xl">
        Let&apos;s see if you pre-qualify
      </h1>
      <PrescreenForm type={type} turnstileSiteKey={env("TURNSTILE_SITE_KEY")} />
    </div>
  );
}
