-- =====================================================================
-- SEO: per-product slugs for /product/<slug> URLs.
-- Run this in the Supabase SQL Editor, THEN run scripts/gen-product-slugs.mjs
-- to populate the column (slugify supports Arabic/Turkish/Latin + uniqueness).
-- =====================================================================

-- 1) Add the column (nullable until populated).
alter table public.products add column if not exists slug text;

-- 2) Enforce global uniqueness once populated (NULLs are allowed/ignored by the
--    unique index, so this is safe to create before the populate step).
create unique index if not exists products_slug_key on public.products(slug);

-- 3) Helps the product sitemap query (only available products are indexed).
create index if not exists products_available_idx on public.products(available);
