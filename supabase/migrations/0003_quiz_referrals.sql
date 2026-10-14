-- Referral vault
alter table public.subscribers add column if not exists ref_code text unique;
alter table public.subscribers add column if not exists referred_by text;
alter table public.subscribers add column if not exists quiz_id uuid;
create index if not exists subscribers_referred_by_idx on public.subscribers (referred_by);
update public.subscribers set ref_code = substr(md5(random()::text || id::text), 1, 8) where ref_code is null;

-- AI Readiness Quiz results (public result pages read via server with service role)
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  answers jsonb not null,
  score int not null,
  plan text[] not null default '{}',
  email text,
  ref text,
  created_at timestamptz not null default now()
);

-- Free AI audit requests (10 referrals). Scott follows up by email/PDF.
create table if not exists public.audit_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  ref_code text not null unique,
  referral_count int not null,
  quiz_id uuid,
  notes text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.quiz_results enable row level security;
alter table public.audit_requests enable row level security;
-- No public policies: all access goes through server routes using the service role key.
