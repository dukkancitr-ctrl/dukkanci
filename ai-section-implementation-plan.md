# خطة تنفيذ «قسم الذكاء الصناعي» في دكانجي

> خطة هندسية واقعية مبنية على المواصفات (`مواصفات_قسم_الذكاء_الصناعي_دكانجي.docx`) ومطابقة لبنية المشروع الفعلية.
> آخر تحديث: حزيران 2026 · المرجع: المواصفات + فحص الكود الحالي.

> **✅ حالة التنفيذ:** قيد الدوال محسوم (ترقية Vercel Pro — السقف رُفع). **المرحلة 1 (الأساس) مبنيّة** (app.js v165، لم تُنشَر بعد):
> الجداول `ai_providers`/`ai_feature_config`/`ai_usage_log` (مطبّقة على Supabase) + `lib/ai-gateway.js` + `api/ai.js` + تبويب «الذكاء الاصطناعي» + إعادة توجيه `aiReply` عبر البوابة.
> **متبقٍّ قبل التفعيل في الإنتاج:** ضبط `KEY_ENCRYPTION_SECRET` في Vercel ثم النشر (commit/push). المراحل 2–5 لم تبدأ.

---

## 0. الفارق الجوهري بين الوثيقة والواقع

المواصفات تفترض بنية **Next.js**. المشروع الفعلي مختلف، ويجب أن تُبنى الخطة عليه لا على افتراض الوثيقة:

| البُعد | افتراض الوثيقة | الواقع في المشروع |
|--------|----------------|--------------------|
| الواجهة | Next.js / React | **Vanilla JS** — ملف واحد `app.js` (6885 سطر، `?v=163`) + `index.html` |
| الخلفية | غير محدّد بدقّة | دوال **Vercel Serverless** في `/api` + Supabase |
| استدعاء Supabase | client library | خليط: `supabase-js` (anon) في الواجهة + **REST خام عبر fetch** في `/api` (لا مكتبة) |
| النشر | غير مذكور | **Vercel Hobby — سقف 12 دالة `/api` منشورة. ونحن عند السقف تماماً (12/12).** |

**القيد الأخطر:** أي endpoint جديد قائم بذاته في `/api` سيصبح الدالة الـ13 ← يتجاوز سقف Hobby ← **يفشل النشر بصمت ويتجمّد الموقع** (هذا موثّق في ذاكرة المشروع). كل تصميم تالٍ مبنيّ حول هذا القيد.

---

## 1. ما هو مبنيّ فعلاً (لسنا نبدأ من الصفر)

نصف المواصفات مُنفّذ جزئياً بالفعل:

| ميزة في الوثيقة | الحالة الفعلية | المرجع |
|------------------|----------------|--------|
| **الرد الآلي على واتساب** | ✅ موجود — OpenAI `gpt-4o-mini`، يقرأ آخر 8 رسائل كسياق، fallback آمن | `api/notify-order.js` دالة `aiReply()` (≈ سطر 640–677)، نظام التعليمات `AI_SYSTEM` (≈ 630–639) |
| **اتصال WhatsApp Business API** | ✅ حيّ — Meta Cloud API، webhook، قوالب، OTP، صندوق وارد ثنائي | `api/notify-order.js` (`ingestWebhook`, `sendWhatsapp`)، جدول `whatsapp_messages` |
| **تحسين صور المنتجات** | ✅ موجود (نسخة أولى) — OpenAI `gpt-image-1` image-edit | `api/enhance-image.js` |
| **البحث الصوتي** | ✅ موجود (Web Speech API في المتصفح، عربي) | `app.js` ≈ 1520–1564 |
| **لوحة إدارة + تخزين إعدادات** | ✅ نمط جاهز — تبويبات `adminItems` + جدول `site_settings` عبر `adminApi("save-settings")` | `app.js` ≈ 2356، `renderAdmin()` ≈ 4064 |
| **جدول إعدادات/أعلام ميزات** | ✅ `integration_settings` + `site_settings` موجودان | `save-integrations.js`، `isFeatureOn()` |

