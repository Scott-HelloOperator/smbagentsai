import { Jack } from "./Logo";
export default function PageHead({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (<header>
    <p className="eyebrow"><Jack size={7} /> {eyebrow}</p>
    <h1 className="mt-3 font-serif text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.015em] sm:text-5xl">{title}</h1>
    {children && <div className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink/70">{children}</div>}
  </header>);
}
