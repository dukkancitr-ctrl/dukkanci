-- 2026-07-12 — حقول تقييمات Google للمتاجر (قسم «دليل دكانجي» /dalil).
-- إضافات آمنة فقط: أعمدة جديدة + صف إعدادات، بلا أي حذف أو تعديل على بيانات قائمة.
-- تُملأ الحقول عبر scripts/update-google-ratings.js (Google Places API الرسمي — لا scraping).

alter table public.stores
  add column if not exists google_place_id text,
  add column if not exists google_rating numeric,
  add column if not exists google_reviews_count integer,
  add column if not exists google_maps_url text,
  add column if not exists google_rating_updated_at timestamptz;

comment on column public.stores.google_place_id is 'معرّف Google Places للمكان — يُملأ عبر scripts/update-google-ratings.js';
comment on column public.stores.google_rating is 'تقييم Google (1.0–5.0) من Place Details — لا يُحرَّر يدوياً';
comment on column public.stores.google_reviews_count is 'عدد تقييمات Google (user_ratings_total)';
comment on column public.stores.google_maps_url is 'رابط صفحة المكان على Google Maps (حقل url من Place Details)';
comment on column public.stores.google_rating_updated_at is 'آخر تحديث لحقول Google أعلاه';

-- الحد الأدنى لعدد تقييمات Google المؤهِّل لتصدّر ترتيب «الأعلى تقييماً» في الدليل.
-- قابل للتعديل لاحقاً بتحديث قيمة هذا الصف في site_settings (يقرؤه app.js مع احتياطي 50).
insert into public.site_settings (key, value)
select 'dalil', '{"minGoogleReviewsForTop": 50}'::jsonb
where not exists (select 1 from public.site_settings where key = 'dalil');
