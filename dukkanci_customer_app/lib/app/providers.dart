import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../core/api/api_client.dart';
import '../core/auth/auth_repository.dart';
import '../core/cache/secure_storage.dart';
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

final orderRepositoryProvider = Provider<OrderRepository>((ref) {
  return OrderRepository(ref.read(apiClientProvider));
});
