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
