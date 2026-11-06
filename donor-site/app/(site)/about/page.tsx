import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import { SITE, serviceStatesText } from "@/config/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SITE.brand}, our mission, and how we support egg and sperm donors.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Section title={`About ${SITE.brand}`}>
      <div className="max-w-3xl space-y-6 text-lg">
        <p>
          {SITE.brand} connects generous people with the families who need their help. We recruit
          and pre-screen egg and sperm donors, and guide them through every step of the process with
          care, honesty and respect.
        </p>
        <h2 className="pt-4 text-2xl font-semibold">What we believe</h2>
        <ul className="list-disc space-y-2 pl-6 text-base">
          <li>
            <strong>Informed choice.</strong> Donors deserve clear, balanced information — including
            the risks — before making any decision.
          </li>
          <li>
            <strong>Fair, transparent compensation.</strong> Compensation recognizes your time and
            commitment. It is never based on appearance, ethnicity, or other personal traits.
          </li>
          <li>
            <strong>Privacy first.</strong> Your personal and health information is protected and
            never sold.
          </li>
          <li>
            <strong>Real support.</strong> Every donor has a dedicated coordinator — a real person
            you can call or text.
          </li>
        </ul>
        <h2 className="pt-4 text-2xl font-semibold">How we work</h2>
        <p className="text-base">
          We handle outreach, pre-screening, and coordination. All medical evaluations, procedures,
          and laboratory work are performed by licensed partner fertility clinics and FDA-registered
          sperm banks. We currently serve donors in {serviceStatesText}.
        </p>
        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <Button asChild>
            <Link href="/egg-donor">Become an Egg Donor</Link>
          </Button>
          <Button asChild>
            <Link href="/sperm-donor">Become a Sperm Donor</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
