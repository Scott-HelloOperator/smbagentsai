import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import CopyButton from "@/components/CopyButton";
import { SITE_URL } from "@/lib/taxonomy";
export const metadata: Metadata = { title: "Embed: AI use case of the week", description: "Add a free 'AI use case of the week' widget to your site, newsletter page or member portal. One line of HTML, no tracking.", alternates: { canonical: "/widget" } };
export default function Widget() {
  const src = `${SITE_URL}/embed/use-case-of-the-week`;
  const code = (t: string) => `<iframe src="${src}${t === "dark" ? "?theme=dark" : ""}" title="AI use case of the week from SMB Agents AI" width="100%" height="250" style="max-width:420px;border:0;border-radius:14px" loading="lazy"></iframe>`;
  return (<article className="pt-8 sm:pt-12">
    <PageHead eyebrow="Embed" title="Use case of the week, on your site"><p>A small card that shows a different practical AI use case every Monday. Good for chambers of commerce, trade associations, accountants' client portals, and anyone whose members keep asking "so what do I actually do with AI?" Free. No scripts, cookies or tracking.</p></PageHead>
    <div className="mt-10 grid gap-10 lg:grid-cols-2">
      {(["light", "dark"] as const).map((t) => (<section key={t} aria-label={`${t} theme`}>
        <p className="eyebrow">{t} theme</p>
        <iframe src={`${src}${t === "dark" ? "?theme=dark" : ""}`} title={`Preview (${t})`} width="100%" height="250" className="mt-3 max-w-[420px] rounded-[14px] border-0" loading="lazy" />
        <div className="mt-4 rounded-xl border border-ink/10 bg-white p-3"><div className="flex items-start justify-between gap-3"><code className="block break-all text-[12.5px] leading-relaxed text-ink/75">{code(t)}</code><CopyButton text={code(t)} label="Copy code" /></div></div>
      </section>))}
    </div>
    <p className="mt-8 text-sm text-ink/55">Rotates every Monday. Links open on smbagentsai.com in a new tab. Want a custom version for your members? <a className="underline" href="/contact">Ask us</a>.</p>
  </article>);
}
