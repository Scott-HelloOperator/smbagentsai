"use client";
import { useState } from "react";
import Link from "next/link";
import { Jack } from "./Logo";
import { getRef } from "./RefCapture";
import ShareLink from "./ShareLink";
export default function Switchboard() {
  const [email, setEmail] = useState(""); const [state, setState] = useState<"idle"|"loading"|"ok"|"err">("idle");
  const [res, setRes] = useState<{ code: string | null; link: string | null }>({ code: null, link: null });
  return (
    <section id="switchboard" className="relative mt-20 border-y border-ink/15 py-10 sm:py-14">
      <span id="newsletter" className="absolute -top-20" aria-hidden />
      <div className="grid gap-6 sm:grid-cols-[1fr_1.1fr] sm:items-end sm:gap-12">
        <div>
          <p className="eyebrow"><Jack size={7} /> Daily · Free</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">The Switchboard</h2>
        </div>
        <p className="text-[17px] leading-relaxed text-ink/70">Five AI use cases that actually work for small businesses, in your inbox each morning. What it does, what it costs, what breaks. Unsubscribe whenever.</p>
      </div>
      {state === "ok" ? (<div className="mt-4">
        <p className="font-medium text-sage-600">You're on The Switchboard. Watch for tomorrow's email.</p>
        {res.link && <div className="mt-4 rounded-xl border border-ink/10 bg-white p-4">
          <p className="font-medium">Share your link — 3 friends unlock <b>The Vault</b> (premium prompt pack), 10 get you a <b>free AI audit</b>.</p>
          <div className="mt-3"><ShareLink link={res.link} text="Found a free directory of real AI agent use cases for small businesses:" /></div>
          <Link href={`/me?code=${res.code}`} className="mt-3 inline-block text-sm underline">Track your referrals →</Link>
          <p className="mt-1 text-xs text-ink/50">Bookmark that page — it's how you get back to your rewards.</p>
        </div>}
      </div>) : (
        <form className="mt-8 flex flex-col gap-2 sm:flex-row" onSubmit={async (e) => { e.preventDefault(); setState("loading");
          const r = await fetch("/api/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, ref: getRef() }) });
          if (r.ok) { setRes(await r.json()); setState("ok"); } else setState("err"); }}>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourbusiness.com" className="flex-1 rounded-full border border-ink/20 bg-white px-5 py-3 outline-none focus:border-ink/50" aria-label="Email" />
          <button disabled={state === "loading"} className="btn-coral">{state === "loading" ? "Connecting…" : "Subscribe to The Switchboard"}</button>
        </form>)}
      {state === "err" && <p className="mt-2 text-sm text-rose-700">Something went wrong — please try again.</p>}
    </section>
  );
}
