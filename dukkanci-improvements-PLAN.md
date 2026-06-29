# دكانجي — خطة تنفيذ التحسينات الخمسة (مُكيَّفة على الكود الفعلي)

> هذه الخطة هي ترجمة دليل `dukkanci-improvements-dev-guide.md` إلى **واقع الكود الحقيقي**.
> الدليل الأصلي كُتب على افتراض «واجهة React/Next» — وهذا **غير صحيح**: المشروع تطبيق
> **Vanilla-JS PWA** (ملف `app.js` واحد ≈416KB + `index.html` + ملفّات `*-data.js` + دوال
> `api/*.js`). لا يوجد React ولا Next ولا JSX ولا موجّه صفحات.
>
> **النتيجة الأهم:** الكثير من «الميزات الخمس» **مبنيّ أصلاً** في الكود لكن محليّاً
> (localStorage) أو جزئياً. العمل الحقيقي أصغر بكثير من الدليل: غالبه **ربط ما هو قائم
> بالتخزين السحابي** + طبقات إضافية صغيرة، لا بناءً من الصفر.

---

## 0) قرارات ثابتة لهذه الخطة

| القرار | القيمة |
|---|---|
| المنصّة الفعلية | Vanilla-JS PWA: `app.js` + `index.html` + `*-data.js` + `api/*.js` |
| منطق الخادم (مال/خصم/رصيد) | **Supabase RPC (`security definer`) أو Edge Functions** — **ليس** `api/*.js` |
| سبب ذلك | خطة Vercel Hobby تحدّ الدوال المنشورة بـ **12، ونحن على الحد بالضبط** (13 ملفاً في `api/` ناقص `auth-sms.js` المتجاهَل). أي دالة `api/` جديدة = فشل بناء صامت + تجميد الإنتاج |
| الهجرات | إضافية فقط، **مباشرة على الإنتاج** (قرار المالك): `CREATE TABLE` / `ADD COLUMN ... NULL` / `CREATE INDEX CONCURRENTLY` فقط |
| أعلام الميزات | تُقرأ من جدول `integration_settings` القائم عبر طبقة `integrations.js` الموجودة (لا حاجة لاستعلام جديد) |
| RLS | مُفعّل على كل جدول جديد، الافتراضي حظر |
| مسار الزائر | يبقى حرفياً كما هو؛ كل ميزة خلف علمها والافتراضي **مُطفأ** |

### علم الميزة — يُعاد استخدام البنية الموجودة (مهم)
`integrations.js` يحمّل **كل** صفوف `integration_settings` مسبقاً إلى
`window.DUKKANCI_INTEGRATIONS.settings`. لذا لا نكتب استعلاماً جديداً — نضيف فقط دالّة قراءة:

```js
// تُضاف قرب أعلى app.js (بجوار دوال state)
function isFeatureOn(key) {
  const s = window.DUKKANCI_INTEGRATIONS && window.DUKKANCI_INTEGRATIONS.settings[key];
  return !!(s && s.is_enabled);          // الافتراضي: مُطفأ عند الغياب/الفشل
}
```

### الهجرة الأولى (تُشغَّل قبل أي شيء) — أعلام الميزات
ملف `migrations/20260629_feature_flags.sql`:
```sql
insert into public.integration_settings (setting_key, setting_value, is_enabled) values
  ('feature_customer_accounts',  '', false),
  ('feature_conversion_drivers', '', false),
  ('feature_eta_tightening',     '', false),
  ('feature_community_retention','', false),
  ('feature_voice_search',       '', false)
on conflict (setting_key) do nothing;
```

> ملاحظة نشر: أي تعديل على `app.js`/`styles.css`/`sw.js` يتطلّب **رفع رقم `?v=`** في
> `index.html` و`sw.js` (قاعدة النشر القائمة)، وإلا لا تصل التغييرات للمستخدمين العائدين.

---

## الميزة 1 — حساب يختصر الطريق  ·  العلم: `feature_customer_accounts`

### ما هو مبنيّ أصلاً (لا تُعِد بناءه)
| القائم | الموقع |
|---|---|
| دخول بالبريد+كلمة المرور + Google + OTP هاتف (واتساب) | `app.js:893` `initAuth`, `signInWithEmail`, `signInWithGoogle`, `sendWhatsappOtp`؛ `AUTH_FLAGS.phoneOtpLogin = true` |
| `state.user` + `state.customerProfile` + زر الحساب | `app.js:881` `updateAccountButton`, `applyUserToProfile` |
| عناوين محفوظة (label/structured/namedZone/isDefault) + صفحة «عناوين التوصيل» | `app.js:155` `loadCustomerAddresses`, `:2125`, إضافة/تعديل/حذف/افتراضي `:6371-6410`, `:5352-5368` |
| «إعادة الطلب» كامل | `app.js:4189` `reorderCustomerOrder`, `:5239` `applyCustomerReorder` |
| لقطة بنود الطلب (incl. `productId`) | تُخزَّن في `delivery_details.lineItems` (انظر `api/notify-order.js:735`) + `app.js:6255` |
| تعبئة الدفع تلقائياً من العنوان الافتراضي | `app.js:1235` `getDefaultAddress` مستخدم في الدفع |

