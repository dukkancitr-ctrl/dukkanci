# تفعيل إشعارات واتساب لطلبات دكانجي

الهدف: عند إنشاء أي طلب، يُرسَل من **رقم المنصة** (رقم واتساب واحد تملكه دكانجي عبر WhatsApp Cloud API من Meta):

1. رسالة **للمتجر** بتفاصيل الطلب.
2. رسالة **للزبون** تؤكّد استلام طلبه.

البنية البرمجية جاهزة في الكود. كل ما تبقّى هو **تفعيل الرقم وربطه** وضبط المتغيّرات. حتى تفعله، يعمل الموقع طبيعياً والإشعارات معطّلة تلقائياً (`skipped`).

---

## المكوّنات في الكود (جاهزة)

| الملف | الوظيفة |
|---|---|
| `api/notify-order.js` | يرسل رسالتي الطلب (للمتجر + للزبون) عبر Cloud API. يعمل no-op حتى تُضبط المتغيّرات. |
| `api/notify-order.js` (GET) | يعمل أيضاً كنقطة Webhook للتحقق من الرقم واستقبال حالات التسليم (دُمج لتقليل عدد الدوال — حدّ Hobby 12 دالة). |
| `app.js` → `notifyOrderWhatsapp()` | يُستدعى بعد حفظ الطلب مباشرة (fire-and-forget، لا يعطّل الطلب). |

---

## خطوات التفعيل (مرّة واحدة)

### 1) إنشاء تطبيق Meta + WhatsApp
- ادخل إلى <https://developers.facebook.com/> → **My Apps** → **Create App** → نوع **Business**.
- أضف منتج **WhatsApp** للتطبيق.
- من **WhatsApp > API Setup** ستجد:
  - **Phone number ID** → ضعه في `WHATSAPP_PHONE_NUMBER_ID`.
  - **Temporary access token** (صالح 24 ساعة، للتجربة فقط).

### 2) ربط رقم واتساب حقيقي
- في **API Setup** اضغط **Add phone number** وأضف رقم دكانجي (رقم لم يُستخدم على تطبيق واتساب عادي).
- أكمل التحقق برمز SMS/مكالمة.
- هذا هو "رقم المنصة" الذي ستصل منه كل الإشعارات.

### 3) توكن دائم (مهم جداً)
التوكن المؤقت ينتهي خلال 24 ساعة. للإنتاج أنشئ توكن دائم:
- <https://business.facebook.com/> → **Business Settings** → **Users > System Users** → أنشئ System User.
- امنحه صلاحية على التطبيق (Assets) ودور **Admin/Employee**.
- **Generate New Token** → اختر التطبيق → فعّل صلاحيات: `whatsapp_business_messaging` و `whatsapp_business_management`.
- انسخ التوكن → `WHATSAPP_TOKEN`.

### 4) إنشاء قوالب الرسائل (Templates)
لأن المتجر/الزبون لم يراسلا الرقم خلال آخر 24 ساعة، **يجب** استخدام قوالب معتمدة.
من **WhatsApp > Message Templates > Create Template** (الفئة: **Utility**، اللغة: العربية `ar`):

**قالب المتجر** — الاسم مثلاً `order_store_alert`، نص الجسم:
```
🛒 طلب جديد على دكانجي
رقم الطلب: {{1}}
الزبون: {{2}}
الهاتف: {{3}}
الإجمالي: {{4}}
الاستلام: {{5}}
المنتجات: {{6}}
```
ضع اسمه في `WHATSAPP_TEMPLATE_STORE`. (6 متغيّرات بالترتيب أعلاه.)

**قالب الزبون** — الاسم مثلاً `order_customer_ack`، نص الجسم:
```
✅ تم استلام طلبك على دكانجي
رقم الطلب: {{1}}
المتجر: {{2}}
الإجمالي: {{3}}
سنعلمك فور تأكيد المتجر. شكراً لاستخدامك دكانجي 🛍️
```
ضع اسمه في `WHATSAPP_TEMPLATE_CUSTOMER`. (3 متغيّرات بالترتيب.)

> الترتيب وعدد المتغيّرات يجب أن يطابق ما في `api/notify-order.js` تماماً. القوالب تحتاج موافقة Meta (غالباً دقائق إلى ساعات).

### 5) ضبط المتغيّرات في Vercel
من **Vercel > Project > Settings > Environment Variables** أضف:
```
WHATSAPP_TOKEN=<التوكن الدائم>
WHATSAPP_PHONE_NUMBER_ID=<من API Setup>
WHATSAPP_API_VERSION=v21.0
WHATSAPP_DEFAULT_COUNTRY_CODE=90
WHATSAPP_TEMPLATE_STORE=order_store_alert
WHATSAPP_TEMPLATE_CUSTOMER=order_customer_ack
WHATSAPP_TEMPLATE_LANG=ar
WHATSAPP_VERIFY_TOKEN=<أي نص عشوائي>
```
ثم أعد النشر (Redeploy).

### 6) ربط الـ Webhook (لتأكيد الرقم وحالات التسليم)
- من **WhatsApp > Configuration > Webhook** → **Edit**:
  - **Callback URL**: `https://www.dukkanci.com.tr/api/notify-order`
  - **Verify token**: نفس قيمة `WHATSAPP_VERIFY_TOKEN`.
- اضغط **Verify and Save** ثم **Subscribe** لحقلي `messages` و`message_template_status_update`.

---

## الاختبار

بعد ضبط المتغيّرات والنشر، نفّذ طلب POST تجريبي:
```bash
curl -X POST https://www.dukkanci.com.tr/api/notify-order \
  -H "Content-Type: application/json" \
  -d '{"id":"DK-TEST1","storeId":1,"customer":"تجربة","customerPhone":"+90 555 000 00 00","total":250,"fulfillment":"delivery","address":"عنوان تجريبي","payment":"الدفع عند الاستلام","lineItems":[{"name":"منتج","qty":2}]}'
```
- استجابة `{"skipped":true}` تعني أن المتغيّرات غير مضبوطة بعد.
- استجابة فيها `results.store` و`results.customer` بـ `ok:true` تعني نجاح الإرسال.
- ضع رقم هاتفك في `customerPhone` لرؤية الرسالة فعلياً.

ثم جرّب طلباً حقيقياً من الموقع — سيُستدعى `/api/notify-order` تلقائياً.

---

## ملاحظات

- **التكلفة**: Cloud API يتيح ألف محادثة Utility مجاناً شهرياً تقريباً، ثم بسعر لكل محادثة (يختلف حسب الدولة).
- **رقم المتجر**: يُؤخذ من حقل `whatsapp` أو `phone` في جدول `stores` (لا يُؤخذ من المتصفح، لأسباب أمنية).
- **بديل أكثر موثوقية للتشغيل**: بدل الاستدعاء من المتصفح، يمكن إنشاء **Supabase Database Webhook** على `INSERT` في جدول `orders` يستدعي `/api/notify-order` ويمرّر `NOTIFY_SECRET` في ترويسة `x-notify-secret`. الكود يقبل الشكلين.
- **إشعار تغيّر الحالة لاحقاً**: لإرسال رسالة للزبون عند "تم القبول/خرج للتوصيل"، استدعِ نفس المنطق من مكان تحديث الحالة في لوحة التاجر (يمكن توسيعه لاحقاً).
