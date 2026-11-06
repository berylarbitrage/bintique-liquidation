import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getFullApp, getOwnApplication } from "@/lib/portal";
import { FullApplication } from "@/components/portal/full-application";
import type { PortalPhoto } from "@/components/portal/photo-uploader";
import { PHOTO_BUCKET } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Full Application" };

const SIGNED_URL_TTL = 600; // 10 minutes

export default async function FullApplicationPage() {
  const { supabase, user } = await requireUser("/portal/application");
  const app = await getOwnApplication(supabase, user.id);
  if (!app) redirect("/portal");
  const full = await getFullApp(supabase, app.id);

  const { data: photoRows } = await supabase
    .from("photos")
    .select("id,kind,storage_path")
    .eq("application_id", app.id)
    .order("created_at");
  const urls = new Map<string, string>();
  if (photoRows?.length) {
    // User-scoped client: storage RLS only signs the applicant's own files.
    const { data } = await supabase.storage.from(PHOTO_BUCKET).createSignedUrls(
      photoRows.map((p) => p.storage_path),
      SIGNED_URL_TTL,
    );
    data?.forEach((d) => d.path && d.signedUrl && urls.set(d.path, d.signedUrl));
  }
  const photos: PortalPhoto[] = (photoRows ?? []).map((p) => ({
    id: p.id,
    kind: p.kind,
    url: urls.get(p.storage_path) ?? null,
  }));

  return (
    <div>
      <Link
        href="/portal"
        className="text-primary inline-flex items-center gap-1 text-sm underline"
      >
        <ArrowLeft className="size-4" aria-hidden /> Portal home
      </Link>
      <h1 className="mt-2 mb-6 text-3xl font-semibold">Your full application</h1>
      <FullApplication
        donorType={app.donor_type}
        initialSections={full?.sections ?? {}}
        initialCompleted={full?.completed_sections ?? []}
        photos={photos}
        submitted={!!full?.submitted_at}
      />
    </div>
  );
}
