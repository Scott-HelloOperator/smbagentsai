import seed from "@/data/use-cases.json";
import { createClient } from "@supabase/supabase-js";

/** "Before you switch it on" box. Required on every card; enforced by the DB check constraint (0005) and scripts/engine/safety.mjs. */
export type UseCaseSafety = {
  /** One sentence: the concrete failure for this workflow. */
  whatCanGoWrong: string;
  /** One sentence: the signal to pause or turn it off. */
  whenToStop: string;
  /** One sentence: where a person takes over. */
  humanHandoff: string;
};

export type UseCase = {
  slug: string; title: string; category: string; result: string; summary: string;
  what_they_did: string; how_it_went: string; worth_knowing: string; prompt: string; steps: string[];
  video_url: string | null; tools: string[]; agent: string; industries: string[];
  difficulty: "No-code" | "Light setup" | "Needs help"; setup_time: string; monthly_cost: string; impact: string;
  source_url: string | null; published_at: string; is_example: boolean;
  safety: UseCaseSafety;
  /** True when the agent reads content written by outsiders (email, inbox, DMs/texts, tickets, reviews, forms, web pages): prompt-injection risk. */
  reads_untrusted_content: boolean;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL, anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabaseEnabled = Boolean(url && anon);

export async function getUseCases(): Promise<UseCase[]> {
  if (supabaseEnabled) {
    try {
      const { data, error } = await createClient(url!, anon!).from("use_cases").select("*").eq("is_published", true).order("published_at", { ascending: false });
      if (!error && data?.length) return data as UseCase[];
    } catch { /* fall through */ }
  }
  return seed as UseCase[];
}
export async function getUseCase(slug: string) { return (await getUseCases()).find((u) => u.slug === slug); }

export function adminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // no-store: never let Next's data cache serve stale referral counts / quiz rows.
  return url && key ? createClient(url, key, { auth: { persistSession: false }, global: { fetch: (i, init) => fetch(i, { ...init, cache: "no-store" }) } }) : null;
}
