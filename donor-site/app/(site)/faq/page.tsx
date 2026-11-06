import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/marketing/section";
import { FaqList } from "@/components/marketing/faq-list";
import { JsonLd } from "@/components/marketing/jsonld";
import { Button } from "@/components/ui/button";
import { FAQ, type FaqGroup } from "@/content/faq";
import { faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about egg donation, sperm donation, compensation, and privacy.",
  alternates: { canonical: "/faq" },
};

const ORDER: FaqGroup[] = ["egg", "sperm", "general"];

export default function FaqPage() {
  const all = ORDER.flatMap((g) => FAQ[g].items);
  return (
    <>
      <JsonLd data={faqJsonLd(all)} />
      <Section
        title="Frequently Asked Questions"
        intro="Can't find your answer? Contact us any time."
      >
        <nav aria-label="FAQ sections" className="mb-10 flex flex-wrap gap-2">
          {ORDER.map((g) => (
            <a
              key={g}
              href={`#${g}`}
              className="border-border bg-card hover:border-primary rounded-full border px-4 py-2 text-sm font-medium"
            >
              {FAQ[g].title}
            </a>
          ))}
        </nav>
        <div className="space-y-12">
          {ORDER.map((g) => (
            <div key={g} id={g} className="scroll-mt-24">
              <h2 className="mb-4 text-2xl font-semibold">{FAQ[g].title}</h2>
              <FaqList items={FAQ[g].items} />
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/apply/egg">Apply as an Egg Donor</Link>
          </Button>
          <Button asChild>
            <Link href="/apply/sperm">Apply as a Sperm Donor</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
