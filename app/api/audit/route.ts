import { NextResponse } from "next/server";
import { status, AUDIT_AT } from "@/lib/referrals";
import { adminClient } from "@/lib/data";
import { recordForm, str } from "@/lib/server";
// 10-referral reward: a written AI audit delivered async (PDF or recorded video). Never a call.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const s = await status(b.code);
  if (!s) return NextResponse.json({ error: "Unknown code" }, { status: 404 });
  if (s.count < AUDIT_AT) return NextResponse.json({ error: `Needs ${AUDIT_AT} confirmed referrals` }, { status: 403 });
  const f = { business: str(b.business, 300), website: str(b.website, 300), tools: str(b.tools, 500), headache: str(b.headache, 3000), format: ["PDF", "Video walkthrough"].includes(b.format) ? b.format : "PDF" };
  const notes = JSON.stringify(f);
  const db = adminClient()!;
  const { error } = await db.from("audit_requests").upsert({ email: s.email, ref_code: s.code, referral_count: s.count, quiz_id: s.quizId, notes }, { onConflict: "ref_code", ignoreDuplicates: true });
  if (error) return NextResponse.json({ error: "Could not save" }, { status: 500 });
  await recordForm(req, "audit", { email: s.email, ref_code: s.code, referrals: String(s.count), quiz: s.quizId || "", ...f });
  return NextResponse.json({ ok: true });
}
