-- AI section foundation (Phase 1): provider/key registry, per-feature config, usage log.
-- Mirrors the security posture of whatsapp_messages: RLS enabled with NO public
-- policy, so every read/write goes through the service-role key on the server
-- (api/ai.js + lib/ai-gateway.js). The anon key can never read API keys.

-- 1) Providers and their (encrypted) API keys.
create table if not exists public.ai_providers (
  id uuid primary key default gen_random_uuid(),
  provider_name text not null,          -- openai | anthropic | google | replicate
  label text,                           -- optional human label shown in the panel
  service_type text not null default 'text',  -- text | image | embedding | both
  api_key_encrypted text not null,      -- AES-256-GCM (iv:tag:cipher), never plaintext
  key_hint text,                        -- last 4 chars only, for the UI
  default_model text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Which provider/model powers each feature.
create table if not exists public.ai_feature_config (
  id uuid primary key default gen_random_uuid(),
  feature_name text unique not null,    -- whatsapp_autoreply | image_enhancement | synonym_generation | embeddings
  provider_id uuid references public.ai_providers(id) on delete set null,
  model_override text,
  is_enabled boolean not null default true,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 3) Per-call usage log for cost monitoring.
create table if not exists public.ai_usage_log (
  id bigserial primary key,
  feature text,
  provider text,
  model text,
  units integer,                        -- total tokens (text) or images (image)
  est_cost numeric,
  ok boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists ai_usage_log_created_idx on public.ai_usage_log (created_at desc);
create index if not exists ai_usage_log_feature_idx on public.ai_usage_log (feature, created_at desc);

-- Lock everything down: RLS on, no policy = service-role only.
alter table public.ai_providers      enable row level security;
alter table public.ai_feature_config enable row level security;
alter table public.ai_usage_log      enable row level security;

-- Seed the four features the spec defines, unbound (provider_id null) until the
-- admin connects a provider in the panel. is_enabled lets each be toggled.
insert into public.ai_feature_config (feature_name) values
  ('whatsapp_autoreply'),
  ('image_enhancement'),
  ('synonym_generation'),
  ('embeddings')
on conflict (feature_name) do nothing;
