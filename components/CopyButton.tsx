"use client";
import { useState } from "react";
export default function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className={`rounded-lg bg-clay-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-clay-700 ${className}`}
      onClick={async (e) => { e.stopPropagation(); try { await navigator.clipboard.writeText(text); } catch { const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); } setDone(true); setTimeout(() => setDone(false), 1800); }}>
      {done ? "Copied ✓" : "Copy prompt"}
    </button>
  );
}
