# خطة تنفيذ نظام الكوكيز والتتبع التسويقي — دكانجي
**Cookie & Tracking System — Technical Implementation Plan**

> الحالة: ✅ المرحلة 1 مبنية ومختبَرة في المتصفح 2026-06-30 (غير مرفوعة بعد — النشر من main). لغة البانر: العربية فقط (مع بنية جاهزة لإضافة TR/EN لاحقاً).
> آخر تحديث: 2026-06-30
>
> **اكتشاف مهم أثناء التنفيذ:** بكسل تيك توك `D8VDK4JC77U45FANPJTG` يُطلَق من **داخل حاوية GTM** (`GTM-NKWVJ49J`) وليس من كودنا، لذا Consent Mode لا يوقفه. عُولِج برمجياً (تأجيل سكربت analytics.tiktok.com + ttq.holdConsent حتى موافقة التسويق). **الحل الجذري = إضافة Consent Trigger على وسم تيك توك داخل واجهة GTM (مهمة على المستخدم).**
>
> **اختُبِر بنجاح:** أول زيارة بلا موافقة → لا بكسل/كوكي تسويقي (لا `_ttp`، تيك توك مؤجَّل، fbq/GA غير محقونين) · قبول الكل → كل البكسلات تعمل + إطلاق تيك توك · موافقة تحليلات فقط → GA يعمل وMeta/TikTok يبقيان موقوفين · `/api/track` يردّ 200 (fail-open محلياً) وأعمدته مطابقة للجداول · dataLayer بالشكل الموحّد (event_id/uid/items/traffic_source).

---

## 0. ملخص تنفيذي

البنية الحالية فيها طبقة حقن بكسلات شغّالة (`integrations.js`) وأحداث تجارة موصولة في `app.js`، لكن **لا يوجد**: بانر موافقة، كوكيز first-party، التقاط UTM/click-ids، Google Consent Mode، طبقة `dataLayer` موحّدة بـ `event_id`، تخزين داخلي للأحداث، ولا مُرسِل Conversions API على السيرفر. كما أن **بكسل تيك توك و GTM يعملان حالياً عند كل تحميل صفحة بلا موافقة** — وهذا مخالف للمواصفة وقانون KVKK التركي.

الخطة تبني الناقص فوق الموجود **دون كسر** السلة/الطلبات/الصفحات الحالية، على ثلاث مراحل (نفس ترتيب أولويات المواصفة).

---

## 1. الجرد: ما هو موجود فعلاً

| المكوّن | الحالة | المرجع |
|---|---|---|
| طبقة حقن البكسلات | ✅ موجودة | `integrations.js` — `I.inject()`, `_injectMeta/_injectTiktok/_injectGtm/_injectGa4`, `I.track()`, `I.pageView()` |
| GA4 | ✅ `G-ZY03L2JH9H` | عبر GTM + حقن مباشر |
| GTM | ✅ `GTM-NKWVJ49J` | **مثبّت يدوياً** في `index.html:52-56` |
| Meta Pixel | ✅ `meta_pixel_id` | `integrations.js:88-96` |
| TikTok Pixel | ✅ `D8VDK4JC77U45FANPJTG` | **مثبّت يدوياً** في `index.html:59` + حقن مكرر في `integrations.js:98-107` |
| Google Ads | ✅ على Purchase فقط | `integrations.js:159-161` |
| إعدادات التتبع | ✅ جدول `integration_settings` (16 صف) | مفاتيح: `ga4_measurement_id`, `google_tag_manager_id`, `meta_pixel_id`, `tiktok_pixel_id`, `meta_capi_token`, `tiktok_events_token`, `meta_test_event_code=TEST32260` |
| أحداث التجارة | ✅ 4 نقاط | `app.js`: `ViewContent` (5280)، `AddToCart` (5681)، `InitiateCheckout` (6226)، `Purchase` (7519) |
| بانر الموافقة | ❌ غير موجود | — |
| كوكيز first-party | ❌ غير موجودة (localStorage فقط) | — |
| التقاط UTM/fbclid/gclid | ❌ غير موجود | — |
| `event_id` موحّد على كل حدث | ❌ (فقط Purchase فيه eventID) | — |
| تخزين داخلي للأحداث | ❌ الجداول الأربعة غير موجودة | — |
| Meta Conversions API (سيرفر) | ❌ التوكن مخزّن لكن لا يُستخدم | — |
| تقارير لوحة الإدارة | ❌ | — |

