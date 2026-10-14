import { NextResponse } from "next/server";
import { adminClient } from "@/lib/data";
import { recordForm, rateLimit, ipHash, validEmail, str } from "@/lib/server";
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (b.hp) return NextResponse.json({ ok: true });
  if (!validEmail(b.email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  const row = { name: str(b.name, 120), business: str(b.business, 200) || null, email: b.email.toLowerCase(), credit_url: str(b.credit_url, 300) || null,
    title: str(b.title, 160), story: str(b.story, 5000), tools: str(b.tools, 300) || null, hours_saved: str(b.hours_saved, 60) || null, ip_hash: ipHash(req) };
  if (!row.name || row.title.length < 5 || row.story.length < 20) return NextResponse.json({ error: "Name, a headline and a few sentences about the win, please." }, { status: 400 });
  if (row.credit_url && !/^https?:\/\//.test(row.credit_url)) return NextResponse.json({ error: "Credit link should start with https://" }, { status: 400 });
  if (!(await rateLimit(`win:${row.ip_hash}`, 3, 3600))) return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });
  const db = adminClient(); let id: string | null = null;
  if (db) { const { data, error } = await db.from("wins").insert(row).select("id").single(); if (!error) id = data.id; }
  const { ip_hash, ...fields } = row; void ip_hash;
  const r = await recordForm(req, "win", { ...fields, win_id: id || "" } as Record<string, unknown>);
  return NextResponse.json({ ok: true, id: r.id, delivered: r.delivered });
}
