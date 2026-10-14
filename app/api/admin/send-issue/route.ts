import { NextResponse } from "next/server";
import { adminClient } from "@/lib/data";
import { isAdmin, adminTokenFrom, sendEmail, emailProvider, validEmail } from "@/lib/server";
import { getIssue } from "@/lib/issues";
import { renderIssue, MAILING_ADDRESS } from "@/lib/emails";
import { countReferrals, requireConfirm } from "@/lib/referrals";
import { SITE_URL } from "@/lib/taxonomy";
export const dynamic = "force-dynamic";
export const maxDuration = 300;
/**
 * POST /api/admin/send-issue  (Authorization: Bearer <admin token>)
 * body: { issue: 1, mode: "test", to: ["a@b.com"] }  -> [TEST] copies to listed addresses
 *       { issue: 1, mode: "all", confirm: "SEND ISSUE 1" } -> every active subscriber (confirmed-only once double opt-in is on)
 * Refuses to send to the list without an email provider and a CAN-SPAM mailing address. Skips anyone already sent this issue.
 */
export async function POST(req: Request) {
  if (!(await isAdmin(adminTokenFrom(req)))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({})); const issue = getIssue(Number(b.issue));
  if (!issue) return NextResponse.json({ error: "Unknown issue" }, { status: 404 });
  if (!emailProvider()) return NextResponse.json({ error: "No email provider. Set RESEND_API_KEY and EMAIL_FROM in Vercel." }, { status: 412 });
  const db = adminClient()!;
  let recipients: { email: string; unsub_token: string | null; ref_code: string | null }[] = [];
  if (b.mode === "test") {
    const to = (Array.isArray(b.to) ? b.to : []).filter(validEmail).slice(0, 10);
    for (const email of to) { const { data } = await db.from("subscribers").select("email,unsub_token,ref_code").eq("email", email.toLowerCase()).maybeSingle(); recipients.push(data || { email, unsub_token: null, ref_code: null }); }
  } else if (b.mode === "all") {
    if (b.confirm !== `SEND ISSUE ${issue.number}`) return NextResponse.json({ error: `Pass confirm: "SEND ISSUE ${issue.number}"` }, { status: 400 });
    if (!MAILING_ADDRESS) return NextResponse.json({ error: "Set NEWSLETTER_ADDRESS (CAN-SPAM physical mailing address) before sending to the list." }, { status: 412 });
    let q = db.from("subscribers").select("email,unsub_token,ref_code").is("unsubscribed_at", null).limit(5000);
    if (requireConfirm()) q = q.not("confirmed_at", "is", null);
    const { data } = await q; const { data: sent } = await db.from("newsletter_sends").select("email").eq("issue", issue.number).eq("status", "sent");
    const done = new Set((sent || []).map((s) => s.email)); recipients = (data || []).filter((r) => !done.has(r.email));
  } else return NextResponse.json({ error: "mode must be test or all" }, { status: 400 });
  const results: { email: string; ok: boolean; error?: string }[] = [];
  for (const r of recipients) {
    const refCount = r.ref_code ? (await countReferrals(r.ref_code)).count : 0;
    const m = renderIssue(issue, { unsubToken: r.unsub_token, refCode: r.ref_code, refCount });
    const unsub = r.unsub_token ? `${SITE_URL}/api/unsubscribe?t=${r.unsub_token}` : `${SITE_URL}/unsubscribe`;
    const err = await sendEmail({ to: r.email, subject: (b.mode === "test" ? "[TEST] " : "") + m.subject, html: m.html,
      headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } });
    if (b.mode === "all") await db.from("newsletter_sends").insert({ issue: issue.number, email: r.email, status: err ? "failed" : "sent", error: err });
    results.push({ email: r.email, ok: !err, error: err || undefined });
    await new Promise((res) => setTimeout(res, 120)); // stay under Resend's rate limit
  }
  return NextResponse.json({ issue: issue.number, mode: b.mode, sent: results.filter((r) => r.ok).length, failed: results.filter((r) => !r.ok) });
}
