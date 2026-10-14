import Link from "next/link";
import Logo from "./Logo";
export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-ink/80 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" aria-label="SMB Agents AI home"><Logo /></Link>
        <nav className="flex items-center gap-3 text-sm font-medium text-ink/75 sm:gap-5">
          <Link href="/quiz" className="hidden text-clay-700 hover:text-clay-600 sm:inline">Quiz</Link>
          <Link href="/about" className="hover:text-ink">About</Link>
          <Link href="/submit" className="hidden hover:text-ink sm:inline">Submit</Link>
          <Link href="/#switchboard" className="whitespace-nowrap rounded-full border-2 border-ink bg-white px-3 py-1 text-ink shadow-pop transition hover:-translate-y-px">The Switchboard</Link>
        </nav>
      </div>
    </header>
  );
}
