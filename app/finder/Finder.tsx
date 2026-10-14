"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function FinderForm({ initial = "" }: { initial?: string }) {
  const [text, setText] = useState(initial); const [busy, setBusy] = useState(false); const router = useRouter();
  const tooShort = text.trim().length < 12;
  return (<form className="mt-8" onSubmit={(e) => { e.preventDefault(); if (tooShort) return; setBusy(true); router.push(`/finder?q=${encodeURIComponent(text.trim().slice(0, 280))}#results`); setTimeout(() => setBusy(false), 800); }}>
    <label htmlFor="biz" className="mb-2 block text-sm font-medium text-ink/70">Describe your business in a sentence or two</label>
    <textarea id="biz" name="q" value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={280} placeholder="e.g. We're a 6-person plumbing company. Missed calls and late invoices are killing us."
      className="w-full rounded-2xl border border-ink/15 bg-white px-5 py-4 text-[17px] leading-relaxed outline-none focus:border-ink/50 focus:ring-2 focus:ring-clay-100" />
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <button className="btn" disabled={busy || tooShort} data-testid="finder-go">{busy ? "Finding…" : "Find my 5 agents"}</button>
      <span className="text-sm text-ink/55">{tooShort && text ? "A little more detail, please. What do you do, and what's annoying you?" : "No signup. Nothing stored. The link is shareable."}</span>
    </div>
  </form>);
}
