import Link from "next/link";
export default function Header() {
  return (
    <header className="border-b border-ink/5 bg-cream/90 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-serif text-lg font-bold">SMB<span className="text-clay-600">Agents</span>AI</Link>
        <nav className="flex gap-4 text-sm text-ink/70">
          <Link href="/quiz" className="font-medium text-clay-700 hover:text-clay-600">Quiz</Link>
          <Link href="/about" className="hover:text-ink">About</Link>
          <Link href="/submit" className="hover:text-ink">Submit</Link>
          <Link href="/#newsletter" className="hidden sm:inline hover:text-ink">Newsletter</Link>
        </nav>
      </div>
    </header>
  );
}
