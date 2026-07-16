import 'package:flutter/foundation.dart';
import '../../../core/api/supabase_bootstrap.dart';
import '../../../core/errors/failure.dart';
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

  /// Arabic-forgiving search across store + product names — a simplified
  /// client-side pass. The website's getMatchingProducts() has a much richer
  /// dialect-synonym index (see [[ai-section]]); port that logic here rather
  /// than reimplementing from scratch once this repo layer is extended to
  /// call a shared search endpoint.
  Future<List<Store>> searchStores(String query) async {
    final normalized = _normalizeArabic(query.trim());
    if (normalized.isEmpty) return [];
    final all = await fetchApprovedStores();
    return all.where((s) => _normalizeArabic(s.name).contains(normalized)).toList();
  }

  String _normalizeArabic(String input) => input
      .replaceAll(RegExp('[أإآا]'), 'ا')
      .replaceAll('ة', 'ه')
      .replaceAll('ى', 'ي')
      .replaceAll(RegExp(r'[ً-ْ]'), '') // tashkeel
      .replaceAll(RegExp(r'\s+'), ' ')
      .toLowerCase();
}
