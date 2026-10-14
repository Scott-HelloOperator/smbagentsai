import { createHash } from "crypto";
import { adminClient } from "./data";
import { SITE_URL } from "./taxonomy";

export const OWNER_EMAIL = process.env.OWNER_EMAIL || "scott@hellooperator.ai";
const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export function ipHash(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  return sha(`smb:${ip}`).slice(0, 24);
}

/** Sliding-window limit. Returns true when the call is allowed. Fails open if the DB is down (forms must never silently drop). */
export async function rateLimit(bucket: string, max: number, windowSec: number) {
  const db = adminClient(); if (!db) return true;
  const since = new Date(Date.now() - windowSec * 1000).toISOString();
  const { count, error } = await db.from("rate_events").select("id", { count: "exact", head: true }).eq("bucket", bucket).gte("created_at", since);
  if (error) return true;
  if ((count || 0) >= max) return false;
  await db.from("rate_events").insert({ bucket });
  return true;
}

export async function isAdmin(token: string | null | undefined) {
  if (!token || token.length < 16) return false;
  const db = adminClient(); if (!db) return false;
  const { data } = await db.from("app_secrets").select("value_hash").eq("name", "admin").maybeSingle();
  return Boolean(data && data.value_hash === sha(token));
}
export const adminTokenFrom = (req: Request) => (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "") || new URL(req.url).searchParams.get("key");

export const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export const emailProvider = () => (process.env.RESEND_API_KEY && process.env.EMAIL_FROM ? "resend" : null);

/** Send one email via Resend. Returns null on success or an error string. */
export async function sendEmail(o: { to: string; subject: string; html: string; text?: string; replyTo?: string; headers?: Record<string, string> }) {
  const key = process.env.RESEND_API_KEY, from = process.env.EMAIL_FROM;
  if (!key || !from) return "no_provider";
  try {
    const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: o.to, subject: o.subject, html: o.html, text: o.text, reply_to: o.replyTo, headers: o.headers }) });
    return r.ok ? null : `resend_${r.status}: ${(await r.text()).slice(0, 200)}`;
  } catch (e) { return `resend_error: ${(e as Error).message}`; }
}

/** Free fallback: FormSubmit.co forwards to OWNER_EMAIL after Scott clicks its one-time activation email. No account needed. */
async function formsubmit(kind: string, fields: Record<string, unknown>) {
  if (process.env.FORMSUBMIT_DISABLED === "1") return "formsubmit_disabled";
  const target = process.env.FORMSUBMIT_ALIAS || OWNER_EMAIL;
  try {
    const r = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(target)}`, {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json", Origin: SITE_URL, Referer: `${SITE_URL}/` },
      body: JSON.stringify({ _subject: `[smbagentsai] New ${kind} submission`, _template: "table", _captcha: "false", ...Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, typeof v === "string" ? v : JSON.stringify(v)])) }),
    });
    const j = await r.json().catch(() => ({}));
    return r.ok && String((j as any).success) === "true" ? null : `formsubmit_${r.status}: ${String((j as any).message || "").slice(0, 160)}`;
  } catch (e) { return `formsubmit_error: ${(e as Error).message}`; }
}

/** Store a form submission in Supabase, then try to deliver it to Scott (Resend, else FormSubmit). Storage first: never lose a lead. */
export async function recordForm(req: Request, kind: string, fields: Record<string, unknown>) {
  const db = adminClient();
  const email = typeof fields.email === "string" ? fields.email.trim().toLowerCase() : null;
  const name = typeof fields.name === "string" ? fields.name.slice(0, 200) : null;
  let id: string | null = null;
  if (db) {
    const { data, error } = await db.from("form_submissions").insert({ kind, email, name, payload: fields, ip_hash: ipHash(req) }).select("id").single();
    if (error) console.error("[forms] store failed", error.message); else id = data.id;
  }
  const rows = Object.entries(fields).map(([k, v]) => `<tr><td style="padding:6px 10px;color:#6b5f57;vertical-align:top">${esc(k)}</td><td style="padding:6px 10px;white-space:pre-wrap">${esc(typeof v === "string" ? v : JSON.stringify(v))}</td></tr>`).join("");
  const html = `<div style="font-family:Georgia,serif;color:#2B2420"><h2 style="margin:0 0 8px">New ${esc(kind)} submission</h2><table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows}</table><p style="font-family:Arial,sans-serif;font-size:12px;color:#6b5f57">Stored in Supabase (form_submissions${id ? ` · ${id}` : ""}). Admin: ${SITE_URL}/admin</p></div>`;
  let via: string | null = null, err: string | null = null;
  if (emailProvider()) { err = await sendEmail({ to: OWNER_EMAIL, subject: `[smbagentsai] New ${kind} submission${name ? ` from ${name}` : ""}`, html, replyTo: email || undefined }); if (!err) via = "resend"; }
  if (!via) { const e2 = await formsubmit(kind, { ...fields, submission_id: id || "unsaved" }); if (!e2) via = "formsubmit"; else err = [err, e2].filter(Boolean).join(" | "); }
  if (db && id) await db.from("form_submissions").update({ delivered_via: via, delivery_error: via ? null : err }).eq("id", id);
  return { id, stored: Boolean(id), delivered: Boolean(via) };
}

export const validEmail = (e: unknown): e is string => typeof e === "string" && e.length < 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
export const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
