import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';

import 'device_registrar.dart';

/// 🔌 محوّل الإشعارات الفورية (FCM) — **خامل بالكامل حالياً، ولا يُستدعى من
/// أي مكان في التطبيق.**
///
/// المشروع **لا يهيّئ Firebase إطلاقاً**: لا يوجد `google-services.json`،
/// ولا `Firebase.initializeApp()` في `main.dart` (انظر التعليق الصريح هناك).
/// حزم `firebase_*` موجودة في `pubspec.yaml` منذ الدفعة الأولى لكنها بلا
/// تفعيل. هذا الملف يجهّز نقطة تفعيل **واحدة** ([FcmAdapter.activate]) كي لا
/// يحتاج تشغيل الإشعارات الفورية لاحقاً إلى إعادة كتابة أي شيء — فقط
/// الخطوات الخمس أدناه ثم استدعاء واحد.
///
/// ---
/// ## خطوات التفعيل (بالترتيب، ولا يعمل شيء قبل إتمامها كلها)
///
/// **١. أنشئ مشروع Firebase** باسم شركة دكانجي (لا حساب مبرمج فردي — نفس
///    تحذير قسم ٣٠/٤٠ من المواصفات)، وأضف تطبيق Android بمعرّف الحزمة
///    `com.dukkanci.app`.
///
/// **٢. نزّل `google-services.json`** من إعدادات المشروع وضعه في:
///    `dukkanci_customer_app/android/app/google-services.json`
///
/// **٣. أضف إضافة Gradle** في موضعين:
///    - `android/settings.gradle.kts` ضمن كتلة `plugins`:
///      `id("com.google.gms.google-services") version "4.4.2" apply false`
///    - `android/app/build.gradle.kts` ضمن كتلة `plugins`:
///      `id("com.google.gms.google-services")`
///
/// **٤. هيّئ Firebase في الإقلاع** — في `lib/main.dart`، قبل `runApp`:
///    ```dart
///    await Firebase.initializeApp();
///    ```
///    (واحذف التعليق الذي يشرح لماذا كانت معطّلة.)
///
/// **٥. استدعِ [FcmAdapter.activate] مرة واحدة** بعد تسجيل الجهاز في شاشة
///    البداية (`splash_screen.dart`، حيث يُستدعى `DeviceRegistrar.register`
///    اليوم):
///    ```dart
///    unawaited(FcmAdapter.activate(ref.read(deviceRegistrarProvider)));
///    ```
///
/// ---
/// ## ما تفعله [activate] عند التفعيل
/// تطلب إذن الإشعارات، تجلب توكن FCM، وتمرّره إلى
/// `register-device` بـ`push_channel: "fcm"` (نفس نقطة التسجيل العادية، بلا
/// نقطة ثانية)، ثم تشترك في `onTokenRefresh` كي لا يصبح التوكن قديماً بصمت
/// حين يجدّده النظام.
///
/// ## الأمان قبل التفعيل
/// استدعاؤها اليوم **آمن تماماً**: تفحص `Firebase.apps` أولاً (قراءة قائمة
/// في الذاكرة، لا تمرّ بأي قناة نظام ولا ترمي حين لا يكون Firebase مهيّأً)
/// وتخرج فوراً بـ[FcmActivation.firebaseNotInitialized] دون لمس
/// `FirebaseMessaging.instance` — وهو ما **كان** سيرمي
/// «No Firebase App '[DEFAULT]' has been created».
class FcmAdapter {
  FcmAdapter._();

  /// نقطة التفعيل الوحيدة. تُرجع سبب عدم التفعيل بدل رمي استثناء، فيستطيع
  /// المستدعي تسجيله وتجاهله.
  static Future<FcmActivation> activate(DeviceRegistrar registrar) async {
    if (!_isFirebaseReady) {
      debugPrint('FcmAdapter: Firebase غير مهيّأ — تخطّي تفعيل الإشعارات الفورية (راجع خطوات التفعيل في fcm_adapter.dart).');
      return FcmActivation.firebaseNotInitialized;
    }

    try {
      final messaging = FirebaseMessaging.instance;

      final settings = await messaging.requestPermission();
      final status = settings.authorizationStatus;
      if (status != AuthorizationStatus.authorized && status != AuthorizationStatus.provisional) {
        debugPrint('FcmAdapter: رُفض إذن الإشعارات ($status).');
        return FcmActivation.permissionDenied;
      }

      final token = await messaging.getToken();
      if (token == null || token.isEmpty) {
        debugPrint('FcmAdapter: تعذّر الحصول على توكن FCM.');
        return FcmActivation.noToken;
      }

      await registrar.register(pushChannel: 'fcm', pushToken: token);

      // النظام قد يجدّد التوكن في أي وقت؛ بلا هذا الاشتراك يبقى الخادم على
      // توكن ميت فتتوقف الإشعارات بصمت بعد أول تجديد.
      messaging.onTokenRefresh.listen(
        (refreshed) => registrar.register(pushChannel: 'fcm', pushToken: refreshed),
        onError: (Object e) => debugPrint('FcmAdapter.onTokenRefresh ignored: $e'),
      );

      return FcmActivation.activated;
    } catch (e, st) {
      // الإشعارات الفورية ميزة إضافية: أي عطل فيها لا يجوز أن يمنع إقلاع
      // التطبيق أو يُظهر خطأً للزبون.
      debugPrint('FcmAdapter.activate failed: $e\n$st');
      return FcmActivation.failed;
    }
  }

  /// `Firebase.apps` قائمة في الذاكرة يملؤها `initializeApp` فقط، فقراءتها
  /// بلا تهيئة تُعيد قائمة فارغة ولا ترمي. الـtry/catch حزام أمان إضافي لو
  /// تغيّرت هذه التفصيلة في إصدار لاحق من الحزمة.
  static bool get _isFirebaseReady {
    try {
      return Firebase.apps.isNotEmpty;
    } catch (e) {
      debugPrint('FcmAdapter: فحص Firebase.apps فشل: $e');
      return false;
    }
  }
}

/// نتيجة محاولة التفعيل — سبب صريح بدل `bool` صامت.
enum FcmActivation {
  /// Firebase غير مهيّأ (الحالة الحالية للمشروع).
  firebaseNotInitialized,

  /// المستخدم رفض إذن الإشعارات.
  permissionDenied,

  /// لم يُرجِع FCM توكناً.
  noToken,

  /// عطل غير متوقَّع (مسجَّل في debugPrint).
  failed,

  /// فُعِّل فعلاً وسُجِّل التوكن على الخادم.
  activated,
}
