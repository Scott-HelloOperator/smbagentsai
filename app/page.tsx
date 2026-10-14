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
    <section className="pb-5 pt-6 sm:pb-6 sm:pt-10">
      <p className="eyebrow"><Jack size={7} /> For businesses under 200 people</p>
      <h1 className="mt-3 max-w-3xl font-serif text-[2.25rem] font-semibold leading-[1.04] tracking-[-0.02em] sm:text-[3.5rem]">Real AI agent use cases, sorted by the problem you <em className="font-normal italic">actually</em> have.</h1>
      <p className="mt-3 max-w-xl text-lg leading-relaxed text-ink/65">Pick a headache, flip a card, copy the prompt. Plain English, honest about cost and effort, no hype.</p>
    </section>
    <Link href="/quiz" className="group mb-6 flex items-center justify-between gap-4 border-y border-ink/10 py-3.5" data-testid="quiz-cta">
      <div><p className="eyebrow !text-clay-700">New · 3-minute quiz</p>
        <p className="mt-1 font-serif text-lg font-semibold sm:text-2xl">How ready is your business for AI agents?</p>
        <p className="mt-1 text-sm text-ink/60">A score out of 100 and your top-5 agent plan.</p></div>
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
