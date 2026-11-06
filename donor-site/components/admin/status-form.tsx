"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { STATUSES, STATUS_LABELS, type Status } from "@/lib/admin/constants";
import { NativeSelect } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function StatusForm({ id, status }: { id: string; status: Status }) {
  const router = useRouter();
  const [value, setValue] = useState<Status>(status);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: value }),
    });
    setSaving(false);
    setMsg(res.ok ? "Saved" : "Could not save");
    if (res.ok) router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="w-56">
        <NativeSelect
          aria-label="Status"
          value={value}
          onChange={(e) => setValue(e.target.value as Status)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </NativeSelect>
      </div>
      <Button variant="primary" size="sm" onClick={save} disabled={saving || value === status}>
        {saving ? "Saving…" : "Update status"}
      </Button>
      {msg && (
        <span role="status" className="text-muted text-sm">
          {msg}
        </span>
      )}
    </div>
  );
}
