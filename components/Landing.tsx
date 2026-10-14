import Link from "next/link";
import type { UseCase } from "@/lib/data";
import { facts, faq } from "@/lib/landing";
import { slugify, SITE_URL } from "@/lib/taxonomy";
import { PACKS } from "@/lib/packs";
import { Jack } from "./Logo";
import Switchboard from "./Switchboard";
type Kind = "problem" | "industry" | "tool";
export default function Landing({ kind, name, h1, intro, items, path }: { kind: Kind; name: string; h1: string; intro: string; items: UseCase[]; path: string }) {
  const f = facts(items), qa = faq(name, f, kind);
  const ld: object[] = [
    { "@context": "https://schema.org", "@type": "CollectionPage", name: h1, description: intro, url: `${SITE_URL}${path}`,
      mainEntity: { "@type": "ItemList", numberOfItems: f.n, itemListElement: f.sorted.map((u, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/use-case/${u.slug}`, name: u.title })) } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Use cases", item: SITE_URL }, { "@type": "ListItem", position: 2, name, item: `${SITE_URL}${path}` }] },
  ];
  if (qa.length) ld.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: qa.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })) });
  const cross = kind === "tool" ? f.categories.map(([c]) => ({ href: `/category/${slugify(c)}`, label: c })) : kind === "problem" ? f.industries.map(([c]) => ({ href: `/industry/${slugify(c)}`, label: c })) : f.categories.map(([c]) => ({ href: `/category/${slugify(c)}`, label: c }));
  const packs = kind === "industry" ? PACKS.filter((p) => p.items.filter((s) => items.some((u) => u.slug === s)).length >= 3) : [];
  return (<article className="pt-6 sm:pt-10">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <nav aria-label="Breadcrumb" className="text-sm text-ink/55"><Link href="/" className="hover:text-ink">Use cases</Link> <span aria-hidden>/</span> {kind === "problem" ? "Problems" : kind === "industry" ? "Industries" : "Tools"}</nav>
    <p className="eyebrow mt-6"><Jack size={7} /> {kind === "problem" ? "Problem" : kind === "industry" ? "Industry" : "Tool"} · {f.n} use case{f.n === 1 ? "" : "s"}</p>
    <h1 className="mt-3 max-w-4xl font-serif text-[2.2rem] font-semibold leading-[1.06] tracking-[-0.02em] sm:text-[3.25rem]">{h1}</h1>
    <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/70">{intro}</p>
    {f.n > 0 ? <>
      <dl className="mt-8 grid grid-cols-2 border-y border-ink/15 sm:grid-cols-4">
        {[["Use cases", String(f.n)], ["High impact", String(f.high)], ["Quickest setup", f.quickest.setup_time], ["Start with", f.start.difficulty]].map(([k, v], i) => (
          <div key={k} className={`py-4 ${i % 2 ? "pl-4" : "pr-4"} sm:px-4 sm:first:pl-0 ${i ? "sm:border-l sm:border-ink/10" : ""} ${i > 1 ? "border-t border-ink/10 sm:border-t-0" : ""}`}><dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">{k}</dt><dd className="mt-1 font-medium">{v}</dd></div>))}
      </dl>
      <ol className="mt-8 divide-y divide-ink/10 border-b border-ink/10">{f.sorted.map((u, i) => (<li key={u.slug}><Link href={`/use-case/${u.slug}`} className="group grid grid-cols-[2.5rem_1fr] gap-3 py-5 sm:grid-cols-[2.5rem_1fr_14rem]">
        <span className="font-serif text-3xl font-semibold text-ink/25" aria-hidden>{i + 1}</span>
        <span><span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-clay-700">{u.category}{i === 0 ? " · Start here" : ""}</span>
          <span className="mt-1 block font-serif text-xl font-semibold leading-snug group-hover:underline group-hover:decoration-clay-500 group-hover:underline-offset-4">{u.title}</span>
          <span className="mt-1 block text-[15px] text-ink/70">{u.result}</span></span>
        <span className="col-start-2 text-xs leading-relaxed text-ink/55 sm:col-start-3 sm:text-right">{u.difficulty} · {u.setup_time}<br className="hidden sm:block" /> {u.monthly_cost}<br className="hidden sm:block" /> <span className="text-ink/45">{u.tools.slice(0, 3).join(", ")}</span></span>
      </Link></li>))}</ol>
      {qa.length > 0 && <section className="mt-12 max-w-3xl" aria-labelledby="faq"><h2 id="faq" className="font-serif text-2xl font-semibold">Quick answers</h2>
        <dl className="mt-4 space-y-5">{qa.map((x) => <div key={x.q}><dt className="font-semibold">{x.q}</dt><dd className="mt-1 text-[16px] leading-relaxed text-ink/75">{x.a}</dd></div>)}</dl></section>}
    </> : <p className="mt-8 rounded-2xl border border-dashed border-ink/20 p-6 text-ink/65">No vetted use cases here yet. The robot refuses to pad this page with fluff. <Link className="underline" href="/submit">Know one that works?</Link></p>}
    {(cross.length > 0 || packs.length > 0) && <section className="mt-12 grid gap-8 border-t border-ink/10 pt-8 sm:grid-cols-2">
      {cross.length > 0 && <div><p className="eyebrow">{kind === "problem" ? "Industries using these" : "Problems these solve"}</p><div className="mt-3 flex flex-wrap gap-2">{cross.map((c) => <Link key={c.href} href={c.href} className="chip hover:border-ink/30">{c.label}</Link>)}</div></div>}
      {kind !== "tool" && f.tools.length > 0 && <div><p className="eyebrow">Tools involved</p><div className="mt-3 flex flex-wrap gap-2">{f.tools.slice(0, 10).map(([t]) => <Link key={t} href={`/tool/${slugify(t)}`} className="chip hover:border-ink/30">{t}</Link>)}</div></div>}
      {packs.length > 0 && <div><p className="eyebrow">Curated packs</p><div className="mt-3 flex flex-wrap gap-2">{packs.map((p) => <Link key={p.slug} href={`/packs/${p.slug}`} className="chip hover:border-ink/30">{p.name}</Link>)}</div></div>}
    </section>}
    <p className="mt-8 text-sm text-ink/60">Not sure where you fit? <Link className="underline" href="/finder">Describe your business</Link> and get your top five. Or browse <Link className="underline" href="/">all use cases</Link>.</p>
    <Switchboard />
  </article>);
}
