import { NextResponse } from "next/server";
import { status, AUDIT_AT, notify } from "@/lib/referrals";
import { adminClient } from "@/lib/data";
export async function POST(req: Request) {
  const { code, notes } = await req.json().catch(() => ({}));
  const s = await status(code);
  if (!s) return NextResponse.json({ error: "Unknown code" }, { status: 404 });
  if (s.count < AUDIT_AT) return NextResponse.json({ error: `Needs ${AUDIT_AT} referrals` }, { status: 403 });
  const db = adminClient()!;
  const { error } = await db.from("audit_requests").upsert({ email: s.email, ref_code: s.code, referral_count: s.count, quiz_id: s.quizId, notes: typeof notes === "string" ? notes.slice(0, 2000) : null }, { onConflict: "ref_code", ignoreDuplicates: true });
  if (error) return NextResponse.json({ error: "Could not save" }, { status: 500 });
  await notify("audit_requested", s.email, { code: s.code });
  return NextResponse.json({ ok: true });
}
