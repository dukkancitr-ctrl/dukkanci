import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/cache/local_cache.dart';
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

  CartState copyWith({int? storeId, List<CartItem>? items}) =>
      CartState(storeId: storeId, items: items ?? this.items);
}

/// Enforces the ONE-STORE-PER-CART rule (spec section 14) — the single most
/// important cart invariant. Every mutation goes through here so no other
/// code path can accidentally bypass it.
class CartController extends Notifier<CartState> {
  @override
  CartState build() {
    _restore();
    return const CartState();
  }

  LocalCache get _cache => ref.read(localCacheProvider);

  Future<void> _restore() async {
    final raw = _cache.readCartJson();
    if (raw.isEmpty) return;
    final items = raw.map(CartItem.fromJson).toList();
    if (items.isEmpty) return;
    state = CartState(storeId: items.first.storeId, items: items);
  }

  Future<void> _persist() async {
    await _cache.saveCartJson(state.items.map((i) => i.toJson()).toList());
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
    final next = state.items.map((i) => i.lineKey == lineKey ? i.copyWith(quantity: quantity) : i).toList();
    state = state.copyWith(items: next);
    _persist();
  }

  void removeLine(String lineKey) {
    final next = state.items.where((i) => i.lineKey != lineKey).toList();
    state = next.isEmpty ? const CartState() : state.copyWith(items: next);
    _persist();
  }

  void clear() {
    state = const CartState();
    _cache.clearCart();
  }
}

final cartControllerProvider = NotifierProvider<CartController, CartState>(CartController.new);

/// Provided in main.dart via ProviderScope overrides once SharedPreferences
/// is ready (see app/bootstrap.dart) — kept as a plain throwing default here
/// so a missing override fails loudly instead of silently no-op-ing persistence.
final localCacheProvider = Provider<LocalCache>((ref) {
  throw UnimplementedError('localCacheProvider must be overridden in main.dart after SharedPreferences.getInstance()');
});
