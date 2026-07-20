import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/providers.dart';
import '../../../core/api/supabase_bootstrap.dart';
import '../../cart/application/cart_controller.dart';
import '../data/device_registrar.dart';

/// لقطة ملخّصة عن السلة، تُلتقط لحظة التعديل وتُرسَل بعد انتهاء مهلة التجميع.
///
/// ⚠️ **ملخّص فقط، بقرار خصوصية صريح:** المتجر، وعدد الأصناف، والمجموع،
/// وأسماء المنتجات. **لا خيارات ولا إضافات ولا ملاحظات الزبون** — لا تُضَف
/// هنا لاحقاً بحجة «تحسين الرسالة».
class _CartSnapshot {
  const _CartSnapshot({
    required this.storeId,
    required this.itemCount,
    required this.subtotal,
    required this.itemNames,
  });

  final int storeId;
  final int itemCount;
  final double subtotal;
  final List<String> itemNames;
}

/// يرسل حالة السلة للخادم (تذكير السلة المتروكة) بعد **تجميع** التعديلات.
///
/// بلا التجميع كان كل ضغط على «+» يُطلق طلب شبكة مستقلاً: زبون يرفع الكمية
/// من ١ إلى ٥ كان سيُنتج خمسة نداءات في ثانيتين. المؤقّت يُصفَّر مع كل تعديل،
/// فلا يُرسَل شيء إلا بعد [_debounce] من الهدوء الفعلي.
class CartSyncService {
  CartSyncService(this._ref);

  final Ref _ref;

  static const _debounce = Duration(seconds: 3);

  Timer? _timer;

  /// أسماء المتاجر مُخزَّنة محلياً: السلة تعرف `storeId` فقط، والعقد يطلب
  /// `store_name` أيضاً. استعلام واحد لكل متجر في عمر الجلسة، لا واحد لكل
  /// مزامنة.
  final Map<int, String> _storeNames = {};

  /// يُستدعى بعد **كل** تعديل على السلة (إضافة/تعديل كمية/حذف/إفراغ).
  /// السلة الفارغة تُرسَل بـ`item_count: 0` كما يوجب العقد، شريطة أن نعرف
  /// المتجر الذي أُفرغت منه.
  void schedule(CartState cart, {int? emptiedStoreId}) {
    final storeId = cart.storeId ?? emptiedStoreId;
    if (storeId == null) return;

    final snapshot = _CartSnapshot(
      storeId: storeId,
      itemCount: cart.itemCount,
      subtotal: cart.subtotal,
      itemNames: cart.items.map((i) => i.name).where((n) => n.isNotEmpty).toList(),
    );

    _timer?.cancel();
    _timer = Timer(_debounce, () => unawaited(_send(snapshot)));
  }

  /// السلة تحوّلت إلى طلب.
  ///
  /// يُلغي أي مزامنة معلّقة **قبل** إرسال التحويل: لولا ذلك لهبطت مزامنة
  /// «سلة فارغة» مجدولة قبل ثوانٍ **بعد** إشعار التحويل، فيبدو للخادم أن
  /// الزبون أفرغ سلته بعد الشراء ويرسل له تذكيراً بسلة اشترى منها فعلاً.
  void markConverted() {
    _timer?.cancel();
    _timer = null;
    unawaited(_convert());
  }

  void dispose() {
    _timer?.cancel();
    _timer = null;
  }

  Future<void> _send(_CartSnapshot snapshot) async {
    try {
      final registrar = _ref.read(deviceRegistrarProvider);
      final uid = await registrar.deviceUid();
      final phone = await _ref.read(authRepositoryProvider).verifiedPhone;
      await _ref.read(notificationRepositoryProvider).syncCart(
            deviceUid: uid,
            storeId: snapshot.storeId,
            storeName: await _storeName(snapshot.storeId),
            itemCount: snapshot.itemCount,
            subtotal: snapshot.subtotal,
            itemNames: snapshot.itemNames,
            customerPhone: phone,
          );
    } catch (e, st) {
      // مزامنة السلة خدمة خلفية بحتة: لا تُظهر خطأً ولا تعطّل السلة أبداً.
      debugPrint('CartSyncService.send ignored: $e\n$st');
    }
  }

  Future<void> _convert() async {
    try {
      final uid = await _ref.read(deviceRegistrarProvider).deviceUid();
      await _ref.read(notificationRepositoryProvider).cartConverted(deviceUid: uid);
    } catch (e, st) {
      debugPrint('CartSyncService.convert ignored: $e\n$st');
    }
  }

  Future<String> _storeName(int storeId) async {
    final cached = _storeNames[storeId];
    if (cached != null) return cached;
    try {
      final row = await supabase.from('stores').select('name').eq('id', storeId).maybeSingle();
      final name = (row?['name'] as Object?)?.toString().trim() ?? '';
      if (name.isNotEmpty) _storeNames[storeId] = name;
      return name;
    } catch (e) {
      // اسم فارغ أفضل من إسقاط المزامنة كلها — بقية الحمولة (المتجر، العدد،
      // المجموع، الأسماء) لا تزال مفيدة للخادم.
      debugPrint('CartSyncService._storeName failed for $storeId: $e');
      return '';
    }
  }
}

final cartSyncServiceProvider = Provider<CartSyncService>((ref) {
  final service = CartSyncService(ref);
  ref.onDispose(service.dispose);
  return service;
});
