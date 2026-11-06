import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
import { safeNext } from "@/lib/auth-links";

export const metadata: Metadata = { title: "Sign In", robots: { index: false, follow: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-semibold">Sign in</h1>
      <p className="text-muted mt-2 mb-6">
        No password needed — we&apos;ll email you a secure link. Sign-in is available to applicants
        who have pre-qualified.
      </p>
      {sp.error === "link" && (
        <p role="alert" className="bg-accent-soft mb-4 rounded-lg p-3 text-sm">
          That sign-in link is invalid or has expired. Please request a new one.
        </p>
      )}
      <LoginForm next={next} />
      <p className="text-muted mt-6 text-sm">
        Haven&apos;t applied yet?{" "}
        <Link href="/egg-donor" className="underline">
          Egg donors
        </Link>{" "}
        ·{" "}
        <Link href="/sperm-donor" className="underline">
          Sperm donors
        </Link>
      </p>
    </div>
  );
}
