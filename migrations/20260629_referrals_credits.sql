-- =====================================================================
-- Dukkanci — Feature 4 (parts a+b): referrals + simple credit wallet
-- Additive only. Applied to prod (tzcqnqzltrjemdnkzpzn) 2026-06-29 as Supabase
-- migration "community_retention_referrals_credits". Complete, runnable record.
--
-- feature_community_retention is inserted OFF (referral rewards = real money).
-- Review site_settings.referral_config, then flip the flag on to go live.
-- Tables are RLS self-read only; ALL writes go through the SECURITY DEFINER RPCs.
-- =====================================================================

create table if not exists public.referral_codes (
  customer_id uuid primary key references auth.users(id) on delete cascade,
  code text unique not null,
  created_at timestamptz not null default now()
);
create table if not exists public.referrals (
  id bigint generated always as identity primary key,
  referrer_id uuid not null references auth.users(id) on delete cascade,
  referee_id uuid references auth.users(id) on delete set null,
  referee_phone text,
  status text not null default 'pending' check (status in ('pending','qualified','rewarded')),
  reward_amount numeric not null default 0,
  first_order_id text references public.orders(id),
  created_at timestamptz not null default now()
);
create unique index if not exists uq_referrals_referee on public.referrals(referee_id) where referee_id is not null;
create index if not exists idx_referrals_referrer on public.referrals(referrer_id);

create table if not exists public.customer_credits (
  id bigint generated always as identity primary key,
  customer_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null,                 -- +add / -spend
  reason text not null,
  order_id text references public.orders(id),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_credits_customer on public.customer_credits(customer_id);

alter table public.referral_codes   enable row level security;
alter table public.referrals        enable row level security;
alter table public.customer_credits enable row level security;
drop policy if exists "refcode_self" on public.referral_codes;
drop policy if exists "ref_self"     on public.referrals;
drop policy if exists "credits_self" on public.customer_credits;
create policy "refcode_self" on public.referral_codes for select using (customer_id = auth.uid());
create policy "ref_self"     on public.referrals      for select using (referrer_id = auth.uid() or referee_id = auth.uid());
create policy "credits_self" on public.customer_credits for select using (customer_id = auth.uid());

insert into public.site_settings (key, value) values
  ('referral_config', '{"referrer_reward": 25, "referee_reward": 25, "expiry_days": 90}'::jsonb)
on conflict (key) do nothing;

create or replace function public.get_or_create_referral_code()
returns text language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); existing text; gen text;
begin
  if uid is null then return null; end if;
  select code into existing from public.referral_codes where customer_id = uid;
  if existing is not null then return existing; end if;
  for i in 1..10 loop
    gen := upper(substr(md5(uid::text || clock_timestamp()::text || i::text), 1, 7));
    begin
      insert into public.referral_codes(customer_id, code) values (uid, gen);
      return gen;
    exception when unique_violation then
      select code into existing from public.referral_codes where customer_id = uid;
      if existing is not null then return existing; end if;
    end;
  end loop;
  return null;
end; $$;

create or replace function public.apply_referral_code(p_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); ref_owner uuid;
begin
  if uid is null then return jsonb_build_object('ok', false, 'reason', 'not_signed_in'); end if;
  select customer_id into ref_owner from public.referral_codes where lower(code) = lower(btrim(p_code));
  if ref_owner is null then return jsonb_build_object('ok', false, 'reason', 'bad_code'); end if;
  if ref_owner = uid then return jsonb_build_object('ok', false, 'reason', 'self'); end if;
  if exists (select 1 from public.referrals where referee_id = uid) then
    return jsonb_build_object('ok', false, 'reason', 'already_referred'); end if;
  insert into public.referrals(referrer_id, referee_id, status) values (ref_owner, uid, 'pending');
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.credit_balance()
returns numeric language sql security definer set search_path = public as $$
  select coalesce(sum(amount), 0) from public.customer_credits
  where customer_id = auth.uid() and (expires_at is null or expires_at > now());
$$;

create or replace function public.qualify_referral(p_order_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid(); r public.referrals; cfg jsonb;
  rr numeric; re numeric; exp_days int;
begin
  if uid is null then return jsonb_build_object('ok', false, 'reason', 'not_signed_in'); end if;
  if not exists (select 1 from public.orders where id = p_order_id and customer_id = uid) then
    return jsonb_build_object('ok', false, 'reason', 'no_order'); end if;
  select * into r from public.referrals where referee_id = uid and status = 'pending' limit 1;
  if not found then return jsonb_build_object('ok', false, 'reason', 'no_pending_referral'); end if;
  select value into cfg from public.site_settings where key = 'referral_config';
  rr := coalesce((cfg->>'referrer_reward')::numeric, 0);
  re := coalesce((cfg->>'referee_reward')::numeric, 0);
  exp_days := coalesce((cfg->>'expiry_days')::int, 90);
  update public.referrals set status = 'rewarded', reward_amount = rr, first_order_id = p_order_id where id = r.id;
  if rr > 0 then insert into public.customer_credits(customer_id, amount, reason, order_id, expires_at)
    values (r.referrer_id, rr, 'referral_referrer', p_order_id, now() + (exp_days || ' days')::interval); end if;
  if re > 0 then insert into public.customer_credits(customer_id, amount, reason, order_id, expires_at)
    values (uid, re, 'referral_referee', p_order_id, now() + (exp_days || ' days')::interval); end if;
  return jsonb_build_object('ok', true, 'referee_reward', re);
end; $$;

create or replace function public.apply_credit(p_order_id text, p_amount numeric)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); bal numeric; spend numeric;
begin
  if uid is null then return jsonb_build_object('ok', false, 'applied', 0, 'reason', 'not_signed_in'); end if;
  if not exists (select 1 from public.orders where id = p_order_id and customer_id = uid) then
    return jsonb_build_object('ok', false, 'applied', 0, 'reason', 'no_order'); end if;
  if exists (select 1 from public.customer_credits where order_id = p_order_id and reason = 'redeem' and customer_id = uid) then
    return jsonb_build_object('ok', true, 'applied', 0, 'reason', 'already_applied'); end if;  -- idempotent
  select credit_balance() into bal;
  spend := least(greatest(coalesce(p_amount, 0), 0), bal);
  if spend <= 0 then return jsonb_build_object('ok', true, 'applied', 0); end if;
  insert into public.customer_credits(customer_id, amount, reason, order_id)
    values (uid, -spend, 'redeem', p_order_id);
  return jsonb_build_object('ok', true, 'applied', spend);
end; $$;

insert into public.integration_settings (setting_key, setting_value, is_enabled) values
  ('feature_community_retention', '', false)
on conflict (setting_key) do nothing;
