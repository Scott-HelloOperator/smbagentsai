# SMBAgentsAI.com

A free, plain-English directory of real AI agent use cases for small-business owners (<200 employees). Problem-first: pick a headache, flip a card, copy the prompt.

**Stack:** Next.js 14 (App Router, TypeScript) · Tailwind CSS · Supabase Postgres (optional) · deploys to Vercel.

## Features
- Home: search, problem-category chips, tool/industry/difficulty filters, sort (newest, easiest, impact, A–Z)
- Flip cards (click/tap/keyboard): front = title, result, tools, difficulty; back = copy-to-clipboard prompt, short steps, full-guide link, subtle "Want us to set it up?" → `/help-me`
- `/use-case/[slug]` SEO pages (metadata, OpenGraph, HowTo JSON-LD)
- Landing pages: `/category/[slug]`, `/tool/[slug]`, `/industry/[slug]`
- `sitemap.xml`, `robots.txt`
- Newsletter signup (`/api/subscribe` → `subscribers` table; no-op without Supabase)
- `/submit` (→ `submissions` table; no-op without Supabase), `/sponsor`, `/about`, `/help-me`
- 32 seeded illustrative use cases in `data/use-cases.json` (all `is_example: true`, no sources/people/quotes invented)

## Local setup
```bash
npm install
cp .env.example .env.local   # optional; works with no env vars
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```
Without Supabase env vars the app reads `data/use-cases.json` and signups/submissions are accepted but not stored.

## Env vars
| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for sitemap/OG (e.g. `https://smbagentsai.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (reads published use cases) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; seeding and API inserts. Never expose client-side. |

## Supabase
1. Create a project at supabase.com.
2. SQL Editor → run `supabase/migrations/0001_init.sql` (or `supabase db push` with the CLI).
3. Seed: `NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed`
4. Edit use cases in the Supabase table editor; set `is_published=false` to hide. Pages revalidate hourly.

## Deploy to Vercel
1. Import this GitHub repo in Vercel (framework auto-detected as Next.js).
2. Add the env vars above (Production + Preview).
3. Deploy, then add the `smbagentsai.com` domain and set `NEXT_PUBLIC_SITE_URL` to it.

## Editing content
`data/use-cases.json` is the fallback seed (regenerate via `python3 scripts/generate_seed.py`). Taxonomies live in `lib/taxonomy.ts`.

Made by [Hello Operator](https://hellooperator.ai).

## Daily content engine (Phase 2)
Runs as a **GitHub Actions cron** (`.github/workflows/content-engine.yml` — currently stored at `docs/content-engine.workflow.yml`; copy it into `.github/workflows/` via GitHub UI or a token with the Workflows permission, daily 11:15 UTC ≈ 7:15 AM ET; also runnable manually with a dry-run toggle). GitHub Actions was chosen over Vercel Cron because Hobby cron is limited to once/day with short function timeouts, and the engine needs several minutes (polite Reddit pacing + LLM calls). Actions is free for public repos / within the free minutes for private ones.

Pipeline (`scripts/engine/`, zero dependencies, Node 22):
1. **Discover** (`sources.mjs`): Reddit public search RSS across r/smallbusiness, r/Entrepreneur, r/sweatystartup, r/automation, r/ChatGPT, r/n8n, r/zapier, r/AI_Agents and trade subs (JSON API is blocked for datacenter IPs; RSS works), plus Hacker News via the Algolia API. Dedupe by URL.
2. **Skip already-seen** URLs (`engine_seen` table + existing `use_cases.source_url`).
3. **Prefilter** (`prefilter.mjs`): cheap heuristics — needs AI/automation + owner/business + first-hand + outcome signals; rejects crypto/hype/spam/launch posts/dev-only.
4. **LLM rewrite** (`llm.mjs`, OpenAI or Anthropic): accepts/rejects and rewrites into the schema.
5. **Quality gates**: valid category/difficulty, ≥3 steps, prompt has `[placeholders]`, `evidence` quotes must appear verbatim in the source, and every number in result/summary/how-it-went must appear in the source.
6. **Insert** to `use_cases` (`is_example=false`, published unless `ENGINE_AUTO_PUBLISH=false`), record in `engine_seen`, then POST `/api/revalidate` so the site updates.

Local dry run (no keys needed; prints candidates, writes nothing): `node scripts/engine/run.mjs --dry-run --days=30`

GitHub repo → Settings → Secrets and variables → Actions → add: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `REVALIDATE_SECRET` (same value as in Vercel), and `OPENAI_API_KEY` **or** `ANTHROPIC_API_KEY`. Apply `supabase/migrations/0002_engine.sql` first.
