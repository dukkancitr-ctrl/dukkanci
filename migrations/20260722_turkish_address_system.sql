-- Turkish address system: İl / İlçe / Mahalle-Köy reference tables.
-- These are READ-ONLY public reference data (like a postal-code table), not
-- customer data, so RLS just allows anon SELECT — same trust level as
-- `stores`/`products`. No changes needed to `customer_addresses` or `orders`:
-- both already store their payload as jsonb (`data`, `delivery_details`), so
-- the new structured address shape (road type, site/building name, block,
-- door numbers, floor, postal code, lat/lng, location_source, full_address_tr)
-- lives inside those existing jsonb columns — zero DDL there.
--
-- Run this once in the Supabase SQL editor. After it succeeds, run
-- `node scripts/seed-tr-locations.mjs` locally (uses SUPABASE_SERVICE_ROLE_KEY
-- from .env) to bulk-insert the ~33,374 rows (81 provinces, 1,010 districts,
-- 32,283 neighborhoods/villages) from data/tr-locations/*.json.

create table if not exists public.tr_provinces (
  id integer primary key,
  plate_code smallint not null unique,
  name_tr text not null,
  search_name text not null,
  is_active boolean not null default true
);

create table if not exists public.tr_districts (
  id integer primary key,
  province_id integer not null references public.tr_provinces(id) on delete cascade,
  name_tr text not null,
  search_name text not null,
  is_active boolean not null default true
);

create table if not exists public.tr_neighborhoods (
  id integer primary key,
  district_id integer not null references public.tr_districts(id) on delete cascade,
  settlement_type text not null default 'mahalle' check (settlement_type in ('mahalle','koy','belde','kirsal')),
  name_tr text not null,
  search_name text not null,
  postal_code text,
  is_active boolean not null default true
);

create index if not exists idx_tr_districts_province on public.tr_districts(province_id);
create index if not exists idx_tr_neighborhoods_district on public.tr_neighborhoods(district_id);
create index if not exists idx_tr_provinces_search on public.tr_provinces(search_name);
create index if not exists idx_tr_districts_search on public.tr_districts(search_name);
create index if not exists idx_tr_neighborhoods_search on public.tr_neighborhoods(search_name);

alter table public.tr_provinces enable row level security;
alter table public.tr_districts enable row level security;
alter table public.tr_neighborhoods enable row level security;

drop policy if exists tr_provinces_public_read on public.tr_provinces;
create policy tr_provinces_public_read on public.tr_provinces for select using (true);

drop policy if exists tr_districts_public_read on public.tr_districts;
create policy tr_districts_public_read on public.tr_districts for select using (true);

drop policy if exists tr_neighborhoods_public_read on public.tr_neighborhoods;
create policy tr_neighborhoods_public_read on public.tr_neighborhoods for select using (true);

-- Manually-entered neighborhoods ("Listede yok") flow through the existing
-- customer_addresses.data jsonb blob (key `manualSettlementName` +
-- `settlementSource:'manual'`) — no new table needed for review; the admin
-- panel filters customer_addresses where data->>'settlementSource' = 'manual'.
