"use client";
import { useState } from "react";
export default function AuditButton({ code, requested }: { code: string; requested: boolean }) {
  const [done, setDone] = useState(requested); const [notes, setNotes] = useState(""); const [busy, setBusy] = useState(false);
  if (done) return <p className="mt-3 text-sm font-medium text-sage-600">Requested ✓ — your audit will arrive by email.</p>;
  return (<form className="mt-3 space-y-2" onSubmit={async (e) => { e.preventDefault(); setBusy(true);
      const r = await fetch("/api/audit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code, notes }) }); setBusy(false); if (r.ok) setDone(true); }}>
    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Anything we should know? (business, tools, biggest headache)" className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm" />
    <button disabled={busy} className="rounded-xl bg-clay-600 px-4 py-2 text-sm font-medium text-white">{busy ? "Requesting…" : "Request my free audit"}</button>
  </form>);
}
