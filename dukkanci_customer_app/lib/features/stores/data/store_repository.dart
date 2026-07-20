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

  /// Ids of stores that actually have a discounted product right now.
  ///
  /// `stores.has_offer` is a merchant-authored banner flag, NOT a record of
  /// real price cuts, and the two disagree badly: measured live, 422 products
  /// across 17 stores are discounted, yet 6 of those stores have
  /// `has_offer = false` — including باشا بيتزريا with 30 discounted pizzas.
  /// Relying on the flag alone (as this app used to) hid every one of them
  /// from «عروض وخصومات», which is what the website never did: it derives
  /// offers from products, because it holds the whole catalog in memory.
  ///
  /// Only `store_id/price/old_price` are selected, so even the full result is
  /// a few hundred tiny rows; it is still paged, because discounts grow.
  Future<Set<int>> fetchStoreIdsWithDiscountedProducts() async {
    try {
      final ids = <int>{};
      for (var from = 0; ; from += 1000) {
        final rows = await supabase
            .from('products')
            .select('store_id, price, old_price')
            .eq('available', true)
            .not('old_price', 'is', null)
            .range(from, from + 999) as List;
        for (final r in rows) {
          final row = Map<String, dynamic>.from(r as Map);
          final price = (row['price'] as num?)?.toDouble() ?? 0;
          final oldPrice = (row['old_price'] as num?)?.toDouble();
          // A real discount only — some rows carry an old_price that is not
          // actually higher, and the website ignores those too.
          if (oldPrice != null && oldPrice > price) ids.add(row['store_id'] as int);
        }
        if (rows.length < 1000) break;
      }
      return ids;
    } catch (e, st) {
      debugPrint('StoreRepository.fetchStoreIdsWithDiscountedProducts ignored: $e\n$st');
      return const {}; // fall back to the has_offer flag alone
    }
  }

  /// Products reachable only through a curated synonym — the dialect/Turkish/
  /// brand aliases the website matches via `product_synonyms`.
  ///
  /// This is what lets a Turkish speaker type "döner" and get "شاورما", or a
  /// shopper type "Dove" and reach a product whose name never says it. Measured
  /// on live data: ~3,000 products carry a synonym that appears nowhere in
  /// their own name or category.
  ///
  /// One request, not two: `product_synonyms!inner(...)` makes PostgREST do the
  /// join, so the filter on the child table selects parent rows directly.
  ///
  /// Matching is EXACT per array element (see [synonymMatchCandidates] for why
  /// no pattern operator exists here), so unlike [searchProducts] these rows
  /// are already answers — the caller must NOT re-filter them against
  /// name/category, since by definition the term isn't there.
  ///
  /// Fails soft: synonyms are an enhancement, so a failure here must never
  /// take down the main name/category results.
  Future<List<Product>> searchProductsBySynonym(String query, {int limit = 200}) async {
    final candidates = synonymMatchCandidates(query);
    if (candidates.isEmpty) return [];
    try {
      final rows = await supabase
          .from('products')
          .select('*, product_synonyms!inner(product_id)')
          .eq('available', true)
          .eq('product_synonyms.status', 'done')
          .overlaps('product_synonyms.synonyms', candidates)
          .limit(limit);
      return (rows as List).map((r) => Product.fromJson(Map<String, dynamic>.from(r as Map))).toList();
    } catch (e, st) {
      debugPrint('StoreRepository.searchProductsBySynonym ignored: $e\n$st');
      return [];
    }
  }
}
