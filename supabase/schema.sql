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

-- =====================================================================
-- Sales reporting layer (see migrations/20260616_sales_reporting.sql for docs)
-- Orders are stored once in public.orders; the store reads its own rows and the
-- platform reads all rows. These typed views aggregate sales for both.
-- =====================================================================
create index if not exists orders_store_id_idx  on public.orders (store_id);
create index if not exists orders_created_at_idx on public.orders (created_at);
create index if not exists orders_status_idx     on public.orders (status);

create or replace view public.order_reports as
select
  o.id, o.store_id, s.name as store_name, o.customer,
  o.delivery_details->>'phone'                                as customer_phone,
  o.status,
  coalesce(o.total, 0)                                        as total,
  coalesce((o.delivery_details->'quote'->>'fee')::numeric, 0) as delivery_fee,
  coalesce(o.total, 0) - coalesce((o.delivery_details->'quote'->>'fee')::numeric, 0) as subtotal,
  o.delivery_details->>'payment'                             as payment,
  coalesce(o.delivery_details->>'fulfillment', 'delivery')   as fulfillment,
  o.items                                                     as line_count,
  coalesce((select sum(coalesce((li->>'qty')::numeric, 1))
            from jsonb_array_elements(coalesce(o.delivery_details->'lineItems', '[]'::jsonb)) li), 0) as units,
  (o.status is distinct from 'ملغى' and o.status is distinct from 'مرفوضة')  as is_realized,
  o.created_at,
  (o.created_at at time zone 'Europe/Istanbul')::date         as order_date
from public.orders o
left join public.stores s on s.id = o.store_id;

create or replace view public.store_sales_daily as
select store_id, store_name, order_date, count(*) as orders, sum(total) as revenue,
       sum(subtotal) as subtotal, sum(delivery_fee) as delivery_fees, sum(units) as units,
       round(avg(total), 2) as avg_order_value
from public.order_reports where is_realized
group by store_id, store_name, order_date;

create or replace view public.store_sales_monthly as
select store_id, store_name, date_trunc('month', order_date)::date as month,
       count(*) as orders, sum(total) as revenue, sum(units) as units,
       round(avg(total), 2) as avg_order_value
from public.order_reports where is_realized
group by store_id, store_name, date_trunc('month', order_date);

create or replace view public.platform_sales_daily as
select order_date, count(*) as orders, count(distinct store_id) as active_stores,
       sum(total) as revenue, sum(subtotal) as subtotal, sum(delivery_fee) as delivery_fees,
       sum(units) as units, round(avg(total), 2) as avg_order_value
from public.order_reports where is_realized
group by order_date;

create or replace view public.platform_sales_monthly as
select date_trunc('month', order_date)::date as month, count(*) as orders,
       count(distinct store_id) as active_stores, sum(total) as revenue, sum(units) as units,
       round(avg(total), 2) as avg_order_value
from public.order_reports where is_realized
group by date_trunc('month', order_date);

create or replace view public.product_sales as
select o.store_id, li->>'productId' as product_id, li->>'name' as product_name,
       sum(coalesce((li->>'qty')::numeric, 1)) as units,
       sum(coalesce((li->>'qty')::numeric, 1) * coalesce((li->>'price')::numeric, 0)) as revenue,
       count(distinct o.id) as orders
from public.orders o
cross join lateral jsonb_array_elements(coalesce(o.delivery_details->'lineItems', '[]'::jsonb)) li
where o.status is distinct from 'ملغى' and o.status is distinct from 'مرفوضة'
group by o.store_id, li->>'productId', li->>'name';

grant select on public.order_reports, public.store_sales_daily, public.store_sales_monthly,
  public.platform_sales_daily, public.platform_sales_monthly, public.product_sales
to anon, authenticated;

-- =====================================================================
-- Store login credentials (admin-issued: phone = username + generated password)
-- =====================================================================
-- Per-store merchant login. Unlike stores/products above, this table has RLS
-- ENABLED with NO policy, so anon/authenticated are DENIED entirely — passwords
-- are read/written ONLY by the service-role key inside api/notify-order.js
-- (actions store-creds / store-creds-reset / store-login). NEVER add a
-- permissive policy here, or passwords leak to the public anon key.
create table if not exists public.store_credentials (
  store_id   bigint primary key references public.stores(id) on delete cascade,
  username   text not null,                 -- normalized phone (last 10 digits)
  password   text not null,                 -- generated, plaintext (admin shares it)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.store_credentials enable row level security;
create index if not exists store_credentials_username_idx on public.store_credentials(username);
