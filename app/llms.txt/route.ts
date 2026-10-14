import { getUseCases } from "@/lib/data";
import { CATEGORIES, INDUSTRIES, slugify, SITE_URL } from "@/lib/taxonomy";
import { PACKS } from "@/lib/packs";
import { getIssues } from "@/lib/issues";
export const revalidate = 3600;
// https://llmstxt.org — a plain map of the site for language models.
export async function GET() {
  const all = await getUseCases();
  const byCat = CATEGORIES.map((c) => [c, all.filter((u) => u.category === c)] as const).filter(([, xs]) => xs.length);
  const body = `# SMB Agents AI

> A free, plain-English directory of vetted AI agent and automation use cases for small businesses (under 200 people). Each entry covers the problem, the tools, setup time, monthly cost, a copy-paste prompt and step-by-step setup. Outcomes are stated as goals, not guaranteed results. Made by Hello Operator.

## Tools
- [Agent Finder](${SITE_URL}/finder): describe a business in a sentence, get the top 5 use cases
- [AI Readiness Quiz](${SITE_URL}/quiz): 3-minute quiz with a score and a 5-agent plan
- [Industry packs](${SITE_URL}/packs): curated starter sets by industry
- [The Switchboard archive](${SITE_URL}/switchboard): twice-weekly newsletter issues

## Use cases by problem
${byCat.map(([c, xs]) => `### [${c}](${SITE_URL}/category/${slugify(c)})\n${xs.map((u) => `- [${u.title}](${SITE_URL}/use-case/${u.slug}): ${u.result.replace(/^Goal: /, "")}. ${u.difficulty}, ${u.setup_time} setup, ${u.monthly_cost}/month. Tools: ${u.tools.join(", ")}.`).join("\n")}`).join("\n\n")}

## Industries
${INDUSTRIES.map((i) => `- [${i}](${SITE_URL}/industry/${slugify(i)})`).join("\n")}

## Packs
${PACKS.map((p) => `- [${p.name}](${SITE_URL}/packs/${p.slug}): for ${p.who}`).join("\n")}

## Newsletter issues
${getIssues().map((i) => `- [No. ${i.number}: ${i.title}](${SITE_URL}/switchboard/${i.number})`).join("\n")}

## Optional
- [About](${SITE_URL}/about)
- [Submit a use case](${SITE_URL}/submit)
- [Sponsor](${SITE_URL}/sponsor)
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
