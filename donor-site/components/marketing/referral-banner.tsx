import Link from "next/link";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/config/site";

export function ReferralBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col items-start gap-6 rounded-3xl bg-primary p-8 text-primary-foreground md:flex-row md:items-center md:justify-between md:p-12">
        <div className="flex items-start gap-4">
          <Gift className="mt-1 size-8 shrink-0" aria-hidden />
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">
              Refer a friend, earn {SITE.referralBonus}
            </h2>
            <p className="mt-2 opacity-90">
              Know someone who&apos;d be a great donor? Share your link and earn a bonus when they
              complete a donation.
            </p>
          </div>
        </div>
        <Button asChild size="lg">
          <Link href="/refer">Get My Referral Link</Link>
        </Button>
      </div>
    </section>
  );
}
