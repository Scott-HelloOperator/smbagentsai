import { NextResponse } from "next/server";
import { adminClient } from "@/lib/data";
import { SITE_URL } from "@/lib/taxonomy";
export const dynamic = "force-dynamic";
async function unsub(t: string | null) {
  const db = adminClient(); if (!db || !t || !/^[a-f0-9]{32}$/.test(t)) return false;
  const { data } = await db.from("subscribers").update({ unsubscribed_at: new Date().toISOString() }).eq("unsub_token", t).select("id");
  return Boolean(data?.length);
}
// GET from the footer link; POST for RFC 8058 one-click (List-Unsubscribe-Post).
export async function GET(req: Request) { const ok = await unsub(new URL(req.url).searchParams.get("t")); return NextResponse.redirect(`${SITE_URL}/unsubscribe?${ok ? "done=1" : "bad=1"}`, 303); }
export async function POST(req: Request) { const ok = await unsub(new URL(req.url).searchParams.get("t")); return NextResponse.json({ ok }); }
