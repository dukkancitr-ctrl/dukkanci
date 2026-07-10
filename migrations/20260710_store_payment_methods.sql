-- Per-store toggle for which checkout payment methods the merchant accepts
-- (cash on delivery / card-on-delivery via POS / bank transfer). Defaults to
-- all three enabled so existing stores keep today's behavior unchanged.
alter table stores add column if not exists payment_methods jsonb
  default '{"cash":true,"card":true,"bank":true}'::jsonb;
