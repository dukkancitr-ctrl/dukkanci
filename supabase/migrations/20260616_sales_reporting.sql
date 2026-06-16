-- =====================================================================
-- Sales reporting layer
-- ---------------------------------------------------------------------
-- Every order is stored ONCE in public.orders (the single source of truth).
-- It already serves both audiences:
--   • the STORE     -> its own rows         (where store_id = <id>)
--   • the PLATFORM  -> all rows             (no filter)
-- Duplicating rows into a second table would only cause drift, so instead we
-- add typed reporting VIEWS on top, plus indexes to keep them fast.
--
-- Reporting fields that live inside the delivery_details JSON (payment,
-- fulfillment, delivery fee, line items) are extracted here as real columns so
-- they can be aggregated with plain SQL / the Supabase REST API.
-- =====================================================================

-- Indexes that the reports group/filter on.
create index if not exists orders_store_id_idx   on public.orders (store_id);
create index if not exists orders_created_at_idx  on public.orders (created_at);
create index if not exists orders_status_idx      on public.orders (status);

-- ---------------------------------------------------------------------
-- Base view: one flat, typed row per order.
-- ---------------------------------------------------------------------
create or replace view public.order_reports as
select
  o.id,
  o.store_id,
  s.name                                                                       as store_name,
  o.customer,
  o.delivery_details->>'phone'                                                 as customer_phone,
  o.status,
  coalesce(o.total, 0)                                                         as total,
  coalesce((o.delivery_details->'quote'->>'fee')::numeric, 0)                  as delivery_fee,
  coalesce(o.total, 0)
    - coalesce((o.delivery_details->'quote'->>'fee')::numeric, 0)             as subtotal,
  o.delivery_details->>'payment'                                              as payment,
  coalesce(o.delivery_details->>'fulfillment', 'delivery')                    as fulfillment,
  o.items                                                                      as line_count,
  coalesce((
    select sum(coalesce((li->>'qty')::numeric, 1))
    from jsonb_array_elements(coalesce(o.delivery_details->'lineItems', '[]'::jsonb)) li
  ), 0)                                                                        as units,
  -- Cancelled / rejected orders are excluded from realized sales totals.
  (o.status is distinct from 'ملغى' and o.status is distinct from 'مرفوضة')   as is_realized,
  o.created_at,
  (o.created_at at time zone 'Europe/Istanbul')::date                          as order_date
from public.orders o
left join public.stores s on s.id = o.store_id;

-- ---------------------------------------------------------------------
-- Per-store sales (the store's own report).
-- ---------------------------------------------------------------------
create or replace view public.store_sales_daily as
select
  store_id, store_name, order_date,
  count(*)                as orders,
  sum(total)              as revenue,
  sum(subtotal)           as subtotal,
  sum(delivery_fee)       as delivery_fees,
  sum(units)              as units,
  round(avg(total), 2)    as avg_order_value
from public.order_reports
where is_realized
group by store_id, store_name, order_date;

create or replace view public.store_sales_monthly as
select
  store_id, store_name,
  date_trunc('month', order_date)::date as month,
  count(*)              as orders,
  sum(total)            as revenue,
  sum(units)            as units,
  round(avg(total), 2)  as avg_order_value
from public.order_reports
where is_realized
group by store_id, store_name, date_trunc('month', order_date);

-- ---------------------------------------------------------------------
-- Platform-wide sales (the management report).
-- ---------------------------------------------------------------------
create or replace view public.platform_sales_daily as
select
  order_date,
  count(*)                  as orders,
  count(distinct store_id)  as active_stores,
  sum(total)                as revenue,
  sum(subtotal)             as subtotal,
  sum(delivery_fee)         as delivery_fees,
  sum(units)                as units,
  round(avg(total), 2)      as avg_order_value
from public.order_reports
where is_realized
group by order_date;

create or replace view public.platform_sales_monthly as
select
  date_trunc('month', order_date)::date as month,
  count(*)                  as orders,
  count(distinct store_id)  as active_stores,
  sum(total)                as revenue,
  sum(units)                as units,
  round(avg(total), 2)      as avg_order_value
from public.order_reports
where is_realized
group by date_trunc('month', order_date);

-- ---------------------------------------------------------------------
-- Best-selling products (per store + platform), unnested from line items.
-- ---------------------------------------------------------------------
create or replace view public.product_sales as
select
  o.store_id,
  li->>'productId'                                                       as product_id,
  li->>'name'                                                           as product_name,
  sum(coalesce((li->>'qty')::numeric, 1))                              as units,
  sum(coalesce((li->>'qty')::numeric, 1) * coalesce((li->>'price')::numeric, 0)) as revenue,
  count(distinct o.id)                                                  as orders
from public.orders o
cross join lateral jsonb_array_elements(coalesce(o.delivery_details->'lineItems', '[]'::jsonb)) li
where o.status is distinct from 'ملغى' and o.status is distinct from 'مرفوضة'
group by o.store_id, li->>'productId', li->>'name';

-- Expose the views through the Supabase REST API (same open access as the demo
-- order policy; tighten alongside the table policies when you add Auth).
grant select on
  public.order_reports,
  public.store_sales_daily,
  public.store_sales_monthly,
  public.platform_sales_daily,
  public.platform_sales_monthly,
  public.product_sales
to anon, authenticated;
