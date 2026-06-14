-- Dukkanci — جدول إعدادات التكاملات (شغّله مرّة في SQL Editor ليصبح الحفظ سحابيًا عامًا)
create table if not exists public.integration_settings (
  setting_key   text primary key,
  setting_value text,
  is_enabled    boolean default false,
  updated_at    timestamptz default now()
);

alter table public.integration_settings enable row level security;

-- DEMO: قراءة عامة (لحقن البكسلات لكل الزوار) + كتابة عامة (للوحة الإدارة بلا تسجيل دخول).
-- قبل الإطلاق: قصّر الكتابة على الأدمن عبر Supabase Auth.
create policy "integration_settings read"  on public.integration_settings for select using (true);
create policy "integration_settings write" on public.integration_settings for all using (true) with check (true);
