import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Landing from "@/components/Landing";
import { getUseCases } from "@/lib/data";
import { CATEGORIES, slugify, fromSlug } from "@/lib/taxonomy";
import { CATEGORY_COPY } from "@/lib/landing-copy";
import { MIN_INDEX } from "@/lib/landing";
export const revalidate = 3600;
export function generateStaticParams() { return CATEGORIES.map((x) => ({ slug: slugify(x) })); }
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const name = fromSlug(CATEGORIES, params.slug); if (!name) return {};
  const c = CATEGORY_COPY[name]; const n = (await getUseCases()).filter((u) => u.category === name).length;
  return { title: c.h1, description: `${n} vetted AI agent use cases for ${c.pain}. ${c.intro}`.slice(0, 300), alternates: { canonical: `/category/${params.slug}` }, openGraph: { title: c.h1, description: c.intro }, robots: n < MIN_INDEX ? { index: false } : undefined };
}
export default async function Page({ params }: { params: { slug: string } }) {
  const name = fromSlug(CATEGORIES, params.slug); if (!name) notFound();
  const c = CATEGORY_COPY[name]; const items = (await getUseCases()).filter((u) => u.category === name);
  return <Landing kind="problem" name={name} h1={c.h1} intro={c.intro} items={items} path={`/category/${params.slug}`} />;
}
