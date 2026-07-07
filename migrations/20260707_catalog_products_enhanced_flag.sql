-- =====================================================================
-- Dukkanci — shared supermarket catalog: manual (not automatic) AI enhancement
--
-- The bulk ingestion job (scripts/build-shared-catalog.js) originally ran
-- EVERY new candidate through the paid OpenAI cleanup pipeline immediately,
-- before any human had looked at it. In practice most name-normalized
-- clusters turn out to be single-store items (not the "shared across many
-- stores" case the feature is really for), so this burned OpenAI credits on
-- photos nobody had decided were worth cleaning up yet — and a billing hard
-- limit mid-run confirmed the real-world cost risk.
--
-- New model: the bulk job now uploads the RAW source photo as-is (free, no
-- OpenAI call). A reviewer looks at it in the admin "مخزن الصور المشترك" tab
-- and decides, per item, whether it's worth spending on AI cleanup (a
-- POST /api/catalog-review?action=enhance call) before approving it. Some
-- raw photos may already be clean enough to approve without ever being
-- "enhanced" — that's the point: no automatic spend on photos that don't
-- deserve it.
-- =====================================================================

alter table public.catalog_products
  add column if not exists enhanced boolean not null default false; -- true once run through lib/catalog-image-pipeline.js (background/marks removed + zoom standardized)
