import Image from "next/image";
import Link from "next/link";
import { Jack } from "@/components/Logo";
export const metadata = { title: "About", description: "Why Scott Mackin built SMB Agents AI: a plain-English guide to AI agents for small-business owners." };
const LINKEDIN = "https://www.linkedin.com/in/scottmackin/";
const a = "underline decoration-ink/25 underline-offset-4 hover:decoration-clay-500";
export default function About() {
  return (<article className="mx-auto max-w-[640px] pb-8 pt-10 text-[17px] leading-[1.7] text-ink/85 sm:pt-16">
    <p className="eyebrow"><Jack size={7} /> About</p>
    <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.1] tracking-[-0.015em] text-ink sm:text-5xl">Why this site exists</h1>

    <div className="mt-8 space-y-5">
      <p>Hi, I&apos;m Scott. If you run a small business, I already know a few things about your week. You&apos;ve made payroll at least once with your stomach in a knot. You&apos;re the CEO, the IT department, and the person who fixes the printer. And somewhere in your inbox is a vendor promising their AI will &ldquo;transform&rdquo; everything by Friday.</p>
      <p>I&apos;ve been on your side of that inbox for a long time. I&apos;ve started companies, had two exits, and spent 15 years building businesses in Barcelona, which taught me that chaos is fluent in every language. Along the way I spent more than ten years teaching strategic digital marketing to MBA students at EADA Business School, mostly trying to get smart people to stop chasing shiny things.</p>
      <p>These days I run <a href="https://hellooperator.ai" className={a} target="_blank" rel="noopener">Hello Operator</a>, an AI-first agency, so I spend a lot of time talking with business owners. Different industries, same question: <em>how can AI actually help me grow my company and get some of my time back?</em> No buzzwords, no forty-slide deck. Just tell me what works.</p>
      <p>That&apos;s what this site is. Real use cases, vetted, sorted by the problem you actually have: slow payments, leads slipping through the cracks, an inbox that never ends. Each one tells you the tools, the setup time, the cost, and what can go wrong, in plain English. Flip a card, copy the prompt, go have a slightly better Tuesday.</p>
      <p>The robot in the memes is our AI intern. He is not a role model.</p>
      <p>If you&apos;ve built something that works, <Link className={a} href="/submit">send it in</Link>, and I&apos;d love to see it. If you want the best new ones twice a week, <Link className={a} href="/#switchboard">subscribe to The Switchboard</Link>. Pull up a chair. You&apos;re among friends here.</p>
      <p className="text-[14px] leading-relaxed text-ink/55">Entries marked as examples are illustrative, not stories about specific businesses. The site is free, and anything sponsored is labeled.</p>
    </div>

    <footer className="mt-14 border-t border-ink/10 pt-8">
      <div className="flex items-center gap-5">
        <picture>
          <source srcSet="/team/scott-mackin.webp" type="image/webp" />
          <img src="/team/scott-mackin.jpg" alt="Scott Mackin" width={400} height={400} loading="lazy" className="h-20 w-20 shrink-0 rounded-full object-cover sm:h-24 sm:w-24" />
        </picture>
        <div className="min-w-0">
          <p className="font-sig text-[3.5rem] leading-[0.8] text-ink sm:text-6xl" aria-hidden>Scott</p>
          <p className="mt-1 font-semibold text-ink">Scott Mackin</p>
          <p className="text-[15px] leading-snug text-ink/60">Founder, Hello Operator</p>
          <a href={LINKEDIN} target="_blank" rel="noopener" className="mt-1 inline-block text-[15px] font-medium text-ink underline decoration-clay-500 underline-offset-4">LinkedIn ↗</a>
        </div>
      </div>
    </footer>
  </article>);
}
