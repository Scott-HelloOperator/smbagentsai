import type { Metadata } from "next";
import Link from "next/link";
import { adminClient } from "@/lib/data";
import { RATINGS, getIssue } from "@/lib/issues";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Thanks for the feedback", robots: { index: false } };
const LINES: Record<string, string> = { fire: "Noted. The robot will pretend he isn't flattered.", decent: "Decent. The robot considers that a five-star review.", poop: "Fair. The robot has filed a complaint against the humans who wrote it.",
  yes: "Fast beats perfect. Bold. The robot approves.", no: "Your brand, your words. Respect.", evening: "Robots on the night shift. Classic compromise." };
export default async function Thanks({ searchParams }: { searchParams: { i?: string; q?: string; v?: string } }) {
  const n = Number(searchParams.i), issue = getIssue(n), q = searchParams.q || "rating", v = searchParams.v || "";
  let tally: Record<string, number> = {};
  const db = adminClient();
  if (db && issue && q === "rating") { const { data } = await db.from("issue_votes").select("vote").eq("issue", n).eq("question", "rating"); for (const r of data || []) tally[r.vote] = (tally[r.vote] || 0) + 1; }
  const total = Object.values(tally).reduce((a, b) => a + b, 0);
  return (<article className="mx-auto max-w-xl pt-12 text-center">
    <p className="text-5xl">{RATINGS.find((r) => r.v === v)?.e || "📮"}</p>
    <h1 className="mt-4 font-serif text-4xl font-semibold">{v ? "Vote counted. Thank you." : "Hmm, that vote didn't go through."}</h1>
    <p className="mt-3 text-[17px] text-ink/70">{LINES[v] || "The link may be old or mangled by your email app. Try again from the issue page."}</p>
    {total > 0 && <div className="mx-auto mt-8 max-w-sm space-y-2 text-left text-sm">{RATINGS.map((r) => { const c = tally[r.v] || 0; return (
      <div key={r.v}><div className="flex justify-between"><span>{r.e} {r.label}</span><span className="text-ink/55">{Math.round((c / total) * 100)}%</span></div>
        <div className="mt-1 h-1.5 rounded-full bg-ink/5"><div className="h-full rounded-full bg-ink" style={{ width: `${(c / total) * 100}%` }} /></div></div>); })}</div>}
    <div className="mt-10 flex justify-center gap-4 text-sm">{issue && <Link className="underline" href={`/switchboard/${n}`}>Back to the issue</Link>}<Link className="underline" href="/">Browse use cases</Link></div>
  </article>);
}
