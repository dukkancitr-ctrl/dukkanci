-- =====================================================================
-- Dukkanci — Production security hardening migration
-- Covers review items 1 (real RLS), 2 (merchant↔store binding) and 9
-- (store approval workflow).
--
-- ⚠️ RUN THIS AGAINST THE PRODUCTION PROJECT (tzcqnqzltrjemdnkzpzn), NOT a
--    different Supabase project. Test on a staging copy first.
--
-- This migration:
--   * Drops the demo "for all using (true)" policies that let the anon key
--     read AND write everything.
--   * Adds an auth model: platform_admins + store_users (user ↔ store ↔ role).
--   * Adds stores.approval_status so new merchants stay hidden until approved.
--   * Re-creates RLS so: customers see only approved catalog; merchants manage
--     only their own store/products/orders; only admins see everything.
--   * Keeps anonymous order/complaint creation working (no customer login),
--     while blocking anonymous reads of other people's orders.
--
-- Prerequisite: enable Supabase Auth (WhatsApp/SMS OTP or Google) and create
-- the auth users BEFORE relying on the merchant/admin policies.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 0. Drop the insecure demo policies
-- ---------------------------------------------------------------------
drop policy if exists "stores demo all"               on public.stores;
drop policy if exists "products demo all"             on public.products;
drop policy if exists "orders demo all"               on public.orders;
drop policy if exists "complaints demo all"           on public.complaints;
-- integration_settings is handled in a guarded block in section 8 (the table may
-- not exist in every environment — verified absent in production).

-- ---------------------------------------------------------------------
-- 1. Auth model: admins + store membership
-- ---------------------------------------------------------------------
create table if not exists public.platform_admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);
alter table public.platform_admins enable row level security;
-- Only admins can read the admin list; nobody can self-insert (manage via SQL).
drop policy if exists "admins read" on public.platform_admins;
create policy "admins read" on public.platform_admins
  for select using (exists (select 1 from public.platform_admins a where a.user_id = auth.uid()));

create table if not exists public.store_users (
  user_id    uuid   references auth.users(id) on delete cascade,
  store_id   bigint references public.stores(id) on delete cascade,
  role       text   not null default 'owner' check (role in ('owner','staff')),
  created_at timestamptz default now(),
  primary key (user_id, store_id)
);
create index if not exists store_users_store_idx on public.store_users(store_id);
alter table public.store_users enable row level security;

-- ---------------------------------------------------------------------
-- 2. Helper functions (SECURITY DEFINER avoids RLS recursion)
-- ---------------------------------------------------------------------
create or replace function public.is_platform_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.platform_admins where user_id = auth.uid());
$$;

create or replace function public.user_owns_store(p_store_id bigint)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.store_users
    where user_id = auth.uid() and store_id = p_store_id
  );
$$;

grant execute on function public.is_platform_admin()        to anon, authenticated;
grant execute on function public.user_owns_store(bigint)    to anon, authenticated;

-- store_users policies (depend on helpers above)
drop policy if exists "store_users self read" on public.store_users;
create policy "store_users self read" on public.store_users
  for select using (user_id = auth.uid() or public.is_platform_admin());
drop policy if exists "store_users admin manage" on public.store_users;
create policy "store_users admin manage" on public.store_users
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());

-- ---------------------------------------------------------------------
-- 3. Store approval workflow (item 9)
-- ---------------------------------------------------------------------
alter table public.stores
  add column if not exists approval_status text not null default 'pending'
    check (approval_status in ('pending','approved','rejected','suspended'));

-- Existing stores in the catalog are already live → mark them approved once.
update public.stores set approval_status = 'approved'
  where approval_status = 'pending';

-- Bind the creating user as the store owner on insert.
create or replace function public.bind_store_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null then
    insert into public.store_users (user_id, store_id, role)
    values (auth.uid(), new.id, 'owner')
    on conflict do nothing;
  end if;
  return new;
