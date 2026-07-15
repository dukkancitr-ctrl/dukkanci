# دكانجي — تطبيق العملاء (Flutter، v2)

هذا مشروع Flutter أصلي مستقل لتطبيق عملاء دكانجي على أندرويد، مبني حسب
[`docs/تطبيق-اندرويد-Flutter-متطلبات.md`](../docs/تطبيق-اندرويد-Flutter-متطلبات.md)
(المواصفات الكاملة + تعديل حصر اللغة بالعربية RTL فقط).

**هذا تطبيق v2 يُبنى بالتوازي مع تطبيق Capacitor الحالي (v1) في `android/`
و`ios/` بجذر المستودع — لم يُلمس أي منهما، ولا يزال v1 يعمل وينشر كالمعتاد.**
لا تحذف `android/`/`ios/`/`capacitor.config.json`/`www-shell/` بجذر المستودع؛
هذا مشروع منفصل بالكامل في مجلده الخاص.

## الحالة الحالية — ما هو حقيقي وما هو مبدئي

✅ **جاهز وحقيقي (ليس بيانات وهمية):**
- الهيكل الكامل (`lib/core/*`, `lib/features/*`) حسب البنية المطلوبة في قسم 29.
- قراءة المتاجر/المنتجات **مباشرة من Supabase** (نفس قاعدة بيانات الموقع الحي، نفس RLS) — انظر تعليق `core/api/supabase_bootstrap.dart` لفهم لماذا لا يوجد `/api/v1` نظيف بعد.
- قاعدة "سلة من متجر واحد فقط" مطبَّقة بالكامل مع نافذة التعارض من قسم 14.
- تدفق الطلب الكامل: عنوان → دفع → OTP واتساب (نفس آلية الموقع، وليس OTP عام) → إرسال مزدوج (INSERT مباشر + إشعار واتساب) — انظر تعليق `OrderRepository` حول حادثة فقدان الطلبات الحقيقية الموثَّقة في CLAUDE.md.
- `compileSdk`/`targetSdk` **36**، `minSdk` **24**، AGP 9.0.1، NDK 28.2 (يدعم 16KB page size) — كلها افتراضية من Flutter 3.44.6 الحالي، لم تحتج تعديلاً يدوياً.
- شعار وأيقونة التطبيق الحقيقيان (`resources/icon.png`) مولَّدان عبر `flutter_launcher_icons`.
- خط IBM Plex Sans Arabic الحقيقي (نفس خط الموقع) مُضمَّن.
- RTL كامل، عربي فقط، بلا أي شاشة اختيار لغة.
- **بُني وتحقّق فعلياً بـ`flutter build apk --debug` على هذا الجهاز** (Android SDK/JDK 21 من Android Studio الموجودَين مسبقاً) — ليس مجرد كود لم يُختبر تجميعه.

⚠️ **مبدئي / يحتاج إكمالاً (موثَّق بتعليق `TODO`/class doc في كل ملف):**
- `LocationPickerScreen`: يطلب الموقع الحالي فعلياً (permission while-in-use فقط، لا خلفية أبداً) لكن لا يوجد بعد Reverse Geocoding ولا قائمة مناطق يدوية حقيقية.
- `FavoritesController`: محلي داخل الجلسة الحالية فقط (لا يوجد `/favorites` API بعد).
- لا يوجد بعد شريط أقسام "قفز مباشر" في صفحة المتجر (قسم 12) — قائمة مجمّعة بالفئة فقط حالياً.
- لا Firebase (push/crashlytics/analytics) مُفعَّل بعد — يحتاج مشروع Firebase حقيقي (انظر أدناه).
- لا مفتاح خرائط جوجل مضبوط بعد (يحتاج مفتاح Android منفصل، انظر أدناه).
- لا توقيع Release حقيقي (debug keystore فقط حالياً، كإعداد Flutter الافتراضي).
- عدد قليل من شاشات المواصفات (الدعم الكامل بتذاكر، الكوبونات، المقارنة...) مبسَّطة عمداً لهذه الدفعة الأولى.

## البنية

```
lib/
  app/            # الودجة الجذرية + الشل السفلي (5 تبويبات) + مزوّدات Riverpod
  core/
    api/          # Dio (الباك-إند الحالي) + Supabase bootstrap
    auth/         # OTP واتساب (دخول + تأكيد طلب)
    cache/        # SharedPreferences (غير حساس) + flutter_secure_storage (توكنات)
    config/       # بيئات dev/staging/prod عبر --dart-define
    errors/       # Failure موحّد + أكواد الأخطاء من قسم 27
    localization/ # كل النصوص العربية في مكان واحد (بلا .arb، عربي فقط)
    routing/      # go_router + مسارات Deep Link
    theme/        # ألوان/خطوط دكانجي (منسوخة من styles.css)
  features/       # كل ميزة: data/domain/application/presentation
```

## التشغيل محلياً

```powershell
cd dukkanci_customer_app
flutter pub get
flutter run --dart-define=ENV=dev
```

