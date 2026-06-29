-- =====================================================================
-- Dukkanci — Feature 4 (parts a+b): referrals + simple credit wallet
-- Additive only. Already applied to prod (project tzcqnqzltrjemdnkzpzn) on
-- 2026-06-29 via the Supabase MCP; kept here for the record.
--
-- Ships with feature_community_retention OFF because referral rewards grant REAL
-- credit (= real money). Review/adjust amounts in site_settings.referral_config
-- (referrer_reward / referee_reward / expiry_days), then flip the flag on.
--
-- Tables: referral_codes, referrals, customer_credits (append-only ledger;
-- balance = sum of non-expired amounts). All RLS self-read; ALL writes go through
-- security-definer RPCs:
--   get_or_create_referral_code()           -> caller's code (created on demand)
--   apply_referral_code(p_code)             -> link caller as referee (pending)
--   credit_balance()                        -> caller's non-expired balance
--   qualify_referral(p_order_id)            -> on first order: reward both parties
--   apply_credit(p_order_id, p_amount)      -> spend credit, capped at balance, idempotent
-- All require auth.uid(); anon calls just return not_signed_in. get_advisors:
-- no new ERRORs (anon-executable definer WARNs are intentional, like the existing
-- get_order_by_token / coupon RPCs).
--
-- Group orders (Feature 4-c) intentionally deferred — separate MVP.
--
-- Full table/RPC bodies: see apply_migration "community_retention_referrals_credits".
-- =====================================================================

-- (tables + RLS self-policies + RPCs are in the applied migration above)
insert into public.site_settings (key, value) values
  ('referral_config', '{"referrer_reward": 25, "referee_reward": 25, "expiry_days": 90}'::jsonb)
on conflict (key) do nothing;

insert into public.integration_settings (setting_key, setting_value, is_enabled) values
  ('feature_community_retention', '', false)
on conflict (setting_key) do nothing;
