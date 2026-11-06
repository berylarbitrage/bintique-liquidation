"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** "Delete all applicant data" with a typed confirmation dialog. */
export function DeleteApplicantButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    const res = await fetch(`/api/admin/applications/${id}?confirm=DELETE`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      dialog.current?.close();
      router.push("/admin");
      router.refresh();
    } else {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setError(j.error ?? "Delete failed");
    }
  };

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => dialog.current?.showModal()}>
        Delete all applicant data
      </Button>
      <dialog
        ref={dialog}
        className="bg-card text-foreground m-auto w-[min(32rem,calc(100vw-2rem))] rounded-2xl p-6 backdrop:bg-black/50"
        aria-labelledby="delete-title"
      >
        <h2 id="delete-title" className="text-xl font-semibold">
          Delete all data for {name}?
        </h2>
        <p className="text-muted mt-3 text-sm">
          This permanently deletes every application from this email address, the full application,
          all photos in storage, internal notes, and their login account. This cannot be undone.
        </p>
        <label htmlFor="confirm-delete" className="mt-4 block text-sm font-medium">
          Type <strong>DELETE</strong> to confirm
        </label>
        <Input
          id="confirm-delete"
          className="mt-1"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
        />
        {error && (
          <p role="alert" className="text-destructive mt-2 text-sm">
            {error}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => dialog.current?.close()}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={typed !== "DELETE" || busy}
            onClick={run}
          >
            {busy ? "Deleting…" : "Delete permanently"}
          </Button>
        </div>
      </dialog>
    </>
  );
}