### الفجوة الحقيقية (هذا فقط ما نبنيه)
كل ما سبق **محلّي (localStorage `dukkanci-addresses`)** — لا يتبع المستخدم بين الأجهزة ولا
يرتبط بـ `auth.uid()`. المطلوب = **مزامنة سحابية** للموجود.

### الهجرة `migrations/20260629_customer_accounts.sql`
```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text, phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.customer_addresses (
  id bigint generated always as identity primary key,
  customer_id uuid not null references auth.users(id) on delete cascade,
  label text, line text, area text, lat numeric, lng numeric,
  structured jsonb,            -- نحفظ bina/daire/namedZone كما في الواجهة الحالية
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_customer_addresses_customer on public.customer_addresses(customer_id);

-- ربط الطلب بالعميل (إضافي؛ كله NULL فلا يمسّ الطلبات القائمة)
alter table public.orders add column if not exists customer_id uuid references auth.users(id);
alter table public.orders add column if not exists customer_phone text;
create index if not exists idx_orders_customer on public.orders(customer_id);
-- ⚠️ لا نضيف عمود order_items — بنود الطلب موجودة في delivery_details.lineItems

alter table public.profiles           enable row level security;
alter table public.customer_addresses enable row level security;
create policy "profiles_self" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());
create policy "addr_self" on public.customer_addresses
  for all using (customer_id = auth.uid()) with check (customer_id = auth.uid());
-- العميل يرى طلباته فقط (لا يمسّ وصول المتجر/الإدارة القائم)
create policy "orders_customer_read" on public.orders
  for select using (customer_id = auth.uid());
```

### تعديلات `app.js` (كلها خلف `isFeatureOn('feature_customer_accounts')`)
1. **عند `SIGNED_IN`** (`app.js:911`): إن كان العلم مُفعّلاً، اسحب `profiles` +
   `customer_addresses` للمستخدم ← ادمجها في `state.customerProfile` و`state.customerAddresses`
   (السحابة تَغلب المحلي للمسجّل). الزائر يبقى على localStorage تماماً كما الآن.
2. **كتابة العناوين** (`app.js:6371-6410`, `5352-5368`): بعد كل إضافة/تعديل/حذف/جعل-افتراضي،
   إن كان مسجّلاً، اكتب نفس الصف إلى `customer_addresses` عبر `supabaseClient`. (الكتابة المحلّية
   تبقى للزائر.) `saveState`/`loadCustomerAddresses` تبقى دون تغيير للزائر.
3. **ربط الطلب**: عند إنشاء الطلب وهو مسجّل، مرّر `customer_id = state.user.id` و`customer_phone`
   إلى صف `orders` (في مسار كتابة الطلب — يُؤكَّد موضعه وقت التنفيذ: client `supabaseClient` أو
   عبر `notify-order`).
4. **تبويب طلباتي**: للمسجّل، اقرأ `orders where customer_id = uid` (يظهر عبر الأجهزة)؛ للزائر
   يبقى السلوك المحلّي. «إعادة الطلب» تعمل كما هي على `delivery_details.lineItems`.

### القبول / التراجع
زائر يُكمل طلباً كالسابق تماماً (انحدار). مسجّل: عناوينه/طلباته تتبعه على جهاز آخر،
«اطلب مجدداً» يبني السلّة، الدفع يُعبّأ تلقائياً. **إطفاء العلم ⇒ سلوك localStorage الحالي حرفياً.**

---

## الميزة 2 — محرّكات التحويل  ·  العلم: `feature_conversion_drivers`

### ما هو مبنيّ أصلاً
- **تنبيه الحد الأدنى مبنيّ بالكامل** — `app.js:4115`: «أضف X للوصول إلى الحد الأدنى» + تعطيل
  زر الدفع تحت الحد (`:4116`). **لا عمل عليه.**
- **بنية الإشعارات الفورية حيّة** — `sw.js:172` معالِجا `push`/`notificationclick` + `api/notify-order.js`
  يُرسل عبر VAPID (RFC8291). جدول `push_subscriptions` موجود. (الذاكرة: LIVE منذ 2026-06-29.)

