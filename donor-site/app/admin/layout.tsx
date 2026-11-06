import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin(); // non-admins get 404
  return (
    <div className="bg-background min-h-dvh">
      <header className="border-border bg-card border-b">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
          <Link href="/admin" className="text-primary font-serif font-semibold">
            {SITE.brand} · Admin
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted hidden sm:inline">{user.email}</span>
            <form action="/api/auth/signout" method="post">
              <button className="underline">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
