"use client";
import { useState } from "react";
import { inputCls } from "@/components/Form";
export default function AuditButton({ code, requested }: { code: string; requested: boolean }) {
  const [done, setDone] = useState(requested); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  if (done) return <p className="mt-3 text-sm font-medium text-sage-600">Requested ✓ Your audit arrives by email (PDF or short video) within about two weeks. No call, promise.</p>;
  return (<form className="mt-3 space-y-2" onSubmit={async (e) => { e.preventDefault(); setBusy(true); setErr("");
      const r = await fetch("/api/audit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code, ...Object.fromEntries(new FormData(e.currentTarget)) }) });
      setBusy(false); if (r.ok) setDone(true); else setErr((await r.json().catch(() => null))?.error || "Something went wrong."); }}>
    <input name="business" required placeholder="Business name & what you do *" className={inputCls} />
    <input name="website" placeholder="Website (optional)" className={inputCls} />
    <input name="tools" placeholder="Tools you use (QuickBooks, Jobber, Gmail…)" className={inputCls} />
    <textarea name="headache" required rows={3} placeholder="Your biggest time sink right now *" className={inputCls} />
    <label className="flex items-center gap-2 text-sm text-ink/75">Deliver as <select name="format" className="rounded-lg border border-ink/15 bg-white px-2 py-1"><option>PDF</option><option>Video walkthrough</option></select></label>
    <button disabled={busy} className="btn">{busy ? "Requesting…" : "Request my free audit"}</button>
    {err && <p className="text-sm text-clay-700">{err}</p>}
  </form>);
}
