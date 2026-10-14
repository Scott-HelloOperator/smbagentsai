/** SMB Agents AI wordmark. The coral operator dot is the shared element with Hello Operator's ●PERATOR logo. */
export function Jack({ size = 10, className = "" }: { size?: number; className?: string }) {
  return <span aria-hidden className={`inline-block shrink-0 rounded-full bg-clay-500 ${className}`} style={{ width: size, height: size }} />;
}
export default function Logo({ className = "" }: { className?: string }) {
  return (<span className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap ${className}`}>
    <Jack size={11} />
    <span className="font-serif text-[1.2rem] font-semibold leading-none tracking-tight sm:text-[1.3rem]">
      SMB Agents <span className="font-sans text-[0.72em] font-semibold tracking-[0.12em] text-ink/55">AI</span>
    </span>
  </span>);
}
