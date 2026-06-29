-- ============================================================
--  Dukkanci — Tracking & Cookies system schema (Phase 1)
--  Applied to Supabase as migration `tracking_system_phase1` (2026-06-30).
--  Idempotent (create if not exists). RLS = deny-all on the tracking_* tables
--  so only the service-role API (api/track.js) can read/write them.
-- ============================================================

create table if not exists public.tracking_visitors (
  id uuid primary key default gen_random_uuid(),
  dukkanci_uid text unique not null,
  first_seen_at timestamptz not null default now(),
  last_seen_at  timestamptz not null default now(),
  first_source text, last_source text,
  first_landing_page text, last_landing_page text,
  city text, district text, language text, device_type text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.tracking_events (
  id bigint generated always as identity primary key,
  event_id uuid not null,
  dukkanci_uid text not null,
  customer_id uuid,
  event_name text not null,
  event_source text not null default 'web',
  store_id bigint,
  product_id bigint,
  cart_id text,
  order_id text,
  value numeric,
  currency text default 'TRY',
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text,
  fbclid text, gclid text, ttclid text,
  page_url text, referrer text, user_agent text, ip_hash text,
  consent_marketing boolean, consent_analytics boolean,
  created_at timestamptz not null default now()
);
create index if not exists tracking_events_uid_idx on public.tracking_events (dukkanci_uid);
create index if not exists tracking_events_name_idx on public.tracking_events (event_name);
create index if not exists tracking_events_store_idx on public.tracking_events (store_id);
create index if not exists tracking_events_order_idx on public.tracking_events (order_id);
create index if not exists tracking_events_created_idx on public.tracking_events (created_at);

create table if not exists public.tracking_consents (
  id bigint generated always as identity primary key,
  dukkanci_uid text not null,
  customer_id uuid,
  consent_version text not null,
  necessary boolean default true,
  functional boolean default false,
  analytics boolean default false,
  marketing boolean default false,
  source text,
  user_agent text,
  ip_hash text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists tracking_consents_uid_idx on public.tracking_consents (dukkanci_uid);

create table if not exists public.marketing_event_logs (
  id bigint generated always as identity primary key,
  event_id uuid not null,
  event_name text not null,
  destination text not null,        -- meta_capi_server | ga4 | tiktok_events_api | ...
  payload_json jsonb,
  response_json jsonb,
  status text,
  error_message text,
  created_at timestamptz default now()
);

-- link a placed order to the campaign/source that drove it
alter table public.orders add column if not exists attribution jsonb;

-- RLS: no anon/authenticated policies => deny-all; service role bypasses RLS.
alter table public.tracking_visitors enable row level security;
alter table public.tracking_events enable row level security;
alter table public.tracking_consents enable row level security;
alter table public.marketing_event_logs enable row level security;
