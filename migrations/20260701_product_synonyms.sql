-- Product synonyms (Phase 4 of the AI section): dialect alternate-names for each
-- product, linked 1:1 to the base products table by product_id. Populated by the
-- admin "المترادفات" tab (sync names → generate via AI → push to Google).
-- Applied live via Supabase MCP on 2026-07-01.
create table if not exists public.product_synonyms (
  product_id  bigint primary key references public.products(id) on delete cascade,
  name        text not null,                          -- snapshot of the canonical product name
  synonyms    text[] not null default '{}',           -- flat union of all dialect terms (search + SEO alternateName)
  dialects    jsonb  not null default '{}'::jsonb,     -- per-dialect columns: { "شامي":[...], "مصري":[...], "خليجي":[...], "مغاربي":[...], "عراقي":[...], "فصحى":[...] }
  status      text not null default 'pending',         -- pending | done | failed
  indexed_at  timestamptz,                             -- last time this product URL was pushed to Google's Indexing API
  updated_at  timestamptz not null default now()
);
create index if not exists product_synonyms_name_idx   on public.product_synonyms (name);
create index if not exists product_synonyms_status_idx on public.product_synonyms (status);

-- Catalog-like data: public may READ (needed by the client search + SSR product
-- page, both anon). All WRITES go through the service-role key on the server.
alter table public.product_synonyms enable row level security;
drop policy if exists product_synonyms_public_read on public.product_synonyms;
create policy product_synonyms_public_read on public.product_synonyms for select using (true);

-- Snapshot every current product name into the synonyms table. New products get a
-- 'pending' row; a renamed product is reset to 'pending' (and un-indexed) so its
-- synonyms are regenerated. Returns fresh counts. Service-role only.
create or replace function public.sync_product_synonyms()
returns json language plpgsql as $$
declare tot int; pend int; done int;
begin
  insert into public.product_synonyms (product_id, name, status)
  select p.id, p.name, 'pending'
  from public.products p
  where p.name is not null and length(btrim(p.name)) > 0
  on conflict (product_id) do update set
    name       = excluded.name,
    status     = case when public.product_synonyms.name is distinct from excluded.name then 'pending' else public.product_synonyms.status end,
    indexed_at = case when public.product_synonyms.name is distinct from excluded.name then null           else public.product_synonyms.indexed_at end,
    updated_at = now();

  select count(*) into tot  from public.product_synonyms;
  select count(*) into pend from public.product_synonyms where status in ('pending','failed');
  select count(*) into done from public.product_synonyms where status = 'done';
  return json_build_object('total', tot, 'pending', pend, 'done', done);
end $$;

create or replace function public.product_synonyms_stats()
returns json language sql as $$
  select json_build_object(
    'total',   (select count(*) from public.product_synonyms),
    'done',    (select count(*) from public.product_synonyms where status = 'done'),
    'pending', (select count(*) from public.product_synonyms where status in ('pending','failed')),
    'failed',  (select count(*) from public.product_synonyms where status = 'failed'),
    'indexed', (select count(*) from public.product_synonyms where indexed_at is not null),
    'distinct_names', (select count(distinct name) from public.product_synonyms)
  );
$$;

-- Lock the RPCs to the server (service-role). The anon key must not be able to
-- trigger a full-catalog resync or read aggregate stats.
revoke all on function public.sync_product_synonyms()  from public;
revoke all on function public.product_synonyms_stats()  from public;
grant execute on function public.sync_product_synonyms() to service_role;
grant execute on function public.product_synonyms_stats() to service_role;
