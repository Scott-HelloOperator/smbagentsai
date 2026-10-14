import { NextResponse } from "next/server";
import { adminClient } from "@/lib/data";
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (!b.email || !b.story) return NextResponse.json({ error: "Email and story are required" }, { status: 400 });
  const row = { name: b.name || null, email: String(b.email), business: b.business || null, story: String(b.story).slice(0, 10000), tools: b.tools || null, source_url: b.source_url || null };
  const db = adminClient();
  if (!db) { console.info("[submit] Supabase not configured; no-op", row.email); return NextResponse.json({ ok: true, stored: false }); }
  const { error } = await db.from("submissions").insert(row);
  return error ? NextResponse.json({ error: "Could not save" }, { status: 500 }) : NextResponse.json({ ok: true, stored: true });
}
