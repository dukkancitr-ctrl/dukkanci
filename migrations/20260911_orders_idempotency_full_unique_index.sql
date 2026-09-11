-- Applied to production 2026-09-11 via Supabase MCP (apply_migration).
--
-- create-order inserts with PostgREST `orders?on_conflict=idempotency_key`, which
-- emits ON CONFLICT (idempotency_key) with no WHERE predicate. PostgreSQL cannot
-- infer a PARTIAL unique index from that (42P10), so every website order failed
-- with "تعذّر حفظ الطلب" from 2026-09-09 (when checkout moved to create-order)
-- until this ran. A plain unique index keeps the same semantics: NULLs are
-- distinct in a unique index, so rows without a key are still allowed.
create unique index if not exists orders_idempotency_key_key on public.orders (idempotency_key);
drop index if exists public.orders_idempotency_key_uidx;
