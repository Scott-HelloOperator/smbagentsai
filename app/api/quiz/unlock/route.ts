import { NextResponse } from "next/server";
import { getQuiz } from "@/lib/quizStore";
import { subscribe, refLink } from "@/lib/referrals";
import { adminClient } from "@/lib/data";
export async function POST(req: Request) {
  const { id, email, ref } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  const quiz = typeof id === "string" ? await getQuiz(id) : null;
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  const isUuid = /^[0-9a-f-]{36}$/.test(quiz.id);
  const r = await subscribe(email, { ref, source: "quiz", quizId: isUuid ? quiz.id : null });
  const db = adminClient(); if (db && isUuid) await db.from("quiz_results").update({ email: email.toLowerCase() }).eq("id", quiz.id);
  return NextResponse.json({ ok: true, code: r.code, link: r.code ? refLink(r.code) : null,
    plan: quiz.plan.map((u) => ({ slug: u.slug, title: u.title, result: u.result, category: u.category, difficulty: u.difficulty, setup_time: u.setup_time, monthly_cost: u.monthly_cost, tools: u.tools, prompt: u.prompt })) });
}
