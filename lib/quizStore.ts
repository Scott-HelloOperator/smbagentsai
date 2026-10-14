import { adminClient, getUseCases, type UseCase } from "./data";
import { type Answers, scaled, plan, encodeAnswers, decodeAnswers } from "./quiz";

export async function saveQuiz(a: Answers, ref: string | null) {
  const s = scaled(a), p = plan(a, await getUseCases()).map((u) => u.slug);
  const db = adminClient();
  if (db) {
    const { data, error } = await db.from("quiz_results").insert({ answers: a, score: s, plan: p, ref }).select("id").single();
    if (!error && data) return { id: data.id as string, score: s };
  }
  return { id: encodeAnswers(a), score: s };
}

export async function getQuiz(id: string): Promise<{ id: string; score: number; answers: Answers; plan: UseCase[] } | null> {
  const all = await getUseCases();
  const fromAnswers = (a: Answers, s?: number, slugs?: string[]) => ({ id, answers: a, score: s ?? scaled(a),
    plan: slugs?.length ? slugs.map((x) => all.find((u) => u.slug === x)).filter(Boolean) as UseCase[] : plan(a, all) });
  const dec = decodeAnswers(id); if (dec) return fromAnswers(dec);
  const db = adminClient(); if (!db || !/^[0-9a-f-]{36}$/.test(id)) return null;
  const { data } = await db.from("quiz_results").select("answers,score,plan").eq("id", id).maybeSingle();
  return data ? fromAnswers(data.answers as Answers, data.score, data.plan) : null;
}
