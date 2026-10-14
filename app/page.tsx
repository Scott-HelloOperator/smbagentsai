import Directory from "@/components/Directory";
import Newsletter from "@/components/Newsletter";
import Link from "next/link";
import { getUseCases } from "@/lib/data";
export const revalidate = 3600;
export default async function Home() {
  const items = await getUseCases();
  return (<>
    <section className="pb-6 pt-10 sm:pt-16">
      <p className="text-sm font-medium text-clay-600">For owners of businesses under 200 people</p>
      <h1 className="mt-2 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl">Real AI agent use cases, sorted by the problem you actually have.</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/70">Pick a headache, flip a card, copy the prompt. Plain English, honest about cost and effort, no hype.</p>
    </section>
    <Link href="/quiz" className="mb-8 flex items-center justify-between gap-4 rounded-3xl border border-clay-100 bg-gradient-to-r from-clay-50 to-amber-50 p-5 shadow-sm transition hover:shadow-md sm:p-6" data-testid="quiz-cta">
      <div><p className="text-xs font-semibold uppercase tracking-wide text-clay-700">New · 3-minute quiz</p>
        <p className="mt-1 font-serif text-xl font-semibold sm:text-2xl">How ready is your business for AI agents?</p>
        <p className="mt-1 text-sm text-ink/70">Get a score out of 100 and your personal top-5 agent plan.</p></div>
      <span className="shrink-0 rounded-2xl bg-clay-600 px-4 py-3 font-semibold text-white">Take it →</span>
    </Link>
    <Directory items={items} />
    <Newsletter />
  </>);
}
