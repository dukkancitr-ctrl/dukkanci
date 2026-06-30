-- ============================================================
--  Dukkanci — Admin tracking report function (Phase 2b)
--  Applied to Supabase as migration `tracking_report_function` (2026-06-30).
--  Updated 2026-06-30 (migration `tracking_report_add_whatsapp_by_store`):
--   + whatsapp_by_store — every store with WhatsApp-button clicks, ranked desc
--     (powers the admin "نقرات واتساب لكل متجر" table + CSV export).
--  Aggregates tracking_events for the admin "التتبع والبيانات التسويقية" tab.
--  SECURITY INVOKER + execute revoked from anon/authenticated: only the
--  service-role API (api/track-report.js) can read the underlying data.
-- ============================================================
create or replace function public.tracking_report(
  p_from timestamptz,
  p_to   timestamptz,
  p_store bigint default null
) returns jsonb
language sql stable
as $$
  with ev as (
    select * from public.tracking_events
    where created_at >= p_from and created_at < p_to
      and (p_store is null or store_id = p_store)
  ),
  tot as (
    select
      count(distinct dukkanci_uid)                                   as visitors,
      count(*) filter (where event_name in ('page_view','view_home'))as page_views,
      count(*) filter (where event_name='view_store')                as store_views,
      count(*) filter (where event_name='view_item')                 as product_views,
      count(*) filter (where event_name='add_to_cart')               as add_to_cart,
      count(*) filter (where event_name='begin_checkout')            as begin_checkout,
      count(*) filter (where event_name='purchase')                  as purchases,
      count(*) filter (where event_name='whatsapp_click')            as whatsapp_clicks,
      count(*) filter (where event_name='submit_phone')              as leads,
      coalesce(sum(value) filter (where event_name='purchase'),0)    as revenue
    from ev
  ),
  stores_rep as (
    select coalesce(jsonb_agg(row_to_json(x)::jsonb order by x.store_views desc),'[]'::jsonb) d from (
      select e.store_id,
        coalesce(s.name,'#'||e.store_id::text) as name,
        count(*) filter (where e.event_name='view_store')  as store_views,
        count(*) filter (where e.event_name='add_to_cart') as add_to_cart,
        count(*) filter (where e.event_name='purchase')    as purchases,
        count(*) filter (where e.event_name='whatsapp_click') as whatsapp_clicks
      from ev e left join public.stores s on s.id=e.store_id
      where e.store_id is not null
      group by e.store_id, s.name
      order by store_views desc limit 15
    ) x
  ),
  wa_by_store as (
    select coalesce(jsonb_agg(row_to_json(x)::jsonb order by x.whatsapp_clicks desc),'[]'::jsonb) d from (
      select e.store_id,
        coalesce(s.name,'#'||e.store_id::text) as name,
        count(*) filter (where e.event_name='whatsapp_click') as whatsapp_clicks,
        count(distinct e.dukkanci_uid) filter (where e.event_name='whatsapp_click') as unique_visitors,
        count(*) filter (where e.event_name='view_store')  as store_views
      from ev e left join public.stores s on s.id=e.store_id
      where e.store_id is not null
      group by e.store_id, s.name
      having count(*) filter (where e.event_name='whatsapp_click') > 0
      order by whatsapp_clicks desc limit 200
    ) x
  ),
  products_rep as (
    select coalesce(jsonb_agg(row_to_json(x)::jsonb order by x.views desc),'[]'::jsonb) d from (
      select e.product_id,
        coalesce(p.name,'#'||e.product_id::text) as name,
        count(*) filter (where e.event_name='view_item')   as views,
        count(*) filter (where e.event_name='add_to_cart') as add_to_cart
      from ev e left join public.products p on p.id=e.product_id
      where e.product_id is not null
      group by e.product_id, p.name
      order by views desc limit 15
    ) x
  ),
  sources_rep as (
    select coalesce(jsonb_agg(row_to_json(x)::jsonb order by x.visitors desc),'[]'::jsonb) d from (
      select coalesce(nullif(v.last_source,''),'direct') as source,
             count(distinct e.dukkanci_uid) as visitors
      from ev e left join public.tracking_visitors v on v.dukkanci_uid=e.dukkanci_uid
      group by 1 order by visitors desc limit 12
    ) x
  ),
  campaigns_rep as (
    select coalesce(jsonb_agg(row_to_json(x)::jsonb order by x.purchases desc, x.visitors desc),'[]'::jsonb) d from (
      select utm_campaign as campaign,
             count(distinct dukkanci_uid) as visitors,
             count(*) filter (where event_name='purchase') as purchases,
             coalesce(sum(value) filter (where event_name='purchase'),0) as revenue
      from ev where utm_campaign is not null and utm_campaign<>''
      group by utm_campaign order by purchases desc, visitors desc limit 12
    ) x
  ),
  abandoned as (
    select count(*) c from (
      select cart_id from ev where cart_id is not null
      group by cart_id
      having count(*) filter (where event_name='add_to_cart')>0
         and count(*) filter (where event_name='purchase')=0
    ) a
  )
  select jsonb_build_object(
    'range', jsonb_build_object('from',p_from,'to',p_to,'store',p_store),
    'totals', to_jsonb(tot),
    'conversion_rate', case when tot.visitors>0 then round((tot.purchases::numeric/tot.visitors)*100,2) else 0 end,
    'cart_conversion', case when tot.add_to_cart>0 then round((tot.purchases::numeric/tot.add_to_cart)*100,2) else 0 end,
    'abandoned_carts', (select c from abandoned),
    'top_stores', (select d from stores_rep),
    'whatsapp_by_store', (select d from wa_by_store),
    'top_products', (select d from products_rep),
    'traffic_sources', (select d from sources_rep),
    'top_campaigns', (select d from campaigns_rep)
  )
  from tot;
$$;

revoke all on function public.tracking_report(timestamptz,timestamptz,bigint) from public, anon, authenticated;
grant execute on function public.tracking_report(timestamptz,timestamptz,bigint) to service_role;
