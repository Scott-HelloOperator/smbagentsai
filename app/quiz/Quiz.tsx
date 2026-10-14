"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, type Answers } from "@/lib/quiz";
import { getRef } from "@/components/RefCapture";

export default function Quiz() {
  const router = useRouter();
  const [step, setStep] = useState(-1);
  const [a, setA] = useState<Partial<Answers>>({ tools: [], sinks: [] });
  const [busy, setBusy] = useState(false);
  if (step === -1) return (
    <section className="mx-auto max-w-xl pt-12 text-center">
      <p className="text-sm font-medium text-clay-700">The SMB Agents AI Readiness Quiz</p>
      <h1 className="mt-2 font-serif text-4xl font-bold leading-tight">How ready is your business for AI agents?</h1>
      <p className="mt-4 text-lg text-ink/70">9 quick tap questions · about 3 minutes. Get your score out of 100 and a personal plan: the top 5 agents worth trying first.</p>
      <button onClick={() => setStep(0)} className="btn mt-8 px-8 py-4 text-lg">Start the quiz →</button>
      <p className="mt-3 text-xs text-ink/70">Free. No email needed to see your score.</p>
    </section>);
  const q = QUESTIONS[step]; const multi = q.multi; const cur = a[q.id];
  const pick = async (v: string) => {
    if (multi) {
      const arr = (cur as string[]) || [];
      let next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
      if (v === "none") next = next.includes("none") ? ["none"] : []; else next = next.filter((x) => x !== "none");
      if (next.length > multi) return;
      setA({ ...a, [q.id]: next }); return;
    }
    const na = { ...a, [q.id]: v }; setA(na);
    setTimeout(() => advance(na), 180);
  };
  const advance = async (na: Partial<Answers>) => {
    if (step < QUESTIONS.length - 1) return setStep(step + 1);
    setBusy(true);
    const r = await fetch("/api/quiz", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ answers: na, ref: getRef() }) });
    const d = await r.json(); router.push(`/quiz/result/${d.id}?new=1`);
  };
  const sel = (v: string) => (multi ? ((cur as string[]) || []).includes(v) : cur === v);
  return (
    <section className="mx-auto max-w-xl pt-8">
      <div className="flex items-center justify-between text-sm text-ink/70">
        <button onClick={() => setStep(step - 1)} className="hover:text-ink">← Back</button><span>{step + 1} of {QUESTIONS.length}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/5"><div className="h-full rounded-full bg-clay-500 transition-all" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} /></div>
      <h2 className="mt-8 font-serif text-2xl font-semibold sm:text-3xl">{q.q}</h2>
      {q.hint && <p className="mt-1 text-sm text-ink/70">{q.hint}</p>}
      <div className="mt-5 grid gap-2">
        {q.opts.map((o) => (
          <button key={o.v} onClick={() => pick(o.v)} aria-pressed={sel(o.v)}
            className={`rounded-2xl border px-4 py-3.5 text-left text-[16px] transition ${sel(o.v) ? "border-clay-600 bg-clay-50 font-medium" : "border-ink/10 bg-white hover:border-ink/30"}`}>
            {multi && <span className={`mr-2 inline-block h-4 w-4 rounded border align-[-2px] ${sel(o.v) ? "border-ink bg-ink" : "border-ink/30"}`} />}{o.label}
          </button>))}
      </div>
      {multi && <button disabled={!((cur as string[]) || []).length || busy} onClick={() => advance(a)}
        className="mt-5 w-full btn w-full !py-3.5 disabled:opacity-40">{busy ? "Scoring…" : step === QUESTIONS.length - 1 ? "See my score" : "Next →"}</button>}
      {busy && !multi && <p className="mt-4 text-center text-ink/70">Scoring…</p>}
    </section>);
}
