"use client";
import { useState } from "react";
import Link from "next/link";
import { find, type Slim } from "@/lib/finder";
const EXAMPLES = ["We're a 6-person HVAC company. Leads come in while we're on jobs and invoices go out late.", "Two-location dental office, front desk is swamped with recalls and reviews.", "Small Shopify store, 300 products, I write every description myself.", "Marketing agency of 12. Client status reports and meeting notes eat our Fridays."];
export default function Finder({ all }: { all: Slim[] }) {
  const [text, setText] = useState(""); const [res, setRes] = useState<ReturnType<typeof find> | null>(null);
  const run = (t: string) => { setText(t); setRes(t.trim().length > 8 ? find(t, all) : null); };
  return (<div className="mt-8">
    <form onSubmit={(e) => { e.preventDefault(); run(text); }}>
      <label htmlFor="biz" className="sr-only">Describe your business</label>
      <textarea id="biz" value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="e.g. We're a 6-person plumbing company. Missed calls and late invoices are killing us."
        className="w-full rounded-2xl border border-ink/15 bg-white px-5 py-4 text-[17px] leading-relaxed outline-none focus:border-ink/50 focus:ring-2 focus:ring-clay-100" />
      <div className="mt-3 flex flex-wrap items-center gap-3"><button className="btn" data-testid="finder-go">Find my 5 agents</button><span className="text-sm text-ink/50">No signup. Nothing is stored.</span></div>
    </form>
    {!res && <div className="mt-6"><p className="text-sm text-ink/55">Or try one:</p><div className="mt-2 flex flex-col gap-2">{EXAMPLES.map((x) => <button key={x} onClick={() => run(x)} className="text-left text-[15px] text-ink/75 underline decoration-ink/20 underline-offset-4 hover:text-ink">“{x}”</button>)}</div></div>}
    {res && <section className="mt-10" aria-live="polite" data-testid="finder-results">
      <p className="text-sm text-ink/55">{res.matched.industries.length || res.matched.categories.length ? <>Matched on: {[...res.matched.industries, ...res.matched.categories, ...res.matched.tools].join(" · ")}</> : "We couldn't place you exactly, so here are the five that help almost everyone."}</p>
      <ol className="mt-3 divide-y divide-ink/10 border-y border-ink/10">{res.picks.map((u, i) => (<li key={u.slug}><Link href={`/use-case/${u.slug}`} className="group grid grid-cols-[2.5rem_1fr] gap-3 py-5">
        <span className="font-serif text-3xl font-semibold text-ink/25">{i + 1}</span>
        <span><span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-clay-700">{u.category}</span>
          <span className="mt-1 block font-serif text-xl font-semibold leading-snug group-hover:underline group-hover:decoration-clay-500 group-hover:underline-offset-4">{u.title}</span>
          <span className="mt-1 block text-[15px] text-ink/70">{u.result}</span><span className="mt-2 block text-xs text-ink/50">{u.difficulty} · {u.setup_time} · {u.monthly_cost}</span></span></Link></li>))}</ol>
      <p className="mt-6 text-sm text-ink/60">Want a deeper read with a score? <Link className="underline" href="/quiz">Take the 3-minute quiz</Link>. Or browse <Link className="underline" href="/packs">industry packs</Link>.</p>
    </section>}
  </div>);
}
