import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { audit } from "@/lib/admin/audit";
import { STATUS_LABELS, type Status } from "@/lib/admin/constants";
import { createAdminClient, PHOTO_BUCKET } from "@/lib/supabase/admin";
import { ageOn } from "@/lib/dates";
import { FAIL_REASON_LABELS, type FailReason } from "@/lib/eligibility";
import { completionPercent, FORM_SECTIONS, sectionFields, SECTION_TITLES } from "@/lib/full-app";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DefList } from "@/components/admin/field-value";
import { StatusForm } from "@/components/admin/status-form";
import { NoteForm } from "@/components/admin/note-form";
import { DeleteApplicantButton } from "@/components/admin/delete-button";

const SIGNED_URL_TTL = 600; // 10 minutes

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase, user } = await requireAdmin();

  const { data: app } = await supabase.from("applications").select("*").eq("id", id).maybeSingle();
  if (!app) notFound();

  const [{ data: full }, { data: photos }, { data: notes }, { data: referrer }, { data: history }] = await Promise.all([
    supabase.from("full_applications").select("*").eq("application_id", id).maybeSingle(),
    supabase.from("photos").select("*").eq("application_id", id).order("created_at"),
    supabase.from("admin_notes").select("*").eq("application_id", id).order("created_at", { ascending: false }),
    app.referral_code
      ? supabase.from("referrers").select("name,email").eq("code", app.referral_code).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("audit_log")
      .select("action,meta,created_at,actor_id")
      .eq("target_id", id)
      .in("action", ["update_status"])
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  await audit(user.id, "view_application", id);

  // Photos: short-lived signed URLs only.
  const service = createAdminClient();
  const signed = new Map<string, string>();
  if (photos?.length) {
    const { data: urls } = await service.storage
      .from(PHOTO_BUCKET)
      .createSignedUrls(photos.map((p) => p.storage_path), SIGNED_URL_TTL);
    urls?.forEach((u) => u.path && u.signedUrl && signed.set(u.path, u.signedUrl));
  }

  // Note / history authors.
  const authorIds = [...new Set([...(notes ?? []).map((n) => n.author_id), ...(history ?? []).map((h) => h.actor_id)].filter(Boolean))] as string[];
  const authors = new Map<string, string>();
  await Promise.all(
    authorIds.map(async (aid) => {
      const { data } = await service.auth.admin.getUserById(aid);
      authors.set(aid, data.user?.email ?? "unknown");
    }),
  );

  const sections = (full?.sections ?? {}) as Record<string, Record<string, unknown>>;
  const completed = (full?.completed_sections ?? []) as string[];
  const name = `${app.first_name} ${app.last_name}`;
  const fmt = (d: string) => new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-primary underline">
        <ArrowLeft className="size-4" aria-hidden /> All applications
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{name}</h1>
          <p className="mt-1 text-sm text-muted">
            <span className="capitalize">{app.donor_type}</span> donor · submitted {fmt(app.created_at)}
          </p>
          <div className="mt-2 flex gap-2">
            {app.eligible ? <Badge tone="success">Pre-qualified</Badge> : <Badge tone="danger">Not pre-qualified</Badge>}
            <Badge>{STATUS_LABELS[app.status as Status] ?? app.status}</Badge>
            {full && <Badge tone="warn">Full app {completionPercent(completed)}%</Badge>}
          </div>
        </div>
        <StatusForm id={id} status={app.status as Status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 font-sans text-lg font-semibold">Contact</h2>
            <DefList
              items={[
                ["Email", app.email],
                ["Phone", app.phone],
                ["SMS consent", app.sms_consent],
                ["State / ZIP", `${app.state} ${app.zip}`],
                ["Source", app.how_heard],
                ["Referrer", referrer ? `${referrer.name} (${referrer.email}) · ${app.referral_code}` : app.referral_code],
              ]}
            />
          </Card>
          <Card>
            <h2 className="mb-4 font-sans text-lg font-semibold">Pre-screen</h2>
            <DefList
              items={[
                ["Date of birth", `${app.date_of_birth} (age ${ageOn(app.date_of_birth, new Date())})`],
                ["Education", app.education],
                ["Height", app.height_in ? `${Math.floor(app.height_in / 12)}'${app.height_in % 12}"` : null],
                ["Weight", app.weight_lb ? `${app.weight_lb} lb` : null],
                ["BMI", app.bmi],
                ["Nicotine use", app.smoker],
                ["Previous donation", app.previous_donation],
                ...(app.donor_type === "egg"
                  ? ([
                      ["Regular cycles", app.regular_cycles],
                      ["Birth control", app.birth_control],
                    ] as [string, unknown][])
                  : ([
                      ["Within 60 min", app.within_60_min],
                      ["Can commit 6 months", app.can_commit_6_months],
                    ] as [string, unknown][])),
                [
                  "Did not meet",
                  (app.fail_reasons as FailReason[]).map((r) => FAIL_REASON_LABELS[r] ?? r),
                ],
              ]}
            />
          </Card>

          {full &&
            FORM_SECTIONS.map((s) => (
              <Card key={s.id}>
                <h2 className="mb-4 flex items-center gap-2 font-sans text-lg font-semibold">
                  {s.title}
                  {completed.includes(s.id) ? <Badge tone="success">Complete</Badge> : <Badge>Incomplete</Badge>}
                </h2>
                <DefList
                  items={sectionFields(s.id, app.donor_type).map((f) => [f.label, sections[s.id]?.[f.name]])}
                />
              </Card>
            ))}

          <Card>
            <h2 className="mb-4 font-sans text-lg font-semibold">
              {SECTION_TITLES.photos} ({photos?.length ?? 0})
            </h2>
            {photos?.length ? (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.map((p) => (
                  <li key={p.id}>
                    {signed.get(p.storage_path) ? (
                      <a href={signed.get(p.storage_path)} target="_blank" rel="noreferrer">
                        <Image
                          src={signed.get(p.storage_path)!}
                          alt={`${p.kind} photo`}
                          width={240}
                          height={240}
                          unoptimized
                          className="aspect-square w-full rounded-lg object-cover"
                        />
                      </a>
                    ) : (
                      <div className="aspect-square rounded-lg bg-muted-bg" />
                    )}
                    <p className="mt-1 text-xs text-muted capitalize">{p.kind}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">No photos uploaded.</p>
            )}
            <p className="mt-3 text-xs text-muted">Photo links expire after 10 minutes. Reload the page for new links.</p>
          </Card>

          {full?.signed_name && (
            <Card>
              <h2 className="mb-4 font-sans text-lg font-semibold">Signature</h2>
              <DefList
                items={[
                  ["Signed name", full.signed_name],
                  ["Signed at", full.signed_at ? fmt(full.signed_at) : null],
                  ["Submitted at", full.submitted_at ? fmt(full.submitted_at) : null],
                ]}
              />
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 font-sans text-lg font-semibold">Internal notes</h2>
            <NoteForm id={id} />
            <ol className="mt-6 space-y-4 border-l-2 border-primary-soft pl-4">
              {notes?.map((n) => (
                <li key={n.id}>
                  <p className="text-xs text-muted">
                    {authors.get(n.author_id) ?? "Unknown"} · {fmt(n.created_at)}
                  </p>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{n.body}</p>
                </li>
              ))}
              {!notes?.length && <li className="text-sm text-muted">No notes yet.</li>}
            </ol>
          </Card>
          <Card>
            <h2 className="mb-4 font-sans text-lg font-semibold">Status history</h2>
            <ol className="space-y-2 text-sm">
              {history?.map((h, i) => {
                const m = h.meta as { from?: string; to?: string };
                return (
                  <li key={i}>
                    <span className="text-muted">{fmt(h.created_at)}</span> · {m.from} → <strong>{m.to}</strong>
                    <span className="block text-xs text-muted">{authors.get(h.actor_id) ?? ""}</span>
                  </li>
                );
              })}
              {!history?.length && <li className="text-muted">No changes yet.</li>}
            </ol>
          </Card>
          <Card className="border-destructive/40">
            <h2 className="mb-2 font-sans text-lg font-semibold">Danger zone</h2>
            <p className="mb-4 text-sm text-muted">Use for data deletion requests (CCPA / right to delete).</p>
            <DeleteApplicantButton id={id} name={name} />
          </Card>
        </div>
      </div>
    </div>
  );
}
