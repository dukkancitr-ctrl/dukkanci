-- WhatsApp marketing campaign tables for Dukkanci.
-- Run once in Supabase SQL Editor (Dashboard → SQL Editor → New query).

-- Main campaigns table
CREATE TABLE IF NOT EXISTS wa_campaigns (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  template_name    text NOT NULL,
  template_lang    text NOT NULL DEFAULT 'ar',
  template_params  jsonb NOT NULL DEFAULT '[]',
  audience_type    text NOT NULL DEFAULT 'all_customers',
  -- all_customers | no_order_30d
  status           text NOT NULL DEFAULT 'draft',
  -- draft | ready | sending | paused | paused_daily_limit | done | canceled
  total_recipients int  NOT NULL DEFAULT 0,
  sent_count       int  NOT NULL DEFAULT 0,
  failed_count     int  NOT NULL DEFAULT 0,
  note             text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  started_at       timestamptz,
  finished_at      timestamptz
);

-- Per-recipient tracking (one row per phone per campaign)
CREATE TABLE IF NOT EXISTS wa_campaign_recipients (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES wa_campaigns(id) ON DELETE CASCADE,
  phone       text NOT NULL,
  status      text NOT NULL DEFAULT 'pending',
  -- pending | sent | failed
  sent_at     timestamptz,
  error       text
);

CREATE INDEX IF NOT EXISTS idx_wcr_campaign_status
  ON wa_campaign_recipients (campaign_id, status);

CREATE INDEX IF NOT EXISTS idx_wcr_sent_at
  ON wa_campaign_recipients (sent_at)
  WHERE sent_at IS NOT NULL;

-- Uploaded contacts: phone numbers imported by admin (past customers, leads, etc.)
CREATE TABLE IF NOT EXISTS wa_contacts (
  phone      text PRIMARY KEY,
  group_name text NOT NULL DEFAULT 'default',
  source     text NOT NULL DEFAULT 'manual',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Opt-out list: customers who asked not to receive marketing messages
CREATE TABLE IF NOT EXISTS wa_optout (
  phone      text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  reason     text
);

-- RLS: only service-role key can read/write these tables (admin-only data)
ALTER TABLE wa_campaigns          ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_optout             ENABLE ROW LEVEL SECURITY;

-- No public access — all access goes through the service-role key in api/campaign.js
CREATE POLICY "service role only" ON wa_campaigns          FOR ALL USING (false);
CREATE POLICY "service role only" ON wa_campaign_recipients FOR ALL USING (false);
CREATE POLICY "service role only" ON wa_optout             FOR ALL USING (false);
