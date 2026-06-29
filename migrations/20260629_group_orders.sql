-- =====================================================================
-- Dukkanci — Feature 4-c: group / building orders (MVP). Additive only.
-- Applied to prod (tzcqnqzltrjemdnkzpzn) 2026-06-29 as Supabase migration
-- "community_group_orders". Complete, runnable record. Same flag
-- (feature_community_retention, set in 20260629_referrals_credits.sql).
--
-- A coordination tool, NOT a combined cart: neighbors join a shared group via a
-- token link to reach a store's minimum + share delivery; each still orders.
-- RLS self-read; the token view + all writes go through the SECURITY DEFINER RPCs.
-- Client: /group/<token> route (SPA catch-all serves it).
-- =====================================================================

create table if not exists public.group_orders (
  id bigint generated always as identity primary key,
  share_token uuid not null default gen_random_uuid() unique,
  store_id bigint not null references public.stores(id),
  area_label text not null,
  window_end timestamptz not null,
  min_target numeric,
  status text not null default 'open' check (status in ('open','locked','submitted','canceled')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create table if not exists public.group_order_participants (
  id bigint generated always as identity primary key,
  group_id bigint not null references public.group_orders(id) on delete cascade,
  customer_id uuid references auth.users(id) on delete set null,
  name text,
  subtotal numeric not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_group_participants_group on public.group_order_participants(group_id);

alter table public.group_orders             enable row level security;
alter table public.group_order_participants enable row level security;
drop policy if exists "group_owner_read" on public.group_orders;
drop policy if exists "gparts_self_read" on public.group_order_participants;
create policy "group_owner_read" on public.group_orders for select using (created_by = auth.uid());
create policy "gparts_self_read" on public.group_order_participants for select using (customer_id = auth.uid());

create or replace function public.create_group_order(
  p_store_id bigint, p_area_label text, p_window_hours int, p_min_target numeric default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); tok uuid; gid bigint;
begin
  if uid is null then return jsonb_build_object('ok', false, 'reason', 'not_signed_in'); end if;
  if btrim(coalesce(p_area_label,'')) = '' then return jsonb_build_object('ok', false, 'reason', 'no_area'); end if;
  if not exists (select 1 from public.stores where id = p_store_id) then
    return jsonb_build_object('ok', false, 'reason', 'bad_store'); end if;
  insert into public.group_orders(store_id, area_label, window_end, min_target, created_by)
    values (p_store_id, btrim(p_area_label),
            now() + (greatest(1, least(coalesce(p_window_hours, 6), 72)) || ' hours')::interval,
            p_min_target, uid)
    returning id, share_token into gid, tok;
  return jsonb_build_object('ok', true, 'token', tok, 'id', gid);
end; $$;

create or replace function public.get_group_order(p_token uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare g public.group_orders; parts jsonb;
begin
  select * into g from public.group_orders where share_token = p_token;
  if not found then return jsonb_build_object('found', false); end if;
  select coalesce(jsonb_agg(jsonb_build_object('name', name, 'subtotal', subtotal) order by created_at), '[]'::jsonb)
    into parts from public.group_order_participants where group_id = g.id;
  return jsonb_build_object(
    'found', true, 'store_id', g.store_id, 'area_label', g.area_label,
    'window_end', g.window_end, 'min_target', g.min_target,
    'status', case when g.window_end < now() and g.status = 'open' then 'closed' else g.status end,
    'participants', parts,
    'total', (select coalesce(sum(subtotal), 0) from public.group_order_participants where group_id = g.id),
    'count', (select count(*) from public.group_order_participants where group_id = g.id));
end; $$;

create or replace function public.join_group_order(p_token uuid, p_name text, p_subtotal numeric default 0)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); g public.group_orders;
begin
  select * into g from public.group_orders where share_token = p_token;
  if not found then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;
  if g.status <> 'open' or g.window_end < now() then return jsonb_build_object('ok', false, 'reason', 'closed'); end if;
  if uid is not null and exists (select 1 from public.group_order_participants where group_id = g.id and customer_id = uid) then
    update public.group_order_participants
      set name = coalesce(nullif(btrim(p_name), ''), name), subtotal = greatest(coalesce(p_subtotal, 0), 0)
      where group_id = g.id and customer_id = uid;
  else
    insert into public.group_order_participants(group_id, customer_id, name, subtotal)
      values (g.id, uid, nullif(btrim(p_name), ''), greatest(coalesce(p_subtotal, 0), 0));
  end if;
  return jsonb_build_object('ok', true);
end; $$;
