import 'dart:io' show Platform;

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:uuid/uuid.dart';

import '../../../app/providers.dart';
import '../../../core/cache/local_cache.dart';
import '../../cart/application/cart_controller.dart' show localCacheProvider;
import 'notification_repository.dart';

/// يملك هوية هذا التثبيت لدى خادم الإشعارات، ويسجّلها.
///
/// المعرّف (`device_uid`) يُولَّد **مرة واحدة فقط** بـUUID v4 عند أول حاجة
/// إليه، ثم يُحفظ في SharedPreferences ويُعاد استخدامه في كل نداء بعدها.
/// توليده من جديد في كل إقلاع كان سيُنتج جهازاً «جديداً» في كل مرة، فيتضاعف
/// الجدول على الخادم وتضيع كل سلة متروكة وكل إشعار سابق.
class DeviceRegistrar {
  DeviceRegistrar(this._cache, this._repo);

  final LocalCache _cache;
  final NotificationRepository _repo;

  static const _uuid = Uuid();

  String? _cachedUid;
  Future<String>? _pendingUid;

  /// معرّف التثبيت الثابت. آمن للاستدعاء المتوازي: نداءان متزامنان قبل أول
  /// حفظ يشتركان في نفس الـFuture بدل أن يولّد كلٌّ منهما معرّفاً مختلفاً
  /// ويكتب فوق الآخر.
  Future<String> deviceUid() {
    final cached = _cachedUid ?? _cache.deviceUid;
    if (cached != null && cached.isNotEmpty) {
      _cachedUid = cached;
      return Future.value(cached);
    }
    return _pendingUid ??= _generateAndStore();
  }

  Future<String> _generateAndStore() async {
    final generated = _uuid.v4();
    await _cache.setDeviceUid(generated);
    _cachedUid = generated;
    _pendingUid = null;
    return generated;
  }

  /// `android` أو `ios` — العقد يقبل الاثنين، والمشروع يُبنى لأندرويد أولاً
  /// لكن نفس الشيفرة تعمل على iOS بلا تعديل.
  static String get platform => Platform.isIOS ? 'ios' : 'android';

  /// إصدار التطبيق كما يراه المتجر (`1.0.0+1`). فشل قراءته لا يمنع التسجيل —
  /// الحقل اختياري في العقد.
  static Future<String?> appVersion() async {
    try {
      final info = await PackageInfo.fromPlatform();
      return '${info.version}+${info.buildNumber}';
    } catch (e) {
      debugPrint('DeviceRegistrar.appVersion unavailable: $e');
      return null;
    }
  }

  /// يسجّل الجهاز لدى الخادم.
  ///
  /// يُستدعى في ثلاث لحظات:
  /// 1. إقلاع التطبيق (شاشة البداية) — بالهاتف المحفوظ إن وُجد.
  /// 2. بعد إتمام طلب — عندها صار رقم الزبون معروفاً ومُتحقَّقاً منه.
  /// 3. عند تفعيل FCM ووصول توكن (انظر fcm_adapter.dart) — وهو المسار
  ///    الخامل حالياً.
  ///
  /// `notifications_enabled` يُقرأ من نفس علم [LocalCache.notificationsEnabled]
  /// الذي يتحكم به المستخدم من شاشة الإشعارات — مصدر حقيقة واحد، بلا نسخة
  /// ثانية على الجهاز.
  /// **لا ترمي أبداً.** كل مستدعياتها نداءات خلفية غير منتظَرة
  /// (`unawaited`)، ورمي استثناء منها كان سينتهي كخطأ غير ملتقَط في المنطقة
  /// غير المتزامنة بدل أن يُبتلع بهدوء.
  Future<void> register({
    String? customerPhone,
    String? pushChannel,
    String? pushToken,
  }) async {
    try {
      final uid = await deviceUid();
      await _repo.registerDevice(
        deviceUid: uid,
        platform: platform,
        pushChannel: pushChannel,
        pushToken: pushToken,
        customerPhone: customerPhone,
        appVersion: await appVersion(),
        notificationsEnabled: _cache.notificationsEnabled,
      );
    } catch (e, st) {
      debugPrint('DeviceRegistrar.register ignored: $e\n$st');
    }
  }
}

final notificationRepositoryProvider = Provider<NotificationRepository>((ref) {
  return NotificationRepository(ref.read(apiClientProvider));
});

final deviceRegistrarProvider = Provider<DeviceRegistrar>((ref) {
  return DeviceRegistrar(ref.read(localCacheProvider), ref.read(notificationRepositoryProvider));
});