### ما **لا** يوجد بعد (الفجوة الحقيقية)
- ❌ طبقة مفاتيح متعدّدة المزوّدين (`ai_providers` / `ai_feature_config`) — حالياً مفتاح OpenAI واحد عبر `OPENAI_API_KEY`.
- ❌ **AI Gateway** موحّد — كل ميزة تنادي OpenAI مباشرة.
- ❌ لا Anthropic ولا Google ولا مزوّد صور بديل.
- ❌ لا **RAG / pgvector / embeddings / قاعدة معرفة** إطلاقاً.
- ❌ لا **مترادفات** — البحث تطبيع نصّي بسيط فقط (`normalizeAr`).
- ❌ لا سياق **لكل متجر** للرد الآلي (تعليمة عامة واحدة hardcoded).
- ❌ لا تصعيد بشري مُمنهج، ولا سجل استهلاك/تكلفة، ولا لوحة تحكّم بالمزوّدين.
- ❌ تحسين الصور بلا طابور غير متزامن، ولا تخزين مزدوج، ولا قبول/رفض.

---

## 2. حلّ قيد الـ12 دالة (قرار حاكم — يُتّخذ قبل أي كود)

هذه أهم نقطة. ثلاثة مسارات:

### الخيار أ — Supabase Edge Functions للأعمال الثقيلة (موصى به)
الأعمال الثقيلة (معالجة ملفات المعرفة، توليد embeddings، توليد المترادفات بالجملة، طابور الصور) تُنفّذ كـ **Supabase Edge Functions** — تعمل على Supabase ولا تُحسب ضمن سقف Vercel إطلاقاً. أما الأعمال الخفيفة لكل طلب (توجيه البوابة، الاسترجاع، الرد الآلي) فتبقى داخل `notify-order.js`.
- ✔ لا يلمس سقف Vercel. ✔ بيئة Deno قريبة من pgvector. ✔ مناسب للمهام المجدولة/الطويلة.
- ✘ بيئة تشغيل ثانية تُدار وتُراقَب.

### الخيار ب — دمج دالتين لتحرير مقعد، ثم إضافة `ai.js` موحّدة
دمج `reverse-geocode.js` + `delivery-quote.js` في دالة `geo.js` واحدة (كلاهما خرائط/مواقع) ← يتحرّر مقعد ← تُضاف دالة `ai.js` متعدّدة الإجراءات (`?action=...`) تجمع كل عمليات القسم.
- ✔ فصل نظيف لكود القسم في ملف واحد. ✔ يبقى ضمن Hobby.
- ✘ عمل دمج/اختبار مسبق. ✘ دالة واحدة قد تتضخّم.

### الخيار ج — ترقية Vercel Pro
يرفع سقف الدوال (و`maxDuration`). الأبسط هندسياً.
- ✔ حرية كاملة لإضافة endpoints. ✘ تكلفة شهرية.

**التوصية:** **أ + إضافة الإجراءات الخفيفة كـ `?action=` على `notify-order.js`** (هو أصلاً مركز كل شيء). نلجأ لـ(ب) فقط إذا تضخّم `notify-order.js` بشكل يصعب صيانته، ولـ(ج) عند التوسّع التجاري لاحقاً.

---

## 3. المبدأ المعماري المعدّل (مطابق للمشروع)

```
الميزات (features)                AI Gateway (مكتبة مشتركة)         المزوّدون (providers)
─────────────────                ──────────────────────            ──────────────────
رد واتساب الآلي  ─┐
استرجاع المعرفة  ─┤              lib/ai-gateway.js                  OpenAI
توليد المترادفات ─┼──► aiGateway.complete(feature, ...) ──► يقرأ ai_feature_config ──► Anthropic
توليد embeddings ─┤              aiGateway.embed(...)                Google
تحسين الصور      ─┘              aiGateway.image(...)                مزوّد صور (Replicate)
                                  + fallback + usage log
```

**القرار المعماري المفصلي:**
- **AI Gateway = مكتبة `lib/ai-gateway.js` لا دالة `/api`.** تُستورَد داخل `notify-order.js` و`enhance-image.js` وأي Edge Function. هكذا لا تستهلك مقعد دالة، ويتحقّق مبدأ الوثيقة (فصل المزوّد عن الميزة) دون كسر سقف Vercel.
- كل استدعاء OpenAI الحالي (`aiReply`، `enhance-image`) **يُعاد توجيهه عبر البوابة** بدل النداء المباشر — هذا يحوّل الموجود إلى أصل قابل للتوسّع.
- التشفير: متغيّر بيئة `KEY_ENCRYPTION_SECRET` + AES على مستوى التطبيق عند الحفظ، وفكّ التشفير داخل البوابة (server-side فقط، service-role). بديل: Supabase Vault.

---

## 4. مخطط قاعدة البيانات (ملفات migration جديدة في `/migrations`)

