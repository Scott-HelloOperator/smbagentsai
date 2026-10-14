-- Unified inbox for every form on the site. Nothing is lost: rows are written before any email delivery is attempted.
create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null,               -- submit | sponsor | contact | help | win | audit
  email text, name text,
  payload jsonb not null default '{}',
  status text not null default 'new',
  delivered_via text,               -- resend | formsubmit | null
  delivery_error text,
  ip_hash text,
  created_at timestamptz not null default now()
);
create index if not exists form_submissions_created_idx on public.form_submissions (created_at desc);

-- Simple sliding-window rate limiter.
create table if not exists public.rate_events (id bigserial primary key, bucket text not null, created_at timestamptz not null default now());
create index if not exists rate_events_bucket_idx on public.rate_events (bucket, created_at desc);

-- Hashed secrets (admin token). Value never stored in plaintext.
create table if not exists public.app_secrets (name text primary key, value_hash text not null, created_at timestamptz not null default now());

-- Subscribers: double opt-in, unsubscribe, anti-gaming.
alter table public.subscribers add column if not exists email_norm text;
alter table public.subscribers add column if not exists confirmed_at timestamptz;
alter table public.subscribers add column if not exists confirm_token text;
alter table public.subscribers add column if not exists unsub_token text;
alter table public.subscribers add column if not exists unsubscribed_at timestamptz;
alter table public.subscribers add column if not exists ip_hash text;
update public.subscribers set unsub_token = encode(gen_random_bytes(16), 'hex') where unsub_token is null;
update public.subscribers set confirm_token = encode(gen_random_bytes(16), 'hex') where confirm_token is null;
update public.subscribers set email_norm = lower(email) where email_norm is null;
create index if not exists subscribers_email_norm_idx on public.subscribers (email_norm);

-- Newsletter
create table if not exists public.newsletter_sends (
  id bigserial primary key, issue int not null, email text not null, status text not null, error text, created_at timestamptz not null default now()
);
create table if not exists public.issue_votes (
  id bigserial primary key, issue int not null, vote text not null check (vote in ('fire','decent','poop')),
  voter text not null, created_at timestamptz not null default now(), unique (issue, voter)
);

-- Owner-submitted wins (moderated)
create table if not exists public.wins (
  id uuid primary key default gen_random_uuid(),
  name text not null, business text, email text not null, credit_url text,
  title text not null, story text not null, tools text, hours_saved text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  ip_hash text, created_at timestamptz not null default now(), approved_at timestamptz
);

alter table public.form_submissions enable row level security;
alter table public.rate_events enable row level security;
alter table public.app_secrets enable row level security;
alter table public.newsletter_sends enable row level security;
alter table public.issue_votes enable row level security;
alter table public.wins enable row level security;
-- No public policies: server routes use the service role.
alter table public.issue_votes add column if not exists question text not null default 'rating';
alter table public.issue_votes drop constraint if exists issue_votes_vote_check;
alter table public.issue_votes drop constraint if exists issue_votes_issue_voter_key;
alter table public.issue_votes add constraint issue_votes_uniq unique (issue, question, voter);
