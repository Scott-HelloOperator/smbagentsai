import type { UseCase } from "./data";
const DIFF = ["No-code", "Light setup", "Needs help"];
const minutes = (s: string) => { const m = s.toLowerCase(); const n = parseFloat(m) || 1; if (/half a day/.test(m)) return 240; if (/day/.test(m)) return n * 480; if (/half a day/.test(m)) return 240; if (/hour/.test(m)) return n * 60; if (/min/.test(m)) return n; return 9999; };
const costLow = (s: string) => { const m = s.match(/\$(\d+)/); return /included/i.test(s) ? 0 : m ? Number(m[1]) : 999; };
const count = (xs: string[]) => [...xs.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]);
export const MIN_INDEX = 2; // pages with fewer cards are noindex + left out of the sitemap
export function facts(items: UseCase[]) {
  const byDiff = DIFF.map((d) => [d, items.filter((u) => u.difficulty === d).length] as const).filter(([, n]) => n);
  const rank = (u: UseCase) => (u.impact === "High" ? 0 : 1) * 10 + DIFF.indexOf(u.difficulty) * 3 + Math.min(3, minutes(u.setup_time) / 120);
  const sorted = [...items].sort((a, b) => rank(a) - rank(b) || a.title.localeCompare(b.title));
  const quickest = [...items].sort((a, b) => minutes(a.setup_time) - minutes(b.setup_time))[0];
  const cheapest = [...items].sort((a, b) => costLow(a.monthly_cost) - costLow(b.monthly_cost))[0];
  return { n: items.length, byDiff, sorted, start: sorted[0], quickest, cheapest, high: items.filter((u) => u.impact === "High").length,
    tools: count(items.flatMap((u) => u.tools)), industries: count(items.flatMap((u) => u.industries)), categories: count(items.map((u) => u.category)) };
}
export function faq(name: string, f: ReturnType<typeof facts>, kind: "problem" | "industry" | "tool") {
  if (!f.n) return [];
  const subj = kind === "tool" ? `with ${name}` : kind === "industry" ? `for ${name.toLowerCase()}` : `for ${name.toLowerCase()}`;
  const q: { q: string; a: string }[] = [
    { q: `What's the easiest AI agent to start with ${subj}?`, a: `Start with "${f.start.title}". It's rated ${f.start.difficulty.toLowerCase()}, takes about ${f.start.setup_time.toLowerCase()} to set up and costs ${f.start.monthly_cost} a month.` },
    { q: `How long does setup take?`, a: `The quickest here is "${f.quickest.title}" at ${f.quickest.setup_time.toLowerCase()}. ${f.byDiff.map(([d, n]) => `${n} ${n === 1 ? "is" : "are"} ${d.toLowerCase()}`).join(", ")}.` },
    { q: `What does it cost?`, a: `Most run on tools you may already pay for. The lowest-cost option here is "${f.cheapest.title}" (${f.cheapest.monthly_cost}/month).` },
  ];
  if (kind !== "tool" && f.tools.length) q.push({ q: `Which tools do these use?`, a: `Most often ${f.tools.slice(0, 4).map(([t]) => t).join(", ")}. Each guide lists the exact tools and a copy-paste prompt.` });
  return q;
}
