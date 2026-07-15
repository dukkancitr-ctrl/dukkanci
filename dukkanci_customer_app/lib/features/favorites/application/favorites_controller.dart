import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Local-only, in-memory favorites (store ids) for now — spec section 26
/// wants a real GET/POST/DELETE /favorites/stores/{id} backend so favorites
/// sync across devices once the customer is logged in; that endpoint
/// doesn't exist yet (see docs/تطبيق-اندرويد-Flutter-متطلبات.md
/// architecture note). This scaffold keeps favorites for the current app
/// session only — persisting them (SharedPreferences via LocalCache, then
/// an API call once /favorites ships) is a follow-up, not yet wired here.
class FavoritesController extends Notifier<Set<int>> {
  @override
  Set<int> build() => <int>{};

  void toggle(int storeId) {
    final next = Set<int>.from(state);
    next.contains(storeId) ? next.remove(storeId) : next.add(storeId);
    state = next;
  }

  bool isFavorite(int storeId) => state.contains(storeId);
}

final favoritesControllerProvider = NotifierProvider<FavoritesController, Set<int>>(FavoritesController.new);
