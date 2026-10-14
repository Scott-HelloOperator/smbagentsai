import { NextResponse } from "next/server";
import { adminClient } from "@/lib/data";
import { SITE_URL } from "@/lib/taxonomy";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get("t") || ""; const db = adminClient();
  let code = "";
  if (db && /^[a-f0-9]{32}$/.test(t)) {
    const { data } = await db.from("subscribers").select("ref_code,confirmed_at").eq("confirm_token", t).maybeSingle();
    if (data) { code = data.ref_code; if (!data.confirmed_at) await db.from("subscribers").update({ confirmed_at: new Date().toISOString(), unsubscribed_at: null }).eq("confirm_token", t); }
  }
  return NextResponse.redirect(`${SITE_URL}/switchboard/confirmed${code ? `?code=${code}` : "?bad=1"}`, 303);
}
