import Link from "next/link";
import { Jack } from "./Logo";
const COLS: [string, [string, string][]][] = [
  ["Explore", [["/", "All use cases"], ["/packs", "Industry packs"], ["/quiz", "AI Readiness Quiz"], ["/wins", "Owner wins"]]],
  ["The Switchboard", [["/#switchboard", "Subscribe"], ["/switchboard", "Past issues"], ["/me", "Your referrals"], ["/widget", "Embed widget"]]],
  ["Talk to us", [["/submit", "Submit a use case"], ["/sponsor", "Sponsor"], ["/help-me", "Get help"], ["/contact", "Contact"], ["/about", "About"]]],
];
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink/10 py-10 text-sm text-ink/70">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div><p className="flex items-center gap-2 font-serif text-lg font-semibold text-ink"><Jack size={9} /> SMB Agents AI</p>
          <p className="mt-2 max-w-xs">Real AI agent use cases for businesses under 200 people. Free, plain English, no hype.</p>
          <p className="mt-3 text-xs">Made by <a href="https://hellooperator.ai" className="underline decoration-ink/20 hover:text-ink">Hello Operator</a></p></div>
        {COLS.map(([h, links]) => (<nav key={h} aria-label={h}><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/70">{h}</p>
          <ul className="mt-3 space-y-2">{links.map(([href, label]) => <li key={href}><Link href={href} className="hover:text-ink">{label}</Link></li>)}</ul></nav>))}
      </div>
    </footer>
  );
}
