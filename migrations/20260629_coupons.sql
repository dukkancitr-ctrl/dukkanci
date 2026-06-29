-- =====================================================================
-- Dukkanci — Feature 2: conversion drivers (coupons + free-delivery threshold)
-- Additive only. Already applied to prod (project tzcqnqzltrjemdnkzpzn) on
-- 2026-06-29 via the Supabase MCP; kept here for the record.
--
-- Money is validated SERVER-SIDE: validate_coupon (display) + redeem_coupon
-- (records the redemption at order time, enforces usage/per-customer limits,
-- ties to a real order, idempotent). Both are SECURITY DEFINER and callable by
-- anon so guests can use coupons (intentional; same pattern as get_order_by_token).
-- The browser only displays the result and recomputes the amount from validated
-- params so it tracks live cart edits; total is floored at 0.
--
-- Min-order alert + Web Push were ALREADY live, so this feature adds only coupons
-- + the free-delivery threshold. All gated behind feature_conversion_drivers.
-- Ships INERT: no coupons exist yet and delivery_config.free_delivery_threshold is
-- null, so nothing changes for customers until an admin adds coupons / a threshold.
--
-- To create a coupon (example):
--   insert into public.coupons (code, discount_type, value, min_subtotal, max_discount, per_customer_limit)
--   values ('WELCOME10', 'percent', 10, 150, 50, 1);
-- To enable global free delivery over 500 TL:
--   update public.site_settings set value = jsonb_set(value, '{free_delivery_threshold}', '500')
--   where key = 'delivery_config';
-- =====================================================================

create table if not exists public.coupons (
  id bigint generated always as identity primary key,
  code text unique not null,
  discount_type text not null check (discount_type in ('percent','fixed','free_delivery')),
  value numeric not null default 0,
  store_id bigint references public.stores(id),      -- NULL = every store
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
create policy "coupons_public_read" on public.coupons for select using (active = true);
-- coupon_redemptions: no public policy (only the security-definer RPCs touch it).

alter table public.stores add column if not exists free_delivery_threshold numeric;
insert into public.site_settings (key, value) values
  ('delivery_config', '{"free_delivery_threshold": null, "currency": "TL"}'::jsonb)
on conflict (key) do nothing;

-- RPCs validate_coupon(p_code,p_store_id,p_subtotal,p_phone) and
-- redeem_coupon(p_code,p_order_id,p_store_id,p_subtotal,p_phone,p_customer_id):
-- see the apply_migration named "conversion_drivers_coupons" for the full bodies.

insert into public.integration_settings (setting_key, setting_value, is_enabled) values
  ('feature_conversion_drivers', '', true)
on conflict (setting_key) do nothing;
