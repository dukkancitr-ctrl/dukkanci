import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/cache/local_cache.dart';
import '../../notifications/application/cart_sync_service.dart';
import '../domain/cart_item.dart';

/// Result of trying to add an item from a different store than what's
/// already in the cart — the UI must show the exact confirmation dialog from
/// spec section 14 ("تحتوي سلتك على منتجات من متجر آخر...") rather than
/// silently merging or silently blocking.
enum AddToCartResult { added, otherStoreConflict }

class CartState {
  final int? storeId;
  final List<CartItem> items;

  const CartState({this.storeId, this.items = const []});

  double get subtotal => items.fold(0, (sum, i) => sum + i.lineTotal);
  int get itemCount => items.fold(0, (sum, i) => sum + i.quantity);
  bool get isEmpty => items.isEmpty;

  /// ⚠ `storeId ?? this.storeId` وليس `storeId` — أُصلحت 2026-07-20.
  ///
  /// كانت مكتوبة `CartState(storeId: storeId, …)`، فأي استدعاء بلا تمرير المتجر
  /// صراحةً كان **يُصفّر `storeId`**. النتيجة كانت عطلاً كاملاً في الشراء:
  /// `updateQuantity`/`removeLine` تمحوان المتجر، ثم `_submit()` في شاشة الدفع
  /// يبدأ بـ`if (cart.isEmpty || cart.storeId == null) return;` — أي أن زر
  /// «تأكيد الطلب» كان لا يفعل شيئاً إطلاقاً وبلا أي رسالة خطأ بعد أي تغيير
  /// كمية في السلة. لم يظهر العطل سابقاً لأن `addItem` تمرّر المتجر صراحةً،
  /// فتبدو السلة سليمة حتى أول تعديل كمية.
  CartState copyWith({int? storeId, List<CartItem>? items}) =>
      CartState(storeId: storeId ?? this.storeId, items: items ?? this.items);
}

/// Enforces the ONE-STORE-PER-CART rule (spec section 14) — the single most
/// important cart invariant. Every mutation goes through here so no other
/// code path can accidentally bypass it.
class CartController extends Notifier<CartState> {
  /// Restores the saved cart SYNCHRONOUSLY and returns it as the initial
  /// state. An earlier version called an async `_restore()` that assigned
  /// `state` and then returned `const CartState()` — since readCartJson() has
  /// no await, the assignment ran first and the empty return value clobbered
  /// it, so a saved cart never came back after an app restart (caught on the
  /// emulator: add item → kill app → reopen → cart empty).
  @override
  CartState build() {
    final raw = _cache.readCartJson();
    if (raw.isEmpty) return const CartState();
    final items = raw.map(CartItem.fromJson).toList();
    if (items.isEmpty) return const CartState();
    return CartState(storeId: items.first.storeId, items: items);
  }

  LocalCache get _cache => ref.read(localCacheProvider);

  /// [emptiedStoreId] هو متجر السلة **قبل** التعديل. يلزم فقط حين يُحذف آخر
  /// صنف فتُصفَّر `state.storeId` — بدونه لا نعود نعرف عن أي متجر نُبلّغ
  /// خادم الإشعارات أن السلة أُفرغت.
  Future<void> _persist({int? emptiedStoreId}) async {
    _syncRemote(emptiedStoreId: emptiedStoreId);
    await _cache.saveCartJson(state.items.map((i) => i.toJson()).toList());
  }

  /// مزامنة ملخّصة (مؤجَّلة ٣ ثوانٍ) مع خادم الإشعارات لتذكير السلة
  /// المتروكة. تُرسَل أسماء المنتجات والعدد والمجموع فقط — لا خيارات ولا
  /// إضافات ولا ملاحظات (قرار خصوصية، انظر CartSyncService).
  void _syncRemote({int? emptiedStoreId}) {
    ref.read(cartSyncServiceProvider).schedule(state, emptiedStoreId: emptiedStoreId);
  }

  /// Returns [AddToCartResult.otherStoreConflict] instead of throwing so the
  /// UI can show the "keep current cart / clear and start new" dialog. Call
  /// [clearAndAdd] if the customer chooses to start over.
  AddToCartResult addItem(CartItem item) {
    if (state.storeId != null && state.storeId != item.storeId && state.items.isNotEmpty) {
      return AddToCartResult.otherStoreConflict;
    }
    final existingIndex = state.items.indexWhere((i) => i.lineKey == item.lineKey);
    final next = List<CartItem>.from(state.items);
    if (existingIndex >= 0) {
      next[existingIndex] = next[existingIndex].copyWith(quantity: next[existingIndex].quantity + item.quantity);
    } else {
      next.add(item);
    }
    state = state.copyWith(storeId: item.storeId, items: next);
    _persist();
    return AddToCartResult.added;
  }

  void clearAndAdd(CartItem item) {
    state = CartState(storeId: item.storeId, items: [item]);
    _persist();
  }

  void updateQuantity(String lineKey, int quantity) {
    if (quantity <= 0) {
      removeLine(lineKey);
      return;
    }
    final previousStoreId = state.storeId;
    final next = state.items.map((i) => i.lineKey == lineKey ? i.copyWith(quantity: quantity) : i).toList();
    state = state.copyWith(items: next);
    // يُمرَّر متجر ما قبل التعديل احتياطاً لأن `CartState.copyWith` **لا
    // تحافظ** على `storeId` حين لا يُمرَّر صراحةً (`storeId: storeId` بدل
    // `storeId ?? this.storeId`) — علة قائمة في السلة قبل هذه الميزة، لكن
    // أثرها هنا أن مزامنة السلة كانت ستفقد المتجر بعد أي تغيير كمية.
    _persist(emptiedStoreId: previousStoreId);
  }

  void removeLine(String lineKey) {
    final previousStoreId = state.storeId;
    final next = state.items.where((i) => i.lineKey != lineKey).toList();
    state = next.isEmpty ? const CartState() : state.copyWith(items: next);
    _persist(emptiedStoreId: previousStoreId);
  }

  void clear() {
    final previousStoreId = state.storeId;
    state = const CartState();
    _cache.clearCart();
    _syncRemote(emptiedStoreId: previousStoreId);
  }
}

final cartControllerProvider = NotifierProvider<CartController, CartState>(CartController.new);

/// Provided in main.dart via ProviderScope overrides once SharedPreferences
/// is ready (see app/bootstrap.dart) — kept as a plain throwing default here
/// so a missing override fails loudly instead of silently no-op-ing persistence.
final localCacheProvider = Provider<LocalCache>((ref) {
  throw UnimplementedError('localCacheProvider must be overridden in main.dart after SharedPreferences.getInstance()');
});
