import Directory from "@/components/Directory";
import Switchboard from "@/components/Switchboard";
import Link from "next/link";
import Image from "next/image";
import { Jack } from "@/components/Logo";
import { getUseCases } from "@/lib/data";
export const revalidate = 3600;
export default async function Home() {
  const items = await getUseCases();
  return (<>
    <section className="pb-6 pt-8 sm:pt-14">
      <p className="inline-flex items-center gap-2 rounded-full border-2 border-ink/80 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-clay-700"><Jack size={14} /> For businesses under 200 people</p>
      <h1 className="mt-4 max-w-3xl font-serif text-[2.4rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">Real AI agent use cases, sorted by the <span className="relative whitespace-nowrap"><span className="relative z-10">problem you</span><span aria-hidden className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded-full bg-mustard-400/70 sm:h-4" /></span> actually have.</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/75">Pick a headache, flip a card, copy the prompt. Plain English, honest about cost and effort, no hype.</p>
    </section>
    <Link href="/quiz" className="card-pop mb-8 flex items-center justify-between gap-4 bg-clay-50 p-5 transition hover:-translate-y-0.5 sm:p-6" data-testid="quiz-cta">
      <div><p className="text-xs font-bold uppercase tracking-wide text-clay-700">New · 3-minute quiz</p>
        <p className="mt-1 font-serif text-xl font-semibold sm:text-2xl">How ready is your business for AI agents?</p>
        <p className="mt-1 text-sm text-ink/70">Get a score out of 100 and your personal top-5 agent plan.</p></div>
      <span className="btn shrink-0 px-4">Take it →</span>
    </Link>
    <Directory items={items} />
    <section className="mt-16 grid items-center gap-6 sm:grid-cols-[1fr_1.1fr]">
      <Image src="/gary/oh-gary-1.png" alt="Cartoon: Gary the AI Intern proudly shows a laptop reading 'AI saved 400 hours!' while the coffee machine burns behind him. Caption: Oh Gary." width={1000} height={1000} className="card-pop w-full rounded-3xl" sizes="(min-width: 640px) 45vw, 100vw" />
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-sage-600">Meet the intern</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold">Oh, Gary.</h2>
        <p className="mt-3 text-ink/75">Gary is our AI intern. He&apos;s eager, tireless, and absolutely certain step one is &ldquo;automate everything.&rdquo; Every use case on this site is written so you don&apos;t end up like Gary: start small, keep a human in the loop, and check the coffee machine.</p>
        <Link href="/about" className="mt-4 inline-block font-semibold text-clay-700 underline decoration-2 underline-offset-4">Who&apos;s behind this →</Link>
      </div>
    </section>
    <Switchboard />
  </>);
}
