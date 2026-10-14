import { NextResponse } from "next/server";
import { recordForm, rateLimit, ipHash, validEmail, str } from "@/lib/server";
import { adminClient } from "@/lib/data";
const KINDS: Record<string, string[]> = {
  sponsor: ["name", "email", "company", "website", "budget", "message"],
  contact: ["name", "email", "topic", "message"],
  help: ["name", "email", "business", "message"],
  submit: ["name", "email", "business", "story", "tools", "source_url"],
};
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const kind = String(b.kind || "");
  if (!KINDS[kind]) return NextResponse.json({ error: "Unknown form" }, { status: 400 });
  if (b.hp) return NextResponse.json({ ok: true }); // honeypot: pretend success
  if (!validEmail(b.email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  const main = kind === "submit" ? "story" : "message";
  if (str(b[main]).length < 5) return NextResponse.json({ error: "Please add a short message." }, { status: 400 });
  if (!(await rateLimit(`form:${kind}:${ipHash(req)}`, 5, 600))) return NextResponse.json({ error: "Too many submissions. Try again in a few minutes." }, { status: 429 });
  const fields: Record<string, string> = {};
  for (const k of KINDS[kind]) { const v = str(b[k], k === main ? 10000 : 500); if (v) fields[k] = v; }
  if (kind === "submit") { const db = adminClient(); if (db) await db.from("submissions").insert({ name: fields.name || null, email: fields.email, business: fields.business || null, story: fields.story, tools: fields.tools || null, source_url: fields.source_url || null }); }
  const r = await recordForm(req, kind, fields);
  if (!r.stored && !r.delivered) return NextResponse.json({ error: "Could not save. Please email scott@hellooperator.ai." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
