import type { Metadata } from "next";
import { Section } from "@/components/marketing/section";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <Section title="Privacy Policy">
      <div className="prose-legal max-w-3xl">
        <p className="rounded-lg bg-accent-soft p-3 text-sm font-semibold">
          DRAFT — PLACEHOLDER TEXT. This policy must be reviewed by a qualified attorney before
          launch.
        </p>
        <p className="text-sm text-muted">Last updated: [DATE]</p>

        <h2>1. Who we are</h2>
        <p>
          {SITE.brand} (&quot;we&quot;, &quot;us&quot;) recruits and pre-screens egg and sperm
          donors. Contact: {SITE.contactEmail}, {SITE.contactPhone}.
        </p>

        <h2>2. Information we collect</h2>
        <ul>
          <li>
            <strong>Pre-screen:</strong> date of birth, state, ZIP code, education, height, weight,
            nicotine use, basic reproductive-health answers, prior donation, contact details (name,
            email, phone), consent choices, and how you heard about us. We do not collect your SSN,
            medical records, photos, or race/ethnicity at this stage.
          </li>
          <li>
            <strong>Full application (if invited):</strong> personal background, physical
            characteristics, personal and family medical history, reproductive history, photos, and
            your electronic signature.
          </li>
          <li>
            <strong>Referral program:</strong> referrer name and email.
          </li>
          <li>
            <strong>Technical data:</strong> IP address (for security and rate limiting) and, only
            with your consent, analytics and advertising cookies.
          </li>
        </ul>

        <h2>3. How we use it</h2>
        <ul>
          <li>To assess preliminary eligibility and contact you about donor programs.</li>
          <li>To share your application with partner clinics or sperm banks, with your consent.</li>
          <li>To administer referral bonuses.</li>
          <li>To secure our services and prevent fraud.</li>
          <li>To send text messages only if you opted in (reply STOP to opt out at any time).</li>
        </ul>
        <p>We never sell your personal information. Health information is never used for advertising.</p>

        <h2>4. Who can see it</h2>
        <p>
          Only authorized staff of {SITE.brand}, and the partner medical providers involved in your
          screening. Service providers (hosting, email delivery) process data on our behalf under
          contract.
        </p>

        <h2>5. How long we keep it</h2>
        <p>
          [RETENTION PERIOD — e.g. pre-screen data for applicants who do not proceed is deleted after
          24 months.] Data may be kept longer where required by law.
        </p>

        <h2>6. Your rights and deleting your data</h2>
        <p>
          You may request access to, correction of, or deletion of your data by emailing{" "}
          {SITE.contactEmail}. We will verify your identity and respond within 45 days.
        </p>

        <h2 id="ccpa">7. California residents (CCPA/CPRA)</h2>
        <p>
          California residents have the right to know what personal information we collect, use and
          disclose; the right to delete; the right to correct; the right to limit use of sensitive
          personal information (including health information); and the right not to be discriminated
          against for exercising these rights. We do not sell or &quot;share&quot; personal
          information for cross-context behavioral advertising without consent. To exercise your
          rights, email {SITE.contactEmail} or call {SITE.contactPhone}. [ATTORNEY TO COMPLETE.]
        </p>

        <h2 id="cookies">8. Cookies</h2>
        <p>
          We use strictly necessary cookies (for example, to remember your cookie choice and referral
          code). Analytics (Google Analytics 4) and advertising (Meta Pixel) cookies are only loaded
          if you click &quot;Accept all&quot;. You can change your choice any time via &quot;Cookie
          Settings&quot; in the footer.
        </p>

        <h2>9. Security</h2>
        <p>
          Data is encrypted in transit and at rest. Photos are stored privately and accessed only via
          short-lived links. Health information is never included in emails or URLs.
        </p>

        <h2>10. Changes</h2>
        <p>We will post any changes on this page and update the date above.</p>
      </div>
    </Section>
  );
}
