import type { Metadata } from "next";
import Link from "next/link";
import { status, refLink, maskEmail, VAULT_AT, AUDIT_AT } from "@/lib/referrals";
import ShareLink from "@/components/ShareLink";
import AuditButton from "./AuditButton";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your referrals", robots: { index: false } };
const Milestone = ({ n, count, title, body, children }: { n: number; count: number; title: string; body: string; children?: React.ReactNode }) => {
  const done = count >= n;
  return (<div className={`rounded-2xl border p-4 ${done ? "border-sage-600/30 bg-sage-100" : "border-ink/10 bg-white"}`}>
    <div className="flex items-center justify-between"><p className="font-semibold">{done ? "✓ " : ""}{title}</p><span className="text-sm text-ink/60">{Math.min(count, n)}/{n}</span></div>
    <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/5"><div className="h-full rounded-full bg-clay-500" style={{ width: `${Math.min(100, (count / n) * 100)}%` }} /></div>
    <p className="mt-2 text-sm text-ink/70">{body}</p>{done && children}
  </div>);
};
export default async function Me({ searchParams }: { searchParams: { code?: string } }) {
  const s = searchParams.code ? await status(searchParams.code) : null;
  if (!s) return (<section className="mx-auto max-w-xl pt-12">
    <h1 className="font-serif text-3xl font-bold">Your referral status</h1>
    <p className="mt-3 text-ink/70">Open the link you got after signing up (it looks like <code>/me?code=abc123</code>). Not signed up yet? <Link className="underline" href="/#switchboard">Subscribe to The Switchboard</Link> or <Link className="underline" href="/quiz">take the quiz</Link>.</p>
  </section>);
  return (<section className="mx-auto max-w-xl pt-8">
    <p className="text-sm text-ink/60">Signed up as {maskEmail(s.email)}</p>
    <h1 className="mt-1 font-serif text-3xl font-bold">You've referred {s.count} {s.count === 1 ? "owner" : "owners"}</h1>
    <p className="mt-2 text-ink/70">A referral counts when someone new signs up from your link with a real, unique email (and confirms it, once confirmation emails are on). Duplicates, throwaway inboxes and sign-ups from your own network don't count. The robot checks.</p>
    {s.pending > 0 && <p className="mt-2 text-sm text-ink/60">{s.pending} more waiting on email confirmation.</p>}
    <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm"><p className="mb-2 text-sm font-medium">Your link</p>
      <ShareLink link={refLink(s.code)} text="A free directory of real AI agent use cases for small businesses — plus a 3-minute readiness quiz:" /></div>
    <div className="mt-5 space-y-3">
      <Milestone n={VAULT_AT} count={s.count} title="The Vault" body="Our premium prompt pack: 12 copy-paste prompts for owners (cash crunch, price increases, angry customers).">
        <Link href={`/vault?code=${s.code}`} className="mt-3 inline-block rounded-xl bg-clay-600 px-4 py-2 text-sm font-medium text-white">Open The Vault →</Link></Milestone>
      <Milestone n={AUDIT_AT} count={s.count} title="Free AI audit" body="A written AI audit of your business, delivered by email as a PDF or short recorded video. No call, no pitch.">
        <AuditButton code={s.code} requested={Boolean(s.audit)} /></Milestone>
    </div>
    {s.quizId && <p className="mt-6 text-sm"><Link className="underline" href={`/quiz/result/${s.quizId}`}>View your quiz result →</Link></p>}
    <p className="mt-6 text-xs text-ink/50">Keep this page bookmarked — it's private to your code.</p>
  </section>);
}