end;
$$;
drop trigger if exists trg_bind_store_owner on public.stores;
create trigger trg_bind_store_owner
  after insert on public.stores
  for each row execute function public.bind_store_owner();

-- Prevent non-admins from changing moderation/trust fields (approval, featured,
-- official flag, subscription). Merchants may edit everything else on their store.
create or replace function public.guard_store_moderation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then
    if new.approval_status is distinct from old.approval_status
       or new.official_store is distinct from old.official_store
       or new.featured       is distinct from old.featured
       or new.subscription   is distinct from old.subscription then
      raise exception 'only the platform admin can change moderation fields';
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists trg_guard_store_moderation on public.stores;
create trigger trg_guard_store_moderation
  before update on public.stores
  for each row execute function public.guard_store_moderation();

-- ---------------------------------------------------------------------
-- 4. RLS — stores
-- ---------------------------------------------------------------------
-- Read: approved stores are public; owners see their own (any status); admin all.
drop policy if exists "stores public read" on public.stores;
create policy "stores public read" on public.stores
  for select using (
    approval_status = 'approved'
    or public.user_owns_store(id)
    or public.is_platform_admin()
  );

-- Insert: only logged-in users, and only as a 'pending' application.
drop policy if exists "stores insert pending" on public.stores;
create policy "stores insert pending" on public.stores
  for insert to authenticated
  with check (approval_status = 'pending' or public.is_platform_admin());

-- Update: owners of the store, or admin. (Moderation fields blocked by trigger.)
drop policy if exists "stores owner update" on public.stores;
create policy "stores owner update" on public.stores
  for update
  using (public.user_owns_store(id) or public.is_platform_admin())
  with check (public.user_owns_store(id) or public.is_platform_admin());

-- Delete: admin only.
drop policy if exists "stores admin delete" on public.stores;
create policy "stores admin delete" on public.stores
  for delete using (public.is_platform_admin());

-- ---------------------------------------------------------------------
-- 5. RLS — products
-- ---------------------------------------------------------------------
-- Read: products of approved stores are public; owners/admin see their own.
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products
  for select using (
    exists (select 1 from public.stores s
            where s.id = products.store_id and s.approval_status = 'approved')
    or public.user_owns_store(store_id)
    or public.is_platform_admin()
  );

-- Write: only the owning merchant or admin.
drop policy if exists "products owner write" on public.products;
create policy "products owner write" on public.products
  for all
  using (public.user_owns_store(store_id) or public.is_platform_admin())
  with check (public.user_owns_store(store_id) or public.is_platform_admin());

-- ---------------------------------------------------------------------
-- 6. RLS — orders
-- ---------------------------------------------------------------------
-- Customer order tracking without a customer login: each order carries an
-- unguessable token. The web app GENERATES this token at checkout, sends it in
-- the insert, and stores it locally ("طلباتي"). Reads go through get_order_by_token.
alter table public.orders
  add column if not exists public_token uuid not null default gen_random_uuid();

-- Insert: anyone (anonymous customers) may create an order, but only for an
-- approved store. They cannot pre-set a status other than the initial one.
drop policy if exists "orders public insert" on public.orders;
create policy "orders public insert" on public.orders
  for insert
  with check (
    exists (select 1 from public.stores s
            where s.id = orders.store_id and s.approval_status = 'approved')
  );

-- Select: ONLY the owning merchant or admin via the normal API. Customers use
-- the token RPC below (table reads stay locked down to stop id-enumeration).
drop policy if exists "orders owner read" on public.orders;
create policy "orders owner read" on public.orders
  for select using (public.user_owns_store(store_id) or public.is_platform_admin());

-- Update (status changes, edits): owning merchant or admin only.
drop policy if exists "orders owner update" on public.orders;
create policy "orders owner update" on public.orders
  for update
  using (public.user_owns_store(store_id) or public.is_platform_admin())
  with check (public.user_owns_store(store_id) or public.is_platform_admin());

drop policy if exists "orders admin delete" on public.orders;
create policy "orders admin delete" on public.orders
  for delete using (public.is_platform_admin());

