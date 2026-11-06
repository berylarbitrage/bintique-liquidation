"use client";

import { OPEN_CONSENT_EVENT } from "@/lib/consent";

export function CookieSettingsLink() {
  return (
    <button
      type="button"
      className="text-left"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
    >
      Cookie Settings
    </button>
  );
}
