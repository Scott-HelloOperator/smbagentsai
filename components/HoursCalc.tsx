"use client";
import { useState } from "react";
import type { Calc } from "@/lib/calc";
export default function HoursCalc({ c }: { c: Calc }) {
  const [qty, setQty] = useState(c.qty), [mins, setMins] = useState(c.minutes), [rate, setRate] = useState(50);
  const perMonth = c.per === "week" ? qty * 4.33 : qty;
  const hours = (perMonth * mins * c.share) / 60, value = hours * rate;
  const n = (x: number) => (x >= 10 ? Math.round(x).toLocaleString() : x.toFixed(1));
  const box = "w-20 rounded-lg border border-ink/15 bg-white px-2 py-1 text-right tabular-nums";
  return (<section className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6" data-testid="hours-calc" aria-labelledby="calc-h">
    <p className="eyebrow">Back-of-napkin math</p>
    <h2 id="calc-h" className="mt-2 font-serif text-2xl font-semibold">How much time would this give you back?</h2>
    <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="space-y-4 text-[15px]">
        <label className="block"><span className="flex items-center justify-between gap-3"><span>{c.unit[0].toUpperCase() + c.unit.slice(1)} per {c.per}</span><input type="number" min={0} max={c.max} value={qty} onChange={(e) => setQty(Math.max(0, Math.min(c.max, Number(e.target.value) || 0)))} className={box} aria-label={`${c.unit} per ${c.per}`} /></span>
          <input type="range" min={0} max={c.max} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="mt-2 w-full accent-[#2B2420]" aria-hidden tabIndex={-1} /></label>
        <label className="flex items-center justify-between gap-3"><span>Minutes each, by hand</span><input type="number" min={0} step={0.5} value={mins} onChange={(e) => setMins(Math.max(0, Number(e.target.value) || 0))} className={box} /></label>
        <label className="flex items-center justify-between gap-3"><span>What an hour of your time is worth ($)</span><input type="number" min={0} value={rate} onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))} className={box} /></label>
      </div>
      <div className="rounded-2xl bg-cream p-5 text-center sm:w-56">
        <p className="font-serif text-5xl font-semibold tabular-nums" data-testid="calc-hours">{n(hours)}</p>
        <p className="text-sm text-ink/60">hours back per month</p>
        <p className="mt-3 border-t border-ink/10 pt-3 text-sm"><b className="tabular-nums">${n(value)}</b>/mo of your time</p>
      </div>
    </div>
    <p className="mt-4 text-xs leading-relaxed text-ink/55">Assumes the setup removes about {Math.round(c.share * 100)}% of the manual time. {c.note} Your numbers, your call. The robot refuses to promise anything.</p>
  </section>);
}
