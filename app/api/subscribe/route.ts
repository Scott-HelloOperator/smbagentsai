import { NextResponse } from "next/server";
import { subscribe, refLink } from "@/lib/referrals";
export async function POST(req: Request) {
  const { email, ref, source } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  try {
    const r = await subscribe(email, { ref, source: typeof source === "string" ? source.slice(0, 40) : "site" });
    return NextResponse.json({ ok: true, stored: r.stored, code: r.code, link: r.code ? refLink(r.code) : null });
  } catch (e) { console.error("[subscribe]", e); return NextResponse.json({ error: "Could not subscribe" }, { status: 500 }); }
}
