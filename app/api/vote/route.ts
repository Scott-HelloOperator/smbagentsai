import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { adminClient } from "@/lib/data";
import { ipHash, rateLimit } from "@/lib/server";
import { getIssue } from "@/lib/issues";
import { SITE_URL } from "@/lib/taxonomy";
export const dynamic = "force-dynamic";
const ALLOWED: Record<string, string[]> = { rating: ["fire", "decent", "poop"], dilemma: ["yes", "no", "evening"] };
export async function GET(req: Request) {
  const u = new URL(req.url); const i = Number(u.searchParams.get("i")), q = u.searchParams.get("q") || "rating", v = u.searchParams.get("v") || "", t = u.searchParams.get("t");
  const back = (ok: boolean) => NextResponse.redirect(`${SITE_URL}/switchboard/thanks?i=${i}&q=${q}&v=${ok ? v : ""}`, 303);
  if (!getIssue(i) || !ALLOWED[q]?.includes(v)) return back(false);
  const db = adminClient(); if (!db) return back(true);
  // Voter identity: the subscriber's private token (from their email) or, on the web, a hashed IP. One vote per issue+question; re-votes update.
  let voter = `ip:${ipHash(req)}`;
  if (t && /^[a-f0-9]{32}$/.test(t)) { const { data } = await db.from("subscribers").select("id").eq("unsub_token", t).maybeSingle(); if (data) voter = `s:${createHash("sha256").update(t).digest("hex").slice(0, 24)}`; }
  if (!(await rateLimit(`vote:${ipHash(req)}`, 30, 3600))) return back(false);
  await db.from("issue_votes").upsert({ issue: i, question: q, vote: v, voter }, { onConflict: "issue,question,voter" });
  return back(true);
}