```sql
-- 1) المزوّدون ومفاتيحهم
create table ai_providers (
  id uuid primary key default gen_random_uuid(),
  provider_name text not null,          -- openai | anthropic | google | replicate
  service_type  text not null,          -- text | image | embedding | both
  api_key_encrypted text not null,      -- لا يُخزَّن صريحاً أبداً
  default_model text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) ربط كل ميزة بمزوّد نشط
create table ai_feature_config (
  id uuid primary key default gen_random_uuid(),
  feature_name text unique not null,    -- whatsapp_autoreply | image_enhancement | synonym_generation | embeddings
  provider_id uuid references ai_providers(id),
  model_override text,
  is_enabled boolean default true,
  settings jsonb default '{}'::jsonb
);

-- 3) المترادفات
create table product_synonyms (
  id uuid primary key default gen_random_uuid(),
  product_id bigint references products(id),
  canonical_name text not null,
  synonyms text[] not null default '{}',
  dialect_tag text
);

-- 4) قاعدة المعرفة (RAG) — يتطلب: create extension if not exists vector;
create table knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  file_name text, storage_path text,
  scope text not null,                  -- platform | store
  store_id bigint,
  status text default 'processing',     -- processing | ready | failed
  created_at timestamptz default now()
);
create table knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references knowledge_documents(id) on delete cascade,
  content text not null,
  embedding vector(1536),               -- بحسب نموذج embeddings المختار
  metadata jsonb default '{}'::jsonb
);
create index on knowledge_chunks using hnsw (embedding vector_cosine_ops);

-- 5) سجل الاستهلاك (متطلب عام)
create table ai_usage_log (
  id bigserial primary key,
  feature text, provider text, model text,
  units integer, est_cost numeric,
  created_at timestamptz default now()
);
```
كل الجداول **RLS = deny** بلا سياسة عامة (مثل `whatsapp_messages`) — الوصول عبر service-role فقط. تُطبّق عبر Supabase MCP `apply_migration`.

---

## 5. المراحل التنفيذية

### المرحلة 0 — حسم قيد الدوال (يوم واحد، حاجِز)
قرار الخيار (أ/ب/ج)، وتجهيز بيئة Supabase Edge Functions إن اخترنا (أ). **بدون هذا القرار لا يُكتب كود.**

### المرحلة 1 — الأساس: المفاتيح + AI Gateway + لوحة الإدارة (أعلى أولوية)
هذا العمود الذي يقوم عليه كل ما بعده.
1. migration للجدولين `ai_providers` + `ai_feature_config` + `ai_usage_log`.
2. `lib/ai-gateway.js`: دوال `complete()` / `embed()` / `image()`، قراءة المزوّد النشط من `ai_feature_config`، فكّ تشفير المفتاح، fallback، تسجيل الاستهلاك. محوِّلات لـ OpenAI أولاً ثم Anthropic وGoogle.
3. إجراءات إدارية على `notify-order.js`: `?action=ai-save-provider`، `ai-list-providers` (يعرض آخر 4 أرقام فقط)، `ai-set-feature`. كلها خلف `x-admin-token` + دور المشرف الأعلى.
4. تبويب إداري جديد: إضافة `["ai","sparkles","إدارة الذكاء الاصطناعي"]` إلى `adminItems` (app.js ≈ 2356) + دالة `adminAI()` في خريطة `renderAdmin()` (≈ 4064): إدخال مفاتيح، اختيار المزوّد لكل ميزة، عرض حالة/استهلاك كل ميزة.
5. **إعادة توجيه** `aiReply()` و`enhance-image.js` للنداء عبر البوابة (تحويل الموجود لأصل).
- المخاطر: التشفير، وتسرّب المفاتيح في الواجهة (يُمنع بإظهار 4 أرقام فقط).

### المرحلة 2 — قاعدة المعرفة (RAG) — العمود الفقري حسب الوثيقة
1. `create extension vector` + migration للجدولين `knowledge_documents` + `knowledge_chunks` (apply_migration).
2. **Edge Function `ingest-knowledge`** (الخيار أ): رفع ملف → `Supabase Storage` → استخراج نص (txt مباشرة؛ docx عبر مكتبة استخراج) → تقطيع 300–800 كلمة بتداخل → `aiGateway.embed()` → تخزين المقاطع ومتجهاتها. الحالة `processing→ready/failed`.
3. **الاسترجاع** داخل `aiReply()` في `notify-order.js`: تحويل سؤال العميل لمتجه → similarity search (أعلى 3–5 مقاطع) مع احترام النطاق (عام + متجر العميل فقط) → حقن المقاطع في `system context` مع تعليمة صريحة: «اعتمد على هذه المعلومات فقط، وإن لم تجد فاعتذر/صعّد» (منع hallucination).
4. واجهة `adminAI()` فرع «التدريب»: رفع/قائمة الملفات وحالتها، تصنيف عام/متجر، حذف (cascade)، إضافة معرفة نصية مباشرة، **حقل اختبار** يُظهر المقاطع المسترجَعة والرد قبل الاعتماد، ومؤشر حجم القاعدة.
- المخاطر: prompt injection من محتوى الملفات (يُعامَل كبيانات لا أوامر)، اختيار نموذج embeddings يدعم العربية، تكلفة الـembedding (مرة واحدة عند الرفع).

