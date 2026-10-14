import Link from "next/link";
import Logo from "./Logo";
export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5">
        <Link href="/" aria-label="SMB Agents AI home"><Logo /></Link>
        <nav className="flex items-center gap-4 text-sm text-ink/70 sm:gap-6">
          <Link href="/quiz" className="hidden hover:text-ink sm:inline">Quiz</Link>
          <Link href="/finder" className="hidden hover:text-ink md:inline">Agent Finder</Link>
          <Link href="/packs" className="hidden hover:text-ink md:inline">Packs</Link>
          <Link href="/about" className="hover:text-ink">About</Link>
          <Link href="/wins" className="hidden hover:text-ink lg:inline">Wins</Link>
          <Link href="/#switchboard" className="whitespace-nowrap rounded-full bg-ink px-3.5 py-1.5 font-medium text-cream hover:bg-ink/85">The Switchboard</Link>
        </nav>
      </div>
    </header>
  );
}
