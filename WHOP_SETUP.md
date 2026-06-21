# ربط اشتراك Whop بمتاجر دكانجي

تكامل يفعّل رابط دفع Whop لإضافة متجر (تجربة مجانية ٧ أيام ثم اشتراك شهري)، ويتحكّم
بتشغيل/إيقاف المتجر **حسب حالة الاشتراك الحيّة في Whop**، ويرسل رسالة تجديد عبر واتساب
عند الانتهاء.

رابط الدفع: <https://whop.com/dukkanci/dukkanci-store-subscription/>

---

## كيف يعمل التدفق

1. التاجر يفتح رابط Whop ويبدأ التجربة المجانية (٧ أيام) ثم يدفع شهرياً (٢٬٤٩٩ ل.ت).
2. عند بدء التجربة أو نجاح الدفع، يرسل Whop حدث `membership.went_valid` إلى
   `‎/api/notify-order?action=whop` → يُفعَّل المتجر (`subscription_active = true`)
   ويُحفظ تاريخ انتهاء الفترة (`current_period_end`).
3. التاجر يُحوَّل بعد الدفع إلى لوحة المتجر ليبنيه (الرابط يُضبط في Whop، انظر أدناه).
4. ما دام الاشتراك صالحاً في Whop يبقى المتجر يستقبل الطلبات. عند الإلغاء أو فشل
   التجديد يرسل Whop `membership.went_invalid` → يتوقف المتجر عن استقبال الطلبات
   الجديدة (يبقى ظاهراً) وتُرسل رسالة تجديد عبر واتساب.
5. مهمة يومية (Vercel Cron) تعمل كشبكة أمان: تُغلق أي متجر انتهت فترته دون وصول حدث
   من Whop وترسل رسالة التجديد مرة واحدة.

> **ملاحظة عن «٣٧ يوماً»:** اشتراك Whop متجدّد شهرياً، لذا يبقى المتجر مفتوحاً ما دام
> الدفع مستمراً (وليس ٣٧ يوماً ثابتة). إن لم يجدّد التاجر بعد أول شهر، تكون المدة
> الفعلية ٧ أيام تجربة + ٣٠ يوم دفعة واحدة = ٣٧ يوماً ثم يتوقف. وإذا لم يرسل Whop
> تاريخ تجديد، يستخدم النظام ٣٧ يوماً كقيمة احتياطية.

---

## ١) متغيّرات البيئة في Vercel

أضِفها في Vercel → Project → Settings → Environment Variables ثم أعد النشر:

| المتغيّر | لازم؟ | القيمة |
|---|---|---|
| `WHOP_WEBHOOK_SECRET` | **نعم** | سر التوقيع `whsec_…` من لوحة Whop (الخطوة ٢). |
| `WHOP_CHECKOUT_URL` | اختياري | رابط الدفع. الافتراضي هو رابط دكانجي أعلاه. |
| `CRON_SECRET` | **نعم** | أي سلسلة عشوائية طويلة. يحمي مهمة Cron (يرسلها Vercel تلقائياً كـ `Authorization: Bearer`). |
| `WHATSAPP_TEMPLATE_RENEWAL` | اختياري | اسم قالب واتساب للتجديد. الافتراضي `subscription_renewal`. |
| `SUPABASE_SERVICE_ROLE_KEY` | **نعم** | مفتاح service_role (مضبوط مسبقاً لعمل لوحة الإدارة). يلزم لكتابة حالة الاشتراك. |
| `WHATSAPP_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID` | لرسالة واتساب | مضبوطة مسبقاً لإشعارات الطلبات. |

---

## ٢) إعداد Webhook في Whop

1. لوحة Whop → **Developer → Webhooks → Create**.
2. **URL**: `https://www.dukkanci.com.tr/api/notify-order?action=whop`
3. فعّل الأحداث:
   - `membership.went_valid`
   - `membership.went_invalid`
   - (اختياري) `payment.succeeded`
4. احفظ، وانسخ **Webhook Secret** (`whsec_…`) إلى `WHOP_WEBHOOK_SECRET` في Vercel.

التوقيع يُتحقَّق منه بمعيار Standard Webhooks (نفس آلية Supabase Send-SMS المستخدمة
في المشروع)، فأي طلب غير موقّع يُرفض (401).

---

