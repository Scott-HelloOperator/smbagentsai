import type { Metadata } from "next";
import { adminClient } from "@/lib/data";
import Form from "@/components/Form";
import PageHead from "@/components/PageHead";
export const revalidate = 300;
export const metadata: Metadata = { title: "Owner wins", description: "Small-business owners share the AI setups that actually saved them time. Real names, real credit, moderated by humans.", alternates: { canonical: "/wins" } };
type Win = { id: string; name: string; business: string | null; credit_url: string | null; title: string; story: string; tools: string | null; hours_saved: string | null; approved_at: string };
export default async function Wins() {
  const db = adminClient(); let wins: Win[] = [];
  if (db) { const { data } = await db.from("wins").select("id,name,business,credit_url,title,story,tools,hours_saved,approved_at").eq("status", "approved").order("approved_at", { ascending: false }).limit(60); wins = (data || []) as Win[]; }
  return (<article className="pt-8 sm:pt-12">
    <PageHead eyebrow="Owner wins" title={<>Small wins, <em className="font-normal italic">actually</em> shipped.</>}>
      <p>Owners sharing the AI setups that gave them time back. Every win is read by a human before it goes up, and you get credit with a link to your business. Vendors posing as customers get a polite no.</p>
    </PageHead>
    <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      <section aria-label="Approved wins">
        {wins.length ? <ol className="divide-y divide-ink/10 border-y border-ink/10">{wins.map((w) => (<li key={w.id} className="py-6">
          <h2 className="font-serif text-2xl font-semibold leading-snug">{w.title}</h2>
          <p className="mt-2 whitespace-pre-line text-[16px] leading-relaxed text-ink/80">{w.story}</p>
          <p className="mt-3 text-sm text-ink/60">— {w.credit_url ? <a className="font-medium text-ink underline decoration-clay-500 underline-offset-4" href={w.credit_url} rel="noopener ugc" target="_blank">{w.name}{w.business ? `, ${w.business}` : ""}</a> : <span className="font-medium text-ink">{w.name}{w.business ? `, ${w.business}` : ""}</span>}
            {w.tools && <> · {w.tools}</>}{w.hours_saved && <> · saves {w.hours_saved}</>}</p>
        </li>))}</ol>
        : <div className="rounded-2xl border border-dashed border-ink/20 p-8 text-center"><p className="font-serif text-2xl font-semibold">The wall is empty. For now.</p>
            <p className="mx-auto mt-2 max-w-md text-ink/65">Be the first owner on it. The robot has been staring at this blank space all week and it's getting weird.</p></div>}
        <aside className="mt-8 rounded-2xl bg-ink p-6 text-cream">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/60">Coming soon</p>
          <p className="mt-2 font-serif text-2xl font-semibold">The Wins Contest</p>
          <p className="mt-2 text-[15px] leading-relaxed text-cream/75">Sponsor-funded prizes for the most useful owner win each month. Judged by humans on one question: could another owner copy this on Monday? Wins posted now will be eligible.</p>
        </aside>
      </section>
      <section aria-labelledby="post-win" className="lg:sticky lg:top-24 lg:self-start">
        <h2 id="post-win" className="font-serif text-2xl font-semibold">Post your win</h2>
        <p className="mt-1 text-sm text-ink/60">Short and specific beats long and vague. We may edit lightly for clarity.</p>
        <div className="mt-4"><Form kind="win" endpoint="/api/wins" submit="Submit for review" done={<><p className="font-semibold text-ink">Thanks! It's in the review queue.</p><p className="mt-1">A human reads it, usually within a few days. If it goes up, we'll email you.</p></>}
          fields={[{ name: "name", label: "Your name (as credited)", required: true }, { name: "business", label: "Business name" }, { name: "email", label: "Email (never shown)", type: "email", required: true },
            { name: "credit_url", label: "Credit link", type: "url", placeholder: "https://yourbusiness.com" }, { name: "title", label: "Headline", required: true, placeholder: "Stopped chasing invoices by phone" },
            { name: "story", label: "What did you set up, and what changed?", type: "textarea", required: true, rows: 5 }, { name: "tools", label: "Tools used", placeholder: "QuickBooks, Zapier" },
            { name: "hours_saved", label: "Time saved (honest guess)", placeholder: "about 3 hours a week" }]} /></div>
      </section>
    </div>
  </article>);
}
