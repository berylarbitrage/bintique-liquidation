import Link from "next/link";
import { DISCLAIMER, SITE, serviceStatesText } from "@/config/site";
import { Logo } from "@/components/layout/logo";
import { CookieSettingsLink } from "@/components/analytics/cookie-settings-link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-muted-bg">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="space-y-3 md:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm text-muted">{SITE.tagline}</p>
          <p className="text-sm">
            <a className="underline" href={`mailto:${SITE.contactEmail}`}>
              {SITE.contactEmail}
            </a>
            <br />
            <a className="underline" href={`tel:${SITE.contactPhone.replace(/\D/g, "")}`}>
              {SITE.contactPhone}
            </a>
          </p>
          <p className="text-sm text-muted">Serving donors in: {serviceStatesText}</p>
        </div>
        <div>
          <h2 className="mb-3 font-sans text-sm font-semibold">Donate</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/egg-donor">Become an Egg Donor</Link></li>
            <li><Link href="/sperm-donor">Become a Sperm Donor</Link></li>
            <li><Link href="/refer">Refer a Friend</Link></li>
            <li><Link href="/portal">Applicant Login</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-sans text-sm font-semibold">Company</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Use</Link></li>
            <li><CookieSettingsLink /></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl space-y-2 px-4 py-6 text-xs text-muted">
          <p>
            <strong>Disclaimer:</strong> {DISCLAIMER}
          </p>
          <p>
            © {new Date().getFullYear()} {SITE.brand}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
