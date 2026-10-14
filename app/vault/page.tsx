import type { Metadata } from "next";
import Link from "next/link";
import { status, VAULT_AT } from "@/lib/referrals";
import { VAULT } from "@/lib/vault";
import CopyButton from "@/components/CopyButton";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "The Vault — premium prompt pack", robots: { index: false } };
export default async function Vault({ searchParams }: { searchParams: { code?: string } }) {
  const s = searchParams.code ? await status(searchParams.code) : null;
  if (!s || s.count < VAULT_AT) return (<section className="mx-auto max-w-xl pt-12 text-center">
    <p className="text-4xl">🔒</p><h1 className="mt-2 font-serif text-3xl font-bold">The Vault</h1>
    <p className="mt-3 text-ink/70">{VAULT.length} premium prompts for owners — weekly brief, cash-crunch triage, price-increase letters and more. Unlocks when {VAULT_AT} people sign up with your referral link.</p>
    {s ? <p className="mt-4">You're at <b>{s.count}/{VAULT_AT}</b>. <Link className="underline" href={`/me?code=${s.code}`}>Get your link →</Link></p>
       : <p className="mt-4"><Link className="underline" href="/#newsletter">Sign up to get your referral link →</Link></p>}
  </section>);
  return (<section className="mx-auto max-w-3xl pt-8">
    <p className="text-sm font-medium text-clay-600">Unlocked ✓</p>
    <h1 className="font-serif text-3xl font-bold">The Vault</h1>
    <p className="mt-2 text-ink/70">Replace anything in [brackets]. Thanks for spreading the word.</p>
    <div className="mt-6 space-y-4">{VAULT.map((v, i) => (<div key={v.t} className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3"><h2 className="font-serif text-lg font-semibold">{i + 1}. {v.t}</h2><CopyButton text={v.p} /></div>
      <p className="mt-2 whitespace-pre-wrap text-[15px] text-ink/80">{v.p}</p></div>))}</div>
  </section>);
}
