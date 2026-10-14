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
      <p>I&apos;ve started a few companies and sold two. For more than ten years I&apos;ve taught strategic digital marketing to MBA students at EADA Business School. These days I run <a href="https://hellooperator.ai" className={a} target="_blank" rel="noopener">Hello Operator</a>, which means I talk to business owners all day.</p>
      <p>They all ask the same thing: how can AI actually help me grow my company and win back some time? Not in a keynote. In my business, this quarter, with the people and tools I already have.</p>
      <p>Most of what they get in return is hype, jargon, or a demo that falls apart on contact with a real inbox.</p>
      <p>This site is the straight answer. Real use cases, tested, sorted by the problem you actually have. Each one tells you what it takes: the tools, the setup time, the cost, and what can go wrong. Nothing else.</p>
      <p>Entries marked as examples are illustrative, not stories about specific businesses. The site is free. Anything sponsored is labeled.</p>
      <p>The robot in the memes is our AI intern. He is not a role model.</p>
      <p>If you&apos;ve built something that works, <Link className={a} href="/submit">send it in</Link>. If you want five of these each morning, <Link className={a} href="/#switchboard">subscribe to The Switchboard</Link>.</p>
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
