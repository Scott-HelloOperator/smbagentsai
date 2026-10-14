"use client";
import { useState } from "react";
const enc = encodeURIComponent;
const Icon = ({ d }: { d: string }) => <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d={d} /></svg>;
const LI = "M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.5 0h4.37v1.92h.06c.61-1.15 2.1-2.37 4.32-2.37 4.62 0 5.47 3.04 5.47 7v7.45h-4.56v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.53 1.72-2.53 3.49V22H7.72V8z";
const X = "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z";
const MAIL = "M2 5h20v14H2V5zm2 2v.5l8 5 8-5V7H4zm16 2.85-8 5-8-5V17h16V9.85z";
const LINK = "M10.6 13.4a1 1 0 0 1 0-1.4l3.6-3.6a3 3 0 1 1 4.2 4.2l-2 2a1 1 0 1 1-1.4-1.4l2-2a1 1 0 0 0-1.4-1.4L12 13.4a1 1 0 0 1-1.4 0zm2.8-2.8a1 1 0 0 1 0 1.4l-3.6 3.6a3 3 0 1 1-4.2-4.2l2-2a1 1 0 1 1 1.4 1.4l-2 2a1 1 0 0 0 1.4 1.4L12 10.6a1 1 0 0 1 1.4 0z";
export default function ShareButtons({ url, title, text, compact = false }: { url: string; title: string; text?: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const b = `inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white ${compact ? "px-2.5 py-1.5" : "px-3.5 py-2"} text-sm font-medium text-ink/80 transition hover:border-ink/40 hover:text-ink`;
  const body = `${text || title}\n\n${url}`;
  return (<div className="flex flex-wrap gap-2" data-testid="share-buttons">
    <a className={b} target="_blank" rel="noopener" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} aria-label="Share on LinkedIn"><Icon d={LI} />{!compact && "LinkedIn"}</a>
    <a className={b} target="_blank" rel="noopener" href={`https://x.com/intent/post?text=${enc(text || title)}&url=${enc(url)}`} aria-label="Share on X"><Icon d={X} />{!compact && "Post"}</a>
    <a className={b} href={`mailto:?subject=${enc(title)}&body=${enc(body)}`} aria-label="Share by email"><Icon d={MAIL} />{!compact && "Email"}</a>
    <button type="button" className={b} onClick={() => { navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }); }} aria-label="Copy link"><Icon d={LINK} />{copied ? "Copied ✓" : compact ? "" : "Copy link"}</button>
  </div>);
}
