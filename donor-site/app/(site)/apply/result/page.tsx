import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Application Received",
  robots: { index: false, follow: false },
};

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const eligible = status === "eligible";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      {eligible ? (
        <>
          <CheckCircle2 className="text-primary mx-auto size-14" aria-hidden />
          <h1 className="mt-4 text-3xl font-semibold md:text-4xl">Great news — you pre-qualify!</h1>
          <p className="text-muted mt-4 text-lg">
            Thank you for applying. We&apos;ve sent you an email with a secure sign-in link to
            complete your full application. It only takes a few minutes per section, and you can
            save as you go.
          </p>
          <ol className="mx-auto mt-8 max-w-md space-y-3 text-left">
            <li>
              <strong>1.</strong> Check your inbox (and spam folder) for an email from {SITE.brand}.
            </li>
            <li>
              <strong>2.</strong> Complete your full application in the secure portal.
            </li>
            <li>
              <strong>3.</strong> Your coordinator will reach out to schedule a short video call.
            </li>
          </ol>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/portal">Go to Applicant Portal</Link>
            </Button>
          </div>
          <p className="text-muted mt-6 text-sm">
            Didn&apos;t get the email? You can request a new link from the portal sign-in page.
          </p>
        </>
      ) : (
        <>
          <Heart className="text-accent mx-auto size-14" aria-hidden />
          <h1 className="mt-4 text-3xl font-semibold md:text-4xl">Thank you for your interest</h1>
          <p className="text-muted mt-4 text-lg">
            Based on the current requirements of our partner programs, we&apos;re not able to move
            forward with your application right now. These requirements are set by medical providers
            and aren&apos;t a reflection of you.
          </p>
          <p className="mt-4 text-lg">
            You can still make a difference: refer a friend and earn{" "}
            <strong>{SITE.referralBonus}</strong> when they complete a donation.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/refer">Refer a Friend</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
