import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Landing from "@/components/Landing";
import { getUseCases } from "@/lib/data";
import { TOOLS, slugify, fromSlug } from "@/lib/taxonomy";
import { MIN_INDEX, facts } from "@/lib/landing";
export const revalidate = 3600;
export function generateStaticParams() { return TOOLS.map((x) => ({ slug: slugify(x) })); }
const copy = async (name: string) => {
  const items = (await getUseCases()).filter((u) => u.tools.includes(name)); const f = facts(items);
  const intro = items.length ? `Already paying for ${name}? ${items.length === 1 ? "Here's one vetted way" : `Here are ${items.length} vetted ways`} to get more out of it with AI, mostly for ${f.categories.slice(0, 2).map(([c]) => c.toLowerCase()).join(" and ")}. Each guide has a copy-paste prompt, setup steps and the honest monthly cost.` : `We haven't vetted a ${name} use case yet.`;
  return { items, intro, h1: `AI agents that work with ${name}` };
};
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const name = fromSlug(TOOLS, params.slug); if (!name) return {};
  const c = await copy(name);
  return { title: c.h1, description: c.intro.slice(0, 300), alternates: { canonical: `/tool/${params.slug}` }, openGraph: { title: c.h1, description: c.intro }, robots: c.items.length < MIN_INDEX ? { index: false } : undefined };
}
export default async function Page({ params }: { params: { slug: string } }) {
  const name = fromSlug(TOOLS, params.slug); if (!name) notFound();
  const c = await copy(name);
  return <Landing kind="tool" name={name} h1={c.h1} intro={c.intro} items={c.items} path={`/tool/${params.slug}`} />;
}