### المرحلة 3 — ترقية الرد الآلي على واتساب
بما أن الأساس موجود، هذه ترقية لا بناء جديد:
1. **سياق لكل متجر**: استبدال `AI_SYSTEM` العام بسياق ديناميكي (بيانات المتجر + المنتجات المتوفّرة + سياسات التوصيل) + مقاطع المعرفة المسترجَعة (المرحلة 2).
2. **تصعيد بشري ممنهج**: عند طلب العميل إنساناً أو ثقة منخفضة → تحويل المحادثة لطابور المراجعة + تنبيه المتجر (نبني فوق صندوق الوارد الموجود).
3. **مفتاح تشغيل/إيقاف لكل متجر** + حدود أمان (لا يؤكّد سعراً/طلباً نهائياً ذاتياً).

### المرحلة 4 — المترادفات
1. migration `product_synonyms`.
2. **توليد** (Edge Function أو إجراء مجدول): سحب أسماء المنتجات → `aiGateway.complete(synonym_generation)` يولّد مرادفات باللهجات (شامية/خليجية/مصرية/مغاربية/عراقية).
3. **الدمج في البحث**: الأبسط لهذا المشروع — تحميل مصفوفة المرادفات مع الكتالوج ومطابقتها **في الواجهة** ضمن منطق البحث الحالي (`app.js`). البديل الخلفي: PostgreSQL FTS أو `pg_trgm`.
4. ضوابط: مراجعة بشرية اختيارية + إضافة/حذف يدوي + توليد تلقائي عند إضافة منتج.

### المرحلة 5 — ترقية تحسين الصور
ترقية `enhance-image.js` الموجودة:
1. توجيه عبر البوابة (`image_enhancement`) لإتاحة تبديل المزوّد (OpenAI/Replicate).
2. معالجة **غير متزامنة** عبر طابور (Edge Function/queue) كي لا تُبطئ الرفع.
3. **تخزين مزدوج** (أصلي + محسّن) + قبول/رفض النسخة قبل النشر + حدود حسب الباقة.

### عبر كل المراحل (متطلبات عامة)
- لوحة القسم تعرض حالة كل ميزة + المزوّد المربوط + الاستهلاك (`ai_usage_log`).
- الوصول للقسم **مقصور على المشرف الأعلى** (مفاتيح حساسة).
- توثيق: إضافة ميزة جديدة = سجل في `ai_feature_config` + ربطها بالبوابة، دون لمس الميزات القائمة.
- رفع `?v=` في `index.html` مع كل دفعة واجهة (نمط المشروع).

---

## 6. ترتيب التنفيذ الموصى به

```
المرحلة 0 (قرار الدوال) ──► 1 (الأساس/البوابة) ──┬──► 2 (RAG) ──► 3 (واتساب)
                                                  ├──► 4 (المترادفات)
                                                  └──► 5 (الصور)
```
المرحلة 1 إلزامية أولاً (كل شيء يمرّ عبر البوابة). ثم 2+3 معاً (توصية الوثيقة: التدريب عمود الواتساب). و4 و5 مستقلّتان وقابلتان للتوازي بعد الأساس.

---

## 7. ملخص القرارات المطلوبة منك قبل كتابة الكود
1. **قيد الدوال**: أيّ خيار (أ Edge Functions / ب دمج+`ai.js` / ج ترقية Pro)؟
2. **التشفير**: `KEY_ENCRYPTION_SECRET` على مستوى التطبيق أم Supabase Vault؟
3. **المزوّدون**: نبدأ بـ OpenAI فقط في البوابة ثم نضيف Anthropic/Google، أم نجهّز الثلاثة فوراً؟
4. **نقطة الانطلاق الفعلية**: المرحلة 1 (الأساس) كما هو موصى، أم تريد إثبات مفهوم سريع لميزة واحدة أولاً؟
