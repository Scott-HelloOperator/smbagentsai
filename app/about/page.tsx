import Image from "next/image";
import Link from "next/link";
import { Jack } from "@/components/Logo";
export const metadata = { title: "About", description: "Why Scott Mackin built SMB Agents AI: a plain-English guide to AI agents for small-business owners." };
const LINKEDIN = "https://www.linkedin.com/in/scottmackin/";
export default function About() {
  return (<article className="mx-auto max-w-2xl pb-6 pt-8 text-[17px] leading-relaxed sm:pt-12">
    <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-clay-700"><Jack size={14} /> About</p>
    <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Hi, I&apos;m Scott. Thanks for picking up.</h1>

    <div className="mt-6 flex items-center gap-4">
      <Image src="/team/scott-mackin.png" alt="Illustrated portrait of Scott Mackin" width={600} height={600} priority className="h-24 w-24 shrink-0 rounded-full border-2 border-ink shadow-pop sm:h-28 sm:w-28" />
      <p className="text-sm text-ink/70">Scott Mackin<br />Founder, SMB Agents AI<br /><a href={LINKEDIN} className="font-medium text-ink underline decoration-clay-500 decoration-2 underline-offset-4" target="_blank" rel="noopener">Say hi on LinkedIn</a></p>
    </div>

    <div className="mt-8 space-y-4">
      <p>I run <a href="https://hellooperator.ai" className="underline decoration-ink/25 underline-offset-4 hover:decoration-clay-500" target="_blank" rel="noopener">Hello Operator</a>, an AI-first marketing agency. These days most of my work is about one question: how does AI actually help a small business, not a Fortune 500 with a data team?</p>
      <p>I&apos;ve been an entrepreneur most of my career, with two exits along the way, so I know the juggling act of running a small company firsthand. For more than ten years I&apos;ve also been an adjunct professor of strategic digital marketing at EADA Business School.</p>
      <p>After 15 years in Spain, I recently moved from Barcelona to Newburyport, Massachusetts. New town, lots of great small businesses, and a lot of owners asking me the same thing: &ldquo;Should I be doing something with AI?&rdquo;</p>
      <p>This site is my answer. Most AI agent content is written for engineers or enterprises. SMB Agents AI is for the owner-operator of a business under 200 people who&apos;s curious, short on time, and doesn&apos;t know where to start. Every entry starts with a problem you&apos;ll recognize (slow payments, missed leads, a messy inbox) and tells you honestly what it takes: the tools, the setup time, the monthly cost, and what can go wrong.</p>
    </div>

    <aside className="card-pop mt-10 flex items-center gap-4 bg-mustard-50 p-5">
      <Image src="/gary/gary-oops.png" alt="Gary the AI Intern scratching his head sheepishly" width={479} height={726} className="w-16 shrink-0 sm:w-20" />
      <p className="text-[16px]">You&apos;ll also run into <b>Gary, our AI intern</b>. Gary is enthusiastic, never sleeps, and once tried to automate the coffee machine. He&apos;s a cartoon, but he&apos;s also a fair picture of most AI tools: genuinely helpful, as long as a human keeps an eye on him.</p>
    </aside>

    <div className="mt-10 space-y-4">
      <p>A few house rules: entries marked as examples are illustrative composites of common setups, not stories about specific businesses. Real, sourced stories get added as they&apos;re submitted and verified. The site is free, and I&apos;ll always label anything sponsored.</p>
      <p>If you&apos;ve built something that works, <Link className="underline decoration-clay-500 decoration-2 underline-offset-4" href="/submit">send me your use case</Link>. And if you want five of these in your inbox each morning, <Link className="underline decoration-clay-500 decoration-2 underline-offset-4" href="/#switchboard">subscribe to The Switchboard</Link>.</p>
    </div>

    <p className="mt-10 font-serif text-2xl italic">Scott</p>
    <p className="text-sm text-ink/60">Newburyport, MA</p>
  </article>);
}
