"use client";
import { useState } from "react";
export type Field = { name: string; label: string; type?: "text" | "email" | "url" | "textarea" | "select"; required?: boolean; placeholder?: string; options?: string[]; rows?: number };
export const inputCls = "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-ink/50 focus:ring-2 focus:ring-clay-100";
export default function Form({ kind, fields, submit = "Send", done, endpoint = "/api/forms", extra }: { kind: string; fields: Field[]; submit?: string; done: React.ReactNode; endpoint?: string; extra?: Record<string, unknown> }) {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle"); const [msg, setMsg] = useState("");
  if (state === "ok") return <div role="status" className="rounded-2xl border border-sage-600/25 bg-sage-50 p-5 text-[15px] text-ink/80" data-testid={`form-ok-${kind}`}>{done}</div>;
  return (
    <form data-testid={`form-${kind}`} className="space-y-3" onSubmit={async (e) => {
      e.preventDefault(); setState("loading");
      const body = { ...Object.fromEntries(new FormData(e.currentTarget)), kind, ...extra };
      const r = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
      if (r?.ok) setState("ok"); else { setMsg((await r?.json().catch(() => null))?.error || "Something went wrong. Please try again."); setState("err"); }
    }}>
      {fields.map((f) => (
        <label key={f.name} className="block">
          <span className="mb-1 block text-sm font-medium text-ink/75">{f.label}{f.required && <span className="text-clay-600"> *</span>}</span>
          {f.type === "textarea" ? <textarea name={f.name} required={f.required} rows={f.rows || 5} placeholder={f.placeholder} className={inputCls} />
            : f.type === "select" ? <select name={f.name} required={f.required} className={inputCls} defaultValue=""><option value="" disabled>Choose one</option>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>
            : <input name={f.name} type={f.type || "text"} required={f.required} placeholder={f.placeholder} className={inputCls} />}
        </label>
      ))}
      <input name="hp" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <div className="flex items-center gap-3 pt-1">
        <button disabled={state === "loading"} className="btn">{state === "loading" ? "Sending…" : submit}</button>
        <p className="text-xs text-ink/50">Goes straight to Scott. No list, no spam.</p>
      </div>
      {state === "err" && <p role="alert" className="text-sm text-clay-700">{msg}</p>}
    </form>
  );
}
