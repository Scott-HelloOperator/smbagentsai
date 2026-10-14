"use client";
import { useState } from "react";
export default function CopyButton({ text, className = "", label = "Copy prompt" }: { text: string; className?: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className={`shrink-0 rounded-full bg-ink px-3.5 py-1.5 text-sm font-semibold text-cream transition hover:bg-ink/85 ${className}`} aria-live="polite"
      onClick={async (e) => { e.stopPropagation(); try { await navigator.clipboard.writeText(text); } catch { const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); } setDone(true); setTimeout(() => setDone(false), 1800); }}>
      {done ? "Copied ✓" : label}
    </button>
  );
}
