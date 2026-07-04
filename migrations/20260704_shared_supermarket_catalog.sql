-- =====================================================================
-- Dukkanci — Shared supermarket image/product bank ("مخزن الصور المشترك")
--
-- Problem this solves: most Arab-owned supermarkets in Turkey arrive with no
-- product database and no product photography of their own, yet ~90% of what
-- they sell is identical to what's already on Dukkanci's existing supermarket
-- stores. This migration adds a curated, cross-store catalog of standardized
-- product photos + canonical names that any NEW store created under the
-- "سوبر ماركت" category can browse and pull products from at setup time —
-- keeping the product name (editable) and choosing their own price + optional
-- sale price, with NO price required up front.
--
-- Safety model:
--   * catalog_products is populated ONLY by the service role (admin curation
--     script/API — see lib/catalog-image-pipeline.js, scripts/build-shared-
--     catalog.js, api/catalog-review.js). No merchant or the anon key can
--     insert/update/delete rows here directly.
--   * A row is only visible to other stores once BOTH approved = true AND
--     brand_free = true — i.e. a human confirmed the photo/name carries no
--     specific store's trademark, logo, watermark, or private-label branding.
--     Everything starts as approved = false and must be reviewed.
--   * Each store's own copy of an imported product still lives in the normal
--     public.products table (same RLS/ownership rules as any other product);
--     catalog_product_id is just a traceability link back to the shared item.
-- =====================================================================

begin;

create table if not exists public.catalog_products (
  id                 bigint generated always as identity primary key,
  normalized_key     text not null,          -- de-duplication key (normalized name), used by the ingestion script's upsert
  canonical_name      text not null,          -- default product name shown to importing stores (they can rename their own copy)
  category           text,
  subcategory        text,
  unit               text,                   -- كيلو / قطعة / علبة ...
  image              text not null,          -- processed: background removed, no store marks, uniform canvas size + zoom
  source_image       text,                   -- original raw photo kept for admin/audit + reprocessing, never shown to merchants
  keywords           text[] not null default '{}',   -- alternate names/dialect spellings seen across contributing stores
  source_store_id    bigint references public.stores(id) on delete set null,   -- which store's photo originally seeded this row (audit only)
  contributor_store_ids bigint[] not null default '{}',  -- all store ids whose products matched into this entry
  brand_free         boolean not null default false,  -- human-confirmed: no store-specific trademark/logo/watermark
  approved           boolean not null default false,  -- visible to other stores once true (see check below)
  review_note        text,                   -- admin note, or the optional AI brand-prescreen hint (never auto-approves)
  usage_count        integer not null default 0,       -- how many stores currently use this item (maintained by trigger below)
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint catalog_products_approval_requires_brand_free check (not approved or brand_free)
);

create unique index if not exists catalog_products_normalized_key_idx on public.catalog_products (normalized_key);
create index if not exists catalog_products_category_idx  on public.catalog_products (category);
create index if not exists catalog_products_approved_idx  on public.catalog_products (approved, brand_free);

-- ---------------------------------------------------------------------
-- Link from a store's own product row back to the shared catalog entry it
-- was imported from (nullable — most products, including anything a store
-- adds manually, will never have this set).
-- ---------------------------------------------------------------------
alter table public.products
  add column if not exists catalog_product_id bigint references public.catalog_products(id) on delete set null;
create index if not exists products_catalog_product_id_idx on public.products (catalog_product_id);

-- Keep catalog_products.usage_count in sync with how many store products
-- currently reference it (nice-to-have stat for the admin review screen —
-- popular items are almost certainly safe/generic and quick to approve).
create or replace function public.sync_catalog_usage_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    if new.catalog_product_id is not null then
      update public.catalog_products set usage_count = usage_count + 1 where id = new.catalog_product_id;
    end if;
  elsif tg_op = 'UPDATE' then
    if new.catalog_product_id is distinct from old.catalog_product_id then
      if old.catalog_product_id is not null then
        update public.catalog_products set usage_count = greatest(0, usage_count - 1) where id = old.catalog_product_id;
      end if;
      if new.catalog_product_id is not null then
        update public.catalog_products set usage_count = usage_count + 1 where id = new.catalog_product_id;
      end if;
    end if;
  elsif tg_op = 'DELETE' then
    if old.catalog_product_id is not null then
      update public.catalog_products set usage_count = greatest(0, usage_count - 1) where id = old.catalog_product_id;
    end if;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_sync_catalog_usage_count on public.products;
create trigger trg_sync_catalog_usage_count
  after insert or update of catalog_product_id or delete on public.products
  for each row execute function public.sync_catalog_usage_count();

-- ---------------------------------------------------------------------
-- RLS — catalog_products
-- Public (anon + authenticated) may only ever SELECT rows that a human has
-- approved AND flagged brand_free. There is intentionally NO insert/update/
-- delete policy: only the service-role key (used exclusively by the admin
-- curation script/API) can write here, so a compromised or buggy merchant
-- session can never pollute the shared bank.
-- ---------------------------------------------------------------------
alter table public.catalog_products enable row level security;

drop policy if exists "catalog_products public read approved" on public.catalog_products;
create policy "catalog_products public read approved" on public.catalog_products
  for select using (approved = true and brand_free = true);

grant select on public.catalog_products to anon, authenticated;

commit;

-- =====================================================================
-- POST-MIGRATION:
--   1) Create a public Supabase Storage bucket named "catalog-images"
--      (Storage → New bucket → Public). This is where the standardized
--      product photos are uploaded by lib/catalog-image-pipeline.js.
--   2) Set env vars (Vercel project settings): OPENAI_API_KEY (already used
--      by /api/enhance-image), SUPABASE_SERVICE_ROLE_KEY, ADMIN_PASSWORD /
--      ADMIN_SESSION_SECRET (already used by the admin panel).
--   3) Run the one-time ingestion job to seed the bank from the existing
--      supermarket stores:  node scripts/build-shared-catalog.js
--   4) Review the pending queue before anything becomes visible to other
--      merchants — GET/POST /api/catalog-review.js (see file header).
-- =====================================================================
