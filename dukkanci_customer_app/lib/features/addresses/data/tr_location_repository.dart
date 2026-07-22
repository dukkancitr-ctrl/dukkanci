import 'package:flutter/foundation.dart';
import '../../../core/api/supabase_bootstrap.dart';
import '../../../core/utils/turkish_address.dart';
import '../domain/tr_location.dart';

/// Reads the İl/İlçe/Mahalle reference tables directly from Supabase (same
/// public, RLS-read-only tables the website reads — see StoreRepository for
/// why this app talks to Supabase directly rather than through a REST API).
/// Districts/neighborhoods are always fetched scoped to a parent id — never
/// the whole country at once (32k+ rows) — and cached per-parent in memory
/// for the lifetime of the app, since this reference data never changes
/// during a session.
class TrLocationRepository {
  List<TrProvince>? _provincesCache;
  final Map<int, List<TrDistrict>> _districtsCache = {};
  final Map<int, List<TrNeighborhood>> _neighborhoodsCache = {};

  Future<List<TrProvince>> fetchProvinces() async {
    if (_provincesCache != null) return _provincesCache!;
    try {
      final rows = await supabase.from('tr_provinces').select('id,name_tr,search_name').order('name_tr');
      final list = (rows as List).map((r) => TrProvince.fromJson(Map<String, dynamic>.from(r as Map))).toList();
      _provincesCache = list;
      return list;
    } catch (e, st) {
      debugPrint('TrLocationRepository.fetchProvinces failed: $e\n$st');
      return const [];
    }
  }

  Future<List<TrDistrict>> fetchDistricts(int provinceId) async {
    final cached = _districtsCache[provinceId];
    if (cached != null) return cached;
    try {
      final rows = await supabase
          .from('tr_districts')
          .select('id,province_id,name_tr,search_name')
          .eq('province_id', provinceId)
          .order('name_tr');
      final list = (rows as List).map((r) => TrDistrict.fromJson(Map<String, dynamic>.from(r as Map))).toList();
      _districtsCache[provinceId] = list;
      return list;
    } catch (e, st) {
      debugPrint('TrLocationRepository.fetchDistricts failed: $e\n$st');
      return const [];
    }
  }

  Future<List<TrNeighborhood>> fetchNeighborhoods(int districtId) async {
    final cached = _neighborhoodsCache[districtId];
    if (cached != null) return cached;
    try {
      final rows = await supabase
          .from('tr_neighborhoods')
          .select('id,district_id,name_tr,search_name,settlement_type')
          .eq('district_id', districtId)
          .order('name_tr');
      final list = (rows as List).map((r) => TrNeighborhood.fromJson(Map<String, dynamic>.from(r as Map))).toList();
      _neighborhoodsCache[districtId] = list;
      return list;
    } catch (e, st) {
      debugPrint('TrLocationRepository.fetchNeighborhoods failed: $e\n$st');
      return const [];
    }
  }

  /// Best-effort match of a free-text name (e.g. from reverse-geocoding)
  /// against a fetched row list — never throws, returns null on no match.
  static T? matchByName<T>(List<T> rows, String Function(T) searchNameOf, String? name) {
    if (name == null || name.trim().isEmpty || rows.isEmpty) return null;
    final q = normalizeTrSearch(name);
    for (final r in rows) {
      if (searchNameOf(r) == q) return r;
    }
    for (final r in rows) {
      final sn = searchNameOf(r);
      if (sn.startsWith(q) || q.startsWith(sn)) return r;
    }
    return null;
  }
}
