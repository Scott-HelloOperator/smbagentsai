create table if not exists public.use_cases (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  result text not null,
  summary text not null,
  what_they_did text,
  how_it_went text,
  worth_knowing text,
  prompt text,
  steps jsonb not null default '[]'::jsonb,
  video_url text,
  tools text[] not null default '{}',
  agent text,
  industries text[] not null default '{}',
  difficulty text not null check (difficulty in ('No-code','Light setup','Needs help')),
  setup_time text,
  monthly_cost text,
  impact text,
  source_url text,
  published_at date not null default current_date,
  is_example boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists use_cases_category_idx on public.use_cases (category);
create index if not exists use_cases_tools_idx on public.use_cases using gin (tools);
create index if not exists use_cases_industries_idx on public.use_cases using gin (industries);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  name text, email text not null, business text, story text not null, tools text, source_url text,
  created_at timestamptz not null default now()
);

alter table public.use_cases enable row level security;
alter table public.subscribers enable row level security;
alter table public.submissions enable row level security;
create policy "public read published use cases" on public.use_cases for select using (is_published);
-- subscribers/submissions: no public policies; inserts go through server API routes using the service role key.
