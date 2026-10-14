import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getQuiz } from "@/lib/quizStore";
import { verdict } from "@/lib/quiz";
import { SITE_URL } from "@/lib/taxonomy";
import Unlock from "./Unlock";
import ShareLink from "@/components/ShareLink";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const q = await getQuiz(params.id); if (!q) return {};
  const t = `I scored ${q.score}/100 on the AI Readiness Quiz — what's yours?`;
  return { title: t, description: "A free 3-minute quiz for small-business owners. Get your score and a top-5 AI agent plan.", openGraph: { title: t, url: `/quiz/result/${params.id}` }, twitter: { card: "summary_large_image", title: t }, robots: { index: false } };
}
export default async function Page({ params }: { params: { id: string } }) {
  const q = await getQuiz(params.id); if (!q) notFound();
  const v = verdict(q.score);
  const teaser = q.plan[0];
  return (
    <section className="mx-auto max-w-2xl pt-8">
      <p className="eyebrow">AI Readiness Quiz result</p>
      <div className="mt-3 flex items-center gap-5 rounded-3xl bg-white p-6 border border-ink/10">
        <div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(#ED7347 ${q.score * 3.6}deg, #F3E8DE 0)` }}>
          <div className="grid h-[88px] w-[88px] place-items-center rounded-full bg-white text-center"><span className="font-serif text-3xl font-semibold">{q.score}</span><span className="-mt-2 text-xs text-ink/70">/ 100</span></div>
        </div>
        <div><h1 className="font-serif text-2xl font-semibold">{v.label}</h1><p className="mt-1 text-ink/70">{v.line}</p></div>
      </div>
      <h2 className="mt-8 font-serif text-xl font-semibold">Your top 5 agents to try first</h2>
      <div className="mt-3 rounded-2xl border border-ink/10 bg-white p-4 border-l-2 border-l-clay-500">
        <p className="text-xs font-semibold uppercase tracking-wide text-clay-700">#1 · {teaser.category}</p>
        <p className="mt-1 font-serif text-lg font-semibold">{teaser.title}</p><p className="text-sm text-ink/70">{teaser.result}</p>
      </div>
      <Unlock id={q.id} count={q.plan.length} />
      <div className="mt-10 rounded-2xl bg-white p-5 border border-ink/10">
        <h2 className="font-semibold">Share your score</h2>
        <div className="mt-3"><ShareLink link={`${SITE_URL}/quiz/result/${q.id}`} text={`I scored ${q.score}/100 on the AI Readiness Quiz — what's yours?`} /></div>
      </div>
      <p className="mt-6 text-center"><Link href="/quiz" className="text-sm underline">Take the quiz yourself →</Link></p>
    </section>);
}
