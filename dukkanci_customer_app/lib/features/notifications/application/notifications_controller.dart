import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/providers.dart';
import '../../cart/application/cart_controller.dart' show localCacheProvider;
import '../data/device_registrar.dart';
import '../domain/app_notification.dart';

/// حالة صندوق الإشعارات: القائمة + عدّاد غير المقروء.
///
/// **ليس `autoDispose` عمداً:** شارة الجرس في الرئيسية تقرأ نفس المزوّد، فلو
/// تخلّص من نفسه عند مغادرة الشاشة لأعاد الجلب في كل تنقّل بين التبويبات
/// ولوَمَض العدّاد صفراً في كل مرة.
class NotificationsController extends AsyncNotifier<NotificationInbox> {
  @override
  Future<NotificationInbox> build() => _load();

  Future<NotificationInbox> _load() async {
    final uid = await ref.read(deviceRegistrarProvider).deviceUid();
    // الهاتف اختياري: الضيف غير المسجَّل يُخدَم بـdevice_uid وحده، ومن أتمّ
    // طلباً من قبل يُطابَق برقمه أيضاً فتصله إشعارات طلبه على أي جهاز.
    final phone = await ref.read(authRepositoryProvider).verifiedPhone;
    return ref.read(notificationRepositoryProvider).fetchInbox(deviceUid: uid, customerPhone: phone);
  }

  /// إعادة تحميل للسحب-للتحديث. لا تضع الحالة في `loading` عمداً: القائمة
  /// المعروضة تبقى مكانها بينما تدور عجلة `RefreshIndicator` فوقها، بدل أن
  /// تُستبدل بهياكل تحميل ثم تعود. (زر «إعادة المحاولة» في شاشة الخطأ يستخدم
  /// `invalidate` بدلاً منها ليُظهر هياكل التحميل فعلاً.)
  Future<void> refresh() async {
    state = await AsyncValue.guard(_load);
  }

  /// يعلّم إشعاراً واحداً كمقروء، **تفاؤلياً**: تتحدّث الواجهة فوراً ثم
  /// يُبلَّغ الخادم. النقر يفتح وجهة الإشعار في نفس اللحظة، فانتظار رحلة
  /// شبكة كامل قبل إخفاء نقطة «غير مقروء» كان سيبدو كأن النقرة لم تُسجَّل.
  Future<void> markRead(int id) async {
    final current = state.value;
    if (current == null) return;

    if (!current.items.any((n) => n.id == id && !n.isRead)) return;

    final now = DateTime.now();
    final items = [for (final n in current.items) n.id == id ? n.markedRead(now) : n];
    final optimisticUnread = current.unread > 0 ? current.unread - 1 : 0;
    state = AsyncValue.data(NotificationInbox(items: items, unread: optimisticUnread));

    final serverUnread = await _postMarkRead(ids: [id]);
    // لا نكتب فوق التقدير المتفائل إلا برقم حقيقي من الخادم.
    if (serverUnread != null) {
      final latest = state.value;
      if (latest != null) state = AsyncValue.data(latest.copyWith(unread: serverUnread));
    }
  }

  /// حذف `ids` من الحمولة يعني «الكل» في العقد.
  Future<void> markAllRead() async {
    final current = state.value;
    if (current == null || current.items.every((n) => n.isRead)) return;

    final now = DateTime.now();
    state = AsyncValue.data(NotificationInbox(
      items: [for (final n in current.items) n.markedRead(now)],
      unread: 0,
    ));

    final serverUnread = await _postMarkRead();
    if (serverUnread != null && serverUnread > 0) {
      // الخادم يعرف أكثر مما تعرضه الصفحة الواحدة (limit) — احترم رقمه.
      final latest = state.value;
      if (latest != null) state = AsyncValue.data(latest.copyWith(unread: serverUnread));
    }
  }

  Future<int?> _postMarkRead({List<int>? ids}) async {
    try {
      final uid = await ref.read(deviceRegistrarProvider).deviceUid();
      return await ref.read(notificationRepositoryProvider).markRead(deviceUid: uid, ids: ids);
    } catch (e, st) {
      // فشل التبليغ لا يُرجِع الواجهة للخلف: الإشعار سيعود «غير مقروء» عند
      // أول إعادة تحميل حقيقية من الخادم، وهذا أقل إزعاجاً من وميض عكسي.
      debugPrint('NotificationsController.markRead ignored: $e\n$st');
      return null;
    }
  }

  /// يبدّل تفعيل الإشعارات ويبلّغ الخادم.
  ///
  /// يستخدم علم `LocalCache.notificationsEnabled` **الموجود مسبقاً** (المفتاح
  /// `dk_notifications_enabled`) الذي كان معرَّفاً بلا أي مستدعٍ — لا علم
  /// ثانٍ موازٍ له. لا يمسّ حالة الصندوق فلا يُعاد جلب القائمة عبثاً؛ الشاشة
  /// تقرأ العلم من الذاكرة المحلية مباشرة.
  Future<void> setNotificationsEnabled(bool enabled) async {
    await ref.read(localCacheProvider).setNotificationsEnabled(enabled);
    try {
      final uid = await ref.read(deviceRegistrarProvider).deviceUid();
      await ref.read(notificationRepositoryProvider).setPrefs(deviceUid: uid, notificationsEnabled: enabled);
    } catch (e) {
      debugPrint('NotificationsController.setNotificationsEnabled ignored: $e');
    }
  }
}

final notificationsControllerProvider =
    AsyncNotifierProvider<NotificationsController, NotificationInbox>(NotificationsController.new);

/// عدّاد غير المقروء وحده — لشارة الجرس في الرئيسية.
///
/// يسقط لصفر عند التحميل أو الخطأ بدل رمي الاستثناء لأعلى: فشل خدمة إشعارات
/// يجب ألا يُسقط الصفحة الرئيسية.
final unreadNotificationsCountProvider = Provider<int>((ref) {
  return ref.watch(notificationsControllerProvider).value?.unread ?? 0;
});
