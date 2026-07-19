import 'package:flutter/foundation.dart';
import '../../../core/api/supabase_bootstrap.dart';
import '../../../core/errors/failure.dart';
import '../../../core/utils/arabic.dart';
import '../domain/store.dart';
import '../../products/domain/product.dart';

/// Reads directly from Supabase `stores`/`products` — same tables, same RLS
/// policies the website reads from (see supabase_bootstrap.dart for why).
class StoreRepository {
  Future<List<Store>> fetchApprovedStores({String? category}) async {
    try {
      var query = supabase.from('stores').select();
      if (category != null && category.isNotEmpty) {
        query = query.eq('category', category);
      }
      final rows = await query.order('id');
      return (rows as List)
          .map((r) => Store.fromJson(Map<String, dynamic>.from(r as Map)))
          .where((s) => s.isPubliclyVisible)
          .toList();
    } catch (e, st) {
      debugPrint('StoreRepository.fetchApprovedStores failed: $e\n$st');
      throw Failure.network();
    }
  }

  Future<Store?> fetchStoreBySlugOrId(String slugOrId) async {
    try {
      final asId = int.tryParse(slugOrId);
      final row = asId != null
          ? await supabase.from('stores').select().eq('id', asId).maybeSingle()
          : await supabase.from('stores').select().eq('slug', slugOrId).maybeSingle();
      if (row == null) return null;
      return Store.fromJson(Map<String, dynamic>.from(row));
    } catch (e, st) {
      debugPrint('StoreRepository.fetchStoreBySlugOrId failed: $e\n$st');
      throw Failure.network();
    }
  }

  Future<List<Product>> fetchProductsForStore(int storeId) async {
    try {
      final rows = await supabase
          .from('products')
          .select()
          .eq('store_id', storeId)
          .eq('available', true)
          .order('id');
      return (rows as List).map((r) => Product.fromJson(Map<String, dynamic>.from(r as Map))).toList();
    } catch (e, st) {
      debugPrint('StoreRepository.fetchProductsForStore failed: $e\n$st');
      throw Failure.network();
    }
  }

  /// Arabic-forgiving store search. Stores are few enough (< 200) to fetch
  /// whole and filter in memory; products are NOT — see [searchProducts].
  Future<List<Store>> searchStores(String query) async {
    final terms = arabicSearchTerms(query);
    if (terms.isEmpty) return [];
    final all = await fetchApprovedStores();
    return all.where((s) => matchesAllTerms('${s.name} ${s.category}', terms)).toList();
  }

  /// Search products across the WHOLE catalog, server-side.
  ///
  /// The website can afford to hold every product in memory and filter with
  /// plain JS (app.js `getMatchingProducts`). This client cannot: the catalog
  /// is 11,725 rows and PostgREST is configured with `db-max-rows=1000`, which
  /// truncates every response *regardless of `limit`* — verified live, a
  /// request for 5,000 rows returns exactly 1,000. Copying the website's
  /// approach would therefore have searched only the first ~9% of the catalog
  /// while looking perfectly healthy.
  ///
  /// So the filtering happens in Postgres. Each term contributes its own
  /// `or=(name.ilike…,category.ilike…)`; repeated `or` params are ANDed by
  /// PostgREST, which keeps terms order-independent and lets a query like
  /// "دجاج مشوي" match a product whose name and category each supply one word.
  ///
  /// The patterns are intentionally permissive (see [arabicIlikePattern]), so
  /// the rows returned here are *candidates*, not answers — the caller still
  /// applies [matchesAllTerms] to get exact results. Correctness comes from
  /// that second pass; this pass only has to be a superset, cheaply.
  Future<List<Product>> searchProducts(String query, {int candidateLimit = 1000}) async {
    final terms = arabicSearchTerms(query);
    if (terms.isEmpty) return [];
    try {
      var request = supabase.from('products').select().eq('available', true);
      for (final term in terms) {
        final pattern = arabicIlikePattern(term);
        request = request.or('name.ilike.$pattern,category.ilike.$pattern');
      }
      final rows = await request.limit(candidateLimit);
      return (rows as List).map((r) => Product.fromJson(Map<String, dynamic>.from(r as Map))).toList();
    } catch (e, st) {
      debugPrint('StoreRepository.searchProducts failed: $e\n$st');
      throw Failure.network();
    }
  }
}
