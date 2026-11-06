import type { Metadata } from "next";
import { Section } from "@/components/marketing/section";
import { ReferForm } from "@/components/forms/refer-form";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Refer a Friend",
  description: `Refer a friend to become an egg or sperm donor and earn ${SITE.referralBonus}.`,
  alternates: { canonical: "/refer" },
};

export default function ReferPage() {
  return (
    <Section
      eyebrow="Referral program"
      title={`Refer a friend, earn ${SITE.referralBonus}`}
      intro="Know someone who might be a great donor? Share your personal link."
    >
      <div className="grid gap-10 md:grid-cols-2">
        <ReferForm />
        <div>
          <h2 className="font-sans text-lg font-semibold">How it works</h2>
          <ol className="mt-4 space-y-3">
            <li>
              <strong>1.</strong> Enter your name and email to get your unique link.
            </li>
            <li>
              <strong>2.</strong> Share it with friends who might be interested in donating.
            </li>
            <li>
              <strong>3.</strong> When they apply through your link, we&apos;ll record the referral
              automatically.
            </li>
            <li>
              <strong>4.</strong> You receive <strong>{SITE.referralBonus}</strong> after your
              referral completes a donation.
            </li>
          </ol>
          <h2 className="mt-8 font-sans text-lg font-semibold">The fine print</h2>
          <ul className="text-muted mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>The bonus is paid only after the referred donor completes a donation.</li>
            <li>Referrals are tracked for 30 days after your friend clicks your link.</li>
            <li>Self-referrals are not eligible.</li>
            <li>We may change or end the program at any time. See our Terms of Use.</li>
          </ul>
        </div>
      </div>
    </Section>
  );
}
