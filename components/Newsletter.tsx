"use client";
import { useState } from "react";
export default function Newsletter() {
  const [email, setEmail] = useState(""); const [state, setState] = useState<"idle"|"loading"|"ok"|"err">("idle");
  return (
    <section id="newsletter" className="mt-16 rounded-3xl bg-white p-6 shadow-sm sm:p-10">
      <h2 className="font-serif text-2xl font-semibold">5 use cases in your inbox, every morning</h2>
      <p className="mt-2 text-ink/70">Short, practical, no hype. Unsubscribe any time.</p>
      {state === "ok" ? <p className="mt-4 font-medium text-sage-600">You're in. Watch for tomorrow's email.</p> : (
        <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={async (e) => { e.preventDefault(); setState("loading");
          const r = await fetch("/api/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) }); setState(r.ok ? "ok" : "err"); }}>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourbusiness.com" className="flex-1 rounded-xl border border-ink/10 px-4 py-3" aria-label="Email" />
          <button disabled={state === "loading"} className="rounded-xl bg-clay-600 px-5 py-3 font-medium text-white hover:bg-clay-700">{state === "loading" ? "Signing up…" : "Get the daily 5"}</button>
        </form>)}
      {state === "err" && <p className="mt-2 text-sm text-rose-700">Something went wrong — please try again.</p>}
    </section>
  );
}
