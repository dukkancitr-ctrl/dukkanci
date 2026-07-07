-- Optional, multi-select, additively-priced product add-ons (e.g. "extra
-- cheese", "add ketchup") — distinct from the existing `options` column, which
-- is a required single-choice variant group (size/weight). Flat list of
-- {name, price} objects; price is added to the item total when selected.
alter table products add column if not exists addons jsonb default '[]'::jsonb;
