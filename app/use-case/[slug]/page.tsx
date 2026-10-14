import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getUseCase, getUseCases } from "@/lib/data";
import { slugify, SITE_URL } from "@/lib/taxonomy";
import CopyButton from "@/components/CopyButton";
export const revalidate = 3600;
export async function generateStaticParams() { return (await getUseCases()).map((u) => ({ slug: u.slug })); }
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const u = await getUseCase(params.slug); if (!u) return {};
  return { title: u.title, description: `${u.result}. ${u.summary}`, alternates: { canonical: `/use-case/${u.slug}` },
    openGraph: { title: u.title, description: u.result, type: "article", url: `/use-case/${u.slug}`, publishedTime: u.published_at } };
}
const Fact = ({ k, v }: { k: string; v: string }) => <div className="rounded-xl bg-white p-3"><dt className="text-xs text-ink/50">{k}</dt><dd className="mt-0.5 text-sm font-medium">{v}</dd></div>;
export default async function Page({ params }: { params: { slug: string } }) {
  const u = await getUseCase(params.slug); if (!u) notFound();
  const jsonLd = { "@context": "https://schema.org", "@type": "HowTo", name: u.title, description: u.summary, datePublished: u.published_at,
    url: `${SITE_URL}/use-case/${u.slug}`, totalTime: undefined, tool: u.tools.map((t) => ({ "@type": "HowToTool", name: t })),
    step: u.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })) };
  return (
    <article className="mx-auto max-w-3xl pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/" className="text-sm text-ink/60">← All use cases</Link>
      <Link href={`/category/${slugify(u.category)}`} className="mt-4 block text-sm font-medium text-clay-600">{u.category}</Link>
      <h1 className="mt-1 font-serif text-3xl font-bold leading-tight sm:text-4xl">{u.title}</h1>
      <p className="mt-3 text-lg text-ink/75">{u.result}</p>
      {u.is_example && <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">Illustrative example — a composite of common setups, not a specific business's story.</p>}
      <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Fact k="Difficulty" v={u.difficulty} /><Fact k="Setup time" v={u.setup_time} /><Fact k="Monthly cost" v={u.monthly_cost} /><Fact k="Impact" v={u.impact} />
      </dl>
      <div className="mt-4 flex flex-wrap gap-1.5">{u.tools.map((t) => <Link key={t} href={`/tool/${slugify(t)}`} className="badge hover:bg-clay-100">{t}</Link>)}
        {u.industries.map((t) => <Link key={t} href={`/industry/${slugify(t)}`} className="chip !py-0.5 text-xs">{t}</Link>)}</div>
      <div className="prose-sm mt-8 space-y-8 text-[16px]">
        <section><h2 className="font-serif text-xl font-semibold">The short version</h2><p className="mt-2">{u.summary}</p></section>
        <section><h2 className="font-serif text-xl font-semibold">What they did</h2><p className="mt-2">{u.what_they_did}</p><p className="text-sm text-ink/60">Agent/tool used: {u.agent}</p></section>
        <section><h2 className="font-serif text-xl font-semibold">How it went</h2><p className="mt-2">{u.how_it_went}</p></section>
        <section className="rounded-2xl bg-amber-50 p-5"><h2 className="font-serif text-xl font-semibold">Worth knowing</h2><p className="mt-2">{u.worth_knowing}</p></section>
        <section className="rounded-2xl bg-clay-50 p-5">
          <div className="flex items-center justify-between gap-2"><h2 className="font-serif text-xl font-semibold">Copy-paste prompt</h2><CopyButton text={u.prompt} /></div>
          <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-white p-4 font-sans text-[15px]">{u.prompt}</pre>
          <p className="mt-2 text-xs text-ink/60">Replace anything in [brackets] with your own details.</p>
        </section>
        <section><h2 className="font-serif text-xl font-semibold">Step-by-step setup</h2><ol className="mt-3 list-decimal space-y-2 pl-6">{u.steps.map((s) => <li key={s}>{s}</li>)}</ol></section>
        {u.video_url && <section><h2 className="font-serif text-xl font-semibold">Video walkthrough</h2><a className="underline" href={u.video_url}>Watch</a></section>}
        {u.source_url && <p className="text-sm">Source: <a className="underline" href={u.source_url} rel="nofollow noopener">{u.source_url}</a></p>}
      </div>
      <p className="mt-10 text-sm text-ink/50">Published {u.published_at}. <Link href="/help-me" className="underline decoration-ink/20">Want help setting this up?</Link></p>
    </article>
  );
}
