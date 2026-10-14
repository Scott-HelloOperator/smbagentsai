/** SMB Agents AI wordmark. The coral "jack" dot is the shared element with Hello Operator's ●PERATOR logo. */
export function Jack({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={className}>
    <circle cx="12" cy="12" r="10.5" fill="#ED7347" stroke="#2B2420" strokeWidth="2" />
    <circle cx="12" cy="12" r="3.6" fill="#FBF7F0" stroke="#2B2420" strokeWidth="1.6" />
  </svg>);
}
export default function Logo({ className = "" }: { className?: string }) {
  return (<span className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap ${className}`}>
    <Jack size={22} />
    <span className="font-serif text-[1.2rem] sm:text-[1.35rem] font-semibold leading-none tracking-tight">
      SMB Agents<span className="ml-1 rounded-full bg-mustard-400 px-1.5 py-0.5 align-[0.12em] font-sans text-[0.62em] font-extrabold tracking-wide text-ink">AI</span>
    </span>
  </span>);
}
