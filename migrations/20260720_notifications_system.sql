-- ============================================================================
-- 2026-07-20 — نظام الإشعارات + الحملات الترويجية المُستهدَفة
-- ============================================================================
-- شغّل هذا الملف مرة واحدة في: Supabase Dashboard → SQL Editor → New query → Run.
-- الملف بالكامل قابل لإعادة التشغيل بأمان (idempotent): تشغيله مرتين لا يضر ولا يفقد بيانات.
--
-- ⚠ هذا الملف **إلزامي** لهذه الميزة، خلافاً لملف البانرات الذي كانت ميزته تعمل بدونه.
--   السبب: صندوق الإشعارات وسجلّ الإرسال وسجلّ الأجهزة تحتاج صفوفاً حقيقية وفهارس،
--   ولا يمكن حشرها في jsonb داخل site_settings كما فُعل مع تعريفات البانرات.
--   ما لا يحتاج SQL إطلاقاً هو **الإعدادات** فقط (ساعات الهدوء/الحد اليومي)، وهي
--   تُخزَّن في site_settings تحت المفتاح 'notifications' وتعمل فور النشر.
--
-- لماذا هذه الجداول أصلاً — الخلاصة التي كشفها تدقيق قاعدة البيانات (2026-07-20):
--   الشريحتان اللتان طلبهما المستخدم صراحةً **غير قابلتين للحساب** من البيانات الحالية:
--     • «نزّل التطبيق ولم يطلب» — لا يوجد أي سجلّ لتثبيت التطبيق. عمود orders.source
--       قيمته 'web' في 13 صفاً من 13، وtracking_events.event_source قيمته 'web' في
--       7,661 صفاً من 7,661. أي أن التطبيق والموقع لا يمكن تمييزهما في البيانات إطلاقاً.
--     • «وضع في السلة ولم يكمل» — السلة تعيش في localStorage (الموقع) وSharedPreferences
--       (Flutter) ولا تصل الخادم أبداً. الأثر الوحيد هو tracking_events.cart_id، وهو
--       معرّف ارتباط تحليلي لا يحمل محتوى السلة ولا رقم هاتف ولا هوية يمكن المراسلة بها.
--   لذلك جدولا app_devices وcart_snapshots أدناه ليسا «تحسيناً» بل **شرط وجود** الميزة.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- (1) سجلّ الأجهزة — الأساس الذي يجعل الاستهداف ممكناً
-- ----------------------------------------------------------------------------
-- صف واحد لكل جهاز/متصفح ثبّت الموقع أو التطبيق. هذا هو الجدول الذي يجيب أخيراً
-- على سؤال «من نزّل التطبيق؟» وهو أيضاً الجسر الموحَّد بين قنوات الإرسال المختلفة:
-- Web Push (متصفح) وFCM (أندرويد) يصيران مجرد قيمتين لعمود push_channel بدل نظامين
-- منفصلين، فتُكتب منطق الاستهداف مرة واحدة ويعمل على القناتين.
--
-- علاقته بجدول push_subscriptions الموجود مسبقاً: **مكمّل لا بديل**. ذلك الجدول يخزّن
-- مفاتيح تعمية RFC 8291 للمتصفح (p256dh/auth) ويخدم إشعارات الطلبات الحالية وسيبقى
-- كما هو بلا أي تعديل. هنا نخزّن **هوية الجهاز** ونربطه بذلك الصف عبر push_endpoint.

create table if not exists public.app_devices (
  id                    bigint generated always as identity primary key,
  device_uid            text not null unique,
  platform              text not null default 'web'
                          check (platform in ('web', 'pwa', 'android', 'ios')),
  push_channel          text check (push_channel in ('webpush', 'fcm')),
  push_endpoint         text,
  push_token            text,
  customer_id           uuid,
  customer_phone        text,
  app_version           text,
  locale                text,
  notifications_enabled boolean not null default true,
  promo_opt_out         boolean not null default false,
  first_seen_at         timestamptz not null default now(),
  last_seen_at          timestamptz not null default now(),
  created_at            timestamptz not null default now()
);

