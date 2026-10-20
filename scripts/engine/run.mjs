#!/usr/bin/env node
// Daily content engine: discover -> prefilter -> dedupe -> LLM rewrite -> validate -> insert -> revalidate.
// Usage: node scripts/engine/run.mjs [--dry-run] [--days=7] [--max=15]
import { fetchAll } from "./sources.mjs";
import { prefilter } from "./prefilter.mjs";
import { rewrite, validate, provider } from "./llm.mjs";

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, "").split("=")).map(([k, v]) => [k, v ?? true]));
const DRY = Boolean(args["dry-run"]), DAYS = Number(args.days || 7), MAX = Number(args.max || process.env.ENGINE_MAX_PER_RUN || 15);
const SB = process.env.NEXT_PUBLIC_SUPABASE_URL, KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = (path, init = {}) => fetch(`${SB}/rest/v1/${path}`, { ...init, headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", ...(init.headers || {}) } });
const slugify = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

async function seenUrls() {
  if (!SB || !KEY) return new Set();
  const [a, b] = await Promise.all([sb("engine_seen?select=source_url"), sb("use_cases?select=source_url&source_url=not.is.null")]);
  return new Set([...(await a.json()), ...(await b.json())].map((r) => r.source_url));
}
const markSeen = (c, status, reason) => sb("engine_seen?on_conflict=source_url", { method: "POST", headers: { Prefer: "resolution=merge-duplicates" },
  body: JSON.stringify({ source_url: c.url, source: c.source, title: c.title.slice(0, 300), status, reason: reason?.slice(0, 500) }) });

const fetched = await fetchAll({ days: DAYS });
const seen = await seenUrls();
const fresh = fetched.filter((c) => !seen.has(c.url));
const scored = fresh.map((c) => ({ c, f: prefilter(c) }));
const passing = scored.filter((x) => x.f.pass).sort((a, b) => b.f.score - a.f.score);
console.log(`fetched=${fetched.length} new=${fresh.length} prefilter_pass=${passing.length} provider=${provider() || "none"}`);

if (DRY || !provider()) {
  if (!provider()) console.log("No LLM key set (OPENAI_API_KEY or ANTHROPIC_API_KEY) — showing prefilter candidates only, nothing written.");
  for (const { c, f } of passing.slice(0, Number(args.show || 15)))
    console.log(`\n[${f.score}] ${c.source} | ${c.title}\n  ${c.url}\n  ${c.text.slice(0, 220)}…`);
  process.exit(0);
}
if (!SB || !KEY) { console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }

let inserted = 0;
for (const { c } of passing.slice(0, MAX)) {
  try {
    const o = await rewrite(c);
    const errs = validate(o, c);
    if (errs.length) { console.log(`REJECT ${c.url}: ${errs.join("; ")}`); await markSeen(c, "rejected", errs.join("; ")); continue; }
    const row = { slug: `${slugify(o.title)}-${Math.random().toString(36).slice(2, 6)}`, title: o.title, category: o.category, result: o.result, summary: o.summary,
      what_they_did: o.what_they_did, how_it_went: o.how_it_went, worth_knowing: o.worth_knowing, prompt: o.prompt, steps: o.steps,
      tools: o.tools || [], agent: o.agent || "Not stated", industries: o.industries, difficulty: o.difficulty, setup_time: o.setup_time || "Not stated",
      monthly_cost: o.monthly_cost || "Not stated", impact: ["High", "Medium", "Low"].includes(o.impact) ? o.impact : "Medium",
      safety: { whatCanGoWrong: o.safety.whatCanGoWrong.trim(), whenToStop: o.safety.whenToStop.trim(), humanHandoff: o.safety.humanHandoff.trim() }, reads_untrusted_content: o.reads_untrusted_content,
      source_url: c.url, published_at: new Date().toISOString().slice(0, 10), is_example: false, is_published: process.env.ENGINE_AUTO_PUBLISH !== "false" };
    const r = await sb("use_cases", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(row) });
    if (!r.ok) throw new Error(`insert ${r.status} ${await r.text()}`);
    await markSeen(c, "accepted", null); inserted++;
    console.log(`ACCEPT ${row.slug} <- ${c.url}`);
  } catch (e) { console.warn(`ERROR ${c.url}: ${e.message}`); await markSeen(c, "error", e.message); }
}
console.log(`inserted=${inserted}`);
if (inserted && process.env.REVALIDATE_URL && process.env.REVALIDATE_SECRET) {
  const r = await fetch(process.env.REVALIDATE_URL, { method: "POST", headers: { "x-revalidate-secret": process.env.REVALIDATE_SECRET } });
  console.log(`revalidate ${r.status}`);
}
