import Directory from "@/components/Directory";
import Newsletter from "@/components/Newsletter";
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
    <Directory items={items} />
    <Newsletter />
  </>);
}