comment on table public.app_devices is 'سجلّ الأجهزة/التثبيتات — المصدر الوحيد لمعرفة «من نزّل التطبيق» ولتوحيد قنوات الإرسال (Web Push / FCM). يُكتب عبر action=register-device في api/notifications.js.';
comment on column public.app_devices.device_uid is 'معرّف تثبيت ثابت يولّده العميل ويحفظه محلياً. على الموقع = نفس dukkanci_uid المستخدَم في tracking_events (فيمكن الربط بينهما لاحقاً)، وفي Flutter = UUID يُولَّد مرة ويُحفظ في SharedPreferences.';
comment on column public.app_devices.platform is 'web = متصفح عادي، pwa = الموقع مثبَّتاً كتطبيق، android/ios = تطبيق Flutter الأصلي. هذا العمود تحديداً هو ما يجعل شريحة «نزّل التطبيق ولم يطلب» قابلة للحساب.';
comment on column public.app_devices.push_channel is 'webpush = مفاتيح المتصفح في push_subscriptions (عبر push_endpoint)، fcm = رمز جهاز أندرويد أصلي في push_token. فارغ = الجهاز مسجَّل لكن لم يمنح إذن الإشعارات بعد (يستقبل داخل التطبيق فقط).';
comment on column public.app_devices.push_endpoint is 'مفتاح الربط مع push_subscriptions.endpoint — لا نكرّر مفاتيح التعمية هنا، بل نشير إليها.';
comment on column public.app_devices.customer_phone is 'يُملأ لحظة تعرّف العميل (تسجيل دخول أو إتمام طلب). قبل ذلك يبقى فارغاً والجهاز مجهول — وهذا بالضبط تعريف «نزّل ولم يطلب».';
comment on column public.app_devices.promo_opt_out is 'إلغاء اشتراك صريح من الرسائل الترويجية وحدها. إشعارات حالة الطلب (المعاملاتية) تبقى تصل — لا يجوز حجبها لأنها خدمة لا تسويق.';

create index if not exists app_devices_phone_idx        on public.app_devices (customer_phone) where customer_phone is not null;
create index if not exists app_devices_platform_idx     on public.app_devices (platform);
create index if not exists app_devices_last_seen_idx    on public.app_devices (last_seen_at desc);
create index if not exists app_devices_customer_id_idx  on public.app_devices (customer_id) where customer_id is not null;

alter table public.app_devices enable row level security;
-- بلا أي policy عمداً: service_role وحده (من api/notifications.js) يقرأ ويكتب.
-- ⚠ لا تُضِف policy بصيغة `for all using (true)` — تجعل سجلّ أجهزة كل العملاء عاماً للقراءة.


-- ----------------------------------------------------------------------------
-- (2) لقطات السلة — «ملخّص فقط» بقرار صريح من المستخدم
-- ----------------------------------------------------------------------------
-- قرار خصوصية متعمَّد (اختاره المستخدم صراحةً بين ثلاثة خيارات في 2026-07-20):
-- يُحفَظ **ملخّص** السلة فقط — المتجر، عدد الأصناف، الإجمالي، أسماء المنتجات — ولا
-- تُحفَظ الخيارات ولا الإضافات ولا ملاحظات العميل ولا أي عنوان. هذا يكفي تماماً لرسالة
-- «سلتك تنتظرك في {المتجر}» ولتقرير قيمة السلات المتروكة، بأقل بيانات شخصية ممكنة.
--
-- ⚠ ما يمنعه هذا القرار عمداً: لا يمكن للعميل استعادة سلته على جهاز آخر (مزامنة السلة)
--   لأن الخيارات/الإضافات غير محفوظة. تلك ميزة منفصلة تحتاج الخيار الثاني (السلة كاملة).
--
-- صف واحد لكل جهاز: التطبيق والموقع يفرضان أصلاً «سلة من متجر واحد فقط»
-- (راجع AddToCartResult.otherStoreConflict في Flutter والمنطق المقابل في app.js)،
-- فلا معنى لأكثر من سلة نشطة لنفس الجهاز.

