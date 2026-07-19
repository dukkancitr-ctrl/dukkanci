-- ============================================================================
-- 2026-07-19 — نظام إدارة البانرات + قياس كفاءتها (نقرات/ظهور)
-- ============================================================================
-- شغّل هذا الملف مرة واحدة في: Supabase Dashboard → SQL Editor → New query → Run.
-- الملف بالكامل قابل لإعادة التشغيل بأمان (idempotent): تشغيله مرتين لا يضر ولا يفقد بيانات.
--
-- ملاحظة مهمة عن نطاق هذا الملف:
--   تعريفات البانرات نفسها (الصور/النصوص/الروابط/فترات الظهور) **لا تحتاج أي SQL**؛
--   فهي تُخزَّن في صف واحد داخل جدول `site_settings` الموجود مسبقاً تحت المفتاح 'banners'،
--   وتُكتب عبر action=save-settings في api/notify-order.js (نفس مسار بقية إعدادات المحتوى،
--   بما فيه تحويل الصور المرفوعة تلقائياً إلى روابط مستضافة عبر offloadJsonImages).
--   لذلك البانرات تعمل على الموقع فور النشر **حتى قبل** تشغيل هذا الملف.
--
--   هذا الملف مطلوب فقط لتفعيل **لوحة بيانات النقرات**. قبل تشغيله تعرض اللوحة رسالة
--   صريحة «تتبّع البانرات غير مُفعّل» بدل عرض أصفار كاذبة، وتشتغل تلقائياً بمجرد تشغيله.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- (1) جدول أحداث البانرات — عدّاد مجهول تماماً
-- ----------------------------------------------------------------------------
-- قرار خصوصية متعمَّد: لا يوجد في هذا الجدول أي معرّف زائر (لا dukkanci_uid ولا IP
-- ولا user agent ولا customer_id) — خلافاً لجدول tracking_events. الصف هنا يجيب فقط
-- «هذا البانر ظهر/نُقر عليه في هذه اللحظة»، فهو بيانات إحصائية مجمّعة غير شخصية
-- بطبيعتها ولا يمكن ربطها بشخص. ونتيجة عملية مقصودة: العدّ **غير محكوم بموافقة
-- الكوكيز**، فأرقام كفاءة البانرات صحيحة لكل الزوار وليست عيّنة منقوصة ممن قبلوا التتبّع.
--
-- حجم البيانات: الظهور (impression) يُرسَل مرة واحدة لكل بانر لكل جلسة تصفّح
-- (إزالة تكرار من طرف العميل عبر sessionStorage في app.js) وليس مع كل تمرير للشاشة،
-- فينمو الجدول ببطء. راجع القسم (4) أدناه لتنظيف اختياري للبيانات القديمة.

create table if not exists public.banner_events (
  id          bigint generated always as identity primary key,
  banner_id   text not null,
  placement   text,
  event_type  text not null check (event_type in ('impression', 'click')),
  source      text not null default 'web' check (source in ('web', 'app')),
  created_at  timestamptz not null default now()
);

comment on table public.banner_events is 'عدّاد ظهور/نقر البانرات — مجهول بالكامل بلا أي معرّف زائر. يُكتب عبر action=banner-event في api/notify-order.js ويُقرأ عبر banner_stats().';
comment on column public.banner_events.banner_id is 'معرّف البانر كما في site_settings.banners.items[].id (مثل bnr_a1b2c3d4) — نصّي عمداً وبلا مفتاح أجنبي لأن التعريفات في jsonb لا في جدول.';
comment on column public.banner_events.source is 'web = الموقع، app = تطبيق الجوال (Flutter) — لمقارنة كفاءة نفس البانر بين المنصتين.';

-- فهرس مركّب يخدم استعلام الإحصاءات الأساسي (تجميع حسب البانر ضمن نافذة زمنية).
create index if not exists banner_events_banner_created_idx
  on public.banner_events (banner_id, created_at desc);

-- فهرس زمني مستقل يخدم التنظيف الدوري واستعلامات المدى الزمني العامة.
create index if not exists banner_events_created_idx
  on public.banner_events (created_at desc);


-- ----------------------------------------------------------------------------
-- (2) RLS — منع الوصول العام تماماً
-- ----------------------------------------------------------------------------
-- نفس نمط جداول tracking_* (راجع scripts/tracking-schema.sql): تفعيل RLS بلا أي policy
-- إطلاقاً = رفض كامل لـ anon و authenticated. مفتاح service_role وحده (المستخدَم حصرياً
-- من api/notify-order.js على الخادم) يتجاوز RLS. هذا مقصود: لا يجوز أن يستطيع زائر
-- قراءة إحصاءات الحملات، ولا أن يكتب في العدّاد مباشرة متجاوزاً تحقّق الخادم.
-- ⚠ لا تُضِف هنا policy بصيغة `for all using (true)` — تُبطل الحماية بالكامل.

