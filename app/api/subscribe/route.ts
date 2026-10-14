import { NextResponse } from "next/server";
import { adminClient } from "@/lib/data";
export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  const db = adminClient();
  if (!db) { console.info("[subscribe] Supabase not configured; no-op for", email); return NextResponse.json({ ok: true, stored: false }); }
  const { error } = await db.from("subscribers").upsert({ email: email.toLowerCase(), source: "site" }, { onConflict: "email" });
  return error ? NextResponse.json({ error: "Could not subscribe" }, { status: 500 }) : NextResponse.json({ ok: true, stored: true });
}
