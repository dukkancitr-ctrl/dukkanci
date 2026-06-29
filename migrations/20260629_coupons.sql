-- =====================================================================
-- Dukkanci — Feature 2: conversion drivers (coupons + free-delivery threshold)
-- Additive only. Applied to prod (tzcqnqzltrjemdnkzpzn) 2026-06-29 as Supabase
-- migration "conversion_drivers_coupons". This file is the complete, runnable
-- record (idempotent). Money is validated server-side via validate_coupon /
-- redeem_coupon (both SECURITY DEFINER, anon-callable so guests can use coupons).
-- Ships inert: no coupons + delivery_config.free_delivery_threshold null until set.
--
-- Create a coupon:
--   insert into public.coupons (code, discount_type, value, min_subtotal, max_discount, per_customer_limit)
--   values ('WELCOME10', 'percent', 10, 150, 50, 1);
-- Enable global free delivery over 500 TL:
--   update public.site_settings set value = jsonb_set(value, '{free_delivery_threshold}', '500')
--   where key = 'delivery_config';
-- =====================================================================

create table if not exists public.coupons (
  id bigint generated always as identity primary key,
  code text unique not null,
  discount_type text not null check (discount_type in ('percent','fixed','free_delivery')),
  value numeric not null default 0,
  store_id bigint references public.stores(id),     -- NULL = valid at every store
  min_subtotal numeric not null default 0,
  max_discount numeric,
  starts_at timestamptz,
  ends_at timestamptz,
  usage_limit integer,
  per_customer_limit integer default 1,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.coupon_redemptions (
  id bigint generated always as identity primary key,
  coupon_id bigint not null references public.coupons(id),
  order_id text references public.orders(id),
  customer_id uuid,
  customer_phone text,
  amount numeric not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_coupon_redemptions_coupon on public.coupon_redemptions(coupon_id);

alter table public.coupons enable row level security;
alter table public.coupon_redemptions enable row level security;
drop policy if exists "coupons_public_read" on public.coupons;
create policy "coupons_public_read" on public.coupons for select using (active = true);
-- coupon_redemptions: no public policy (only the security-definer RPCs touch it).

alter table public.stores add column if not exists free_delivery_threshold numeric;
insert into public.site_settings (key, value) values
  ('delivery_config', '{"free_delivery_threshold": null, "currency": "TL"}'::jsonb)
on conflict (key) do nothing;

create or replace function public.validate_coupon(
  p_code text, p_store_id bigint, p_subtotal numeric, p_phone text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  c public.coupons;
  used_total int; used_customer int;
  phone_key text := regexp_replace(coalesce(p_phone,''), '\D', '', 'g');
  disc numeric := 0;
begin
  select * into c from public.coupons
    where lower(code) = lower(btrim(p_code)) and active = true limit 1;
  if not found then return jsonb_build_object('valid', false, 'reason', 'not_found'); end if;
  if c.starts_at is not null and now() < c.starts_at then
    return jsonb_build_object('valid', false, 'reason', 'not_started'); end if;
  if c.ends_at is not null and now() > c.ends_at then
    return jsonb_build_object('valid', false, 'reason', 'expired'); end if;
  if c.store_id is not null and c.store_id <> p_store_id then
    return jsonb_build_object('valid', false, 'reason', 'wrong_store'); end if;
  if p_subtotal < coalesce(c.min_subtotal, 0) then
    return jsonb_build_object('valid', false, 'reason', 'below_min', 'min_subtotal', c.min_subtotal); end if;
  if c.usage_limit is not null then
    select count(*) into used_total from public.coupon_redemptions where coupon_id = c.id;
    if used_total >= c.usage_limit then
      return jsonb_build_object('valid', false, 'reason', 'usage_limit'); end if;
  end if;
  if c.per_customer_limit is not null and phone_key <> '' then
    select count(*) into used_customer from public.coupon_redemptions
      where coupon_id = c.id and regexp_replace(coalesce(customer_phone,''), '\D','','g') = phone_key;
    if used_customer >= c.per_customer_limit then
      return jsonb_build_object('valid', false, 'reason', 'per_customer_limit'); end if;
  end if;
  if c.discount_type = 'percent' then disc := p_subtotal * c.value / 100;
  elsif c.discount_type = 'fixed' then disc := c.value;
  else disc := 0; end if;                              -- free_delivery
  if c.max_discount is not null then disc := least(disc, c.max_discount); end if;
  disc := least(disc, p_subtotal);
  return jsonb_build_object(
    'valid', true, 'code', c.code, 'discount_type', c.discount_type,
    'value', c.value, 'max_discount', c.max_discount,
    'min_subtotal', c.min_subtotal, 'discount', round(disc));
end; $$;

create or replace function public.redeem_coupon(
  p_code text, p_order_id text, p_store_id bigint, p_subtotal numeric,
  p_phone text default null, p_customer_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v jsonb; c public.coupons;
begin
  if not exists (select 1 from public.orders where id = p_order_id) then
    return jsonb_build_object('valid', false, 'reason', 'no_order'); end if;
  v := public.validate_coupon(p_code, p_store_id, p_subtotal, p_phone);
  if not (v->>'valid')::boolean then return v; end if;
  select * into c from public.coupons where lower(code) = lower(btrim(p_code)) and active = true limit 1;
  if exists (select 1 from public.coupon_redemptions where order_id = p_order_id and coupon_id = c.id) then
    return v || jsonb_build_object('redeemed', true); end if;   -- idempotent
  insert into public.coupon_redemptions(coupon_id, order_id, customer_id, customer_phone, amount)
    values (c.id, p_order_id, p_customer_id, p_phone, (v->>'discount')::numeric);
  return v || jsonb_build_object('redeemed', true);
end; $$;

insert into public.integration_settings (setting_key, setting_value, is_enabled) values
  ('feature_conversion_drivers', '', true)
on conflict (setting_key) do nothing;