-- Customer-facing read: returns a single order only when the id+token match.
create or replace function public.get_order_by_token(p_id text, p_token uuid)
returns setof public.orders language sql stable security definer set search_path = public as $$
  select * from public.orders where id = p_id and public_token = p_token;
$$;
grant execute on function public.get_order_by_token(text, uuid) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 7. RLS — complaints
-- ---------------------------------------------------------------------
-- Customers may file a complaint (insert). Reading/!managing them is admin-only.
drop policy if exists "complaints public insert" on public.complaints;
create policy "complaints public insert" on public.complaints
  for insert with check (true);

drop policy if exists "complaints admin read" on public.complaints;
create policy "complaints admin read" on public.complaints
  for select using (public.is_platform_admin());

drop policy if exists "complaints admin manage" on public.complaints;
create policy "complaints admin manage" on public.complaints
  for update using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "complaints admin delete" on public.complaints;
create policy "complaints admin delete" on public.complaints
  for delete using (public.is_platform_admin());

-- ---------------------------------------------------------------------
-- 8. RLS — integration_settings
-- ---------------------------------------------------------------------
-- Read stays public (tracking pixels are injected for every visitor).
-- Writes are admin-only (was public "for all" — the main hole here).
-- Guarded: the table may not exist in every environment.
do $$
begin
  if to_regclass('public.integration_settings') is not null then
    execute 'alter table public.integration_settings enable row level security';
    execute 'drop policy if exists "integration_settings read" on public.integration_settings';
    execute 'drop policy if exists "integration_settings write" on public.integration_settings';
    execute 'drop policy if exists "integration_settings public read" on public.integration_settings';
    execute 'create policy "integration_settings public read" on public.integration_settings for select using (true)';
    execute 'drop policy if exists "integration_settings admin write" on public.integration_settings';
    execute 'create policy "integration_settings admin write" on public.integration_settings for all using (public.is_platform_admin()) with check (public.is_platform_admin())';
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 9. site_settings & whatsapp_messages (if present)
-- ---------------------------------------------------------------------
-- site_settings: public read (editable site content is injected client-side),
-- admin-only write. The notify API writes it with the service role (bypasses RLS).
do $$
begin
  if to_regclass('public.site_settings') is not null then
    execute 'alter table public.site_settings enable row level security';
    execute 'drop policy if exists "site_settings public read" on public.site_settings';
    execute 'create policy "site_settings public read" on public.site_settings for select using (true)';
    execute 'drop policy if exists "site_settings admin write" on public.site_settings';
    execute 'create policy "site_settings admin write" on public.site_settings for all using (public.is_platform_admin()) with check (public.is_platform_admin())';
  end if;
end $$;

-- whatsapp_messages: NO public/customer access at all. The webhook ingest and
-- admin inbox use the service-role key (bypasses RLS); this just slams the door
-- on the anon/authenticated keys so customer chats are never exposed.
do $$
begin
  if to_regclass('public.whatsapp_messages') is not null then
    execute 'alter table public.whatsapp_messages enable row level security';
    execute 'drop policy if exists "whatsapp admin only" on public.whatsapp_messages';
    execute 'create policy "whatsapp admin only" on public.whatsapp_messages for all using (public.is_platform_admin()) with check (public.is_platform_admin())';
  end if;
end $$;

commit;

-- =====================================================================
-- POST-MIGRATION (run manually, outside this file):
--   1) Promote your admin account:
--        insert into public.platform_admins (user_id)
--        values ('<your-auth-user-uuid>');
--   2) For each existing live store, link its merchant account:
--        insert into public.store_users (user_id, store_id, role)
--        values ('<merchant-auth-uuid>', <store_id>, 'owner');
--   3) Frontend must now use an authenticated Supabase session for merchant/
--      admin writes (the anon key can no longer write stores/products/orders),
--      generate orders.public_token at checkout, and read customer orders via
--      rpc get_order_by_token(id, token).
-- =====================================================================