### 1.1 مخاطر/ملاحظات أمنية مكتشفة (يجب معالجتها)
1. 🔴 **توكنات السيرفر مكشوفة للمتصفح**: `meta_capi_token` و`tiktok_events_token` مخزّنة في `integration_settings`، و`integrations.js` يقرأ الجدول بـ `select *` من المتصفح → التوكنات تصل للعميل. يجب نقلها إلى Environment Variables والتوقف عن إرسالها للمتصفح.
2. 🟠 **تيك توك مكرّر**: مثبّت في `index.html` ومحقون أيضاً في `integrations.js` → يُحمّل مرتين، ويعمل بلا موافقة.
3. 🟠 **GTM/TikTok بلا Consent**: يعملان عند تحميل الصفحة قبل أي موافقة.

---

## 2. قرارات معمارية (Design Decisions)

| # | القرار | السبب |
|---|---|---|
| D1 | **موديول جديد `tracking.js`** يُحمّل **قبل** `integrations.js`، يملك: قراءة/كتابة الكوكيز، توليد `dukkanci_uid`، حالة الموافقة + Consent Mode، التقاط UTM/click-ids (first/last touch)، توليد `event_id`، ودالة `pushEvent()` التي تنشر للـ`dataLayer` + `/api/track`. | فصل المسؤوليات؛ يبقى `integrations.js` للحقن فقط، ويصبح مشروطاً بالموافقة. |
| D2 | **Consent Mode default = denied** يُحقن كأول سطر في `<head>` **قبل** GTM. | شرط Google: يجب ضبط الـ default قبل تحميل أي Tag. |
| D3 | **بوّابة الموافقة (gating)**: `integrations.inject()` يُقسَّم إلى مزوّدي تحليلات (GA4) مشروطين بـ `analytics`، ومزوّدي تسويق (Meta/TikTok/GoogleAds/Snap/Pinterest) مشروطين بـ `marketing`. يُعاد استدعاؤه عند تغيّر الموافقة. | تطبيق "لا بكسل تسويقي قبل الموافقة". |
| D4 | **إزالة تيك توك المثبّت يدوياً** من `index.html`؛ يبقى الحقن عبر `integrations.js` فقط (مشروطاً). | إصلاح التكرار + التشغيل بلا موافقة. |
| D5 | **`event_id` يُولَّد مرة واحدة** عبر `crypto.randomUUID()` لكل حدث مهم، ويُمرَّر إلى: `dataLayer` + `fbq(..., {eventID})` + `/api/track`. | تجهيز Deduplication بين المتصفح والسيرفر (المرحلة 2) من الآن. |
| D6 | **`/api/track`** (Vercel function جديدة) يخزّن الأحداث داخلياً عبر `SUPABASE_SERVICE_ROLE_KEY`؛ الجداول RLS = deny للعميل (الكتابة عبر السيرفر فقط). | حماية البيانات؛ نمط متّبع في `notify-order.js`/`save-integrations.js`. |
| D7 | **التخزين الداخلي يحترم الموافقة**: أحداث تشغيل المنصة (purchase، cart) تُخزَّن دائماً (ضرورية)؛ الأحداث التحليلية البحتة تُخزَّن فقط عند `analytics=true`؛ الإرسال لمنصات الإعلان (المرحلة 2) فقط عند `marketing=true`. | المواصفة §20. |
| D8 | **`content_id` = حقل `id` للمنتج** (Integer) كما هو متّبع الآن في `I.track`. | مطابقة كتالوج Meta. |
| D9 | **ربط الطلب بالحملة**: إضافة عمود `attribution jsonb` على جدول `orders` (first_source/last_source/campaign/landing_page/store_ref/dukkanci_uid) يُملأ عند إنشاء الطلب. | المواصفة §14 — "أي حملة جلبت طلبات حقيقية". |
| D10 | **نقل توكنات CAPI إلى env**: `META_CONVERSIONS_API_TOKEN`, `TIKTOK_EVENTS_API_TOKEN`, إلخ؛ ويتوقف `integrations.js` عن تحميل أعمدة التوكنات للمتصفح. | إصلاح التسريب الأمني (D1.1). |

### 2.1 ملاحظة عن الكوكيز HttpOnly
الكوكيز التي يحتاجها JS (`dukkanci_uid`, `dukkanci_consent`, UTM…) تُضبط من المتصفح: `Secure; SameSite=Lax`. أما `dukkanci_session` بـ `HttpOnly` فلا يمكن ضبطها من JS — تحتاج رداً من السيرفر، لذا تؤجَّل إلى عمل سيرفري لاحق (المرحلة 2). في المرحلة 1 نكتفي بكوكيز التتبع التي يحتاجها العميل.

