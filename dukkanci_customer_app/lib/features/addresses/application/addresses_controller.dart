import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../cart/application/cart_controller.dart' show localCacheProvider;
import '../domain/saved_address.dart';

/// The customer's saved delivery addresses ("عناويني") — local-only, same
/// as [favoriteStoreIds]: there's no customer_addresses backend table wired
/// up yet, so this persists via LocalCache and stays on-device.
class AddressesController extends Notifier<List<SavedAddress>> {
  @override
  List<SavedAddress> build() {
    return ref.read(localCacheProvider).readAddressesJson().map(SavedAddress.fromJson).toList();
  }

  Future<void> _persist(List<SavedAddress> next) async {
    state = next;
    await ref.read(localCacheProvider).saveAddressesJson(next.map((a) => a.toJson()).toList());
  }

  /// First save becomes the default automatically — a one-address book with
  /// no default reads as broken, not neutral.
  Future<void> upsert(SavedAddress address) {
    final exists = state.any((a) => a.id == address.id);
    final withDefault = state.isEmpty ? address.copyWith(isDefault: true) : address;
    final next = exists
        ? [for (final a in state) a.id == address.id ? withDefault : a]
        : [...state, withDefault];
    return _persist(next);
  }

  Future<void> remove(String id) {
    final removedWasDefault = state.any((a) => a.id == id && a.isDefault);
    var next = state.where((a) => a.id != id).toList();
    // Promote another address to default so the book never ends up with
    // addresses left but none marked default.
    if (removedWasDefault && next.isNotEmpty) {
      next = [next.first.copyWith(isDefault: true), ...next.skip(1)];
    }
    return _persist(next);
  }

  Future<void> setDefault(String id) {
    final next = [for (final a in state) a.copyWith(isDefault: a.id == id)];
    return _persist(next);
  }
}

final addressesControllerProvider = NotifierProvider<AddressesController, List<SavedAddress>>(AddressesController.new);