### الفجوة الحقيقية: أكواد الخصم + حدّ التوصيل المجاني
### الهجرة `migrations/20260629_coupons.sql`
```sql
create table if not exists public.coupons (
  id bigint generated always as identity primary key,
  code text unique not null,
  discount_type text not null check (discount_type in ('percent','fixed','free_delivery')),
  value numeric not null default 0,
  store_id bigint references public.stores(id),          -- NULL = عام
  min_subtotal numeric not null default 0, max_discount numeric,
  starts_at timestamptz, ends_at timestamptz,
  usage_limit integer, per_customer_limit integer default 1,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.coupon_redemptions (
  id bigint generated always as identity primary key,
  coupon_id bigint not null references public.coupons(id),
  order_id text references public.orders(id),
  customer_id uuid, customer_phone text,
  amount numeric not null, created_at timestamptz not null default now()
);
alter table public.coupons            enable row level security;
alter table public.coupon_redemptions enable row level security;
create policy "coupons_public_read" on public.coupons for select using (active = true);
-- الكتابة في coupon_redemptions: عبر RPC/خادم فقط (لا سياسة عامة)

-- حدّ التوصيل المجاني
alter table public.stores add column if not exists free_delivery_threshold numeric;
insert into public.site_settings (key, value) values
  ('delivery_config', '{"free_delivery_threshold": null, "currency": "TL"}'::jsonb)
on conflict (key) do nothing;
```

### التحقّق الخادمي — **Supabase RPC (وليس `api/`)**
دالّة `validate_coupon(p_code, p_store_id, p_subtotal)` بـ `security definer set search_path = public`
تُعيد `{ valid, discount, reason }` بعد فحص الفعالية/التواريخ/الحد الأدنى/حدود الاستخدام.
- التطبيق والتسجيل في `coupon_redemptions` يحدث **عند إنشاء الطلب على الخادم** (داخل
  `validate_coupon` أو في مسار كتابة الطلب) — لا في المتصفّح.
- الإجمالي لا يصبح سالباً: `discount = min(discount, subtotal)`.

### تعديلات `app.js` (خلف العلم)
- حقل كوبون في السلّة/الدفع ← `supabaseClient.rpc('validate_coupon', …)` ← يعرض الخصم فقط.
- حدّ التوصيل المجاني في `computeTotals` (`app.js:1404-1410`): إن
  `subtotal >= free_delivery_threshold` ⇒ `delivery = 0` + شارة «توصيل مجاني!».

### القبول / التراجع
كوبون منتهٍ/مزوّر يُرفَض خادمياً (اختبار تلاعب من المتصفّح). الإجمالي لا يَسلب.
إطفاء العلم يُخفي حقل الكوبون وشارة التوصيل المجاني.

---

## الميزة 3 — ضبط وقت التوصيل  ·  العلم: `feature_eta_tightening`

### ما هو مبنيّ أصلاً
- تقدير **ضيّق** للوصول محسوب فعلاً عند الدفع عبر `api/delivery-quote` (`quote.estimatedMinutes`،
  `app.js:3793`, `:4312`, `:6302` ← `~${etaMin} دقيقة`).
- `prepMinutes` لكل متجر في إعدادات التوصيل (`app.js:2398`).

### الفجوة الحقيقية
بطاقة المتجر (`app.js:1535`) وصفحة المتجر (`:1950`) ما زالتا تعرضان النص الثابت `store.time`
(«45 - 75 دقيقة»). المطلوب: **عرض التقدير الضيّق نفسه على البطاقة/الصفحة**، مع تخزين
`prep_time_min` لكل متجر سحابياً.

### الهجرة `migrations/20260629_eta.sql`
```sql
alter table public.stores add column if not exists prep_time_min integer;
insert into public.site_settings (key, value) values
  ('eta_config', '{"default_prep_min": 15, "avg_speed_kmh": 18, "buffer_min": 8}'::jsonb)
on conflict (key) do nothing;
```

### تعديلات `app.js` (خلف العلم)
```js
function estimateEta(distanceKm, prepMin, cfg) {
  const travel = (distanceKm / cfg.avg_speed_kmh) * 60;
  const mid = (prepMin ?? cfg.default_prep_min) + travel + cfg.buffer_min;
  return { low: Math.round(mid - 5), high: Math.round(mid + 5) };
}
```
في `app.js:1535` و`:1950`: إن كان العلم مُفعّلاً و`branchDistanceKm(store)` متاحاً، اعرض
`«{low}–{high} دقيقة»`؛ **وإلا اعرض `store.time` القديم** (تراجع آمن، لا خطأ).

