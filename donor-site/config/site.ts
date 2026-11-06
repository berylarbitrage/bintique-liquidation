/**
 * Central place for all brand / business placeholders.
 * Replace these values before launch — every page reads from here.
 */
export const SITE = {
  brand: "Brand Name", // {{BRAND}}
  domain: "example.com", // {{DOMAIN}}
  contactEmail: "hello@example.com", // {{CONTACT_EMAIL}}
  contactPhone: "(000) 000-0000", // {{CONTACT_PHONE}}
  eggComp: "$8,000 – $12,000 per cycle", // {{EGG_COMP}}
  spermComp: "Up to $1,500 per month", // {{SPERM_COMP}}
  referralBonus: "$500", // {{REFERRAL_BONUS}}
  serviceStates: ["IL", "TX", "GA", "NJ", "CA"], // {{SERVICE_STATES}}
  tagline: "Help build families. Be compensated for your time and commitment.",
} as const;

export const serviceStatesText = SITE.serviceStates.join(", ");

/** Absolute site URL, used for metadata, sitemap, email links. */
export function siteUrl(path = ""): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || `https://${SITE.domain}`).replace(/\/$/, "");
  return `${base}${path}`;
}

export const NAV_LINKS = [
  { href: "/egg-donor", label: "Egg Donors" },
  { href: "/sperm-donor", label: "Sperm Donors" },
  { href: "/refer", label: "Refer a Friend" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const DISCLAIMER =
  "This website does not provide medical advice. Final eligibility is determined by our partner medical providers. Compensation amounts vary by program and are paid for your time, effort, and commitment.";
