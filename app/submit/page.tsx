import type { Metadata } from "next";
import Link from "next/link";
import Form from "@/components/Form";
import PageHead from "@/components/PageHead";
export const metadata: Metadata = { title: "Submit a use case", description: "Built an AI agent or automation that saves your business time? Tell us in plain English.", alternates: { canonical: "/submit" } };
export default function Submit() {
  return (<article className="mx-auto max-w-2xl pb-6 pt-8 sm:pt-12">
    <PageHead eyebrow="Submit" title="Share what's working"><p>Built an AI agent or automation that saves your business time? Tell us in plain English. We review every submission before publishing. Want credit on the Wins wall? <Link href="/wins" className="underline decoration-ink/25 underline-offset-4">Post a win instead</Link>.</p></PageHead>
    <div className="mt-8"><Form kind="submit" submit="Submit use case" done={<><p className="font-semibold text-ink">Thanks! We'll review it and be in touch.</p><p className="mt-1">If it holds up, it goes in the directory with a credit to you.</p></>}
      fields={[{ name: "name", label: "Your name" }, { name: "email", label: "Email", type: "email", required: true }, { name: "business", label: "Business & industry" },
        { name: "story", label: "What problem did you solve, what did you set up, and how did it go?", type: "textarea", required: true, rows: 6 },
        { name: "tools", label: "Tools used", placeholder: "e.g. QuickBooks, Zapier" }, { name: "source_url", label: "Link (optional)", type: "url", placeholder: "https://" }]} /></div>
  </article>);
}
