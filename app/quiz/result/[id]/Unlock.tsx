"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getRef } from "@/components/RefCapture";
import CopyButton from "@/components/CopyButton";
import ShareLink from "@/components/ShareLink";
type P = { slug: string; title: string; result: string; category: string; difficulty: string; setup_time: string; monthly_cost: string; tools: string[]; prompt: string };
export default function Unlock({ id, count }: { id: string; count: number }) {
  const [email, setEmail] = useState(""); const [plan, setPlan] = useState<P[] | null>(null); const [ref, setRef] = useState<{ code: string | null; link: string | null }>({ code: null, link: null });
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const unlock = async (em: string) => {
    setBusy(true); setErr("");
    const r = await fetch("/api/quiz/unlock", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, email: em, ref: getRef() }) });
    setBusy(false);
    if (!r.ok) return setErr("Something went wrong — check your email and try again.");
    const d = await r.json(); setPlan(d.plan); setRef(d); localStorage.setItem(`smb_unlocked_${id}`, em);
  };
  useEffect(() => { const em = localStorage.getItem(`smb_unlocked_${id}`); if (em) unlock(em); }, [id]); // eslint-disable-line
  if (!plan) return (
    <div className="relative mt-3">
      <div aria-hidden className="pointer-events-none select-none space-y-2 blur-[5px]">
        {Array.from({ length: count - 1 }).map((_, i) => <div key={i} className="rounded-2xl bg-white p-4"><p className="h-3 w-24 rounded bg-ink/10" /><p className="mt-2 h-4 w-3/4 rounded bg-ink/20" /><p className="mt-2 h-3 w-1/2 rounded bg-ink/10" /></div>)}
      </div>
      <div className="absolute inset-0 grid place-items-center p-2">
        <form className="w-full max-w-md rounded-2xl bg-white p-5 border border-ink/15 shadow-soft" onSubmit={(e) => { e.preventDefault(); unlock(email); }}>
          <p className="font-serif text-lg font-semibold">Unlock your full 5-agent plan</p>
          <p className="mt-1 text-sm text-ink/70">With copy-paste prompts, setup time and cost for each. You'll also get The Switchboard, our twice-a-week email of use cases that actually work. Unsubscribe any time.</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourbusiness.com" className="flex-1 rounded-xl border border-ink/10 px-4 py-3" aria-label="Email" />
            <button disabled={busy} className="btn">{busy ? "Unlocking…" : "Unlock plan"}</button>
          </div>
          {err && <p className="mt-2 text-sm text-clay-700">{err}</p>}
        </form>
      </div>
    </div>);
  return (<div className="mt-3 space-y-3" data-testid="full-plan">
    {plan.map((u, i) => (
      <div key={u.slug} className="rounded-2xl bg-white p-4 border border-ink/10">
        <p className="text-xs font-semibold uppercase tracking-wide text-clay-700">#{i + 1} · {u.category}</p>
        <Link href={`/use-case/${u.slug}`} className="mt-1 block font-serif text-lg font-semibold hover:underline">{u.title}</Link>
        <p className="text-sm text-ink/70">{u.result}</p>
        <p className="mt-2 text-xs text-ink/70">{u.difficulty} · {u.setup_time} · {u.monthly_cost} · {u.tools.join(", ")}</p>
        <div className="mt-2 flex items-center gap-3"><CopyButton text={u.prompt} /><Link href={`/use-case/${u.slug}`} className="text-sm underline">Full guide</Link></div>
      </div>))}
    {ref.link && <div className="rounded-2xl border border-ink/10 bg-[#F4EDE2] p-4">
      <p className="font-medium">Invite 3 owners → unlock The Vault. Invite 10 → free AI audit.</p>
      <div className="mt-2"><ShareLink link={ref.link} text="This free 3-minute quiz shows which AI agents fit your business:" /></div>
      <Link href={`/me?code=${ref.code}`} className="mt-2 inline-block text-sm underline">Track your referrals →</Link>
    </div>}
    <p className="pt-2 text-center"><Link href="/help-me" className="text-xs text-ink/70 hover:text-ink/70">Want us to set these up?</Link></p>
  </div>);
}
