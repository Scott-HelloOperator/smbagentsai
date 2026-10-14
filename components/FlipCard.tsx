"use client";
import Link from "next/link";
import { useState } from "react";
import type { UseCase } from "@/lib/data";
import CopyButton from "./CopyButton";

const diffColor: Record<string, string> = { "No-code": "bg-sage-500", "Light setup": "bg-amber-400", "Needs help": "bg-clay-500" };

export default function FlipCard({ u }: { u: UseCase }) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped((f) => !f);
  return (
    <div className={`flip h-[340px] ${flipped ? "is-flipped" : ""}`} data-testid="flip-card">
      <div className="flip-inner">
        <div role="button" tabIndex={0} aria-label={`${u.title} — show prompt and steps`} onClick={toggle} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle())}
          className="face flex cursor-pointer flex-col rounded-2xl border border-ink/10 bg-white p-5 transition hover:border-ink/25" aria-hidden={flipped}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-clay-700">{u.category}</p>
          <h3 className="mt-2 font-serif text-xl font-semibold leading-snug">{u.title}</h3>
          <p className="mt-3 text-[15px] text-ink/75">{u.result}</p>
          <div className="mt-auto">
            <div className="flex flex-wrap gap-1.5">{u.tools.slice(0, 4).map((t) => <span key={t} className="badge">{t}</span>)}</div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 font-medium text-ink/70"><span className={`h-1.5 w-1.5 rounded-full ${diffColor[u.difficulty]}`} />{u.difficulty}</span>
              <span className="text-ink/50">Tap to flip ↻</span>
            </div>
          </div>
        </div>
        <div className="face face-back flex flex-col rounded-2xl border border-ink/10 bg-[#F6F1E8] p-5" aria-hidden={!flipped}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-clay-700">Copy-paste prompt</p>
            <button onClick={toggle} className="text-xs text-ink/60 hover:text-ink" aria-label="Flip back">↺ Back</button>
          </div>
          <p className="mt-2 max-h-24 overflow-y-auto rounded-lg bg-white p-2.5 text-[13px] leading-snug text-ink/80">{u.prompt}</p>
          <CopyButton text={u.prompt} className="mt-2 self-start" />
          <ol className="mt-3 list-decimal space-y-0.5 pl-5 text-[13px] text-ink/75">{u.steps.slice(0, 3).map((s) => <li key={s}>{s}</li>)}</ol>
          <div className="mt-auto flex items-end justify-between pt-2">
            <Link href={`/use-case/${u.slug}`} className="text-sm font-medium text-clay-700 underline underline-offset-2">Full guide →</Link>
            <Link href="/help-me" className="text-[11px] text-ink/40 hover:text-ink/70">Want us to set it up?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
