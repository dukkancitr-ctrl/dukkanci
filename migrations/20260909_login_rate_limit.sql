-- M1: brute-force throttle for store/admin login.
-- Backs the loginThrottle* helpers in api/notify-order.js. Service-role only:
-- RLS is ENABLED with NO policy, so anon/authenticated can neither read nor
-- write it; only the service-role key (used by /api/notify-order) touches it.
-- The app code FAILS OPEN if this table is missing, so logins keep working
-- until this migration is applied — apply it to actually enable throttling.

create table if not exists public.login_attempts (
  key           text primary key,               -- "store:<username>" or "admin:<ip>"
  fails         integer not null default 0,
  window_start  timestamptz not null default now(),
  locked_until  timestamptz,
  updated_at    timestamptz not null default now()
);

alter table public.login_attempts enable row level security;
-- (intentionally no policies → service-role-only)

-- Optional housekeeping index for a periodic cleanup of stale rows.
create index if not exists login_attempts_updated_idx on public.login_attempts (updated_at);
