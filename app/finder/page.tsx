import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "@/components/PageHead";
import ShareButtons from "@/components/ShareButtons";
import Switchboard from "@/components/Switchboard";
import { getUseCases } from "@/lib/data";
import { find } from "@/lib/finder";
import { SITE_URL } from "@/lib/taxonomy";
import FinderForm from "./Finder";
export const dynamic = "force-dynamic";
const EXAMPLES = ["We're a 6-person HVAC company. Leads come in while we're on jobs and invoices go out late.", "Two-location dental office, the front desk is swamped with recalls and reviews.", "Small Shopify store, 300 products, I write every description myself.", "Marketing agency of 12. Client status reports and meeting notes eat our Fridays.", "Just me. I run a cleaning business and my inbox is a disaster."];
const clean = (q?: string) => (q || "").replace(/\s+/g, " ").trim().slice(0, 280);
export function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Metadata {
  const q = clean(searchParams.q);
  const title = q ? "My top 5 AI agents, picked by the Agent Finder" : "Agent Finder: your top 5 AI agents in one sentence";
  const og = `${SITE_URL}/api/og/finder${q ? `?q=${encodeURIComponent(q)}` : ""}`;
  return { title, description: "Describe your small business in a sentence and get the five AI agent use cases worth setting up first. Free, no signup.", alternates: { canonical: "/finder" },
    robots: q ? { index: false, follow: true } : undefined, openGraph: { title, images: [{ url: og, width: 1200, height: 630 }] }, twitter: { card: "summary_large_image", title, images: [og] } };
}
export default async function Page({ searchParams }: { searchParams: { q?: string } }) {
  const q = clean(searchParams.q);
  const all = await getUseCases();
  const r = q.length >= 12 ? find(q, all) : null;
  const shareUrl = `${SITE_URL}/finder?q=${encodeURIComponent(q)}`;
  return (<article className="mx-auto max-w-3xl pt-8 sm:pt-12">
    <PageHead eyebrow="Agent Finder" title="Describe your business. Get your top five."><p>What you do, how big you are, what's driving you up the wall. We'll point you at the five use cases worth trying first. No signup, no sales call, no "let's hop on a quick chat."</p></PageHead>
    <FinderForm initial={q} key={q} />
    {q && !r && <p className="mt-6 rounded-xl border border-ink/10 bg-white p-4 text-[15px] text-ink/70" role="status">That's a bit short for the robot to work with. Try a full sentence: what you do and what's eating your week.</p>}
    {!r && <section className="mt-8" aria-labelledby="ex"><p id="ex" className="text-sm text-ink/70">Or borrow someone else's problems:</p>
      <ul className="mt-2 space-y-2">{EXAMPLES.map((x) => <li key={x}><Link href={`/finder?q=${encodeURIComponent(x)}#results`} className="text-[15px] text-ink/75 underline decoration-ink/20 underline-offset-4 hover:text-ink">“{x}”</Link></li>)}</ul></section>}
    {r && <section id="results" className="mt-10 scroll-mt-24" aria-labelledby="res-h" data-testid="finder-results">
      <h2 id="res-h" className="font-serif text-3xl font-semibold">Your top five</h2>
      {r.matched ? <p className="mt-2 text-[15px] text-ink/70">Based on: {[...r.industries, ...r.problems, ...r.tools.map((t) => `uses ${t}`), ...(r.solo ? ["one-person shop"] : [])].join(" · ")}</p>
        : <p className="mt-2 rounded-xl border-l-2 border-clay-500 bg-white px-4 py-3 text-[15px] text-ink/70" data-testid="finder-fallback">We couldn't place your business exactly (the robot is squinting), so here are the five that help almost everyone. Mention your industry or what's annoying you for sharper picks.</p>}
      <ol className="mt-4 divide-y divide-ink/10 border-y border-ink/10">{r.picks.map((u, i) => (<li key={u.slug}><Link href={`/use-case/${u.slug}`} className="group grid grid-cols-[2.5rem_1fr] gap-3 py-5">
        <span className="font-serif text-3xl font-semibold text-ink/25" aria-hidden>{i + 1}</span>
        <span><span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-clay-700">{u.category}</span>
          <span className="mt-1 block font-serif text-xl font-semibold leading-snug group-hover:underline group-hover:decoration-clay-500 group-hover:underline-offset-4">{u.title}</span>
          <span className="mt-1 block text-[15px] text-ink/70">{u.result}</span>
          <span className="mt-2 block text-xs text-ink/70">{u.difficulty} · {u.setup_time} · {u.monthly_cost}{u.why.length ? <> · <span className="text-ink/70">why: {u.why.join(", ")}</span></> : null}</span></span></Link></li>))}</ol>
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-semibold">Share these picks</p><p className="text-sm text-ink/70">The link reopens this exact list.</p></div>
        <ShareButtons url={shareUrl} title="My top 5 AI agents (via SMB Agents AI)" text="I described my business in one sentence and got my top 5 AI agents to set up first:" compact />
      </div>
      <p className="mt-6 text-sm text-ink/70">Want a score and a deeper plan? <Link className="underline" href="/quiz">Take the 3-minute quiz</Link>. Or browse <Link className="underline" href="/packs">industry packs</Link>.</p>
    </section>}
    <Switchboard />
  </article>);
}
