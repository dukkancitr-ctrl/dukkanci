-- =====================================================================
-- Dukkanci — Features 3 (tighter ETA) + 5 (voice search)
-- Additive only. Already applied to prod (project tzcqnqzltrjemdnkzpzn) on
-- 2026-06-29 via the Supabase MCP; kept here for the record.
--
-- No DDL: both features are pure client-side additions in app.js, gated behind
-- feature flags read from the existing integration_settings table. Feature 3's
-- ETA reuses the per-store deliverySettings.prepMinutes already configured by
-- merchants + branchDistanceKm() — so NO new stores column is needed. Only a
-- tunable eta_config (avg speed / buffer) is added to site_settings.
-- =====================================================================

-- Feature flags (default behaviour without these rows = OFF, i.e. unchanged UI).
-- Inserted enabled so the features go live on the next deploy; flip is_enabled
-- to false (admin "التكامل" panel / SQL) to turn either off instantly, no redeploy.
insert into public.integration_settings (setting_key, setting_value, is_enabled) values
  ('feature_eta_tightening', '', true),
  ('feature_voice_search',   '', true)
on conflict (setting_key) do nothing;

-- Tunable ETA model (optional; app.js falls back to these same defaults if absent):
--   estimated arrival ≈ store.prepMinutes + (distanceKm / avg_speed_kmh)*60 + buffer_min,
--   shown as a tight ±5-minute window on store cards / the store page.
insert into public.site_settings (key, value) values
  ('eta_config', '{"default_prep_min": 15, "avg_speed_kmh": 18, "buffer_min": 8}'::jsonb)
on conflict (key) do nothing;
