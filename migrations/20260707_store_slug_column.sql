-- Admin-editable clean URL slug per store, replacing the deploy-only
-- store-slugs.js file as the primary source (that file remains as a legacy
-- fallback for stores already slugged there). Lets a new store get a
-- non-numeric /store/<slug> URL immediately at creation, and lets admin
-- fix/improve a slug without a code deploy.
alter table stores add column if not exists slug text unique;
