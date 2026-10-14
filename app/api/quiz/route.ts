import { NextResponse } from "next/server";
import { saveQuiz } from "@/lib/quizStore";
import { QUESTIONS, type Answers } from "@/lib/quiz";
import { cleanRef } from "@/lib/referrals";
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b?.answers) return NextResponse.json({ error: "Missing answers" }, { status: 400 });
  const a = {} as Answers;
  for (const q of QUESTIONS) {
    const v = b.answers[q.id]; const ok = new Set(q.opts.map((o) => o.v));
    (a as any)[q.id] = q.multi ? (Array.isArray(v) ? v.filter((x: string) => ok.has(x)).slice(0, q.multi) : []) : ok.has(v) ? v : "";
  }
  return NextResponse.json(await saveQuiz(a, cleanRef(b.ref)));
}