القيم الافتراضية في `core/config/app_config.dart` تشير فعلاً لموقع/قاعدة
بيانات دكانجي الحيّة (نفس القيم العامة المُضمَّنة أصلاً في `supabase-config.js`
بجذر الموقع) — يعمل التطبيق فوراً بلا أي إعداد إضافي للقراءة، لكن الكتابة
(الطلبات، OTP) تحتاج الباك-إند الحي فعلاً على `API_BASE_URL`.

## إعدادات البيئة (dev/staging/prod)

```powershell
flutter run --dart-define=ENV=staging --dart-define=API_BASE_URL=https://staging.dukkanci.com.tr
flutter build appbundle --dart-define=ENV=prod --dart-define=MAPS_API_KEY=...
```

أو عبر ملف (`--dart-define-from-file=env/prod.json`) — أنشئ `env/*.json` محلياً
حسب الحاجة (غير متتبَّعة في git إن احتوت قيماً حساسة لبيئة مختلفة عن dev).

## إعداد يدوي مطلوب قبل الإصدار (ليس مهمة برمجية، قرارات/حسابات خارجية)

1. **Firebase** — أنشئ مشروع Firebase باسم شركة دكانجي (وليس حساب مبرمج فردي،
   نفس تحذير قسم 30/40 في المواصفات)، أضف تطبيق Android بمعرّف `com.dukkanci.app`،
   نزّل `google-services.json` وضعه في `android/app/`، ثم أضف
   `id("com.google.gms.google-services")` في `android/app/build.gradle.kts`
   و`classpath("com.google.gms:google-services:...")` في `android/build.gradle.kts`،
   وفعّل `Firebase.initializeApp()` في `main.dart` (معلَّق حالياً بتعليق يشرح ذلك).

2. **مفتاح خرائط جوجل لأندرويد** — أنشئ مفتاح **منفصل** عن مفتاح الموقع
   (المُقيَّد بـ HTTP referrer) في Google Cloud Console، قيّده بـ:
   - اسم الحزمة `com.dukkanci.app`
   - بصمتي SHA-1 (Debug و Release)
   ثم مرّره وقت البناء: `--dart-define=MAPS_API_KEY=...` **و**
   `-PmapsApiKey=...` أو متغيّر بيئة `MAPS_API_KEY` عند تشغيل Gradle مباشرة
   (انظر `android/app/build.gradle.kts`).

3. **توقيع الإصدار (Play App Signing)** — أنشئ Keystore حقيقياً، فعّل
   Play App Signing، احتفظ بمفتاح الرفع (Upload Key) في خزنة أسرار وليس على
   جهاز مبرمج واحد (قسم 4 من المواصفات). حالياً `buildTypes.release` يوقّع
   بمفاتيح debug فقط (افتراضي Flutter) — **لا يصلح للنشر كما هو**.

4. **Android App Links** — انشر `https://www.dukkanci.com.tr/.well-known/assetlinks.json`
   ببصمة SHA-256 لتوقيع الإصدار الحقيقي قبل الاعتماد على
   `android:autoVerify="true"` في `AndroidManifest.xml` (موجود بالفعل، لكن
   بلا الملف المنشور سيعمل الرابط عبر حوار اختيار تطبيق بدل الفتح المباشر).

5. **حساب Google Play Console** باسم شركة دكانجي (25$ لمرة واحدة).

## معمارية التكامل مع الباك-إند الحالي (مهم لأي مطوّر يكمل هذا المشروع)

الموقع الحالي **لا** يملك `/api/v1` نظيفاً كما تفترض المواصفات — `app.js`
يقرأ `stores`/`products` مباشرة من Supabase بمفتاح anon محمي بـRLS، ويكتب
الطلبات بنفس الطريقة + إشعار واتساب منفصل عبر `/api/notify-order`. اتُّبع نفس
النمط هنا تماماً (`StoreRepository`, `OrderRepository`) بدل اختراع طبقة API لا
وجود لها فعلياً على الخادم. إن بنى الفريق لاحقاً `/api/v1` حقيقياً، التغيير
يقتصر على هاتين الطبقتين فقط — لا شيء أعلاهما (الشاشات، Riverpod controllers)
يحتاج تعديلاً.

## تنظيف متبقٍّ (اختياري، غير حرج)

- `flutter analyze` نظيف تماماً من أخطاء/تحذيرات (9 معلومات `info` فقط، كلها
  عن استبدال Supabase `anonKey`→`publishableKey` ومكوّن `Radio` القديم
  →`RadioGroup` الجديد — تغييرات API غير كاسرة، تستحق تحديثاً لاحقاً وليست
  عاجلة).
- إصدار `freezed` الحالي (`3.2.6-dev.1`) هو أحدث ما توفّر متوافقاً مع Dart
  3.12 وقت الكتابة — ثبّته على إصدار مستقر إذا صدر لاحقاً قبل الاعتماد على
  توليد كود Freezed فعلياً (النماذج الحالية مكتوبة يدوياً بلا Freezed عمداً
  لتفادي الاعتماد على codegen في هذه الدفعة الأولى).
