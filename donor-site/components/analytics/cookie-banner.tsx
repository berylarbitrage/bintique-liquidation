"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OPEN_CONSENT_EVENT, readConsent, writeConsent } from "@/lib/consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readConsent() === null) setVisible(true);
    const open = () => setVisible(true);
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="border-border bg-card fixed inset-x-0 bottom-0 z-[60] border-t p-4 shadow-2xl"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-foreground text-sm">
          We use necessary cookies to run this site. With your permission, we also use analytics and
          advertising cookies (Google Analytics, Meta Pixel) to improve our outreach.{" "}
          <Link href="/privacy#cookies" className="underline">
            Read our cookie policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              writeConsent("denied");
              setVisible(false);
            }}
          >
            Necessary only
          </Button>
          <Button
            size="sm"
            onClick={() => {
              writeConsent("granted");
              setVisible(false);
            }}
          >
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}
