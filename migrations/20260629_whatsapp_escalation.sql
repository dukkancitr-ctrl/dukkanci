-- AI section Phase 3: human escalation for the WhatsApp assistant (spec: "التصعيد
-- البشري"). Per-conversation state so the AI steps aside when a customer asks for a
-- human or a human agent takes over. RLS-deny like the other AI/inbox tables —
-- service-role only via api/notify-order.js.
create table if not exists public.whatsapp_threads (
  wa_id text primary key,                 -- E.164 digits, matches whatsapp_messages.wa_id
  ai_paused boolean not null default false,   -- true → auto-reply is suppressed (human handling)
  needs_human boolean not null default false, -- true → flagged in the admin inbox
  last_escalated_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.whatsapp_threads enable row level security;
