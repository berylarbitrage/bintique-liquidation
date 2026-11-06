import { SITE, siteUrl } from "@/config/site";
import type { FaqItem } from "@/content/faq";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.brand,
    url: siteUrl(),
    email: SITE.contactEmail,
    telephone: SITE.contactPhone,
    areaServed: SITE.serviceStates.map((s) => ({ "@type": "State", name: s })),
  };
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
