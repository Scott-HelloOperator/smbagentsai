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
      <p>I run <a href="https://hellooperator.ai" className={a} target="_blank" rel="noopener">Hello Operator</a>, an AI-first marketing agency. Most of our work now is helping small businesses figure out where AI actually earns its keep.</p>
      <p>I&apos;ve started a few companies and sold two. For more than ten years I&apos;ve taught strategic digital marketing as an adjunct professor at EADA Business School in Barcelona. After 15 years in Spain, I recently moved to Newburyport, Massachusetts.</p>
      <p>The question I get most from owners is some version of &ldquo;Should I be doing something with AI?&rdquo; The honest answer is usually &ldquo;Yes, one or two specific things, and probably not the thing you were just pitched.&rdquo;</p>
      <p>Most AI agent content is written for engineers, enterprises, or people selling courses. This site is for the owner-operator of a business under 200 people. Every entry starts with a problem you&apos;ll recognize (slow payments, missed leads, a messy inbox) and tells you what it takes: the tools, the setup time, the monthly cost, and what can go wrong.</p>
      <p>Entries marked as examples are illustrative composites, not stories about specific businesses. Real, sourced stories get added as they&apos;re submitted and verified. The site is free. Anything sponsored is labeled.</p>
      <p>Gary, the robot in the memes, is our AI intern. He is not a role model.</p>
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
          <p className="text-[15px] leading-snug text-ink/60">Founder, Hello Operator · Newburyport, MA</p>
          <a href={LINKEDIN} target="_blank" rel="noopener" className="mt-1 inline-block text-[15px] font-medium text-ink underline decoration-clay-500 underline-offset-4">LinkedIn ↗</a>
        </div>
      </div>
    </footer>
  </article>);
}