---

## 3. المرحلة الأولى (إلزامية) — تفصيل العمل

### 3.1 قاعدة البيانات — Migration جديد
ملف: `scripts/tracking-schema.sql` (يُطبَّق عبر Supabase MCP `apply_migration`).

```sql
-- visitors
create table if not exists public.tracking_visitors (
  id uuid primary key default gen_random_uuid(),
  dukkanci_uid text unique not null,
  first_seen_at timestamptz not null default now(),
  last_seen_at  timestamptz not null default now(),
  first_source text, last_source text,
  first_landing_page text, last_landing_page text,
  city text, district text, language text, device_type text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- events
create table if not exists public.tracking_events (
  id bigint generated always as identity primary key,
  event_id uuid not null,
  dukkanci_uid text not null,
  customer_id uuid,
  event_name text not null,
  event_source text not null default 'web',     -- web | server
  store_id bigint, product_id bigint,
  cart_id text, order_id text,
  value numeric, currency text default 'TRY',
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text,
  fbclid text, gclid text, ttclid text,
  page_url text, referrer text, user_agent text, ip_hash text,
  consent_marketing boolean, consent_analytics boolean,
  created_at timestamptz not null default now()
);
create index on public.tracking_events (dukkanci_uid);
create index on public.tracking_events (event_name);
create index on public.tracking_events (store_id);
create index on public.tracking_events (order_id);
create index on public.tracking_events (created_at);

-- consents (سجل الموافقات)
create table if not exists public.tracking_consents (
  id bigint generated always as identity primary key,
  dukkanci_uid text not null,
  customer_id uuid,
  consent_version text not null,
  necessary boolean default true,
  functional boolean default false,
  analytics boolean default false,
  marketing boolean default false,
  source text,                 -- cookie_banner | settings | api
  user_agent text, ip_hash text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on public.tracking_consents (dukkanci_uid);

-- marketing dispatch log (المرحلة 2، لكن نُنشئه الآن)
create table if not exists public.marketing_event_logs (
  id bigint generated always as identity primary key,
  event_id uuid not null,
  event_name text not null,
  destination text not null,   -- meta_capi_server | ga4 | tiktok_events_api | ...
  payload_json jsonb, response_json jsonb,
  status text, error_message text,
  created_at timestamptz default now()
);

-- ربط الطلب بالحملة
alter table public.orders add column if not exists attribution jsonb;

-- RLS: العميل لا يكتب/يقرأ مباشرة؛ كل شيء عبر service role
alter table public.tracking_visitors enable row level security;
alter table public.tracking_events   enable row level security;
alter table public.tracking_consents enable row level security;
alter table public.marketing_event_logs enable row level security;
-- (لا policies للـ anon = deny-all؛ service role يتجاوز RLS)
```

### 3.2 `tracking.js` (موديول جديد)
المسؤوليات:
- **Cookies util**: `getCookie/setCookie(name,val,{days})` — `Secure; SameSite=Lax; domain=.dukkanci.com.tr` (مع fallback للنطاق الحالي في dev).
- **`dukkanci_uid`**: يُولَّد `crypto.randomUUID()` إن لم يوجد، مدّة 180 يوم. يُحفظ نسخة احتياطية في localStorage (استرجاع لو حُذفت الكوكيز).
- **Consent state** (الكائن من §5):
  ```json
  { "version":"2026-01","necessary":true,"functional":false,"analytics":false,"marketing":false,"timestamp":"ISO","source":"cookie_banner" }
  ```
  يُحفظ في `dukkanci_consent` + `dukkanci_consent_version`.
- **Consent Mode bridge**: `gtag('consent','update', {...})` بترجمة analytics→`analytics_storage`، marketing→`ad_storage`/`ad_user_data`/`ad_personalization`.
- **Attribution capture** عند كل تحميل:
  - يقرأ `utm_*`, `fbclid`, `gclid`, `ttclid`, `store_ref` من `location.search`.
  - `dukkanci_first_source` (90 يوم، لا يُكتب إن وُجد)، `dukkanci_last_source` (30 يوم، يُحدَّث عند حملة مختلفة)، `dukkanci_campaign`, `dukkanci_store_ref`, `dukkanci_affiliate_ref`.
  - يحوّل `fbclid` → صيغة `fbc` ويحفظها (لاستخدام CAPI لاحقاً).