### القبول / التراجع
متجر بمسافة معروفة يعرض نطاقاً ضيّقاً متّسقاً عبر البطاقة/الصفحة/الدفع. متجر بلا بيانات يعرض
`store.time`. إطفاء العلم يُعيد `store.time` في كل مكان.

---

## الميزة 4 — احتفاظ مجتمعي  ·  العلم: `feature_community_retention`  ·  **(يُؤجَّل)**

أثقل ميزة، ولا تعتمد عليها بقية العمل. التوصية: **بعد 1/2/3**. تعتمد على هوية العميل (الميزة 1).
الجداول إضافية ومستقلّة خلف العلم: `referral_codes`, `referrals`, `customer_credits`
(محفظة دفترية، الرصيد = مجموع `amount` غير المنتهي، يُحسب/يُسجَّل خادمياً مثل الكوبونات تماماً)،
ثم لاحقاً `group_orders` + `group_order_participants` (طلب المبنى الجماعي — MVP أخير).
التفاصيل والـSQL في الدليل الأصلي § الميزة 4 (إضافية كما هي). لا أثر على الطلب الفردي عند الإطفاء.

---

## الميزة 5 — البحث الصوتي  ·  العلم: `feature_voice_search`

### ما هو مبنيّ أصلاً
- تطبيع عربي للبحث **موجود** — `app.js:1769` `normalizeAr` + `:1784` `getMatchingProducts`.
- حقول البحث: `#hero-search` (`:1669`), `#stores-search` (`:1840`), بحث المتجر (`:1967`).
- البحث **يعمل على الكتالوج في الذاكرة (client-side)** عبر `getMatchingProducts`.

### تصحيح مهم على الدليل
الدليل يقترح فهرس `pg_trgm` على `products.name` — لكن البحث الحالي **عميل في الذاكرة لا خادمي**،
فالفهرس **لا يفيد** البنية الحالية. نتجاهله (نضيفه فقط لو نُقل البحث للخادم مستقبلاً).
المرادفات يمكن أن تكون **خريطة صغيرة في الواجهة** (أو جدول صغير يُجلب مرة)، لا حاجة لـ `pg_trgm`.

### الفجوة الحقيقية (صغيرة جداً)
زرّ ميكروفون بجوار حقل البحث ← Web Speech API ← يضع الناتج في `state.search` ← `render()`.

### تعديلات `app.js` + `index.html` (خلف العلم)
- زرّ مايك بجانب `#hero-search`/`#stores-search`؛ عند الضغط:
  `new (window.SpeechRecognition || window.webkitSpeechRecognition)()` بلغة `ar`، عند النتيجة
  عيّن `state.search = transcript` ثم `render()` (نفس مسار `getMatchingProducts`).
- **تحسين تدريجي**: إن غاب `SpeechRecognition` ⇒ **أخفِ الزرّ** (لا عطب).
- (اختياري) خريطة مرادفات صغيرة (`بندورة→طماطم`…) تُوسّع `state.search` قبل البحث.

### القبول / التراجع
النطق العربي يُرجع نتائج عبر مسار البحث الحالي. متصفّح غير داعم: لا زرّ ولا خطأ. إطفاء العلم
يُخفي الزرّ.

---

## ترتيب التنفيذ الموصى به

| # | الميزة | الحجم الفعلي بعد التكييف | يعتمد على |
|---|---|---|---|
| 1 | **الميزة 1** (مزامنة الحساب) | متوسط — ربط القائم بالسحابة | — (أساس للميزتين 2/4) |
| 2 | **الميزة 3** (ETA) + **الميزة 5** (صوتي) بالتوازي | صغير جداً | — |
| 3 | **الميزة 2** (كوبونات + توصيل مجاني) | متوسط | الميزة 1 (لـ per_customer) |
| 4 | **الميزة 4** (مجتمعي) | كبير — يُؤجَّل | الميزة 1 |

## قائمة فحص ما قبل كل دمج
- [ ] الهجرة إضافية فقط؛ لا `DROP/RENAME/NOT NULL` على بيانات قائمة.
- [ ] الزائر يُكمل طلباً والعلم مُطفأ (انحدار).
- [ ] العلم مُفعّل: المسار الجديد يحقّق معايير القبول.
- [ ] RLS مُفعّل وسياساته صحيحة على كل جدول جديد.
- [ ] أي خصم/رصيد محسوب خادمياً (RPC)؛ التلاعب من المتصفّح مرفوض؛ الإجمالي لا يَسلب.
- [ ] تشغيل `get_advisors(security)` بعد الهجرة بلا تحذيرات جديدة.
- [ ] رفع `?v=` في `index.html`/`sw.js` لأي تعديل واجهة.
- [ ] إطفاء العلم يُعيد السلوك الحالي حرفياً.
