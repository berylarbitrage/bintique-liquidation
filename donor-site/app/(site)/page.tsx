import Link from "next/link";
import {
  CalendarClock,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Stethoscope,
  Dna,
  Receipt,
} from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { Section } from "@/components/marketing/section";
import { FaqList } from "@/components/marketing/faq-list";
import { ReferralBanner } from "@/components/marketing/referral-banner";
import { JsonLd } from "@/components/marketing/jsonld";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SITE, serviceStatesText } from "@/config/site";
import { HOME_FAQ } from "@/content/faq";
import { organizationJsonLd } from "@/lib/seo";

const PROCESS = [
  { title: "Apply", body: "Answer a few quick questions online. It takes about 3 minutes." },
  { title: "Screen", body: "Complete your profile and medical screening with our partner clinic." },
  { title: "Match / Donate", body: "Get matched with a family or begin your donation schedule." },
  { title: "Get Compensated", body: "Receive compensation for your time and commitment." },
];

const WHY = [
  {
    icon: HeartHandshake,
    title: "A dedicated coordinator",
    body: "One real person guides you through every step and answers your questions.",
  },
  {
    icon: Receipt,
    title: "Transparent compensation",
    body: "Clear amounts up front. Compensation is for your time, never based on personal traits.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy protected",
    body: "Your information is encrypted, never sold, and only shared with partner clinics.",
  },
  {
    icon: MapPin,
    title: "Multi-state service",
    body: `We work with donors in ${serviceStatesText}.`,
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Hero
        eyebrow="Egg & sperm donor programs"
        title="Help someone become a parent."
        subtitle="Donating is a generous gift. We make it simple, supported, and well compensated — with every medical cost covered."
        image="/images/hero-home.svg"
        imageAlt=""
      >
        <Button asChild size="lg">
          <Link href="/egg-donor">Become an Egg Donor</Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/sperm-donor">Become a Sperm Donor</Link>
        </Button>
      </Hero>

      <Section eyebrow="Compensation" title="Compensated for your time and commitment">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-accent-soft">
            <p className="text-primary text-sm font-semibold">Egg donors</p>
            <p className="mt-2 font-serif text-3xl font-semibold">{SITE.eggComp}</p>
            <Link href="/egg-donor" className="mt-4 inline-block text-sm font-medium underline">
              Learn about egg donation
            </Link>
          </Card>
          <Card className="bg-primary-soft">
            <p className="text-primary text-sm font-semibold">Sperm donors</p>
            <p className="mt-2 font-serif text-3xl font-semibold">{SITE.spermComp}</p>
            <Link href="/sperm-donor" className="mt-4 inline-block text-sm font-medium underline">
              Learn about sperm donation
            </Link>
          </Card>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Stethoscope, label: "All medical costs covered" },
            { icon: Dna, label: "Free genetic testing" },
            { icon: CalendarClock, label: "Flexible scheduling" },
          ].map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 font-medium">
              <Icon className="text-primary size-5" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
        <p className="text-muted mt-6 text-sm">
          Compensation amounts vary by program and are paid for your time, effort, and commitment.
        </p>
      </Section>

      <div className="bg-muted-bg">
        <Section eyebrow="How it works" title="Four simple steps">
          <ol className="grid gap-6 md:grid-cols-4">
            {PROCESS.map((s, i) => (
              <li key={s.title} className="bg-card rounded-2xl p-6 shadow-sm">
                <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-full font-semibold">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-sans text-lg font-semibold">{s.title}</h3>
                <p className="text-muted mt-1">{s.body}</p>
              </li>
            ))}
          </ol>
        </Section>
      </div>

      <Section eyebrow="Why us" title={`Why donors choose ${SITE.brand}`}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <Icon className="text-accent size-8" aria-hidden />
              <h3 className="mt-3 font-sans text-lg font-semibold">{title}</h3>
              <p className="text-muted mt-1">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="FAQ" title="Common questions">
        <FaqList items={HOME_FAQ} />
        <Link href="/faq" className="text-primary mt-6 inline-block font-medium underline">
          See all FAQs
        </Link>
      </Section>

      <ReferralBanner />
    </>
  );
}
