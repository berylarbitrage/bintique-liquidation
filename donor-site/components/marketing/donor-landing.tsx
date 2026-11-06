import Link from "next/link";
import { Hero } from "@/components/marketing/hero";
import { Section } from "@/components/marketing/section";
import { CheckList } from "@/components/marketing/check-list";
import { Timeline } from "@/components/marketing/timeline";
import { FaqList } from "@/components/marketing/faq-list";
import { StickyCta } from "@/components/marketing/sticky-cta";
import { Disclaimer } from "@/components/marketing/disclaimer";
import { JsonLd } from "@/components/marketing/jsonld";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requirementsList, type DonorType } from "@/config/eligibility";
import { FAQ } from "@/content/faq";
import { faqJsonLd } from "@/lib/seo";

export interface DonorLandingContent {
  type: DonorType;
  hero: { eyebrow: string; title: string; subtitle: string; image: string };
  comp: { amount: string; covered: string[]; note?: React.ReactNode };
  partnerNote?: React.ReactNode;
  steps: { title: string; body: string }[];
  concerns: { title: string; body: string }[];
}

export function DonorLanding({ c }: { c: DonorLandingContent }) {
  const applyHref = `/apply/${c.type}`;
  const faq = FAQ[c.type];
  return (
    <>
      <JsonLd data={faqJsonLd(faq.items)} />
      <Hero
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        subtitle={c.hero.subtitle}
        image={c.hero.image}
        imageAlt=""
      >
        <Button asChild size="lg">
          <Link href={applyHref}>Start Your Application</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="#requirements">See Requirements</Link>
        </Button>
      </Hero>

      {c.partnerNote && (
        <div className="mx-auto max-w-6xl px-4">
          <p className="bg-primary-soft rounded-xl p-4 text-sm">{c.partnerNote}</p>
        </div>
      )}

      <Section id="requirements" eyebrow="Requirements" title="Who can apply">
        <CheckList items={requirementsList(c.type)} />
        <p className="text-muted mt-4 text-sm">
          These are initial guidelines. Final eligibility is determined by our partner medical
          providers.
        </p>
      </Section>

      <div className="bg-muted-bg">
        <Section eyebrow="Compensation" title="Compensation & covered costs">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <p className="text-primary text-sm font-semibold">Compensation</p>
              <p className="mt-2 font-serif text-3xl font-semibold">{c.comp.amount}</p>
              <p className="text-muted mt-3 text-sm">
                {c.comp.note ??
                  "Paid for your time, effort, and commitment. Amounts vary by program."}
              </p>
            </Card>
            <Card>
              <p className="text-primary text-sm font-semibold">Covered at no cost to you</p>
              <ul className="mt-3 space-y-2">
                {c.comp.covered.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span aria-hidden className="text-accent">
                      ●
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Section>
      </div>

      <Section eyebrow="The process" title="What to expect, step by step">
        <div className="max-w-2xl">
          <Timeline steps={c.steps} />
        </div>
      </Section>

      <div className="bg-muted-bg">
        <Section
          eyebrow="Your questions"
          title="Things you might be wondering about"
          intro="We want you to make an informed decision. These are general answers — please talk with a physician about your personal health."
        >
          <div className="grid gap-6 md:grid-cols-2">
            {c.concerns.map((x) => (
              <Card key={x.title}>
                <h3 className="font-sans text-lg font-semibold">{x.title}</h3>
                <p className="text-muted mt-2">{x.body}</p>
              </Card>
            ))}
          </div>
        </Section>
      </div>

      <Section eyebrow="FAQ" title={`${faq.title} FAQ`}>
        <FaqList items={faq.items} />
      </Section>

      <section className="mx-auto max-w-6xl px-4 pb-10 text-center">
        <h2 className="text-3xl font-semibold">Ready to take the first step?</h2>
        <p className="text-muted mt-3">The pre-screen takes about 3 minutes.</p>
        <Button asChild size="lg" className="mt-6">
          <Link href={applyHref}>Start Your Application</Link>
        </Button>
      </section>

      <Disclaimer />
      <StickyCta href={applyHref} label="Start Your Application" note={c.comp.amount} />
    </>
  );
}