- **`getEventContext()`**: يرجّع `{dukkanci_uid, traffic_source{...}, city, language, page_language}` لإغناء كل حدث.
- **`pushEvent(name, payload)`**:
  1. يولّد `event_id` (إلا إن مُرِّر).
  2. يدفع للـ`dataLayer` (الشكل الموحّد من §7/§10).
  3. يرسل (fire-and-forget) إلى `POST /api/track` مع الموافقة الحالية.
  4. يرجّع `event_id` لاستخدامه في `fbq(..., {eventID})`.
- **`cart_id`**: يولّد/يقرأ `dukkanci_cart_id` (30 يوم) عند أول إضافة للسلة.

### 3.3 بانر الموافقة (Consent Banner) — عربي فقط
ملفات: قسم HTML في `index.html` + أنماط + منطق في `tracking.js` (أو `consent-ui.js` مستقل).
المتطلبات (§5):
- أزرار: **قبول الكل** / **رفض غير الضروري** / **تخصيص** + رابط سياسة الخصوصية + رابط سياسة الكوكيز.
- لوحة تخصيص بأربع فئات: ضرورية (مقفلة on)، وظيفية، تحليلات، تسويق.
- زر **"إعدادات الكوكيز"** في الـFooter لإعادة الفتح في أي وقت.
- لا يظهر مجدداً بعد الاختيار (يُقرأ من `dukkanci_consent`)؛ يظهر تلقائياً إذا تغيّر `consent_version`.
- بنية النصوص في كائن `i18n.ar` واحد ليسهل إضافة `tr`/`en` لاحقاً.
- RTL، متوافق مع هوية الموقع.
- نصوص مقترحة (عربي): "نستخدم الكوكيز لتحسين تجربتك وقياس الأداء والتسويق…".

### 3.4 ضبط `index.html`
- إضافة **Consent Mode default (denied)** كأول `<script>` في `<head>` قبل GTM:
  ```html
  <script>
    window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
    gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',
      ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
  </script>
  ```
- إبقاء GTM (يبقى مثبّتاً مرة واحدة).
- **حذف بكسل تيك توك المثبّت يدوياً** (السطر 59) — يتولّاه الحقن المشروط.
- تحميل `tracking.js?v=1` **قبل** `integrations.js`.
- رفع `?v=` على الملفات المعدّلة (سياسة النشر).

### 3.5 ضبط `integrations.js` (gating)
- في `I.inject()`: قبل حقن أي مزوّد، يقرأ `window.DUKKANCI_TRACKING.consent`.
  - GA4 (`_injectGa4`) → فقط إذا `analytics`.
  - Meta/TikTok/GoogleAds/Snap/Pinterest → فقط إذا `marketing`.
- إضافة `I.applyConsent()` يُستدعى من البانر بعد الاختيار لإعادة محاولة الحقن (دون تكرار — حارس `injected` لكل مزوّد).
- **التوقف عن قراءة أعمدة التوكنات** (`meta_capi_token`, `tiktok_events_token`) للمتصفح (تصفية في `I.load()` أو endpoint منفصل) — إصلاح D1.1.
- في `I.track()`: تمرير `event_id` القادم من `tracking.pushEvent` بدل توليد محلي، وإرسال `content_ids` كما هي.

### 3.6 ضبط `app.js` — توحيد الأحداث وإضافة الناقص
لكل نقطة موجودة، نوجّهها عبر `DUKKANCI_TRACKING.pushEvent(...)` (الذي بدوره ينادي `dataLayer` + `/api/track`)، ثم نمرّر `event_id` الناتج إلى `DUKKANCI_INTEGRATIONS.track(...)`:

| الحدث | الموقع الحالي | العمل |
|---|---|---|
| `view_item` (ViewContent) | `app.js:5280` | توحيد عبر pushEvent + payload §10 |
| `add_to_cart` (AddToCart) | `app.js:5681` | + `cart_id` |
| `begin_checkout` (InitiateCheckout) | `app.js:6226` | items array |
| `purchase` | `app.js:7519` | + `transaction_id=order.id`، وكتابة `attribution` على الطلب |
| `view_store` | عند فتح صفحة متجر | **جديد** |
| `page_view`/`view_home` | تنقّل SPA (`I.pageView`) | ربط بـ pushEvent |
| `search` | عند البحث | **جديد** |
| `submit_phone` (Lead) | عند إدخال/تأكيد الهاتف بالـOTP | **جديد** |
| `whatsapp_click` (Contact) | أزرار واتساب | **جديد** |
| `view_cart` / `remove_from_cart` | فتح/حذف من السلة | **جديد** (GA4) |
| `login` / `sign_up` | المصادقة | **جديد** (GA4) |

