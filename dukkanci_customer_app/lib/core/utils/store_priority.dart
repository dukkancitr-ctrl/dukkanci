import '../../features/stores/domain/store.dart';
import 'distance.dart';

/// Mirrors the website's `PROXIMITY_PRIORITY_RULES` / `WATER_SEARCH_PRIORITY_STORE_IDS`
/// in app.js (طلب المستخدم 2026-07-27) — kept identical on both platforms so a
/// customer sees the same "روا لتوزيع المياه" priority whether they're on the
/// site or the app.
const proximityPriorityStoreId = 115; // روا لتوزيع المياه
const proximityPriorityMaxKm = 2.0;
const waterSearchPriorityStoreIds = {115};

/// [proximityPriorityStoreId] floats to the front only when the customer's
/// real distance to it is known and within [proximityPriorityMaxKm] — never a
/// blanket boost. A no-op with no location or no coordinates on the store.
/// Stable otherwise (everything else keeps its existing relative order).
List<Store> sortStoresByProximityPriority(List<Store> list, double? customerLat, double? customerLng) {
  if (customerLat == null || customerLng == null) return list;
  int rank(Store s) {
    if (s.id != proximityPriorityStoreId || s.lat == null || s.lng == null) return 1;
    final km = haversineKm(customerLat, customerLng, s.lat!, s.lng!);
    return km <= proximityPriorityMaxKm ? 0 : 1;
  }
  final sorted = [...list];
  sorted.sort((a, b) => rank(a).compareTo(rank(b)));
  return sorted;
}

/// Only reorders stores that already matched the search text — never injects
/// a non-matching store. Used wherever a store list is shown alongside an
/// active search query.
List<Store> sortStoresByWaterSearchPriority(List<Store> list) {
  final sorted = [...list];
  sorted.sort((a, b) {
    final ra = waterSearchPriorityStoreIds.contains(a.id) ? 0 : 1;
    final rb = waterSearchPriorityStoreIds.contains(b.id) ? 0 : 1;
    return ra.compareTo(rb);
  });
  return sorted;
}
