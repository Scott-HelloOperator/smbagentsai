import fs from "fs";
import path from "path";
export type Issue = { number: number; slug: string; date: string; subject: string; preheader: string; title: string; body: string };
const DIR = path.join(process.cwd(), "content/switchboard");
function parse(file: string): Issue {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/); if (!m) throw new Error(`bad issue ${file}`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) { const i = line.indexOf(":"); if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, "$1"); }
  return { number: Number(meta.number), slug: meta.slug, date: meta.date, subject: meta.subject, preheader: meta.preheader, title: meta.title, body: m[2].trim() };
}
export const getIssues = () => fs.readdirSync(DIR).filter((f) => f.endsWith(".md")).map(parse).sort((a, b) => b.number - a.number);
export const getIssue = (n: number) => getIssues().find((i) => i.number === n);
export const RATINGS = [{ v: "fire", e: "🔥", label: "Fire" }, { v: "decent", e: "👍", label: "Decent" }, { v: "poop", e: "💩", label: "Stinker" }] as const;
