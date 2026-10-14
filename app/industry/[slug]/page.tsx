import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Landing from "@/components/Landing";
import { getUseCases } from "@/lib/data";
import { INDUSTRIES, slugify, fromSlug } from "@/lib/taxonomy";
import { INDUSTRY_COPY } from "@/lib/landing-copy";
import { MIN_INDEX } from "@/lib/landing";
export const revalidate = 3600;
export function generateStaticParams() { return INDUSTRIES.map((x) => ({ slug: slugify(x) })); }
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const name = fromSlug(INDUSTRIES, params.slug); if (!name) return {};
  const c = INDUSTRY_COPY[name]; const n = (await getUseCases()).filter((u) => u.industries.includes(name)).length;
  return { title: c.h1, description: `${n} vetted AI agent use cases. ${c.intro}`.slice(0, 300), alternates: { canonical: `/industry/${params.slug}` }, openGraph: { title: c.h1, description: c.intro }, robots: n < MIN_INDEX ? { index: false } : undefined };
}
export default async function Page({ params }: { params: { slug: string } }) {
  const name = fromSlug(INDUSTRIES, params.slug); if (!name) notFound();
  const c = INDUSTRY_COPY[name]; const items = (await getUseCases()).filter((u) => u.industries.includes(name));
  return <Landing kind="industry" name={name} h1={c.h1} intro={c.intro} items={items} path={`/industry/${params.slug}`} />;
}
