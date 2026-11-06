"use client";

import Image from "next/image";
import { useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PHOTO_LIMITS } from "@/lib/full-app";
import { Button } from "@/components/ui/button";

export interface PortalPhoto {
  id: string;
  kind: "childhood" | "recent";
  url: string | null;
}

export function PhotoUploader({
  photos,
  readOnly,
  onChange,
}: {
  photos: PortalPhoto[];
  readOnly: boolean;
  onChange: (completed: string[] | null) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const remaining = PHOTO_LIMITS.maxCount - photos.length;

  const upload = async (kind: "childhood" | "recent", file: File) => {
    setError(null);
    if (!PHOTO_LIMITS.mimeTypes.includes(file.type as "image/jpeg"))
      return setError("Please choose a JPG or PNG image.");
    if (file.size > PHOTO_LIMITS.maxBytes) return setError("Photos must be 5 MB or smaller.");
    setBusy(kind);
    try {
      const sign = await fetch("/api/portal/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sign", kind, contentType: file.type, size: file.size }),
      });
      const s = (await sign.json()) as { path?: string; token?: string; error?: string };
      if (!sign.ok || !s.path || !s.token) throw new Error(s.error ?? "Upload failed");
      const { error: upErr } = await createClient()
        .storage.from("donor-photos")
        .uploadToSignedUrl(s.path, s.token, file, { contentType: file.type });
      if (upErr) throw new Error("Upload failed. Please try again.");
      const confirm = await fetch("/api/portal/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirm", kind, path: s.path }),
      });
      const c = (await confirm.json()) as { completed?: string[]; error?: string };
      if (!confirm.ok) throw new Error(c.error ?? "Upload failed");
      onChange(c.completed ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id: string) => {
    setBusy(id);
    const res = await fetch("/api/portal/photo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    setBusy(null);
    const c = (await res.json().catch(() => ({}))) as { completed?: string[] };
    onChange(c.completed ?? null);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted text-sm">
        Upload at least one childhood photo and one recent photo (up to {PHOTO_LIMITS.maxCount}{" "}
        total, JPG or PNG, 5 MB max each). Photos are stored privately and only shared, without your
        name, with partner programs.
      </p>
      {(["childhood", "recent"] as const).map((kind) => (
        <div key={kind}>
          <h3 className="mb-2 font-sans font-semibold capitalize">{kind} photos</h3>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos
              .filter((p) => p.kind === kind)
              .map((p) => (
                <li key={p.id} className="relative">
                  {p.url ? (
                    <Image
                      src={p.url}
                      alt={`${kind} photo`}
                      width={200}
                      height={200}
                      unoptimized
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="bg-muted-bg aspect-square rounded-lg" />
                  )}
                  {!readOnly && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 size-8"
                      aria-label="Remove photo"
                      disabled={busy === p.id}
                      onClick={() => remove(p.id)}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </li>
              ))}
            {!readOnly && remaining > 0 && (
              <li>
                <label className="border-border text-muted hover:border-primary has-[:focus-visible]:outline-ring flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-sm has-[:focus-visible]:outline-2">
                  <Upload className="size-6" aria-hidden />
                  {busy === kind ? "Uploading…" : `Add ${kind} photo`}
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    className="sr-only"
                    disabled={!!busy}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = "";
                      if (f) void upload(kind, f);
                    }}
                  />
                </label>
              </li>
            )}
          </ul>
        </div>
      ))}
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
