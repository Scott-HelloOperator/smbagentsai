-- Tracks every source URL the content engine has evaluated (accepted or rejected) so it is never re-processed.
create table if not exists public.engine_seen (
  source_url text primary key,
  source text,
  title text,
  status text not null check (status in ('accepted','rejected','error')),
  reason text,
  created_at timestamptz not null default now()
);
alter table public.engine_seen enable row level security;
create unique index if not exists use_cases_source_url_uniq on public.use_cases (source_url) where source_url is not null;
