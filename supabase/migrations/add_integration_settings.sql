-- =====================================================================
-- Run this in Supabase SQL Editor to enable GA4 + all integrations
-- =====================================================================

create table if not exists public.integration_settings (
  setting_key   text primary key,
  setting_value text not null default '',
  is_enabled    boolean not null default false,
  updated_at    timestamptz default now()
);

-- seed all known keys
insert into public.integration_settings (setting_key) values
  ('meta_pixel_id'), ('meta_capi_token'), ('meta_test_event_code'),
  ('tiktok_pixel_id'), ('snapchat_pixel_id'), ('pinterest_tag_id'),
  ('google_tag_manager_id'), ('ga4_measurement_id'),
  ('google_ads_conversion_id'), ('google_ads_conversion_label')
on conflict (setting_key) do nothing;

-- RLS: anyone can read (browser loads settings on boot), only service-role writes
alter table public.integration_settings enable row level security;

drop policy if exists "public read integration_settings" on public.integration_settings;
create policy "public read integration_settings"
  on public.integration_settings for select using (true);

grant select on public.integration_settings to anon, authenticated;
