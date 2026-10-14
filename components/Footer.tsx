import Link from "next/link";
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink/5 py-10 text-sm text-ink/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:justify-between">
        <div className="flex flex-wrap gap-4">
          <Link href="/about">About</Link><Link href="/submit">Submit a use case</Link><Link href="/sponsor">Sponsor</Link><Link href="/help-me">Get help</Link>
        </div>
        <p className="text-xs">Made by <a href="https://hellooperator.ai" className="underline decoration-ink/20 hover:text-ink">Hello Operator</a></p>
      </div>
    </footer>
  );
}
