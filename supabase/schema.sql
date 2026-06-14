-- =====================================================================
-- Dukkanci — Supabase schema (run this FIRST in the SQL Editor)
-- Tables: stores, products, orders, complaints
-- =====================================================================

create table if not exists public.stores (
  id               bigint primary key,
  name             text not null,
  category         text,
  image            text,
  cover_image      text,
  logo_image       text,
  logo             text,
  rating           numeric default 0,
  reviews          integer default 0,
  new_store        boolean default true,
  delivery         integer,
  min_order        integer,
  time             text,
  distance         numeric,
  lat              numeric,
  lng              numeric,
  map_url          text,
  open             boolean default true,
  featured         boolean default false,
  has_offer        boolean default false,
  offer            text,
  price_on_request boolean default false,
  description      text,
  address          text,
  phone            text,
  whatsapp         text,
  email            text,
  website          text,
  source_url       text,
  hours            text,
  areas            jsonb default '[]'::jsonb,
  fulfillment      text,
  subscription     text,
  order_count      integer default 0,
  official_store   boolean default false,
  branch_group     text,
  brand_theme      text,
  created_at       timestamptz default now()
);

create table if not exists public.products (
  id               bigint primary key,
  store_id         bigint references public.stores(id) on delete cascade,
  source_id        text,
  name             text not null,
  image            text,
  price            numeric default 0,
  old_price        numeric,
  price_on_request boolean default false,
  unit             text,
  category         text,
  available        boolean default true,
  featured         boolean default false,
  description      text,
  image_fit        text,
  options          jsonb default '[]'::jsonb,
  created_at       timestamptz default now()
);
create index if not exists products_store_id_idx on public.products(store_id);
create index if not exists products_category_idx on public.products(category);

create table if not exists public.orders (
  id               text primary key,
  store_id         bigint references public.stores(id),
  customer         text,
  total            numeric,
  status           text,
  time             text,
  items            integer,
  delivery_details jsonb,
  created_at       timestamptz default now()
);

create table if not exists public.complaints (
  id               text primary key,
  subject          text,
  customer         text,
  store            text,
  status           text default 'شكوى جديدة',
  order_id         text,
  body             text,
  created_at       timestamptz default now()
);

-- =====================================================================
-- Row Level Security (RLS)
-- DEMO policies: public read for catalog; public insert for orders/complaints.
-- NOTE: writes to stores/products are intentionally NOT public.
-- For the merchant/admin dashboards, add Supabase Auth and replace the
-- write policies below with auth-gated ones before going live.
-- =====================================================================
alter table public.stores     enable row level security;
alter table public.products   enable row level security;
alter table public.orders     enable row level security;
alter table public.complaints enable row level security;

-- DEMO policies (no auth): full public access so the app + dashboards work
-- and so the data can be loaded with the public key.
-- ⚠️ Before going live, add Supabase Auth and restrict writes to store owners/admin.
create policy "stores demo all"     on public.stores     for all using (true) with check (true);
create policy "products demo all"   on public.products   for all using (true) with check (true);
create policy "orders demo all"     on public.orders     for all using (true) with check (true);
create policy "complaints demo all" on public.complaints for all using (true) with check (true);
