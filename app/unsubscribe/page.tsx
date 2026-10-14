import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "@/components/PageHead";
export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false } };
export default function Unsub({ searchParams }: { searchParams: { done?: string; bad?: string } }) {
  return (<article className="mx-auto max-w-xl pt-12">
    {searchParams.done ? <PageHead eyebrow="The Switchboard" title="You're off the line."><p>No more emails. The robot didn't even look up. If you change your mind, you can <Link className="underline" href="/#switchboard">resubscribe</Link> any time.</p></PageHead>
      : <PageHead eyebrow="The Switchboard" title="Unsubscribe"><p>{searchParams.bad ? "That unsubscribe link didn't match a subscriber. It may be old or mistyped." : "Use the unsubscribe link at the bottom of any Switchboard email."} Still stuck? <Link className="underline" href="/contact">Tell us</Link> and a human will remove you by hand.</p></PageHead>}
  </article>);
}
