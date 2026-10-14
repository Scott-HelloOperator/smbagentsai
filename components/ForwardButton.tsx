"use client";
import { whoFor } from "@/lib/forward";
// One-tap "send this to someone who..." Native share sheet on phones, prefilled email elsewhere.
export default function ForwardButton({ title, url, category, className = "" }: { title: string; url: string; category: string; className?: string }) {
  const who = whoFor(category);
  const text = `Thought of you. This is for anyone who ${who}: "${title}"`;
  const go = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share && matchMedia("(pointer: coarse)").matches) { try { await nav.share({ title, text, url }); return; } catch { return; } }
    location.href = `mailto:?subject=${encodeURIComponent(`For anyone who ${who}`)}&body=${encodeURIComponent(`${text}\n\n${url}\n\n(Free guide from smbagentsai.com. No signup needed.)`)}`;
  };
  return <button type="button" onClick={go} className={`inline-flex items-center gap-1.5 text-left ${className}`} data-testid="forward">
    <span aria-hidden>↗</span><span>Send to someone who {who}</span></button>;
}
