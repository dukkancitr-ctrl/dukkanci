import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../cart/application/cart_controller.dart' show localCacheProvider;

/// Local, persisted favorites (store ids) via LocalCache/SharedPreferences.
/// Spec section 26 wants a real GET/POST/DELETE /favorites/stores/{id}
/// backend so favorites sync across devices once the customer is logged in;
/// that endpoint doesn't exist server-side yet (see architecture note in
/// docs/تطبيق-اندرويد-Flutter-متطلبات.md) — swap the persistence calls below
/// for API calls once it ships, nothing above this controller needs to change.
class FavoritesController extends Notifier<Set<int>> {
  @override
  Set<int> build() => ref.read(localCacheProvider).favoriteStoreIds;

  void toggle(int storeId) {
    final next = Set<int>.from(state);
    next.contains(storeId) ? next.remove(storeId) : next.add(storeId);
    state = next;
    ref.read(localCacheProvider).saveFavoriteStoreIds(next);
  }

  bool isFavorite(int storeId) => state.contains(storeId);
}

final favoritesControllerProvider = NotifierProvider<FavoritesController, Set<int>>(FavoritesController.new);
