-- =====================================================================
-- Dukkanci — WhatsApp inbox: per-conversation PIN + LABEL
-- (admin "محادثات العملاء" tab). Already applied to the live project on
-- 2026-06-30 via the Supabase API; kept here so the schema change is tracked.
--
-- Adds two columns to the private whatsapp_threads table:
--   pinned  — pinned conversations sort to the top of the inbox.
--   label   — one of a fixed set of tags (validated server-side), so a
--             conversation can be filed into its own list, e.g. a lead who
--             is interested in adding their store ("store_lead").
-- Non-destructive: existing rows get pinned=false, label=null.
-- =====================================================================
alter table public.whatsapp_threads
  add column if not exists pinned boolean not null default false,
  add column if not exists label  text;

-- Fast filtering for the admin inbox (pinned-first sort, per-label lists).
create index if not exists whatsapp_threads_pinned_idx
  on public.whatsapp_threads (pinned) where pinned = true;
create index if not exists whatsapp_threads_label_idx
  on public.whatsapp_threads (label) where label is not null;