create table if not exists public.cart_snapshots (
  id              bigint generated always as identity primary key,
  device_uid      text not null unique,
  store_id        bigint,
  store_name      text,
  item_count      integer not null default 0,
  subtotal        numeric not null default 0,
  item_names      jsonb not null default '[]'::jsonb,
  customer_phone  text,
  customer_id     uuid,
  status          text not null default 'active'
                    check (status in ('active', 'converted', 'notified', 'dismissed')),
  updated_at      timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  converted_at    timestamptz,
  notified_at     timestamptz
);

comment on table public.cart_snapshots is 'ملخّص السلة النشطة لكل جهاز — يجعل شريحة «السلة المتروكة» قابلة للاستهداف. ملخّص فقط بلا خيارات/إضافات/ملاحظات بقرار خصوصية صريح.';
comment on column public.cart_snapshots.item_names is 'مصفوفة أسماء المنتجات فقط (["شاورما دجاج","بطاطا"]) — لعرضها في نص الرسالة. بلا كميات ولا خيارات ولا أسعار مفردة.';
comment on column public.cart_snapshots.status is 'active = سلة قائمة، converted = تحوّلت لطلب فعلي (تُضبط عند إنشاء الطلب)، notified = أُرسل تذكير ولم يُطلب بعد (يمنع تكرار التذكير)، dismissed = العميل أفرغ سلته.';
comment on column public.cart_snapshots.notified_at is 'وقت آخر تذكير — الحارس الذي يمنع إزعاج نفس العميل بتذكير سلة كل ساعة.';

create index if not exists cart_snapshots_status_updated_idx on public.cart_snapshots (status, updated_at desc);
create index if not exists cart_snapshots_phone_idx          on public.cart_snapshots (customer_phone) where customer_phone is not null;

alter table public.cart_snapshots enable row level security;
-- بلا policy: محتوى سلة العميل لا يجوز أن يكون مقروءاً لأي زائر آخر.


-- ----------------------------------------------------------------------------
-- (3) صندوق الإشعارات — سجلّ واحد للمعاملاتي والترويجي معاً
-- ----------------------------------------------------------------------------
-- قرار تصميم مقصود: **جدول واحد** يخدم إشعارات حالة الطلب والرسائل الترويجية معاً،
-- تماماً كما تفعل التطبيقات المشابهة (جرس واحد يجمع «طلبك في الطريق» و«خصم 20٪»).
-- الفصل يكون بعمود kind لا بجدولين، فيبقى الصندوق مرتّباً زمنياً بلا دمج يدوي.
--
-- هذا أيضاً أول سجلّ يجيب على سؤال «ماذا أرسلنا لهذا العميل؟» — وهو سؤال لا إجابة له
-- اليوم إطلاقاً (لا يوجد أي جدول تاريخ إشعارات للعميل في قاعدة البيانات الحالية).

create table if not exists public.notifications (
  id             bigint generated always as identity primary key,
  device_uid     text,
  customer_phone text,
  customer_id    uuid,
  kind           text not null default 'promo'
                   check (kind in ('order', 'promo', 'system')),
  title          text not null,
  body           text,
  image_url      text,
  deep_link      text,
  campaign_id    uuid,
  order_id       text,
  read_at        timestamptz,
  created_at     timestamptz not null default now(),
  -- لا معنى لصفّ لا يمكن تسليمه لأحد: يجب وجود هوية واحدة على الأقل.
  constraint notifications_has_recipient
    check (device_uid is not null or customer_phone is not null or customer_id is not null)
);

