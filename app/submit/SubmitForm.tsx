"use client";
import { useState } from "react";
export default function SubmitForm() {
  const [state, setState] = useState<"idle"|"loading"|"ok"|"err">("idle");
  if (state === "ok") return <p className="mt-6 rounded-xl bg-sage-100 p-4 text-sage-600">Thanks! We'll review it and be in touch.</p>;
  const f = "w-full rounded-xl border border-ink/10 bg-white px-4 py-3";
  return (<form className="mt-6 space-y-3" onSubmit={async (e) => { e.preventDefault(); setState("loading");
      const body = Object.fromEntries(new FormData(e.currentTarget));
      const r = await fetch("/api/submit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); setState(r.ok ? "ok" : "err"); }}>
    <input name="name" placeholder="Your name" className={f} />
    <input name="email" type="email" required placeholder="Email *" className={f} />
    <input name="business" placeholder="Business & industry" className={f} />
    <textarea name="story" required rows={6} placeholder="What problem did you solve, what did you set up, and how did it go? *" className={f} />
    <input name="tools" placeholder="Tools used (e.g. QuickBooks, Zapier)" className={f} />
    <input name="source_url" type="url" placeholder="Link (optional)" className={f} />
    <button disabled={state === "loading"} className="rounded-xl bg-clay-600 px-5 py-3 font-medium text-white">{state === "loading" ? "Sending…" : "Submit"}</button>
    {state === "err" && <p className="text-sm text-rose-700">Something went wrong — please try again.</p>}
  </form>);
}
