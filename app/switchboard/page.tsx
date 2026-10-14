import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "@/components/PageHead";
import Switchboard from "@/components/Switchboard";
import { getIssues } from "@/lib/issues";
export const metadata: Metadata = { title: "The Switchboard archive", description: "Every issue of The Switchboard: real AI agent use cases for small businesses, twice a week.", alternates: { canonical: "/switchboard" } };
export default function Archive() {
  const issues = getIssues();
  return (<article className="pt-8 sm:pt-12">
    <PageHead eyebrow="Newsletter · Tuesdays & Fridays" title="The Switchboard archive"><p>Every issue, in case you missed one or need to forward it to the person who still prints their emails.</p></PageHead>
    <ol className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
      {issues.map((i) => (<li key={i.number}><Link href={`/switchboard/${i.number}`} className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6">
        <span className="w-28 shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/50">No. {String(i.number).padStart(3, "0")}</span>
        <span className="flex-1"><span className="font-serif text-2xl font-semibold group-hover:underline group-hover:decoration-clay-500 group-hover:underline-offset-4">{i.title}</span>
          <span className="mt-1 block text-[15px] text-ink/60">{i.preheader}</span></span>
        <span className="text-sm text-ink/50">{new Date(i.date + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
      </Link></li>))}
    </ol>
    <Switchboard />
  </article>);
}
