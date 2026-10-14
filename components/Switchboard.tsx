"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Jack } from "./Logo";
import { getRef } from "./RefCapture";
import ShareLink from "./ShareLink";
export default function Switchboard() {
  const [email, setEmail] = useState(""); const [state, setState] = useState<"idle"|"loading"|"ok"|"err">("idle");
  const [res, setRes] = useState<{ code: string | null; link: string | null }>({ code: null, link: null });
  return (
    <section id="switchboard" className="card-pop relative mt-16 overflow-hidden bg-mustard-50 p-6 sm:p-10">
      <span id="newsletter" className="absolute -top-20" aria-hidden />
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-clay-700"><Jack size={14} /> Daily email · free</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">The Switchboard</h2>
          <p className="mt-2 max-w-xl text-ink/75">Five real AI use cases for small businesses, patched straight through to your inbox every morning. Short, practical, no hype. Unsubscribe any time.</p>
        </div>
        <Image src="/gary/gary-wave.png" alt="Gary the AI Intern waving, wearing an operator headset" width={503} height={733} className="-mb-10 hidden w-24 shrink-0 sm:block sm:w-32" />
      </div>
      {state === "ok" ? (<div className="mt-4">
        <p className="font-medium text-sage-600">You're on The Switchboard. Watch for tomorrow's email.</p>
        {res.link && <div className="mt-4 rounded-2xl border-2 border-ink/10 bg-white p-4">
          <p className="font-medium">Share your link — 3 friends unlock <b>The Vault</b> (premium prompt pack), 10 get you a <b>free AI audit</b>.</p>
          <div className="mt-3"><ShareLink link={res.link} text="Found a free directory of real AI agent use cases for small businesses:" /></div>
          <Link href={`/me?code=${res.code}`} className="mt-3 inline-block text-sm underline">Track your referrals →</Link>
          <p className="mt-1 text-xs text-ink/50">Bookmark that page — it's how you get back to your rewards.</p>
        </div>}
      </div>) : (
        <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={async (e) => { e.preventDefault(); setState("loading");
          const r = await fetch("/api/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, ref: getRef() }) });
          if (r.ok) { setRes(await r.json()); setState("ok"); } else setState("err"); }}>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourbusiness.com" className="flex-1 rounded-full border-2 border-ink bg-white px-5 py-3" aria-label="Email" />
          <button disabled={state === "loading"} className="btn">{state === "loading" ? "Patching you through…" : "Subscribe to The Switchboard"}</button>
        </form>)}
      {state === "err" && <p className="mt-2 text-sm text-rose-700">Something went wrong — please try again.</p>}
    </section>
  );
}