> أسماء أحداث GA4 تلتزم بالتسميات الرسمية (§9) لتظهر التقارير صحيحة. خرائط Meta حسب §9.

### 3.7 `/api/track.js` (Vercel function جديدة)
- `POST /api/track` يستقبل `{event_id,event_name,payload,consent,context}`.
- يتحقق (rate-limit بسيط + sanity) → upsert `tracking_visitors` (آخر زيارة/مصدر) → insert `tracking_events`.
- يطبّق D7 (ماذا يُخزَّن حسب الموافقة).
- يخزّن `ip_hash` (هاش غير قابل للعكس، اختياري حسب السياسة) لا الـIP الخام.
- المرحلة 2: من هنا يتفرّع الإرسال إلى Meta CAPI / GA4 MP / TikTok Events.

### 3.8 ما لا نخزّنه في الكوكيز (تأكيد §4)
لا هاتف خام، لا إيميل، لا اسم، لا عنوان، لا توكنات. فقط: uid مجهول، consent، cart_id، store slug، UTM، تفضيلات لغة/مدينة.

---

## 4. المرحلة الثانية (مهمة جداً) — ✅ معظمها مبني ومختبَر حياً (commit 49811ba)

> ✅ تم: Meta CAPI من السيرفر (Purchase/Lead/Contact/InitiateCheckout/AddToCart/ViewContent) بنفس `event_id` للـDeduplication · fbp/fbc · Advanced Matching مُهشَّر (هاتف 90XXXXXXXXXX + external_id) · مفاتيح env مع fallback لـintegration_settings · تسجيل في marketing_event_logs · **اختُبِر حياً مقابل Graph API: events_received=1 (TEST32260)**.
> ⏳ متبقٍّ: ضبط متغيّرات META_* على Vercel (لإخراج التوكن من الجدول المقروء من المتصفح) · **تبويب لوحة الإدارة "التتبع والبيانات التسويقية" (2ب) لم يُبنَ بعد** · Consent Trigger على وسم تيك توك داخل GTM.


1. **Meta Conversions API (سيرفر)**: تمديد `/api/track` (أو `/api/capi.js`) لإرسال `Purchase/Lead/Contact/InitiateCheckout/AddToCart/ViewContent` من السيرفر باستخدام **نفس `event_id`** (Deduplication).
2. **نقل التوكنات إلى env** (D10): `META_CONVERSIONS_API_TOKEN`, `META_PIXEL_ID`, `META_TEST_EVENT_CODE`, `META_API_VERSION`, `TIKTOK_EVENTS_API_TOKEN`, … وفصلها تماماً عن مفاتيح WhatsApp (§3 المواصفة — ممنوع الخلط).
3. **`fbp`/`fbc`**: قراءة `_fbp` من كوكي البكسل و`fbc` من `fbclid` وإرسالها مع أحداث السيرفر.
4. **Advanced Matching** (هاش في السيرفر فقط): هاتف بصيغة `90XXXXXXXXXX`، email، الاسم، المدينة، `external_id=customer_id`.
5. **ربط الطلب بالحملة**: ملء `orders.attribution` (تمّ تجهيز العمود في المرحلة 1).
6. **تسجيل الإرسال** في `marketing_event_logs`.
7. **تبويب لوحة الإدارة "التتبع والبيانات التسويقية"** (§15): زوّار، مشاهدات متجر/منتج، إضافات سلة، بدء طلب، طلبات مكتملة، معدل تحويل لكل متجر، مصادر الزيارات، أكثر الحملات/المتاجر/المنتجات، ضغطات واتساب، سلات متروكة — مع فلاتر (تاريخ/متجر/مدينة/مصدر/حملة/جهاز/لغة). يُبنى فوق `tracking_events` عبر RPC/Views.

---

## 5. المرحلة الثالثة (تطويرية) — مخطط
- Server-side GTM.
- TikTok Events API + Google Ads Enhanced Conversions.
- أتمتة السلة المتروكة (§17) — البنية جاهزة (`cart_id` + `dukkanci_uid` + ربط `customer_id`)؛ الإرسال عبر واتساب فقط مع موافقة مناسبة.
- تقارير أصحاب المتاجر (§16) مع ضوابط صلاحيات وخصوصية.
- شرائح جماهير / Lookalike / Retargeting.

