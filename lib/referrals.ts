import { adminClient } from "./data";
import { SITE_URL } from "./taxonomy";
export const VAULT_AT = 3, AUDIT_AT = 10;
export const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => "abcdefghjkmnpqrstuvwxyz23456789"[b % 31]).join("");
export const refLink = (code: string) => `${SITE_URL}/?ref=${code}`;
export const cleanRef = (r: unknown) => (typeof r === "string" && /^[a-z0-9]{4,16}$/.test(r) ? r : null);

/** Creates (or returns) a subscriber with a referral code. Returns null code if Supabase isn't configured. */
export async function subscribe(email: string, opts: { ref?: string | null; source?: string; quizId?: string | null } = {}) {
  const db = adminClient(); email = email.trim().toLowerCase();
  if (!db) return { code: null as string | null, stored: false };
  const { data: existing } = await db.from("subscribers").select("ref_code").eq("email", email).maybeSingle();
  if (existing?.ref_code) {
    if (opts.quizId) await db.from("subscribers").update({ quiz_id: opts.quizId }).eq("email", email);
    return { code: existing.ref_code as string, stored: true };
  }
  const code = newCode();
  const ref = cleanRef(opts.ref);
  const row: Record<string, unknown> = { email, source: opts.source || "site", ref_code: code, quiz_id: opts.quizId || null };
  if (ref) { const { data: r } = await db.from("subscribers").select("email").eq("ref_code", ref).maybeSingle(); if (r && r.email !== email) row.referred_by = ref; }
  const { error } = existing ? await db.from("subscribers").update(row).eq("email", email) : await db.from("subscribers").insert(row);
  if (error) throw error;
  await notify("welcome", email, { code });
  return { code, stored: true };
}

export async function status(code: string) {
  const db = adminClient(); if (!db || !cleanRef(code)) return null;
  const { data: me } = await db.from("subscribers").select("email,ref_code,quiz_id,created_at").eq("ref_code", code).maybeSingle();
  if (!me) return null;
  const { count } = await db.from("subscribers").select("id", { count: "exact", head: true }).eq("referred_by", code);
  const { data: audit } = await db.from("audit_requests").select("status,created_at").eq("ref_code", code).maybeSingle();
  return { email: me.email as string, code, quizId: me.quiz_id as string | null, count: count || 0, audit };
}

export const maskEmail = (e: string) => e.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + "•".repeat(Math.min(6, b.length)) + c);

/** Email hook. No provider yet — logs only. Plug in Resend here (RESEND_API_KEY + EMAIL_FROM). */
export async function notify(kind: "welcome" | "vault_unlocked" | "audit_requested", to: string, data: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY, from = process.env.EMAIL_FROM;
  if (!key || !from) { console.info(`[email:${kind}] provider not configured; skipped`); return; }
  const code = String(data.code || "");
  const subjects = { welcome: "You're in — here's your referral link", vault_unlocked: "The Vault is unlocked", audit_requested: "Your free AI audit request" };
  const html = `<p>Thanks for joining SMB Agents AI.</p><p>Your referral link: <a href="${refLink(code)}">${refLink(code)}</a></p><p>Track progress: <a href="${SITE_URL}/me?code=${code}">${SITE_URL}/me?code=${code}</a></p>`;
  await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject: subjects[kind], html }) }).catch((e) => console.warn("[email] failed", e.message));
}
