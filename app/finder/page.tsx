import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import { getUseCases } from "@/lib/data";
import Finder from "./Finder";
export const revalidate = 3600;
export const metadata: Metadata = { title: "Agent Finder", description: "Describe your business in a sentence and get the five AI agent use cases most worth setting up first. Free, no signup.", alternates: { canonical: "/finder" } };
export default async function Page() {
  const all = (await getUseCases()).map(({ slug, title, result, category, industries, tools, difficulty, setup_time, monthly_cost }) => ({ slug, title, result, category, industries, tools, difficulty, setup_time, monthly_cost }));
  return (<article className="mx-auto max-w-3xl pt-8 sm:pt-12">
    <PageHead eyebrow="Agent Finder" title="Describe your business. Get your top five."><p>One or two sentences: what you do, how big you are, what's driving you up the wall. We'll point you at the five use cases worth trying first. No signup, no sales call, no "let's hop on a quick chat."</p></PageHead>
    <Finder all={all} />
  </article>);
}