comment on table public.notifications is 'صندوق إشعارات العميل — يجمع إشعارات الطلبات (kind=order) والرسائل الترويجية (kind=promo) في سجلّ واحد مرتّب زمنياً. يُقرأ عبر action=inbox في api/notifications.js.';
comment on column public.notifications.kind is 'order = معاملاتي (حالة طلب) ولا يخضع لإلغاء الاشتراك الترويجي، promo = تسويقي ويخضع لكل الحواجز (إلغاء اشتراك/ساعات هدوء/حد يومي)، system = رسائل النظام.';
comment on column public.notifications.deep_link is 'مسار داخلي يُفتح عند النقر (مثل /store/pasa-pizzeria-restaurant أو /offers) — يعمل على الموقع وفي Flutter معاً.';

create index if not exists notifications_device_idx   on public.notifications (device_uid, created_at desc) where device_uid is not null;
create index if not exists notifications_phone_idx    on public.notifications (customer_phone, created_at desc) where customer_phone is not null;
create index if not exists notifications_campaign_idx on public.notifications (campaign_id) where campaign_id is not null;
-- يخدم الحدّ اليومي: «كم رسالة ترويجية وصلت هذا الجهاز اليوم؟»
create index if not exists notifications_promo_rate_idx on public.notifications (device_uid, created_at desc) where kind = 'promo';

alter table public.notifications enable row level security;
-- بلا policy: القراءة تمر عبر الخادم الذي يتحقق من هوية الجهاز/الهاتف.
-- ⚠ لا تفتحها لـanon: صندوق الإشعارات مفتاحه device_uid وهو معرّف يمكن تخمينه/تسريبه،
--   وليس هوية مصادَق عليها — الحماية الحقيقية هي أن الخادم وحده يقرأ.


-- ----------------------------------------------------------------------------
-- (4) الحملات + سجلّ المستلمين
-- ----------------------------------------------------------------------------
-- البنية مطابقة عمداً لنمط wa_campaigns/wa_campaign_recipients المُجرَّب في الإنتاج
-- (راجع api/campaign.js)، بما في ذلك الدرس المدفوع ثمنه: **العدّادات تُشتق بإعادة العدّ
-- من جدول المستلمين ولا تُراكم أبداً**. الحادثة الموثَّقة في CLAUDE.md (2026-07-19):
-- حملة عرضت sent_count=65 بينما 305 صفوف كانت sent فعلاً، والفجوات كانت مضاعفات
-- BATCH_SIZE بالضبط — سباق «قراءة-تعديل-كتابة» كلاسيكي.

create table if not exists public.notification_campaigns (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  title            text not null,
  body             text,
  image_url        text,
  deep_link        text,
  segment          text not null,
  segment_params   jsonb not null default '{}'::jsonb,
  channels         text[] not null default array['inapp']::text[],
  status           text not null default 'draft'
                     check (status in ('draft','scheduled','building','ready','sending','paused','done','canceled')),
  scheduled_at     timestamptz,
  total_recipients integer not null default 0,
  sent_count       integer not null default 0,
  failed_count     integer not null default 0,
  wa_campaign_id   uuid,
  -- WhatsApp cannot carry free text: Meta requires a pre-approved template.
  -- These are only read when 'whatsapp' is among the channels; the in-app and
  -- push channels use title/body directly.
  wa_template_name text,
  wa_template_lang text default 'ar',
  note             text,
  created_by       text,
  created_at       timestamptz not null default now(),
  started_at       timestamptz,
  finished_at      timestamptz
);

