// Pluggable LLM provider. Set ENGINE_LLM_PROVIDER=openai|anthropic (auto-detected from whichever key exists).
import { CATEGORIES, INDUSTRIES, TOOLS, DIFFICULTIES } from "./taxonomy.mjs";
import { goalErrors, GOALS_RULES } from "./goals.mjs";

export function provider() {
  const p = process.env.ENGINE_LLM_PROVIDER || (process.env.OPENAI_API_KEY ? "openai" : process.env.ANTHROPIC_API_KEY ? "anthropic" : null);
  return p;
}

const SYSTEM = `You are an editor for SMBAgentsAI.com, a plain-English directory of real AI agent/automation use cases for small-business owners (<200 employees).
You receive ONE public post. Decide if it is a genuine, first-hand (or clearly reported) account of a small/medium business using AI or automation to get real value.
REJECT if: hype, promotion/ad for the poster's own product, crypto, get-rich-quick, purely a question with no implemented solution, developer-only/technical with no business outcome, enterprise (>200 staff), or too vague to describe what was done.
If ACCEPTED, rewrite into our schema. HARD RULES:
- Use ONLY facts in the post. Never invent numbers, names, tools, results, or quotes. If the post gives no number, describe the result qualitatively.
${GOALS_RULES}
- "evidence" must be 1-3 short phrases copied VERBATIM from the post that support the result.
- Do not name or quote the poster. Say "a [type of business] owner".
- Plain English, no jargon, no hype. Title is outcome-style ("Answer every lead within 5 minutes").
- prompt: a reusable copy-paste prompt with [placeholders] a reader could use to replicate it.
- steps: 4-7 short setup steps grounded in what they did.
- category must be one of: ${CATEGORIES.join(" | ")}
- industries: subset of: ${INDUSTRIES.join(" | ")} (empty array if unclear)
- tools: names of tools mentioned in the post (prefer these spellings: ${TOOLS.join(", ")})
- difficulty: one of ${DIFFICULTIES.join(" | ")}
- setup_time / monthly_cost: from the post if stated, else "Not stated".
- impact: High | Medium | Low (your judgment of value to a typical SMB).
Respond with JSON only: {"accept":boolean,"reject_reason":string|null,"evidence":string[],"title","category","result","summary","what_they_did","how_it_went","worth_knowing","prompt","steps":string[],"tools":string[],"agent","industries":string[],"difficulty","setup_time","monthly_cost","impact"}`;

export async function rewrite(c) {
  const user = `SOURCE URL: ${c.url}\nSOURCE: ${c.source}\nTITLE: ${c.title}\nPOST:\n${c.text.slice(0, 12000)}`;
  const p = provider();
  let raw;
  if (p === "openai") {
    const r = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.ENGINE_LLM_MODEL || "gpt-4o-mini", temperature: 0.2, response_format: { type: "json_object" },
        messages: [{ role: "system", content: SYSTEM }, { role: "user", content: user }] }) });
    if (!r.ok) throw new Error(`openai ${r.status} ${await r.text()}`);
    raw = (await r.json()).choices[0].message.content;
  } else if (p === "anthropic") {
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST",
      headers: { "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.ENGINE_LLM_MODEL || "claude-3-5-haiku-latest", max_tokens: 2000, temperature: 0.2, system: SYSTEM,
        messages: [{ role: "user", content: user }] }) });
    if (!r.ok) throw new Error(`anthropic ${r.status} ${await r.text()}`);
    raw = (await r.json()).content[0].text;
  } else throw new Error("No LLM provider: set OPENAI_API_KEY or ANTHROPIC_API_KEY");
  return JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
}

// Post-LLM quality gates (grounding + schema).
export function validate(o, c) {
  const errs = [];
  const src = `${c.title} ${c.text}`.toLowerCase().replace(/\s+/g, " ");
  if (!o.accept) return [`llm rejected: ${o.reject_reason}`];
  for (const k of ["title", "category", "result", "summary", "what_they_did", "how_it_went", "worth_knowing", "prompt", "difficulty"]) if (!o[k] || typeof o[k] !== "string") errs.push(`missing ${k}`);
  if (!CATEGORIES.includes(o.category)) errs.push(`bad category ${o.category}`);
  if (!DIFFICULTIES.includes(o.difficulty)) errs.push(`bad difficulty`);
  if (!Array.isArray(o.steps) || o.steps.length < 3) errs.push("too few steps");
  if (!/\[[^\]]+\]/.test(o.prompt || "")) errs.push("prompt has no [placeholders]");
  if (!Array.isArray(o.evidence) || !o.evidence.length || !o.evidence.every((e) => src.includes(String(e).toLowerCase().replace(/\s+/g, " ").trim())))
    errs.push("evidence not verbatim in source");
  // Every number in result/how_it_went must appear in the source (no fabricated stats).
  const nums = `${o.result} ${o.how_it_went} ${o.summary}`.match(/\d[\d,.]*%?/g) || [];
  for (const n of nums) if (!src.includes(n.replace(/,/g, "")) && !src.includes(n)) errs.push(`number not in source: ${n}`);
  errs.push(...goalErrors(o, src));
  o.industries = (o.industries || []).filter((x) => INDUSTRIES.includes(x));
  return errs;
}
