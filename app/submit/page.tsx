import SubmitForm from "./SubmitForm";
export const metadata = { title: "Submit a use case" };
export default function Submit() { return (<article className="mx-auto max-w-2xl pt-10">
  <h1 className="font-serif text-3xl font-bold">Share what's working</h1>
  <p className="mt-2 text-ink/70">Built an AI agent or automation that saves your business time? Tell us in plain English. We review every submission before publishing.</p>
  <SubmitForm />
</article>); }
