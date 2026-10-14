import Directory from "./Directory";
import Link from "next/link";
import type { UseCase } from "@/lib/data";
export default function Landing({ kind, name, items, initial }: { kind: string; name: string; items: UseCase[]; initial: { category?: string; tool?: string; industry?: string } }) {
  return (<>
    <section className="pb-6 pt-10">
      <Link href="/" className="text-sm text-ink/60">← All use cases</Link>
      <p className="mt-4 text-sm font-medium text-clay-600">{kind}</p>
      <h1 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">{kind === "Problem" ? name : `AI agent use cases for ${name}`}</h1>
    </section>
    <Directory items={items} initial={initial} />
  </>);
}
