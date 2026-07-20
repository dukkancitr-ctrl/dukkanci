import 'package:flutter/foundation.dart';

import '../../../core/api/api_client.dart';
import '../../../core/errors/failure.dart';
import '../domain/app_notification.dart';

/// طبقة الشبكة الوحيدة لنقطة `/api/notifications`.
///
/// النقطة تتبع نفس أسلوب بقية الباك-إند: مسار واحد + `?action=` في مسار
/// الطلب لا في خريطة `queryParameters` (نفس ما يفعله `AuthRepository` مع
/// `/api/notify-order?action=send-order-otp`)، وكلها POST بجسم JSON.
///
/// **سياسة الأخطاء مقصودة ومختلفة بين النداءات:**
/// - `register-device` / `cart-sync` / `cart-converted` / `set-prefs`
///   نداءات خلفية لا يطلبها المستخدم صراحةً — تفشل بصمت (سجل فقط) فلا يرى
///   الزبون رسالة خطأ عن شيء لم يطلبه أصلاً، ولا تتعطّل السلة أو الطلب لأن
///   خدمة إشعارات لم تستجب.
/// - `inbox` وحده يرمي [Failure] لأن له شاشة حقيقية تعرض
///   `AppErrorView` بزر إعادة محاولة — ابتلاع خطئه كان سيعني قائمة فارغة
///   كاذبة تبدو كـ«لا توجد إشعارات».
class NotificationRepository {
  NotificationRepository(this._api);

  final ApiClient _api;

  static String _endpoint(String action) => '/api/notifications?action=$action';

  /// يسجّل هذا التثبيت (device_uid) لدى الخادم. يُستدعى عند إقلاع التطبيق،
  /// ومجدداً كلما عُرف رقم هاتف الزبون أو وصل توكن FCM جديد.
  Future<void> registerDevice({
    required String deviceUid,
    required String platform,
    String? pushChannel,
    String? pushToken,
    String? customerPhone,
    String? appVersion,
    bool? notificationsEnabled,
  }) async {
    await _fireAndForget('register-device', {
      'device_uid': deviceUid,
      'platform': platform,
      'push_channel': ?pushChannel,
      if (pushToken != null && pushToken.isNotEmpty) 'push_token': pushToken,
      if (customerPhone != null && customerPhone.isNotEmpty) 'customer_phone': customerPhone,
      if (appVersion != null && appVersion.isNotEmpty) 'app_version': appVersion,
      'locale': 'ar',
      'notifications_enabled': ?notificationsEnabled,
    });
  }

  /// لقطة **ملخّصة** عن السلة الحالية (سلة متروكة).
  ///
  /// ⚠️ [itemNames] أسماء منتجات فقط. الخيارات والإضافات وملاحظات الزبون
  /// **لا تُرسل إطلاقاً** — قرار خصوصية متعمَّد، لا سهو: ما يحتاجه تذكير
  /// السلة المتروكة هو «ماذا كان في السلة وبكم»، لا تفاصيل ما طلبه الزبون
  /// بالضبط. لا تُوسّع هذه الحمولة دون قرار خصوصية صريح.
  ///
  /// يُرسَل [itemCount] بقيمة `0` عند إفراغ السلة كي يعرف الخادم أنه لم يعد
  /// هناك ما يُذكَّر به.
  Future<void> syncCart({
    required String deviceUid,
    required int storeId,
    required String storeName,
    required int itemCount,
    required double subtotal,
    required List<String> itemNames,
    String? customerPhone,
  }) async {
    await _fireAndForget('cart-sync', {
      'device_uid': deviceUid,
      'store_id': storeId,
      'store_name': storeName,
      'item_count': itemCount,
      'subtotal': subtotal,
      'item_names': itemNames,
      if (customerPhone != null && customerPhone.isNotEmpty) 'customer_phone': customerPhone,
    });
  }

  /// السلة تحوّلت إلى طلب فعلي — يُستدعى مباشرة بعد نجاح إرسال الطلب حتى لا
  /// يصل الزبون تذكير بسلة اشترى منها بالفعل.
  Future<void> cartConverted({required String deviceUid}) async {
    await _fireAndForget('cart-converted', {'device_uid': deviceUid});
  }

  /// صندوق الإشعارات. يرمي [Failure] عند الفشل (انظر سياسة الأخطاء أعلاه).
  Future<NotificationInbox> fetchInbox({
    required String deviceUid,
    String? customerPhone,
    int limit = 50,
  }) async {
    try {
      final res = await _api.post<Object?>(
        _endpoint('inbox'),
        data: {
          'device_uid': deviceUid,
          if (customerPhone != null && customerPhone.isNotEmpty) 'customer_phone': customerPhone,
          'limit': limit,
        },
        parse: (json) => json,
      );
      return NotificationInbox.fromResponse(res);
    } catch (e, st) {
      debugPrint('NotificationRepository.fetchInbox failed: $e\n$st');
      throw Failure.network();
    }
  }

  /// يعلّم إشعارات بعينها كمقروءة، أو **كلها** حين يُترك [ids] فارغاً/`null`
  /// (هكذا يعرّف العقد الفرق: حذف الحقل = الكل).
  ///
  /// يُعيد عدّاد غير المقروء الجديد من الخادم، أو `null` إن تعذّر النداء —
  /// المستدعي يبقي عندها على تقديره المتفائل بدل الكتابة فوقه بصفر كاذب.
  Future<int?> markRead({required String deviceUid, List<int>? ids}) async {
    try {
      final res = await _api.post<Object?>(
        _endpoint('mark-read'),
        data: {
          'device_uid': deviceUid,
          if (ids != null && ids.isNotEmpty) 'ids': ids,
        },
        parse: (json) => json,
      );
      if (res is Map) {
        final unread = res['unread'];
        if (unread is num) return unread.toInt();
        if (unread is String) return int.tryParse(unread.trim());
      }
      return null;
    } catch (e, st) {
      debugPrint('NotificationRepository.markRead failed: $e\n$st');
      return null;
    }
  }

  /// تفضيلات الإشعارات. [promoOptOut] مدعوم في العقد ومنفَّذ هنا بالكامل،
  /// لكن لا واجهة له بعد — الشاشة تعرض مفتاح [notificationsEnabled] فقط.
  Future<void> setPrefs({
    required String deviceUid,
    bool? notificationsEnabled,
    bool? promoOptOut,
  }) async {
    await _fireAndForget('set-prefs', {
      'device_uid': deviceUid,
      'notifications_enabled': ?notificationsEnabled,
      'promo_opt_out': ?promoOptOut,
    });
  }

  Future<void> _fireAndForget(String action, Map<String, dynamic> body) async {
    try {
      await _api.post<void>(_endpoint(action), data: body);
    } catch (e) {
      debugPrint('NotificationRepository.$action ignored: $e');
    }
  }
}
