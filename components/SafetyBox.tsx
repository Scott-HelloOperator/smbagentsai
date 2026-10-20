import type { UseCase } from "@/lib/data";

export const UNTRUSTED_FLAG = {
  label: "Reads outside messages.",
  text: "Anything a stranger sends can hide instructions aimed at AI. Never let it pay, share logins or act on an urgent ask without you.",
  /** Shorter wording for the flip-card back, where space is fixed. */
  short: "These can hide instructions aimed at AI. Never let it pay, share logins or act on urgent asks alone.",
};

const ROWS = [["whatCanGoWrong", "What can go wrong", "Risk"], ["whenToStop", "When to stop it", "Stop"], ["humanHandoff", "When you step in", "Handoff"]] as const;

/** "Before you switch it on" box. `compact` is the flip-card back; default is the detail page. */
export default function SafetyBox({ u, compact = false, headingLevel = compact ? 3 : 2 }: { u: Pick<UseCase, "slug" | "safety" | "reads_untrusted_content">; compact?: boolean; headingLevel?: 2 | 3 | 4 }) {
  const H = `h${headingLevel}` as "h2" | "h3" | "h4";
  const id = `safety-${u.slug}${compact ? "-card" : ""}`;
  return (
    <section aria-labelledby={id} data-testid="safety-box"
      className={compact ? "rounded-lg border border-ink/15 px-2.5 py-1.5" : "rounded-xl border border-ink/15 bg-white px-5 py-4"}>
      <H id={id} className={`font-semibold uppercase text-ink/70 ${compact ? "text-[10.5px] tracking-[0.12em]" : "text-[11px] tracking-[0.14em]"}`}>Before you switch it on</H>
      <dl className={compact ? "mt-0.5 space-y-0.5 text-[11.5px] leading-[1.3] text-ink/80" : "mt-3 space-y-2 text-[15px] leading-relaxed text-ink/85"}>
        {ROWS.map(([k, label, short]) => (
          <div key={k} className={compact ? "" : "sm:grid sm:grid-cols-[9.5rem_1fr] sm:gap-3"}>
            <dt className={compact ? "inline font-semibold text-ink" : "font-semibold text-ink"}>{compact ? `${short}: ` : label}</dt>
            <dd className={compact ? "inline" : ""}>{u.safety[k]}</dd>
          </div>
        ))}
      </dl>
      {u.reads_untrusted_content && (
        <p data-testid="untrusted-flag" className={`border-l-2 border-clay-500 text-ink/80 ${compact ? "mt-1 pl-2 text-[11px] leading-[1.3]" : "mt-4 pl-3 text-sm"}`}>
          <strong className="font-semibold text-clay-700">{UNTRUSTED_FLAG.label}</strong> {compact ? UNTRUSTED_FLAG.short : UNTRUSTED_FLAG.text}
        </p>
      )}
    </section>
  );
}
