import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getIssue, getIssues, RATINGS } from "@/lib/issues";
import { renderIssueBody, voteUrl } from "@/lib/emails";
import ShareButtons from "@/components/ShareButtons";
import Switchboard from "@/components/Switchboard";
import { SITE_URL } from "@/lib/taxonomy";
export const generateStaticParams = () => getIssues().map((i) => ({ n: String(i.number) }));
export function generateMetadata({ params }: { params: { n: string } }): Metadata {
  const i = getIssue(Number(params.n)); if (!i) return {};
  return { title: `${i.title} · The Switchboard No. ${i.number}`, description: i.preheader, alternates: { canonical: `/switchboard/${i.number}` }, openGraph: { title: i.title, description: i.preheader, type: "article" } };
}
export default function IssuePage({ params }: { params: { n: string } }) {
  const i = getIssue(Number(params.n)); if (!i) notFound();
  return (<article className="mx-auto max-w-[640px] pt-8 sm:pt-12">
    <Link href="/switchboard" className="text-sm text-ink/70 hover:text-ink">← The Switchboard archive</Link>
    <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/70">No. {String(i.number).padStart(3, "0")} · {new Date(i.date + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
    <h1 className="mt-2 font-serif text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.015em] sm:text-5xl">{i.title}</h1>
    <div className="issue mt-8 border-t border-ink pt-6" dangerouslySetInnerHTML={{ __html: renderIssueBody(i) }} />
    <section className="mt-10 border-t border-ink/10 pt-8 text-center" aria-labelledby="rate">
      <h2 id="rate" className="font-serif text-2xl font-semibold">How'd we do?</h2>
      <p className="mt-1 text-sm text-ink/70">One tap. The robot is keeping score.</p>
      <div className="mt-4 flex justify-center gap-3">{RATINGS.map((r) => <a key={r.v} href={voteUrl(i.number, "rating", r.v)} className="w-24 rounded-2xl border border-ink/10 bg-white py-3 text-sm font-semibold hover:border-ink/40"><span className="block text-3xl">{r.e}</span>{r.label}</a>)}</div>
    </section>
    <div className="mt-10"><p className="mb-2 text-sm font-medium text-ink/70">Forward this issue</p><ShareButtons url={`${SITE_URL}/switchboard/${i.number}`} title={`${i.title} (The Switchboard)`} /></div>
    <Switchboard />
  </article>);
}
