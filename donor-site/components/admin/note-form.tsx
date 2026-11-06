"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function NoteForm({ id }: { id: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
    setSaving(false);
    if (res.ok) {
      setNote("");
      setError(null);
      router.refresh();
    } else setError("Could not save note");
  };

  return (
    <form onSubmit={save} className="space-y-2">
      <label htmlFor="note" className="sr-only">
        Add internal note
      </label>
      <Textarea
        id="note"
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add an internal note…"
      />
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
      <Button type="submit" variant="primary" size="sm" disabled={saving || !note.trim()}>
        {saving ? "Saving…" : "Add note"}
      </Button>
    </form>
  );
}
