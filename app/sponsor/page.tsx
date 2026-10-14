import type { Metadata } from "next";
import Form from "@/components/Form";
import PageHead from "@/components/PageHead";
export const metadata: Metadata = { title: "Sponsor", description: "Reach small-business owners while they're looking for tools to fix a specific problem. Always labeled, never pay-to-rank.", alternates: { canonical: "/sponsor" } };
export default function Sponsor() {
  return (<article className="mx-auto max-w-2xl pb-6 pt-8 sm:pt-12">
    <PageHead eyebrow="Sponsor" title="Put your tool in front of owners who are shopping">
      <p>Our readers run businesses under 200 people and show up with a specific headache: slow payments, missed leads, an inbox from hell. Sponsors appear in The Switchboard (twice a week) and as clearly labeled placements on relevant category pages.</p>
    </PageHead>
    <ul className="mt-6 space-y-2 border-y border-ink/10 py-5 text-[15px] text-ink/80">
      <li>· Always labeled as sponsored.</li>
      <li>· Never changes rankings or use-case content. Our robot would quit.</li>
      <li>· Only tools that genuinely serve businesses under 200 people.</li>
    </ul>
    <div className="mt-8">
      <Form kind="sponsor" submit="Send sponsorship inquiry" done={<><p className="font-semibold text-ink">Got it. Thanks.</p><p className="mt-1">Scott reads these himself and will reply by email, usually within two business days.</p></>}
        fields={[{ name: "name", label: "Your name", required: true }, { name: "email", label: "Work email", type: "email", required: true }, { name: "company", label: "Company / tool", required: true },
          { name: "website", label: "Website", type: "url", placeholder: "https://" }, { name: "budget", label: "Rough budget", type: "select", options: ["Under $1k", "$1k–$5k", "$5k–$15k", "$15k+", "Not sure yet"] },
          { name: "message", label: "What do you want to promote, and to whom?", type: "textarea", required: true }]} />
    </div>
  </article>);
}
