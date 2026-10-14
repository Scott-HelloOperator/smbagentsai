import type { Metadata } from "next";
import Quiz from "./Quiz";
export const metadata: Metadata = { title: "AI Readiness Quiz (3 minutes)", description: "9 quick questions. Get your AI readiness score out of 100 and a personal plan of the top 5 AI agents for your business.",
  openGraph: { title: "How ready is your business for AI agents? Take the 3-minute quiz" } };
export default function Page() { return <Quiz />; }
