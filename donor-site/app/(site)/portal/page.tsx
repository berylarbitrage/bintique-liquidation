import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getFullApp, getOwnApplication } from "@/lib/portal";
import { completionPercent } from "@/lib/full-app";
import { STATUS_LABELS, type Status } from "@/lib/admin/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SITE } from "@/config/site";

export const metadata: Metadata = { title: "Applicant Portal" };

export default async function PortalPage() {
  const { supabase, user } = await requireUser("/portal");
  const app = await getOwnApplication(supabase, user.id);
  const full = app ? await getFullApp(supabase, app.id) : null;
  const pct = completionPercent(full?.completed_sections ?? []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">
          {app ? `Welcome, ${app.first_name}` : "Applicant Portal"}
        </h1>
        <form action="/api/auth/signout" method="post">
          <Button variant="ghost" size="sm">
            Sign out
          </Button>
        </form>
      </div>
      {app ? (
        <Card className="max-w-2xl">
          <p className="text-muted text-sm capitalize">{app.donor_type} donor application</p>
          <p className="mt-1 text-lg">
            Status: <strong>{STATUS_LABELS[app.status as Status] ?? app.status}</strong>
          </p>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-sm">
              <span>Full application</span>
              <span>{pct}% complete</span>
            </div>
            <div className="bg-muted-bg h-2 rounded-full">
              <div className="bg-primary h-full rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <Button asChild size="lg" className="mt-6">
            <Link href="/portal/application">
              {full?.submitted_at
                ? "View My Application"
                : pct > 0
                  ? "Continue My Application"
                  : "Start My Full Application"}
            </Link>
          </Button>
        </Card>
      ) : (
        <Card className="max-w-2xl">
          <p>
            We couldn&apos;t find a pre-qualified application for your account. If you think this is
            a mistake, contact us at{" "}
            <a className="underline" href={`mailto:${SITE.contactEmail}`}>
              {SITE.contactEmail}
            </a>
            .
          </p>
        </Card>
      )}
    </div>
  );
}