---

## 6. التحقق والاختبار (مطابقة §22)
- **الكوكيز**: أول زيارة بلا موافقة → لا بكسل تسويقي؛ قبول الكل؛ رفض؛ تخصيص؛ تغيير لاحق؛ حذف وإعادة؛ تصفّح عربي.
- **الأحداث**: رئيسية/متجر/منتج/إضافة/بدء طلب/هاتف/واتساب/إتمام؛ دخول مع `utm_*`، `fbclid`، `gclid`.
- **Meta**: Pixel Helper + Events Manager Test Events (`TEST32260`) + فحص `event_id`/`fbp`/`fbc` + جودة المطابقة (المرحلة 2).
- **GA4**: DebugView + Realtime + Ecommerce (purchase/add_to_cart/begin_checkout).
- **DB**: تخزين الأحداث/الموافقة، ربط بالمتجر/المنتج/الطلب/الحملة، وعدم وجود بيانات شخصية في الكوكيز.
- QA على الموقع الحيّ عبر Chrome على المضيف (الإنترنت في الساندبوكس مُوكّل).

---

## 7. مطابقة معايير القبول (§23)
| # | المعيار | المرحلة |
|---|---|---|
| 1 | بانر حقيقي قبول/رفض/تخصيص | 1 |
| 2 | لا كوكيز تسويق قبل الموافقة | 1 |
| 3 | `dukkanci_uid` لكل زائر | 1 |
| 4 | First/Last touch | 1 |
| 5 | أحداث e-commerce إلى GA4 | 1 |
| 6 | أحداث مهمة إلى Meta Pixel | 1 |
| 7 | أحداث مهمة إلى Meta CAPI (سيرفر) | 2 |
| 8 | نفس `event_id` للمتصفح والسيرفر | 1 (id) / 2 (dedup) |
| 9 | `content_ids` مطابقة للكتالوج | 1 |
| 10 | تخزين الأحداث داخلياً | 1 |
| 11 | تقارير أساسية في اللوحة | 2 |
| 12 | لا هواتف/إيميلات في الكوكيز | 1 |
| 13 | كل المفاتيح في env | 2 (نقل CAPI) |
| 14 | لا خلط WhatsApp/Meta CAPI | 1-2 |
| 15 | عدم كسر السلة/الطلبات/الصفحات | 1 |
| 16 | اختبار على Events Manager + GA4 DebugView | 1-2 |
| 17 | توثيق فني واضح | هذا الملف + تحديثه |

---

## 8. الملفات المتأثرة (Phase 1)
| ملف | نوع التغيير |
|---|---|
| `scripts/tracking-schema.sql` | جديد (migration) |
| `tracking.js` | جديد (الموديول الأساسي + منطق البانر) |
| `index.html` | Consent Mode default، حذف TikTok المثبّت، تحميل `tracking.js`، قسم البانر + رابط Footer، رفع `?v=` |
| `integrations.js` | gating حسب الموافقة، `applyConsent()`، إيقاف تسريب التوكنات، استقبال `event_id` |
| `app.js` | توحيد الأحداث الأربعة عبر `pushEvent` + أحداث جديدة (view_store/search/submit_phone/whatsapp_click/view_cart/login/sign_up) + كتابة `attribution` |
| `api/track.js` | جديد (تخزين داخلي + تجهيز تفرّع CAPI لاحقاً) |

---

## 9. أسئلة/قرارات مفتوحة قبل البدء
1. سياسة الخصوصية وسياسة الكوكيز — هل توجد صفحات/روابط جاهزة لربطها في البانر؟ (إن لا، نضيف صفحتي محتوى مبدئيتين).
2. تخزين `ip_hash`/user_agent في `tracking_consents`/`tracking_events` — مسموح قانونياً لديكم؟ (افتراضي: نخزّن hash فقط، قابل للإيقاف).
3. GA4 قبل موافقة التحليلات — نُبقيه **متوقفاً تماماً** حتى الموافقة (الأبسط والأكثر امتثالاً)، أم نشغّله بنمط Consent Mode بلا كوكيز؟ (الخطة الحالية: متوقف حتى الموافقة).
4. ترتيب التنفيذ داخل المرحلة 1 — مقترح: (DB → tracking.js → البانر → gating → /api/track → توحيد app.js).
```
