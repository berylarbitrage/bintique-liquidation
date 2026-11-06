import type { Metadata } from "next";
import { Section } from "@/components/marketing/section";
import { DISCLAIMER, SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <Section title="Terms of Use">
      <div className="prose-legal max-w-3xl">
        <p className="bg-accent-soft rounded-lg p-3 text-sm font-semibold">
          DRAFT — PLACEHOLDER TEXT. These terms must be reviewed by a qualified attorney before
          launch.
        </p>
        <p className="text-muted text-sm">Last updated: [DATE]</p>
        <h2>1. Acceptance</h2>
        <p>By using {SITE.domain}, you agree to these Terms and our Privacy Policy.</p>
        <h2>2. No medical advice</h2>
        <p>{DISCLAIMER}</p>
        <h2>3. Eligibility & applications</h2>
        <p>
          You must be at least 18 years old to apply. Pre-screen results are preliminary and do not
          guarantee acceptance into any program. You agree that the information you provide is true
          and complete.
        </p>
        <h2>4. Compensation</h2>
        <p>
          Compensation is paid for your time, effort and commitment, according to the written
          agreement for your specific program. Amounts shown on this site are estimates and vary by
          program.
        </p>
        <h2>5. Referral program</h2>
        <p>
          Referral bonuses ({SITE.referralBonus}) are paid only after a referred donor completes a
          donation. We may modify or end the program at any time. Self-referrals and fraudulent
          referrals are void. [ATTORNEY TO COMPLETE.]
        </p>
        <h2>6. Text messages</h2>
        <p>
          If you opt in, we may send texts about your application. Message and data rates may apply.
          Reply STOP to opt out, HELP for help.
        </p>
        <h2>7. Limitation of liability</h2>
        <p>[ATTORNEY TO COMPLETE.]</p>
        <h2>8. Governing law</h2>
        <p>[ATTORNEY TO COMPLETE.]</p>
        <h2>9. Contact</h2>
        <p>{SITE.contactEmail}</p>
      </div>
    </Section>
  );
}