comment on table public.notification_campaigns is 'حملات الإشعارات الترويجية المُستهدَفة بالشرائح. تُدار من تبويب «الإشعارات» في لوحة الإدارة.';
comment on column public.notification_campaigns.segment is 'مفتاح الشريحة — يُحَل عبر الدالة notification_segment_devices() أدناه. القيم المدعومة موثَّقة هناك.';
comment on column public.notification_campaigns.channels is 'قنوات الإرسال: inapp (صندوق داخل التطبيق) | webpush (متصفح) | fcm (أندرويد) | whatsapp (يولّد حملة wa_campaigns مرتبطة).';
comment on column public.notification_campaigns.wa_campaign_id is 'معرّف حملة واتساب المُولَّدة عند اختيار قناة whatsapp — الإرسال الفعلي يتم عبر api/campaign.js المُجرَّب، لا نعيد بناء منطق واتساب هنا.';

create table if not exists public.notification_recipients (
  id             uuid primary key default gen_random_uuid(),
  campaign_id    uuid not null references public.notification_campaigns(id) on delete cascade,
  device_uid     text,
  customer_phone text,
  channel        text not null,
  status         text not null default 'pending'
                   check (status in ('pending','sending','sent','failed','skipped')),
  skip_reason    text,
  error          text,
  sent_at        timestamptz,
  created_at     timestamptz not null default now()
);

comment on table public.notification_recipients is 'صف لكل (مستلم × قناة) في الحملة — مصدر الحقيقة الوحيد للعدّادات. لا تُحسب الأرقام تراكمياً أبداً بل بإعادة العدّ من هنا.';
comment on column public.notification_recipients.skip_reason is 'سبب التخطّي الصريح (opt_out / quiet_hours / daily_cap / no_channel) — بدله عن حذف الصف بصمت، كي يبقى «لماذا لم تصل الرسالة» قابلاً للإجابة.';

-- منع التكرار: نفس المستلم لا يُدرَج مرتين في نفس الحملة على نفس القناة.
-- coalesce ضرورية لأن المستلم قد يكون جهازاً بلا هاتف أو هاتفاً بلا جهاز، وunique
-- العادي في Postgres لا يعتبر صفَّين بـnull متطابقين فيسمح بالتكرار.
create unique index if not exists notification_recipients_uniq_idx
  on public.notification_recipients
     (campaign_id, coalesce(device_uid, ''), coalesce(customer_phone, ''), channel);

create index if not exists notification_recipients_campaign_status_idx
  on public.notification_recipients (campaign_id, status);

alter table public.notification_campaigns  enable row level security;
alter table public.notification_recipients enable row level security;


-- ----------------------------------------------------------------------------
-- (5) دالة حلّ الشرائح — قلب نظام الاستهداف
-- ----------------------------------------------------------------------------
-- تُرجِع مجموعة المستلمين لأي شريحة. التجميع والربط يتمّان **داخل Postgres** وليس
-- بجلب الصفوف وربطها في JavaScript — قرار جوهري لسببين:
--   1. PostgREST هنا مضبوط بـdb-max-rows=1000 ويقصّ كل استجابة بصمت مهما كان &limit=
--      (تحقّق حي: products?limit=5000 أعاد 1000 من أصل 11,725). أي ربط في JS كان
--      سيبني شرائح ناقصة وتبدو سليمة — نفس فصيلة الأخطاء الموثَّقة ثلاث مرات في السجلّ.
--   2. الربط بين الأجهزة والطلبات والسلات في JS يعني عشرات الطلبات الشبكية لكل معاينة.
--
-- تعريف موحَّد لـ«طلب» عبر كل الشرائح: صف في orders حالته ليست 'مرفوضة'.
-- تعريف واحد لا اثنان — كي لا تنشأ فجوة يسقط فيها من طلب وقوبل بالرفض فلا هو
-- «عميل» ولا هو «لم يطلب». من طلباته كلها مرفوضة يُعامَل كـ«لم يطلب بعد»، وهو
-- التصنيف الصحيح لحملة «اطلب أول مرة».
--
-- الصف المُعاد قد يحمل device_uid بلا هاتف (جهاز مجهول لم يعرّف نفسه بعد)، أو هاتفاً
-- بلا device_uid (عميل معروف من الطلبات/واتساب لكن بلا جهاز مسجَّل) — والقناة المناسبة
-- لكل حالة تُحدَّد في api/notifications.js عند البناء.

