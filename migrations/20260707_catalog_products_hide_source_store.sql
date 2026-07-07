-- =====================================================================
-- Dukkanci — hide the shared catalog's source-store identity from merchants
--
-- catalog_products.source_store_id / contributor_store_ids / source_image
-- were only ever meant for admin audit ("which store's photo seeded this
-- entry" — see the column comments in the original migration), never for
-- merchants importing from the bank. The RLS policy already restricts which
-- ROWS anon/authenticated can see (approved AND brand_free), but RLS does
-- NOT restrict which COLUMNS of a visible row are readable — the blanket
-- `grant select on catalog_products` from the original migration exposed
-- every column, so a merchant opening browser devtools could read exactly
-- which competitor store (e.g. "القاضي" or "صفا الشام") a photo came from.
--
-- Fix: replace the table-wide SELECT grant with a column-level one that
-- only exposes what a merchant's import UI actually needs. review_note
-- (admin curation note / AI brand-prescreen hint) is excluded too — it's
-- reviewer-facing only.
-- =====================================================================

revoke select on public.catalog_products from anon, authenticated;

grant select (
  id, canonical_name, category, subcategory, unit, image, keywords, usage_count
) on public.catalog_products to anon, authenticated;
