import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { Section } from "@/components/marketing/section";
import { ContactForm } from "@/components/forms/contact-form";
import { SITE, serviceStatesText } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Questions about becoming a donor? Contact ${SITE.brand}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Section title="Contact us" intro="Have a question? We're happy to help.">
      <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <p className="flex items-center gap-3">
            <Mail className="text-primary size-5" aria-hidden />
            <a href={`mailto:${SITE.contactEmail}`} className="underline">
              {SITE.contactEmail}
            </a>
          </p>
          <p className="flex items-center gap-3">
            <Phone className="text-primary size-5" aria-hidden />
            <a href={`tel:${SITE.contactPhone.replace(/\D/g, "")}`} className="underline">
              {SITE.contactPhone}
            </a>
          </p>
          <p className="text-muted text-sm">Serving donors in {serviceStatesText}.</p>
        </div>
        <ContactForm />
      </div>
    </Section>
  );
}
