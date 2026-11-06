import Link from "next/link";
import { DISCLAIMER, SITE, serviceStatesText } from "@/config/site";
import { Logo } from "@/components/layout/logo";
import { CookieSettingsLink } from "@/components/analytics/cookie-settings-link";

export function Footer() {
  return (
    <footer className="border-border bg-muted-bg mt-20 border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="space-y-3 md:col-span-2">
          <Logo />
          <p className="text-muted max-w-sm text-sm">{SITE.tagline}</p>
          <p className="flex flex-col items-start text-sm">
            <a className="inline-block py-2 underline" href={`mailto:${SITE.contactEmail}`}>
              {SITE.contactEmail}
            </a>
            <a
              className="inline-block py-2 underline"
              href={`tel:${SITE.contactPhone.replace(/\D/g, "")}`}
            >
              {SITE.contactPhone}
            </a>
          </p>
          <p className="text-muted text-sm">Serving donors in: {serviceStatesText}</p>
        </div>
        <div>
          <h2 className="mb-3 font-sans text-sm font-semibold">Donate</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/egg-donor">Become an Egg Donor</Link>
            </li>
            <li>
              <Link href="/sperm-donor">Become a Sperm Donor</Link>
            </li>
            <li>
              <Link href="/refer">Refer a Friend</Link>
            </li>
            <li>
              <Link href="/portal">Applicant Login</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-sans text-sm font-semibold">Company</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Use</Link>
            </li>
            <li>
              <CookieSettingsLink />
            </li>
          </ul>
        </div>
      </div>
      <div className="border-border border-t">
        <div className="text-muted mx-auto max-w-6xl space-y-2 px-4 py-6 text-xs">
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
