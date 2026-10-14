"use client";
import { useState } from "react";
export default function ShareLink({ link, text }: { link: string; text: string }) {
  const [c, setC] = useState(false);
  const enc = encodeURIComponent; const btn = "rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm hover:border-ink/30";
  return (<div>
    <div className="flex gap-2"><input readOnly value={link} className="min-w-0 flex-1 rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm" onFocus={(e) => e.target.select()} aria-label="Link" />
      <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream" onClick={() => { navigator.clipboard?.writeText(link); setC(true); setTimeout(() => setC(false), 1500); }}>{c ? "Copied ✓" : "Copy"}</button></div>
    <div className="mt-2 flex flex-wrap gap-2">
      <a className={btn} target="_blank" rel="noopener" href={`https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(link)}`}>Post on X</a>
      <a className={btn} target="_blank" rel="noopener" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(link)}`}>LinkedIn</a>
      <a className={btn} target="_blank" rel="noopener" href={`https://www.facebook.com/sharer/sharer.php?u=${enc(link)}`}>Facebook</a>
      <a className={btn} href={`mailto:?subject=${enc(text)}&body=${enc(text + "\n\n" + link)}`}>Email</a>
      <a className={btn} href={`sms:?&body=${enc(text + " " + link)}`}>Text</a>
    </div>
  </div>);
}
