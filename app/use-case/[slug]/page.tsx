import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getUseCase, getUseCases } from "@/lib/data";
import { slugify, SITE_URL } from "@/lib/taxonomy";
import { CALC } from "@/lib/calc";
import { PACKS } from "@/lib/packs";
import CopyButton from "@/components/CopyButton";
import HoursCalc from "@/components/HoursCalc";
import ShareButtons from "@/components/ShareButtons";
import ForwardButton from "@/components/ForwardButton";
import { Jack } from "@/components/Logo";
export const revalidate = 3600;
export async function generateStaticParams() { return (await getUseCases()).map((u) => ({ slug: u.slug })); }
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const u = await getUseCase(params.slug); if (!u) return {};
  return { title: u.title, description: `${u.result}. ${u.summary}`.slice(0, 300), alternates: { canonical: `/use-case/${u.slug}` },
    openGraph: { title: u.title, description: u.result, type: "article", url: `/use-case/${u.slug}`, publishedTime: u.published_at }, twitter: { card: "summary_large_image", title: u.title, description: u.result } };
}
const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="font-serif text-[1.6rem] font-semibold leading-tight tracking-[-0.01em]">{children}</h2>;
export default async function Page({ params }: { params: { slug: string } }) {
  const u = await getUseCase(params.slug); if (!u) notFound();
  const all = await getUseCases();
  const related = all.filter((x) => x.slug !== u.slug && (x.category === u.category || x.industries.some((i) => u.industries.includes(i)))).sort((a, b) => Number(b.category === u.category) - Number(a.category === u.category)).slice(0, 3);
  const packs = PACKS.filter((p) => p.items.includes(u.slug));
  const url = `${SITE_URL}/use-case/${u.slug}`; const calc = CALC[u.slug];
  const jsonLd = [{ "@context": "https://schema.org", "@type": "HowTo", name: u.title, description: u.summary, datePublished: u.published_at, url,
    tool: u.tools.map((t) => ({ "@type": "HowToTool", name: t })), step: u.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })),
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: u.monthly_cost } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Use cases", item: SITE_URL }, { "@type": "ListItem", position: 2, name: u.category, item: `${SITE_URL}/category/${slugify(u.category)}` }, { "@type": "ListItem", position: 3, name: u.title, item: url }] }];
  return (
    <article className="mx-auto max-w-[720px] pt-6 sm:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-ink/70"><Link href="/" className="hover:text-ink">Use cases</Link><span aria-hidden>/</span><Link href={`/category/${slugify(u.category)}`} className="hover:text-ink">{u.category}</Link></nav>
      <p className="eyebrow mt-6"><Jack size={7} /> {u.category}</p>
      <h1 className="mt-3 font-serif text-[2.2rem] font-semibold leading-[1.06] tracking-[-0.02em] sm:text-[3.25rem]">{u.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink/75 sm:text-xl">{u.result}</p>
      {u.is_example && <p className="mt-4 border-l-2 border-clay-500 pl-3 text-sm text-ink/70">Illustrative example: a composite of common setups, not a specific business's story.</p>}
      <dl className="mt-8 grid grid-cols-2 border-y border-ink/15 sm:grid-cols-4">
        {[["Difficulty", u.difficulty], ["Setup time", u.setup_time], ["Monthly cost", u.monthly_cost], ["Impact", u.impact]].map(([k, v], i) => (
          <div key={k} className={`py-4 ${i % 2 ? "pl-4" : "pr-4"} sm:px-4 sm:first:pl-0 ${i ? "sm:border-l sm:border-ink/10" : ""} ${i > 1 ? "border-t border-ink/10 sm:border-t-0" : ""}`}><dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/70">{k}</dt><dd className="mt-1 font-medium">{v}</dd></div>))}
      </dl>
      <div className="mt-4 flex flex-wrap gap-1.5">{u.tools.map((t) => <Link key={t} href={`/tool/${slugify(t)}`} className="badge hover:bg-ink/10">{t}</Link>)}
        {u.industries.map((t) => <Link key={t} href={`/industry/${slugify(t)}`} className="chip !py-0.5 text-xs hover:border-ink/30">{t}</Link>)}</div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><ShareButtons url={url} title={u.title} text={`${u.title}: ${u.result}. Free guide with a copy-paste prompt:`} compact />
        <ForwardButton title={u.title} url={url} category={u.category} className="text-sm font-medium text-ink/70 underline decoration-clay-500 underline-offset-4 hover:text-ink" /></div>

      <div className="mt-10 space-y-10 text-[17px] leading-relaxed text-ink/85">
        <section><H2>The short version</H2><p className="mt-3">{u.summary}</p></section>
        <section className="border-t border-ink/10 pt-10"><H2>What they did</H2><p className="mt-3">{u.what_they_did}</p><p className="mt-2 text-sm text-ink/70">Agent/tool used: {u.agent}</p></section>
        <section className="border-t border-ink/10 pt-10"><H2>How it went</H2><p className="mt-3">{u.how_it_went}</p></section>
        <section className="border-l-2 border-clay-500 pl-5"><p className="eyebrow !text-clay-700">Worth knowing</p><p className="mt-2">{u.worth_knowing}</p></section>
        <section className="rounded-2xl border border-ink/10 bg-[#F4EDE2] p-5 sm:p-6" id="prompt">
          <div className="flex items-center justify-between gap-3"><H2>Copy-paste prompt</H2><CopyButton text={u.prompt} /></div>
          <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-ink/10 bg-white p-4 font-mono text-[14px] leading-relaxed text-ink/85">{u.prompt}</pre>
          <p className="mt-2 text-xs text-ink/70">Replace anything in [brackets] with your own details.</p>
        </section>
        <section><H2>Step-by-step setup</H2><ol className="mt-4 space-y-3">{u.steps.map((s, i) => <li key={s} className="grid grid-cols-[2rem_1fr] gap-2"><span className="font-serif text-xl font-semibold text-ink/30">{i + 1}</span><span>{s}</span></li>)}</ol></section>
        {calc && <HoursCalc c={calc} />}
        {u.video_url && <section><H2>Video walkthrough</H2><a className="underline" href={u.video_url}>Watch</a></section>}
        {u.source_url && <p className="text-sm text-ink/70">Source: <a className="underline" href={u.source_url} rel="nofollow noopener">{u.source_url}</a></p>}
      </div>

      <aside className="mt-12 grid gap-4 border-y border-ink/15 py-6 sm:grid-cols-2">
        <div><p className="font-serif text-xl font-semibold">Did this work for you?</p><p className="mt-1 text-sm text-ink/70">Post your win and get credit with a link to your business.</p><Link href="/wins" className="mt-2 inline-block text-sm font-medium underline decoration-clay-500 underline-offset-4">Share a win →</Link></div>
        <div><p className="font-serif text-xl font-semibold">Rather not DIY?</p><p className="mt-1 text-sm text-ink/70">Tell us what you need and we'll point you to someone who sets it up.</p><Link href="/help-me" className="mt-2 inline-block text-sm font-medium underline decoration-clay-500 underline-offset-4">Get help →</Link></div>
      </aside>
      {packs.length > 0 && <p className="mt-6 text-sm text-ink/70">Part of {packs.map((p, i) => <span key={p.slug}>{i ? ", " : ""}<Link className="underline" href={`/packs/${p.slug}`}>{p.name}</Link></span>)}.</p>}
      {related.length > 0 && <section className="mt-10"><p className="eyebrow">Keep going</p><div className="mt-3 grid gap-3 sm:grid-cols-3">{related.map((r) => (
        <Link key={r.slug} href={`/use-case/${r.slug}`} className="rounded-2xl border border-ink/10 bg-white p-4 transition hover:border-ink/30"><p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-clay-700">{r.category}</p><p className="mt-1.5 font-serif text-[17px] font-semibold leading-snug">{r.title}</p></Link>))}</div></section>}
      <p className="mt-10 text-xs text-ink/70">Published {u.published_at}.</p>
    </article>
  );
}
