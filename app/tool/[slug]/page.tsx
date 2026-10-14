import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Landing from "@/components/Landing";
import { getUseCases } from "@/lib/data";
import { TOOLS, slugify, fromSlug } from "@/lib/taxonomy";
export const revalidate = 3600;
export function generateStaticParams() { return TOOLS.map((x) => ({ slug: slugify(x) })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const name = fromSlug(TOOLS, params.slug); if (!name) return {};
  const title = false ? `${name}: AI agent use cases` : `AI agents for ${name}`;
  return { title, description: `Practical AI agent use cases for small businesses — ${name}.`, alternates: { canonical: `/tool/${params.slug}` }, openGraph: { title } };
}
export default async function Page({ params }: { params: { slug: string } }) {
  const name = fromSlug(TOOLS, params.slug); if (!name) notFound();
  const items = await getUseCases();
  return <Landing kind="Tool" name={name} items={items} initial={{ tool: name }} />;
}
