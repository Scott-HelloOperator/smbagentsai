"use client";
import { useMemo, useState } from "react";
import type { UseCase } from "@/lib/data";
import { CATEGORIES, INDUSTRIES, TOOLS, DIFFICULTIES } from "@/lib/taxonomy";
import FlipCard from "./FlipCard";

const impactRank: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
const diffRank: Record<string, number> = { "No-code": 0, "Light setup": 1, "Needs help": 2 };

export default function Directory({ items, initial = {} }: { items: UseCase[]; initial?: { category?: string; tool?: string; industry?: string } }) {
  const [q, setQ] = useState(""); const [cat, setCat] = useState(initial.category || "");
  const [tool, setTool] = useState(initial.tool || ""); const [ind, setInd] = useState(initial.industry || "");
  const [diff, setDiff] = useState(""); const [sort, setSort] = useState("newest");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const r = items.filter((u) => (!cat || u.category === cat) && (!tool || u.tools.includes(tool)) && (!ind || u.industries.includes(ind)) && (!diff || u.difficulty === diff)
      && (!s || [u.title, u.result, u.summary, u.category, u.agent, ...u.tools, ...u.industries].join(" ").toLowerCase().includes(s)));
    return [...r].sort((a, b) => sort === "easiest" ? diffRank[a.difficulty] - diffRank[b.difficulty] : sort === "impact" ? (impactRank[a.impact] ?? 3) - (impactRank[b.impact] ?? 3) : sort === "az" ? a.title.localeCompare(b.title) : b.published_at.localeCompare(a.published_at));
  }, [items, q, cat, tool, ind, diff, sort]);
  const sel = "w-full rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-sm";
  return (
    <section>
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="What's eating your week? Try “invoices” or “reviews”"
        className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3.5 text-base shadow-sm outline-none focus:border-clay-500 focus:ring-2 focus:ring-clay-100" aria-label="Search use cases" />
      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:flex-wrap" role="list">
        {["", ...CATEGORIES].map((c) => (
          <button key={c || "all"} onClick={() => setCat(c)} className={`chip ${cat === c ? "!border-clay-600 !bg-clay-600 text-white" : "hover:border-ink/30"}`}>{c || "All"}</button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <select aria-label="Tool" className={sel} value={tool} onChange={(e) => setTool(e.target.value)}><option value="">Any tool</option>{TOOLS.map((t) => <option key={t}>{t}</option>)}</select>
        <select aria-label="Industry" className={sel} value={ind} onChange={(e) => setInd(e.target.value)}><option value="">Any industry</option>{INDUSTRIES.map((t) => <option key={t}>{t}</option>)}</select>
        <select aria-label="Difficulty" className={sel} value={diff} onChange={(e) => setDiff(e.target.value)}><option value="">Any difficulty</option>{DIFFICULTIES.map((t) => <option key={t}>{t}</option>)}</select>
        <select aria-label="Sort" className={sel} value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option><option value="easiest">Easiest first</option><option value="impact">Biggest impact</option><option value="az">A–Z</option>
        </select>
      </div>
      <p className="mt-4 text-sm text-ink/60" aria-live="polite">{list.length} use case{list.length === 1 ? "" : "s"}</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((u) => <FlipCard key={u.slug} u={u} />)}</div>
      {!list.length && <p className="mt-8 rounded-xl bg-white p-6 text-center text-ink/60">Nothing matches yet. Try clearing a filter — or <a href="/submit" className="underline">tell us what you need</a>.</p>}
    </section>
  );
}