create or replace function public.notification_segment_devices(
  p_segment text,
  p_params  jsonb default '{}'::jsonb
)
returns table (
  device_uid     text,
  customer_phone text,
  platform       text,
  push_channel   text,
  push_endpoint  text,
  push_token     text,
  store_name     text
)
language sql
stable
as $$
  with successful_orders as (
    select o.customer_phone as phone, count(*) as order_count, max(o.created_at) as last_order_at
    from public.orders o
    where o.customer_phone is not null
      and o.status is distinct from 'مرفوضة'
    group by o.customer_phone
  )

  -- كل الأجهزة المسجّلة التي تقبل الإشعارات
  select d.device_uid, d.customer_phone, d.platform, d.push_channel, d.push_endpoint, d.push_token, null::text
  from public.app_devices d
  where p_segment = 'all_devices'
    and d.notifications_enabled

  union all

  -- كل من نزّل التطبيق — بصرف النظر عن الطلبات. هذه هي شريحة «عرض جديد» أو
  -- «توصيل مجاني لكل من نزّل التطبيق» التي طلبها المستخدم صراحةً.
  -- تختلف عن all_devices التي تشمل متصفحي الويب العاديين أيضاً، وعن
  -- app_installed_no_order التي تستثني من سبق له الطلب.
  select d.device_uid, d.customer_phone, d.platform, d.push_channel, d.push_endpoint, d.push_token, null::text
  from public.app_devices d
  where p_segment = 'app_installs'
    and d.notifications_enabled
    and d.platform in ('android', 'ios', 'pwa')

  union all

  -- نزّل التطبيق ولم يطلب — الشريحة التي طلبها المستخدم صراحةً.
  -- «التطبيق» هنا = android/ios (Flutter) أو pwa (الموقع مثبَّتاً)، وليس تصفّحاً عادياً.
  select d.device_uid, d.customer_phone, d.platform, d.push_channel, d.push_endpoint, d.push_token, null::text
  from public.app_devices d
  where p_segment = 'app_installed_no_order'
    and d.notifications_enabled
    and d.platform in ('android', 'ios', 'pwa')
    and (d.customer_phone is null
         or not exists (select 1 from successful_orders s where s.phone = d.customer_phone))

  union all

  -- سلة متروكة — الشريحة الثانية التي طلبها المستخدم صراحةً.
  -- الشروط: سلة نشطة، لم تُلمس منذ p_min_age_minutes (افتراضياً ساعة، فلا نزعج من
  -- لا يزال يتسوّق الآن)، وليست أقدم من p_max_age_days (سلة عمرها شهر ميتة لا متروكة)،
  -- ولم يسبق تذكيرها (status='active' وليس 'notified').
  -- ⚠ coalesce على الهاتف مقصود وليس تجميلاً: السلة تُنشأ غالباً والزائر مجهول، ثم
  -- يتعرّف لاحقاً (تسجيل دخول/طلب) فيُملأ الهاتف على **الجهاز** لا على صفّ السلة القديم.
  -- بلا هذا الاحتياط كانت حملات السلة المتروكة تفقد قناة واتساب بصمت لكل سلة أُنشئت
  -- قبل تعرّف صاحبها — وهي الحالة الغالبة. (كشفه اختبار الشرائح قبل الإطلاق.)
  select c.device_uid, coalesce(c.customer_phone, d.customer_phone), d.platform, d.push_channel, d.push_endpoint, d.push_token, c.store_name
  from public.cart_snapshots c
  left join public.app_devices d on d.device_uid = c.device_uid
  where p_segment = 'abandoned_cart'
    and c.status = 'active'
    and c.item_count > 0
    and c.updated_at < now() - make_interval(mins => coalesce((p_params->>'min_age_minutes')::int, 60))
    and c.updated_at > now() - make_interval(days => coalesce((p_params->>'max_age_days')::int, 7))
    and coalesce(d.notifications_enabled, true)

  union all

  -- طلب مرة واحدة فقط — هدف الحملة: الطلب الثاني.
  select d.device_uid, s.phone, d.platform, d.push_channel, d.push_endpoint, d.push_token, null::text
  from successful_orders s
  left join public.app_devices d on d.customer_phone = s.phone
  where p_segment = 'one_time_buyers'
    and s.order_count = 1

  union all

  -- عملاء متكررون (طلبان فأكثر، أو الحد الذي يمرَّر في min_orders).
  select d.device_uid, s.phone, d.platform, d.push_channel, d.push_endpoint, d.push_token, null::text
  from successful_orders s
  left join public.app_devices d on d.customer_phone = s.phone
  where p_segment = 'repeat_buyers'
    and s.order_count >= coalesce((p_params->>'min_orders')::int, 2)

  union all

  -- عملاء خاملون — طلبوا سابقاً ثم انقطعوا منذ p_days يوماً (افتراضياً 30). حملة استرجاع.
  select d.device_uid, s.phone, d.platform, d.push_channel, d.push_endpoint, d.push_token, null::text
  from successful_orders s
  left join public.app_devices d on d.customer_phone = s.phone
  where p_segment = 'dormant'
    and s.last_order_at < now() - make_interval(days => coalesce((p_params->>'days')::int, 30))

  union all

  -- كل من طلب مرة على الأقل.
  select d.device_uid, s.phone, d.platform, d.push_channel, d.push_endpoint, d.push_token, null::text
  from successful_orders s
  left join public.app_devices d on d.customer_phone = s.phone
  where p_segment = 'all_customers'

  union all

  -- عملاء متجر بعينه — يتيح للإدارة الترويج لمتجر لمن جرّبه فعلاً.
  select d.device_uid, o.customer_phone, d.platform, d.push_channel, d.push_endpoint, d.push_token, null::text
  from (
    select distinct o2.customer_phone
    from public.orders o2
    where o2.customer_phone is not null
      and o2.status is distinct from 'مرفوضة'
      and o2.store_id = (p_params->>'store_id')::bigint
  ) o
  left join public.app_devices d on d.customer_phone = o.customer_phone
  where p_segment = 'store_customers'
    and (p_params->>'store_id') is not null

  union all

  -- كل جهات واتساب المرفوعة (6,334 رقماً حالياً) — قناة واتساب حصراً، فلا device_uid.
  select null::text, c.phone, null::text, null::text, null::text, null::text, null::text
  from public.wa_contacts c
  where p_segment = 'wa_contacts'
    and (
      (p_params->>'group') is null
      or c.group_name = (p_params->>'group')
    )
