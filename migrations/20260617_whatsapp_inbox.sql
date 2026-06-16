-- =====================================================================
-- Dukkanci — WhatsApp inbox (two-way customer chat over the Cloud API)
-- Run this in the Supabase SQL Editor.
--
-- Every WhatsApp message — inbound (from a customer) and outbound (a reply
-- sent from the admin panel) — is stored here. The admin "المحادثات" tab reads
-- and writes these rows THROUGH the server (api/notify-order.js) using the
-- service-role key, so the table stays PRIVATE: RLS is on and there is no
-- public policy, which means the anon/publishable key cannot read customer PII.
-- =====================================================================
create table if not exists public.whatsapp_messages (
  id            bigint generated always as identity primary key,
  wa_id         text not null,                       -- customer phone, E.164 digits (no +)
  contact_name  text,                                -- WhatsApp profile name, when provided
  direction     text not null check (direction in ('in', 'out')),
  body          text,                                -- message text (or a label like "[صورة]")
  msg_type      text default 'text',                 -- text | image | audio | document | ...
  wam_id        text,                                -- WhatsApp message id (for dedupe + status updates)
  status        text,                                -- outbound lifecycle: sent | delivered | read | failed
  error         text,                                -- failure reason, when status = failed
  read_at       timestamptz,                         -- when an inbound message was read in the panel
  created_at    timestamptz default now()
);

-- Dedupe inbound webhook retries / match status updates to the original message.
-- A full unique index (not partial) so ON CONFLICT (wam_id) works in upserts;
-- Postgres allows multiple NULLs, so rows without a wam_id never collide.
create unique index if not exists whatsapp_messages_wam_id_idx
  on public.whatsapp_messages (wam_id);

-- Thread listing + per-conversation history are ordered by time per contact.
create index if not exists whatsapp_messages_wa_id_created_idx
  on public.whatsapp_messages (wa_id, created_at desc);

-- Unread badge: inbound messages not yet opened.
create index if not exists whatsapp_messages_unread_idx
  on public.whatsapp_messages (wa_id) where direction = 'in' and read_at is null;

-- PRIVATE: enable RLS and add NO public policy. The anon/publishable key gets
-- nothing; only the service-role key (used server-side) can read/write, because
-- it bypasses RLS. Do NOT add a "for all using (true)" policy here.
alter table public.whatsapp_messages enable row level security;
