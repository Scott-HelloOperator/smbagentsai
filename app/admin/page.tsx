import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { adminClient } from "@/lib/data";
import { isAdmin, emailProvider } from "@/lib/server";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
const fmt = (d: string) => new Date(d).toLocaleString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) + " ET";
const TABS = ["inbox", "wins", "subscribers", "votes", "audits"] as const;
export default async function Admin({ searchParams }: { searchParams: { tab?: string; bad?: string } }) {
  const ok = await isAdmin(cookies().get("smb_admin")?.value);
  if (!ok) return (<section className="mx-auto max-w-sm pt-16">
    <h1 className="font-serif text-3xl font-semibold">Admin</h1>
    <form method="post" action="/api/admin/login" className="mt-6 space-y-3">
      <input name="token" type="password" required placeholder="Admin token" aria-label="Admin token" className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3" />
      <button className="btn w-full">Sign in</button>
      {searchParams.bad && <p className="text-sm text-clay-700">That token didn't work.</p>}
    </form></section>);
  const db = adminClient()!; const tab = (TABS as readonly string[]).includes(searchParams.tab || "") ? searchParams.tab! : "inbox";
  const [{ count: subs }, { count: confirmed }, { count: unsubs }, { count: pendingWins }] = await Promise.all([
    db.from("subscribers").select("id", { count: "exact", head: true }), db.from("subscribers").select("id", { count: "exact", head: true }).not("confirmed_at", "is", null),
    db.from("subscribers").select("id", { count: "exact", head: true }).not("unsubscribed_at", "is", null), db.from("wins").select("id", { count: "exact", head: true }).eq("status", "pending")]);
  const td = "border-t border-ink/10 px-3 py-2 align-top";
  return (<section className="pt-8">
    <div className="flex flex-wrap items-baseline justify-between gap-3"><h1 className="font-serif text-3xl font-semibold">Admin</h1>
      <p className="text-sm text-ink/60">Email provider: <b>{emailProvider() || "none (FormSubmit fallback)"}</b> · {subs} subscribers · {confirmed} confirmed · {unsubs} unsubscribed</p></div>
    <nav className="mt-4 flex gap-2">{TABS.map((t) => <Link key={t} href={`/admin?tab=${t}`} className={`chip ${t === tab ? "!border-ink !bg-ink text-cream" : ""}`}>{t}{t === "wins" && pendingWins ? ` (${pendingWins})` : ""}</Link>)}</nav>
    <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-white text-sm">
      {tab === "inbox" && await (async () => { const { data } = await db.from("form_submissions").select("*").order("created_at", { ascending: false }).limit(200);
        return <table className="w-full"><thead className="text-left text-ink/55"><tr><th className="px-3 py-2">When</th><th className="px-3 py-2">Kind</th><th className="px-3 py-2">From</th><th className="px-3 py-2">Details</th><th className="px-3 py-2">Delivered</th></tr></thead><tbody>
          {(data || []).map((r) => <tr key={r.id}><td className={`${td} whitespace-nowrap`}>{fmt(r.created_at)}</td><td className={td}>{r.kind}</td><td className={td}>{r.name}<br /><a className="underline" href={`mailto:${r.email}`}>{r.email}</a></td>
            <td className={`${td} max-w-xl whitespace-pre-wrap`}>{Object.entries(r.payload || {}).filter(([k]) => !["name", "email"].includes(k)).map(([k, v]) => `${k}: ${v}`).join("\n")}</td>
            <td className={td}>{r.delivered_via || <span className="text-clay-700" title={r.delivery_error || ""}>stored only</span>}</td></tr>)}
          {!data?.length && <tr><td className={td} colSpan={5}>Nothing yet.</td></tr>}</tbody></table>; })()}
      {tab === "wins" && await (async () => { const { data } = await db.from("wins").select("*").order("created_at", { ascending: false }).limit(200);
        return <table className="w-full"><tbody>{(data || []).map((w) => <tr key={w.id}><td className={`${td} whitespace-nowrap`}>{fmt(w.created_at)}<br /><b>{w.status}</b></td>
          <td className={td}><b>{w.title}</b><p className="mt-1 whitespace-pre-wrap text-ink/75">{w.story}</p><p className="mt-1 text-ink/55">{w.name} · {w.business} · {w.email} {w.credit_url && `· ${w.credit_url}`} {w.hours_saved && `· saves ${w.hours_saved}`}</p></td>
          <td className={`${td} whitespace-nowrap`}>{["approved", "rejected", "pending"].filter((a) => a !== w.status).map((a) => <form key={a} method="post" action="/api/admin/wins" className="mb-1"><input type="hidden" name="id" value={w.id} /><input type="hidden" name="action" value={a} /><button className="chip">{a === "approved" ? "Approve" : a === "rejected" ? "Reject" : "Back to pending"}</button></form>)}</td></tr>)}
          {!data?.length && <tr><td className={td}>No wins submitted yet.</td></tr>}</tbody></table>; })()}
      {tab === "subscribers" && await (async () => { const { data } = await db.from("subscribers").select("email,source,ref_code,referred_by,confirmed_at,unsubscribed_at,created_at").order("created_at", { ascending: false }).limit(500);
        return <table className="w-full"><thead className="text-left text-ink/55"><tr><th className="px-3 py-2">Joined</th><th className="px-3 py-2">Email</th><th className="px-3 py-2">Source</th><th className="px-3 py-2">Code</th><th className="px-3 py-2">Referred by</th><th className="px-3 py-2">Status</th></tr></thead><tbody>
          {(data || []).map((s) => <tr key={s.ref_code}><td className={`${td} whitespace-nowrap`}>{fmt(s.created_at)}</td><td className={td}>{s.email}</td><td className={td}>{s.source}</td><td className={td}><Link className="underline" href={`/me?code=${s.ref_code}`}>{s.ref_code}</Link></td><td className={td}>{s.referred_by}</td>
            <td className={td}>{s.unsubscribed_at ? "unsubscribed" : s.confirmed_at ? "confirmed" : "unconfirmed"}</td></tr>)}</tbody></table>; })()}
      {tab === "votes" && await (async () => { const { data } = await db.from("issue_votes").select("issue,question,vote");
        const t = new Map<string, number>(); for (const v of data || []) { const k = `#${v.issue} · ${v.question} · ${v.vote}`; t.set(k, (t.get(k) || 0) + 1); }
        return <table className="w-full"><tbody>{[...t].sort().map(([k, n]) => <tr key={k}><td className={td}>{k}</td><td className={td}>{n}</td></tr>)}{!t.size && <tr><td className={td}>No votes yet.</td></tr>}</tbody></table>; })()}
      {tab === "audits" && await (async () => { const { data } = await db.from("audit_requests").select("*").order("created_at", { ascending: false });
        return <table className="w-full"><tbody>{(data || []).map((a) => <tr key={a.id}><td className={`${td} whitespace-nowrap`}>{fmt(a.created_at)}</td><td className={td}>{a.email}</td><td className={td}>{a.referral_count} refs</td><td className={`${td} whitespace-pre-wrap`}>{a.notes}</td><td className={td}>{a.status}</td></tr>)}
          {!data?.length && <tr><td className={td}>No audit requests yet.</td></tr>}</tbody></table>; })()}
    </div>
    <p className="mt-4 text-xs text-ink/50">JSON: GET /api/admin/submissions with header Authorization: Bearer &lt;admin token&gt;.</p>
  </section>);
}
