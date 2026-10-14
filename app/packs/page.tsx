import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "@/components/PageHead";
import { PACKS } from "@/lib/packs";
export const metadata: Metadata = { title: "Industry packs", description: "Curated starter packs of AI agent use cases by industry: the first five things we'd set up for your kind of business.", alternates: { canonical: "/packs" } };
export default function Packs() {
  return (<article className="pt-8 sm:pt-12">
    <PageHead eyebrow="Industry packs" title="Start with the five that matter for you"><p>Curated, in order. The first agents we'd set up for your kind of business, and nothing you'll abandon in two weeks.</p></PageHead>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{PACKS.map((p) => (
      <Link key={p.slug} href={`/packs/${p.slug}`} className="group flex flex-col rounded-2xl border border-ink/10 bg-white p-5 transition hover:border-ink/30" data-testid="pack-card">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-clay-700">{p.items.length} use cases</p>
        <h2 className="mt-2 font-serif text-2xl font-semibold leading-snug">{p.name}</h2>
        <p className="mt-1 text-sm text-ink/70">For {p.who}</p>
        <p className="mt-3 text-[15px] text-ink/75">{p.line}</p>
        <span className="mt-auto pt-4 text-sm font-medium text-ink group-hover:underline group-hover:decoration-clay-500 group-hover:underline-offset-4">Open the pack →</span>
      </Link>))}</div>
  </article>);
}
