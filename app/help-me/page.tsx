import type { Metadata } from "next";
import Form from "@/components/Form";
import PageHead from "@/components/PageHead";
export const metadata: Metadata = { title: "Get help setting it up", description: "Every use case is built for DIY. If you'd rather hand it off, tell us what you need.", alternates: { canonical: "/help-me" } };
export default function Help() {
  return (<article className="mx-auto max-w-2xl pb-6 pt-8 sm:pt-12">
    <PageHead eyebrow="Get help" title="Rather hand it off?">
      <p>Every use case here is written so you can do it yourself. If you'd rather not, the team at <a className="underline decoration-ink/25 underline-offset-4 hover:decoration-clay-500" href="https://hellooperator.ai" target="_blank" rel="noopener">Hello Operator</a> builds and maintains these workflows for small businesses. Tell us what you're trying to fix.</p>
    </PageHead>
    <div className="mt-8"><Form kind="help" submit="Send" done={<><p className="font-semibold text-ink">Thanks. We'll be in touch by email.</p><p className="mt-1">No pushy follow-up sequence. We'd be embarrassed.</p></>}
      fields={[{ name: "name", label: "Your name", required: true }, { name: "email", label: "Email", type: "email", required: true }, { name: "business", label: "Business & industry" },
        { name: "message", label: "What do you want automated?", type: "textarea", required: true, placeholder: "e.g. Chasing overdue invoices in QuickBooks without me doing it" }]} /></div>
    <p className="mt-6 text-sm text-ink/55">Not required, never pushed. The directory stays free either way.</p>
  </article>);
}
