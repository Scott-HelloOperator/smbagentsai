import { NextResponse } from "next/server";
import { subscribe, refLink, isDisposable, requireConfirm } from "@/lib/referrals";
import { ipHash, rateLimit, validEmail } from "@/lib/server";
export async function POST(req: Request) {
  const { email, ref, source, hp } = await req.json().catch(() => ({}));
  if (hp) return NextResponse.json({ ok: true, stored: false, code: null, link: null });
  if (!validEmail(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  if (isDisposable(email)) return NextResponse.json({ error: "Please use a real inbox. Disposable addresses can't get the referral rewards." }, { status: 400 });
  const ip = ipHash(req);
  if (!(await rateLimit(`sub:${ip}`, 6, 3600))) return NextResponse.json({ error: "Too many signups from this network. Try again later." }, { status: 429 });
  try {
    const r = await subscribe(email, { ref, source: typeof source === "string" ? source.slice(0, 40) : "site", ip });
    return NextResponse.json({ ok: true, stored: r.stored, code: r.code, link: r.code ? refLink(r.code) : null, existing: r.existing, confirm: requireConfirm() });
  } catch (e) { console.error("[subscribe]", e); return NextResponse.json({ error: "Could not subscribe. Please try again." }, { status: 500 }); }
}