alter table public.banner_events enable row level security;


-- ----------------------------------------------------------------------------
-- (3) دالة تجميع الإحصاءات
-- ----------------------------------------------------------------------------
-- تُرجِع صفاً واحداً لكل بانر له أحداث ضمن آخر `days` يوماً. التجميع يتم داخل Postgres
-- (وليس بجلب كل الصفوف وعدّها في JavaScript) كي تبقى سريعة مهما كبر الجدول.
--
-- أمان: الدالة `security invoker` عمداً (الافتراضي) — أي تعمل بصلاحيات المُستدعي،
-- فتخضع لـRLS أعلاه. النتيجة: استدعاؤها بمفتاح anon يُرجع صفر صفوف، وبمفتاح
-- service_role يُرجع كل شيء. لا حاجة لثقة إضافية في الدالة نفسها.

-- ملاحظة تسمية مقصودة: المعامل اسمه `p_days` وليس `days`. لو سُمّي `days` لصار
-- التعبير `make_interval(days => greatest(days, 1))` يحمل الاسم نفسه مرتين
-- (وسيط مُسمّى لـmake_interval + معامل الدالة) وهو مصدر شائع لخطأ ambiguity في
-- Postgres. كذلك كل عمود مؤهَّل بـ`e.` لتفادي التباسه مع أعمدة الإخراج المعرَّفة
-- في `returns table`.
create or replace function public.banner_stats(p_days integer default 30)
returns table (
  banner_id   text,
  impressions bigint,
  clicks      bigint,
  web_clicks  bigint,
  app_clicks  bigint,
  last_event  timestamptz
)
language sql
stable
as $$
  select
    e.banner_id,
    count(*) filter (where e.event_type = 'impression')                        as impressions,
    count(*) filter (where e.event_type = 'click')                             as clicks,
    count(*) filter (where e.event_type = 'click' and e.source = 'web')        as web_clicks,
    count(*) filter (where e.event_type = 'click' and e.source = 'app')        as app_clicks,
    max(e.created_at)                                                          as last_event
  from public.banner_events e
  where e.created_at >= now() - make_interval(days => greatest(p_days, 1))
  group by e.banner_id;
$$;

comment on function public.banner_stats(integer) is 'تجميع ظهور/نقرات البانرات خلال آخر N يوماً — يستدعيها action=banner-stats في api/notify-order.js بمفتاح service_role.';

-- دفاع في العمق: سحب صلاحية التنفيذ من الأدوار العامة. (RLS يكفي وحده لمنع تسرّب
-- البيانات لأن الدالة security invoker، وهذا حزام أمان إضافي فوقه.)
revoke all on function public.banner_stats(p_days integer) from public, anon, authenticated;


-- ----------------------------------------------------------------------------
-- (4) اختياري تماماً — تنظيف الأحداث القديمة
-- ----------------------------------------------------------------------------
-- غير مُفعَّل ولا يعمل تلقائياً. إن أردت لاحقاً تقليص حجم الجدول، شغّل هذا السطر يدوياً
-- (يحذف الأحداث الأقدم من سنة، وهي أقدم من أي مدى تعرضه لوحة الإحصاءات):
--
--   delete from public.banner_events where created_at < now() - interval '365 days';


-- ============================================================================
-- (5) استدراك — عمود تصنيفات المتاجر من ترحيل 2026-07-19 السابق
-- ============================================================================
-- ⚠ هذا القسم غير متعلق بالبانرات، لكنه مُدرَج هنا عمداً لأنه عطل حقيقي قائم الآن.
--
-- ملف migrations/20260719_store_category_settings.sql كُتب أمس لكنه **لم يُطبَّق فعلياً**
-- على قاعدة الإنتاج (تحقّق مباشر بتاريخ 2026-07-19: الاستعلام عن العمود يُرجع خطأ
-- «column stores.category_settings does not exist»). والنتيجة أن ميزة «تصنيفات المتاجر»
-- في لوحتي الإدارة والتاجر تفشل حالياً بخطأ 502 عند أي محاولة حفظ.
--
-- الأسطر التالية مطابقة لذلك الملف حرفياً وآمنة تماماً (إضافة عمود فقط، بلا حذف أو
-- تعديل أي بيانات قائمة). تشغيلها هنا يُصلح تلك الميزة في نفس الجولة.
-- إن كنت قد شغّلت ذلك الملف بالفعل فلن يحدث شيء (add column if not exists).

alter table public.stores
  add column if not exists category_settings jsonb default '{}'::jsonb;

comment on column public.stores.category_settings is 'تجاوزات يدوية لترتيب/دمج تصنيفات المتجر (إدارة+تاجر) — راجع buildStoreCategoryPlan في app.js وaction=save-store-categories في api/notify-order.js';
