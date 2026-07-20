import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../core/api/api_client.dart';
import '../core/auth/auth_repository.dart';
import '../core/cache/secure_storage.dart';
import '../features/banners/data/banner_repository.dart';
import '../features/banners/domain/app_banner.dart';
import '../features/checkout/data/order_repository.dart';
import '../features/stores/data/store_repository.dart';
import '../features/stores/domain/store.dart';

final secureStorageProvider = Provider<SecureStorage>((ref) {
  return SecureStorage(const FlutterSecureStorage());
});

final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient(ref.read(secureStorageProvider));
});

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.read(apiClientProvider), ref.read(secureStorageProvider));
});

final storeRepositoryProvider = Provider<StoreRepository>((ref) => StoreRepository());

/// All customer-visible (approved) stores, fetched once and shared between the
/// home feed and category pages so switching between them doesn't refetch.
/// Every home section (offers, popular, per-category rails) is derived from
/// this single list client-side — one Supabase round-trip per home load.
final approvedStoresProvider = FutureProvider.autoDispose<List<Store>>((ref) {
  return ref.read(storeRepositoryProvider).fetchApprovedStores();
});

/// Stores that currently have a genuinely discounted product, which the
/// `stores.has_offer` flag does not reliably record — see
/// [Store.hasAnyOffer]. Read it with `.value ?? const <int>{}` so a
/// pending/failed load simply falls back to the flag instead of emptying the
/// offers rail.
final discountedStoreIdsProvider = FutureProvider.autoDispose<Set<int>>((ref) {
  return ref.read(storeRepositoryProvider).fetchStoreIdsWithDiscountedProducts();
});

final orderRepositoryProvider = Provider<OrderRepository>((ref) {
  return OrderRepository(ref.read(apiClientProvider));
});

final bannerRepositoryProvider = Provider<BannerRepository>((ref) => BannerRepository());

/// Admin-managed banners for the app home screen (placement `app_home`).
///
/// Depends on approvedStoresProvider because a banner linking to a store that
/// was removed or unapproved must be dropped, not rendered as a dead tap — the
/// same validity rule the website applies in activeBanners(). Watching (not
/// reading) the stores provider also means a pull-to-refresh of the store list
/// re-validates the banners for free.
final appHomeBannersProvider = FutureProvider.autoDispose<List<AppBanner>>((ref) async {
  final stores = await ref.watch(approvedStoresProvider.future);
  return ref.read(bannerRepositoryProvider).fetchBanners(
        placement: 'app_home',
        approvedStores: stores,
      );
});