$$;

comment on function public.notification_segment_devices(text, jsonb) is
  'حلّ شريحة استهداف إلى مجموعة مستلمين. الشرائح: all_devices | app_installs | app_installed_no_order | abandoned_cart | one_time_buyers | repeat_buyers | dormant | all_customers | store_customers | wa_contacts. تُستدعى عبر RPC من api/notifications.js بمفتاح service_role.';

-- security invoker (الافتراضي) فتخضع لـRLS: anon يُرجع صفراً، service_role يُرجع الكل.
revoke all on function public.notification_segment_devices(text, jsonb) from public, anon, authenticated;


-- ----------------------------------------------------------------------------
-- (6) دالة إحصاءات الحملة
-- ----------------------------------------------------------------------------
-- تُرجِع العدّادات الحقيقية لحملة من جدول المستلمين مباشرة. هذه هي الدالة التي تمنع
-- تكرار حادثة عدّادات واتساب التالفة: العدّ يُشتق ولا يُراكم.

create or replace function public.notification_campaign_stats(p_campaign_id uuid)
returns table (
  total     bigint,
  sent      bigint,
  failed    bigint,
  skipped   bigint,
  pending   bigint,
  remaining bigint
)
language sql
stable
as $$
  select
    count(*)                                                as total,
    count(*) filter (where r.status = 'sent')               as sent,
    count(*) filter (where r.status = 'failed')             as failed,
    count(*) filter (where r.status = 'skipped')            as skipped,
    count(*) filter (where r.status = 'pending')            as pending,
    count(*) filter (where r.status in ('pending','sending')) as remaining
  from public.notification_recipients r
  where r.campaign_id = p_campaign_id;
