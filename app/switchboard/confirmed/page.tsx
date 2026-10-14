import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "@/components/PageHead";
export const metadata: Metadata = { title: "Confirmed", robots: { index: false } };
export default function Confirmed({ searchParams }: { searchParams: { code?: string; bad?: string } }) {
  return (<article className="mx-auto max-w-xl pt-12">
    {searchParams.bad ? <PageHead eyebrow="The Switchboard" title="That link didn't work."><p>It may have expired or been copied wrong. <Link className="underline" href="/#switchboard">Sign up again</Link> and we'll send a fresh one.</p></PageHead>
      : <PageHead eyebrow="The Switchboard" title="Confirmed. You're on the line."><p>Next issue lands Tuesday or Friday, whichever comes first. {searchParams.code && <><Link className="underline" href={`/me?code=${searchParams.code}`}>Grab your referral link</Link>: 3 friends unlock The Vault.</>}</p></PageHead>}
  </article>);
}
