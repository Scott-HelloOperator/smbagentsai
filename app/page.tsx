import Directory from "@/components/Directory";
import Switchboard from "@/components/Switchboard";
import Link from "next/link";
import Image from "next/image";
import { Jack } from "@/components/Logo";
import { getUseCases } from "@/lib/data";
import { SITE_URL } from "@/lib/taxonomy";
export const revalidate = 3600;
export default async function Home() {
  const items = await getUseCases();
  const ld = [{ "@context": "https://schema.org", "@type": "WebSite", name: "SMB Agents AI", url: SITE_URL },
    { "@context": "https://schema.org", "@type": "Organization", name: "SMB Agents AI", url: SITE_URL, parentOrganization: { "@type": "Organization", name: "Hello Operator", url: "https://hellooperator.ai" } }];
  return (<>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <section className="pb-4 pt-5 sm:pb-5 sm:pt-8">
      <p className="eyebrow"><Jack size={7} /> For businesses under 200 people</p>
      <h1 className="mt-3 max-w-[17ch] font-serif text-[2rem] sm:max-w-5xl font-semibold leading-[1.04] tracking-[-0.02em] sm:text-[3.25rem]">Real AI agent use cases, sorted by the problem you <em className="font-normal italic">actually</em> have.</h1>
      <p className="mt-3 max-w-4xl text-base leading-relaxed sm:text-lg text-ink/70">Pick a headache, flip a card, copy the prompt. Plain English, honest about cost and effort, no hype.</p>
    </section>
    <Link href="/quiz" className="group mb-5 flex items-center justify-between gap-4 border-y border-ink/10 py-3" data-testid="quiz-cta">
      <div><p className="eyebrow !text-clay-700">New · 3-minute quiz</p>
        <p className="mt-1 font-serif text-lg font-semibold leading-snug sm:text-[1.375rem]">How ready is your business for AI agents?</p>
        <p className="mt-0.5 hidden text-sm text-ink/70 sm:block">A score out of 100 and your top-5 agent plan.</p></div>
      <span className="btn shrink-0 px-4 py-2.5 text-sm">Take it <span className="ml-1 transition group-hover:translate-x-0.5">→</span></span>
    </Link>
    <Directory items={items} />
    <section className="mt-20 grid items-center gap-8 sm:grid-cols-[minmax(0,420px)_1fr] sm:gap-14">
      <Image src="/memes/robot-shoebox.webp" alt="Meme: a deadpan beige office robot named Gary sits calmly amid flying paperwork. Caption: 'You asked me to automate your operations. You don't have operations. You have a shoebox and a guy named Dave.'" width={1080} height={1362} className="w-full rounded-xl border border-ink/10" sizes="(min-width: 640px) 420px, 100vw" />
      <div>
        <p className="eyebrow"><Jack size={7} /> Robots, unimpressed.</p>
        <p className="mt-3 max-w-md font-serif text-2xl leading-snug">Our AI intern, and the rest of the machines, have notes on how you're running things. The enthusiasm of a fax machine, the judgment of a vendor demo.</p>
      </div>
    </section>
    <Switchboard />
  </>);
}
