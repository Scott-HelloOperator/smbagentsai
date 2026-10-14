import type { UseCase } from "./data";
import { INDUSTRIES } from "./taxonomy";

export type Answers = { size: string; industry: string; tools: string[]; sinks: string[]; leads: string; invoices: string; docs: string; comfort: string; ai: string };
type Opt = { v: string; label: string; pts?: number };
export type Question = { id: keyof Answers; q: string; hint?: string; multi?: number; opts: Opt[] };

export const QUESTIONS: Question[] = [
  { id: "size", q: "How many people work in your business?", opts: [{ v: "solo", label: "Just me", pts: 3 }, { v: "2-10", label: "2–10", pts: 5 }, { v: "11-50", label: "11–50", pts: 5 }, { v: "51-200", label: "51–200", pts: 4 }] },
  { id: "industry", q: "What kind of business is it?", opts: [...INDUSTRIES.map((i) => ({ v: i, label: i })), { v: "Other", label: "Something else" }] },
  { id: "tools", q: "Which of these do you already use?", hint: "Tap all that apply", multi: 9, opts: [
    { v: "books", label: "QuickBooks or Xero", pts: 5 }, { v: "field", label: "Jobber, Housecall Pro or ServiceTitan", pts: 5 }, { v: "crm", label: "A CRM (HubSpot, GoHighLevel…)", pts: 5 },
    { v: "google", label: "Gmail / Google Workspace", pts: 4 }, { v: "microsoft", label: "Outlook / Microsoft 365", pts: 4 }, { v: "payments", label: "Square, Shopify or Stripe", pts: 4 },
    { v: "calendar", label: "Online booking (Calendly etc.)", pts: 3 }, { v: "automation", label: "Zapier, Make or n8n", pts: 6 }, { v: "none", label: "Mostly paper & spreadsheets", pts: 0 } ] },
  { id: "sinks", q: "What eats the most of your week?", hint: "Pick up to 3", multi: 3, opts: [
    { v: "Get paid faster", label: "Chasing payments" }, { v: "Win more leads", label: "Following up on leads" }, { v: "Keep customers happy", label: "Customer questions & reviews" },
    { v: "Run the schedule", label: "Scheduling & dispatch" }, { v: "Hire & onboard", label: "Hiring & training" }, { v: "Cash & books", label: "Bookkeeping" },
    { v: "Paperwork & compliance", label: "Estimates, contracts & paperwork" }, { v: "Owner's inbox & admin", label: "My inbox & admin" }, { v: "Marketing on autopilot", label: "Marketing & social" } ] },
  { id: "leads", q: "How fast do new leads usually hear back?", opts: [{ v: "fast", label: "Within an hour", pts: 8 }, { v: "day", label: "Same day", pts: 5 }, { v: "slow", label: "Next day or later", pts: 2 }, { v: "unknown", label: "Honestly, not sure", pts: 1 }] },
  { id: "invoices", q: "How do overdue invoices get chased?", opts: [{ v: "auto", label: "Automatic reminders", pts: 8 }, { v: "manual", label: "Someone does it by hand", pts: 4 }, { v: "rarely", label: "When we remember", pts: 1 }] },
  { id: "docs", q: "Are your key processes written down?", opts: [{ v: "most", label: "Most of them", pts: 12 }, { v: "some", label: "A few", pts: 6 }, { v: "head", label: "They live in my head", pts: 1 }] },
  { id: "comfort", q: "How comfortable are you setting up new software?", opts: [{ v: "4", label: "I set things up myself", pts: 15 }, { v: "3", label: "Fine with a good tutorial", pts: 11 }, { v: "2", label: "I'd rather someone help", pts: 6 }, { v: "1", label: "Not my thing", pts: 2 }] },
  { id: "ai", q: "How much have you used AI tools like ChatGPT so far?", opts: [{ v: "daily", label: "Most days", pts: 12 }, { v: "some", label: "Tried it a few times", pts: 7 }, { v: "never", label: "Not yet", pts: 2 }] },
];

const TOOL_MAP: Record<string, string[]> = { books: ["QuickBooks", "Xero"], field: ["Jobber", "Housecall Pro", "ServiceTitan"], crm: ["HubSpot", "GoHighLevel"], google: ["Gmail", "Google Workspace"],
  microsoft: ["Outlook", "Microsoft 365"], payments: ["Square", "Shopify", "Stripe"], calendar: ["Calendly"], automation: ["Zapier", "Make", "n8n"] };

export function score(a: Answers): number {
  const pts = (id: keyof Answers, v: string) => QUESTIONS.find((q) => q.id === id)!.opts.find((o) => o.v === v)?.pts ?? 0;
  const toolPts = Math.min(30, (a.tools || []).reduce((s, t) => s + pts("tools", t), 0));
  const raw = pts("size", a.size) + toolPts + pts("leads", a.leads) + pts("invoices", a.invoices) + pts("docs", a.docs) + pts("comfort", a.comfort) + pts("ai", a.ai);
  return Math.max(5, Math.min(100, Math.round(raw))); // max raw = 5+30+8+8+12+15+12 = 90 → scaled below
}
export const scaled = (a: Answers) => Math.min(100, Math.round((score(a) / 90) * 100));

export function verdict(s: number) {
  if (s >= 75) return { label: "Ready to roll", line: "Your systems are digital and you're comfortable with tech. You can start running agents this month." };
  if (s >= 50) return { label: "Nearly there", line: "You have the foundations. A couple of quick wins will make everything else easier." };
  if (s >= 30) return { label: "Getting started", line: "Start with one no-code win and write down how you do it today. That's most of the battle." };
  return { label: "Square one (that's fine)", line: "Begin with simple AI drafting in tools you already use — no setup needed." };
}

export function plan(a: Answers, all: UseCase[], n = 5): UseCase[] {
  const tools = new Set((a.tools || []).flatMap((t) => TOOL_MAP[t] || []));
  const comfort = Number(a.comfort || 2);
  const ranked = all.map((u) => {
    let s = 0;
    const sinkIdx = (a.sinks || []).indexOf(u.category); if (sinkIdx >= 0) s += 6 - sinkIdx;
    if (u.industries.includes(a.industry)) s += 3;
    s += Math.min(3, u.tools.filter((t) => tools.has(t)).length * 1.5);
    if (u.difficulty === "No-code") s += comfort <= 2 ? 2 : 1;
    if (u.difficulty === "Needs help" && comfort <= 2) s -= 2;
    if (u.impact === "High") s += 1;
    if (!u.is_example) s += 0.5;
    return { u, s };
  }).sort((x, y) => y.s - x.s);
  const out: UseCase[] = []; const perCat: Record<string, number> = {};
  for (const { u } of ranked) { if ((perCat[u.category] || 0) >= 2) continue; perCat[u.category] = (perCat[u.category] || 0) + 1; out.push(u); if (out.length === n) break; }
  return out;
}

// Fallback (no Supabase): result id encodes the answers.
export const encodeAnswers = (a: Answers) => "a_" + Buffer.from(JSON.stringify(a)).toString("base64url");
export const decodeAnswers = (id: string): Answers | null => { try { return id.startsWith("a_") ? JSON.parse(Buffer.from(id.slice(2), "base64url").toString()) : null; } catch { return null; } };
