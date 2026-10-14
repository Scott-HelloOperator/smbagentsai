import { adminClient } from "./data";
import { SITE_URL } from "./taxonomy";
import { sendEmail, emailProvider, esc } from "./server";
import { welcomeEmail } from "./emails";
export const VAULT_AT = 3, AUDIT_AT = 10;
export const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => "abcdefghjkmnpqrstuvwxyz23456789"[b % 31]).join("");
export const token = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
export const refLink = (code: string) => `${SITE_URL}/?ref=${code}`;
export const cleanRef = (r: unknown) => (typeof r === "string" && /^[a-z0-9]{4,16}$/.test(r) ? r : null);

const DISPOSABLE = new Set(["mailinator.com","guerrillamail.com","10minutemail.com","tempmail.com","temp-mail.org","yopmail.com","trashmail.com","sharklasers.com","getnada.com","dispostable.com","maildrop.cc","throwawaymail.com","fakeinbox.com","mintemail.com","emailondeck.com","mohmal.com","tempmailo.com","burnermail.io","spamgourmet.com","mailnesia.com","grr.la","tmpmail.org","moakt.com","discard.email"]);
/** Canonical form used for uniqueness: lowercased, +tags stripped, gmail dots removed. */
export function normEmail(e: string) {
  let [u, d] = e.trim().toLowerCase().split("@"); if (!d) return e.toLowerCase();
  u = u.split("+")[0]; if (d === "googlemail.com") d = "gmail.com"; if (d === "gmail.com") u = u.replace(/\./g, "");
  return `${u}@${d}`;
}
export const isDisposable = (e: string) => DISPOSABLE.has(e.split("@")[1]?.toLowerCase() || "");
/** Referrals require double opt-in once an email provider exists. Until then: unique, non-disposable, IP-capped signups. */
export const requireConfirm = () => Boolean(emailProvider()) || process.env.REQUIRE_CONFIRM === "1";

/** Creates (or returns) a subscriber with a referral code. */
export async function subscribe(email: string, opts: { ref?: string | null; source?: string; quizId?: string | null; ip?: string | null } = {}) {
  const db = adminClient(); email = email.trim().toLowerCase();
  if (!db) return { code: null as string | null, stored: false, existing: false };
  const norm = normEmail(email);
  const { data: existing } = await db.from("subscribers").select("ref_code,email,unsubscribed_at").or(`email.eq."${email}",email_norm.eq."${norm}"`).limit(1).maybeSingle();
  if (existing?.ref_code) {
    const upd: Record<string, unknown> = {}; if (opts.quizId) upd.quiz_id = opts.quizId; if (existing.unsubscribed_at) upd.unsubscribed_at = null;
    if (Object.keys(upd).length) await db.from("subscribers").update(upd).eq("ref_code", existing.ref_code);
    return { code: existing.ref_code as string, stored: true, existing: true };
  }
  const code = newCode(), ref = cleanRef(opts.ref);
  const row: Record<string, unknown> = { email, email_norm: norm, source: opts.source || "site", ref_code: code, quiz_id: opts.quizId || null,
    confirm_token: token(), unsub_token: token(), ip_hash: opts.ip || null };
  if (ref) {
    const { data: r } = await db.from("subscribers").select("email_norm,ip_hash").eq("ref_code", ref).maybeSingle();
    // No self-referrals (same normalized email or same network as the referrer).
    if (r && r.email_norm !== norm && !(opts.ip && r.ip_hash && r.ip_hash === opts.ip)) row.referred_by = ref;
  }
  const { error } = await db.from("subscribers").insert(row);
  if (error) throw error;
  if (emailProvider()) { const m = welcomeEmail({ code, confirmToken: row.confirm_token as string, unsubToken: row.unsub_token as string }); await sendEmail({ to: email, ...m }); }
  return { code, stored: true, existing: false };
}

/** Counts referrals that pass anti-gaming rules. */
export async function countReferrals(code: string) {
  const db = adminClient(); if (!db) return { count: 0, pending: 0 };
  const { data: me } = await db.from("subscribers").select("ip_hash").eq("ref_code", code).maybeSingle();
  const { data } = await db.from("subscribers").select("email,email_norm,ip_hash,confirmed_at,unsubscribed_at").eq("referred_by", code).limit(2000);
  const seen = new Set<string>(), perIp = new Map<string, number>(); let count = 0, pending = 0;
  for (const r of data || []) {
    const n = r.email_norm || normEmail(r.email);
    if (seen.has(n) || isDisposable(n) || r.unsubscribed_at) continue; seen.add(n);
    if (r.ip_hash && me?.ip_hash && r.ip_hash === me.ip_hash) continue;
    const ipN = r.ip_hash ? (perIp.get(r.ip_hash) || 0) + 1 : 0; if (r.ip_hash) perIp.set(r.ip_hash, ipN);
    if (ipN > 2) continue; // max 2 credited signups per network
    if (requireConfirm() && !r.confirmed_at) { pending++; continue; }
    count++;
  }
  return { count, pending };
}

export async function status(code: string) {
  const db = adminClient(); if (!db || !cleanRef(code)) return null;
  const { data: me } = await db.from("subscribers").select("email,ref_code,quiz_id,created_at,confirmed_at").eq("ref_code", code).maybeSingle();
  if (!me) return null;
  const { count, pending } = await countReferrals(code);
  const { data: audit } = await db.from("audit_requests").select("status,created_at").eq("ref_code", code).maybeSingle();
  return { email: me.email as string, code, quizId: me.quiz_id as string | null, count, pending, confirmed: Boolean(me.confirmed_at), audit };
}

export const maskEmail = (e: string) => e.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + "•".repeat(Math.min(6, b.length)) + c);
export { esc };
