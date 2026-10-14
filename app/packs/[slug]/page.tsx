import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PACKS, getPack } from "@/lib/packs";
import { getUseCases } from "@/lib/data";
import { SITE_URL } from "@/lib/taxonomy";
import PageHead from "@/components/PageHead";
import ShareButtons from "@/components/ShareButtons";
export const revalidate = 3600;
export const generateStaticParams = () => PACKS.map((p) => ({ slug: p.slug }));
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPack(params.slug); if (!p) return {};
  return { title: `${p.name}: AI agents for ${p.who}`, description: `${p.line} ${p.intro}`, alternates: { canonical: `/packs/${p.slug}` }, openGraph: { title: p.name, description: p.line, url: `/packs/${p.slug}` } };
}
export default async function PackPage({ params }: { params: { slug: string } }) {
  const p = getPack(params.slug); if (!p) notFound();
  const all = await getUseCases(); const items = p.items.map((s) => all.find((u) => u.slug === s)).filter(Boolean) as typeof all;
  const url = `${SITE_URL}/packs/${p.slug}`;
  const ld = { "@context": "https://schema.org", "@type": "ItemList", name: p.name, itemListElement: items.map((u, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/use-case/${u.slug}`, name: u.title })) };
  return (<article className="mx-auto max-w-3xl pt-8 sm:pt-12">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <Link href="/packs" className="text-sm text-ink/55 hover:text-ink">← All packs</Link>
    <div className="mt-5"><PageHead eyebrow={`For ${p.who}`} title={p.name}><p>{p.line} {p.intro}</p></PageHead></div>
    <ol className="mt-8 divide-y divide-ink/10 border-y border-ink/10">{items.map((u, i) => (<li key={u.slug}>
      <Link href={`/use-case/${u.slug}`} className="group grid grid-cols-[2.5rem_1fr] gap-3 py-5">
        <span className="font-serif text-3xl font-semibold text-ink/25">{i + 1}</span>
        <span><span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-clay-700">{u.category}{u.slug === p.start ? " · Start here" : ""}</span>
          <span className="mt-1 block font-serif text-xl font-semibold leading-snug group-hover:underline group-hover:decoration-clay-500 group-hover:underline-offset-4">{u.title}</span>
          <span className="mt-1 block text-[15px] text-ink/70">{u.result}</span>
          <span className="mt-2 block text-xs text-ink/50">{u.difficulty} · {u.setup_time} · {u.monthly_cost}</span></span>
      </Link></li>))}</ol>
    <section className="mt-8 rounded-2xl border border-ink/10 bg-white p-5">
      <p className="font-serif text-xl font-semibold">Know someone who runs one of these?</p>
      <p className="mt-1 text-sm text-ink/60">Send them the pack. It's free and there's nothing to sign up for.</p>
      <div className="mt-3"><ShareButtons url={url} title={`${p.name}: the first AI agents to set up for ${p.who}`} text={`${p.name}: the first AI agents worth setting up for ${p.who}. Free, plain English.`} /></div>
    </section>
  </article>);
}
