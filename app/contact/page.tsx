import type { Metadata } from "next";
import Form from "@/components/Form";
import PageHead from "@/components/PageHead";
export const metadata: Metadata = { title: "Contact", description: "Get in touch with SMB Agents AI.", alternates: { canonical: "/contact" } };
export default function Contact() {
  return (<article className="mx-auto max-w-2xl pb-6 pt-8 sm:pt-12">
    <PageHead eyebrow="Contact" title="Say hello"><p>Corrections, questions, a use case we got wrong, a tool we should look at. A human reads every one. (The robot offered. We said no.)</p></PageHead>
    <div className="mt-8"><Form kind="contact" submit="Send message" done={<><p className="font-semibold text-ink">Message received.</p><p className="mt-1">We'll reply by email. Probably faster than your accountant.</p></>}
      fields={[{ name: "name", label: "Your name", required: true }, { name: "email", label: "Email", type: "email", required: true },
        { name: "topic", label: "Topic", type: "select", options: ["General question", "Correction", "Suggest a tool", "Press", "Partnership", "Other"] },
        { name: "message", label: "Message", type: "textarea", required: true }]} /></div>
  </article>);
}
