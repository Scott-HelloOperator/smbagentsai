import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Landing from "@/components/Landing";
import { getUseCases } from "@/lib/data";
import { INDUSTRIES, slugify, fromSlug } from "@/lib/taxonomy";
export const revalidate = 3600;
export function generateStaticParams() { return INDUSTRIES.map((x) => ({ slug: slugify(x) })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const name = fromSlug(INDUSTRIES, params.slug); if (!name) return {};
  const title = false ? `${name}: AI agent use cases` : `AI agents for ${name}`;
  return { title, description: `Practical AI agent use cases for small businesses — ${name}.`, alternates: { canonical: `/industry/${params.slug}` }, openGraph: { title } };
}
export default async function Page({ params }: { params: { slug: string } }) {
  const name = fromSlug(INDUSTRIES, params.slug); if (!name) notFound();
  const items = await getUseCases();
  return <Landing kind="Industry" name={name} items={items} initial={{ industry: name }} />;
}
