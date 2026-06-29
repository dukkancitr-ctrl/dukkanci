-- =====================================================================
-- Dukkanci — Feature 1: customer account cloud-sync
-- Additive only. Already applied to prod (project tzcqnqzltrjemdnkzpzn) on
-- 2026-06-29 via the Supabase MCP; kept here for the record.
--
-- Auth, the saved-addresses UI, reorder and checkout-prefill ALREADY exist in
-- app.js but were localStorage-only. This adds the cloud layer so a signed-in
-- customer's profile + addresses follow them across devices, and links orders to
-- the customer for per-customer features (coupons/referrals/credits). Cross-device
-- order HISTORY already worked (loadCustomerOrdersFromSupabase matches by phone).
--
-- All client code is gated behind the feature_customer_accounts flag (default OFF
-- when the row is absent). Guest checkout is byte-identical when the flag is off
-- or the user isn't signed in. get_advisors(security) after this migration showed
-- NO new findings for these tables (RLS on + self-policies).
-- =====================================================================

-- Customer profile, 1:1 with auth.users.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_self" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

-- Saved delivery addresses. Lossless: the full client address object is kept in
-- `data` (jsonb), keyed by the app's local id (`client_id`), so a round-trip
-- preserves the exact shape the UI uses (structured/namedZone/details/lat/lng).
-- syncAddressesToCloud() does a delete+insert of the user's set on each change.
create table if not exists public.customer_addresses (
  id bigint generated always as identity primary key,
  customer_id uuid not null references auth.users(id) on delete cascade,
  client_id bigint,
  label text,
  is_default boolean not null default false,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists idx_customer_addresses_customer on public.customer_addresses(customer_id);
alter table public.customer_addresses enable row level security;
create policy "addr_self" on public.customer_addresses
  for all using (customer_id = auth.uid()) with check (customer_id = auth.uid());

-- Link orders to the signed-in customer (nullable -> existing rows untouched;
-- guest orders stay customer_id NULL). customer_phone mirrors delivery_details->>phone.
alter table public.orders add column if not exists customer_id uuid references auth.users(id);
alter table public.orders add column if not exists customer_phone text;
create index if not exists idx_orders_customer on public.orders(customer_id);

-- Feature flag (inserted enabled; flip is_enabled=false to revert instantly).
insert into public.integration_settings (setting_key, setting_value, is_enabled) values
  ('feature_customer_accounts', '', true)
on conflict (setting_key) do nothing;