$$;

revoke all on function public.notification_campaign_stats(uuid) from public, anon, authenticated;


-- ============================================================================
-- (7) استدراك — ترحيلان سابقان لم يُطبَّقا فعلياً على الإنتاج
-- ============================================================================
-- ⚠ غير متعلق بالإشعارات، لكنه عطل حقيقي **قائم الآن** اكتُشف أثناء تدقيق قاعدة
--   البيانات في 2026-07-20، ومُدرَج هنا كي تُصلح الأعطال الثلاثة بتشغيل ملف واحد.
--
--   تحقّق حي مباشر ضد الإنتاج بتاريخ 2026-07-20:
--     • banner_events            → 404 PGRST205 «Could not find the table»
--     • banner_stats()           → 404 PGRST202
--     • stores.category_settings → 400 42703 «column does not exist»
--
--   النتيجة العملية للعطلين: لوحة نقرات البانرات (بُنيت 2026-07-19) لا تعمل، وحفظ
--   «تصنيفات المتاجر» (بُني 2026-07-18) يفشل بـ502 عند كل محاولة حفظ منذ ذلك اليوم.
--
--   الأسطر التالية منقولة حرفياً من الملفين الأصليين وآمنة تماماً (إنشاء/إضافة فقط،
--   بلا حذف أو تعديل أي بيانات قائمة). إن كنت قد شغّلتهما فعلاً فلن يحدث شيء.

create table if not exists public.banner_events (
  id          bigint generated always as identity primary key,
  banner_id   text not null,
  placement   text,
  event_type  text not null check (event_type in ('impression', 'click')),
  source      text not null default 'web' check (source in ('web', 'app')),
  created_at  timestamptz not null default now()
);

create index if not exists banner_events_banner_created_idx on public.banner_events (banner_id, created_at desc);
create index if not exists banner_events_created_idx        on public.banner_events (created_at desc);

alter table public.banner_events enable row level security;

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
    count(*) filter (where e.event_type = 'impression')                 as impressions,
    count(*) filter (where e.event_type = 'click')                      as clicks,
    count(*) filter (where e.event_type = 'click' and e.source = 'web') as web_clicks,
    count(*) filter (where e.event_type = 'click' and e.source = 'app') as app_clicks,
    max(e.created_at)                                                   as last_event
  from public.banner_events e
  where e.created_at >= now() - make_interval(days => greatest(p_days, 1))
  group by e.banner_id;
$$;

revoke all on function public.banner_stats(p_days integer) from public, anon, authenticated;

alter table public.stores
  add column if not exists category_settings jsonb default '{}'::jsonb;


-- ============================================================================
-- تم. بعد تشغيل هذا الملف:
--   • تبويب «الإشعارات» في لوحة الإدارة يعمل بالكامل (شرائح حيّة + إرسال + إحصاءات)
--   • صندوق الإشعارات يظهر للعملاء على الموقع وفي التطبيق
--   • لوحة نقرات البانرات تعمل (كانت معطّلة منذ 2026-07-19)
--   • حفظ تصنيفات المتاجر يعمل (كان يفشل بـ502 منذ 2026-07-18)
-- ============================================================================