## ٣) تحويل التاجر بعد الدفع إلى بناء متجره

في إعداد المنتج على Whop:

- **Redirect / After-purchase URL**: `https://www.dukkanci.com.tr/#merchant`

التاجر يسجّل الدخول للوحة المتجر بنفس **رقم واتساب** متجره (أو Google)، فيُربط
بمتجره ويبدأ البناء.

### كيف يُربط الاشتراك بالمتجر الصحيح؟

عند وصول الحدث، يبحث النظام عن المتجر بالترتيب:

1. `metadata.store_id` المُمرَّر في الـ checkout (الأدق — استخدمه إن أمكن تمرير
   `store_id` كميتاداتا في رابط Whop).
2. متجر مرتبط مسبقاً بنفس `whop_membership_id`.
3. تطابق البريد: `stores.subscription_email` ثم `stores.email` مع بريد حساب Whop.

> لضمان الربط، اجعل بريد التاجر في دكانجي (`email` أو `subscription_email`) مطابقاً
> لبريد حسابه في Whop. إن لم يوجد متجر بعد، يُحفظ الاشتراك في جدول
> `whop_subscriptions` ويُربط لاحقاً عند تطابق البريد/الميتاداتا.

---

## ٤) قالب واتساب لرسالة التجديد

الرسائل المرسلة من النشاط خارج نافذة الـ ٢٤ ساعة تتطلّب قالباً معتمداً من Meta.

أنشئ قالباً في WhatsApp Manager:

- **الاسم**: `subscription_renewal` (أو غيّره عبر `WHATSAPP_TEMPLATE_RENEWAL`)
- **التصنيف**: Utility
- **اللغة**: العربية (`ar`)
- **المتن** (وسيطان):
  ```
  مرحباً {{1}}، انتهى اشتراك متجرك على دكانجي وتوقّف استقبال الطلبات الجديدة. جدّد اشتراكك الآن ليعود متجرك للعمل: {{2}}
  ```
  - `{{1}}` = اسم المتجر، `{{2}}` = رابط التجديد (Whop).

قبل اعتماد القالب، تصل الرسالة فقط إذا راسل المتجرُ الرقمَ خلال آخر ٢٤ ساعة (للاختبار).

---

## ٥) المهمة المجدولة (Cron)

مضافة في `vercel.json`:

```json
"crons": [{ "path": "/api/notify-order?action=subscription-cron", "schedule": "0 6 * * *" }]
```

تعمل يومياً ٠٦:٠٠ بتوقيت UTC. تتطلّب ضبط `CRON_SECRET`. لتشغيلها يدوياً (اختبار):

```
GET https://www.dukkanci.com.tr/api/notify-order?action=subscription-cron&secret=<NOTIFY_SECRET>
```

أو بترويسة `Authorization: Bearer <CRON_SECRET>`.

---

## ٦) قاعدة البيانات

طُبّقت ترحيلة `whop_subscription_tracking`:

- أعمدة جديدة في `stores`: `subscription_status`, `subscription_active`,
  `trial_ends_at`, `current_period_end`, `whop_membership_id`, `whop_plan_id`,
  `subscription_email`, `renewal_notified_at`.
- جدول `whop_subscriptions` (سجل عضويات Whop المرجعي — يكتبه مفتاح service_role فقط).

المتاجر الـ ٤٥ الحالية تبقى مفعّلة (`subscription_active = true` افتراضياً) ولا تتأثر
بالمهمة المجدولة لأن `current_period_end` لديها فارغ.

---

## ٧) اختبار سريع

1. من Whop → Webhooks → **Send test event** لـ `membership.went_valid`، وتأكّد أن
   الاستجابة `200` وأن صفًّا ظهر في `whop_subscriptions`.
2. أنشئ اشتراكاً حقيقياً ببريد يطابق متجراً تجريبياً، وتحقّق أن
   `stores.subscription_active = true` و`current_period_end` مضبوط.
3. أرسل `membership.went_invalid` (أو ألغِ الاشتراك)، وتحقّق أن المتجر توقّف عن
   استقبال الطلبات ووصلت رسالة واتساب التجديد.
4. في لوحة المتجر → تبويب «الاشتراك»: تظهر الحالة والتاريخ الحقيقيان وزر التجديد
   يفتح رابط Whop.
