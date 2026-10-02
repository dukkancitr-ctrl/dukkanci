import '../../features/stores/domain/store.dart';
import 'distance.dart';

/// A store paired with its straight-line distance from the customer.
class StoreDistance {
  const StoreDistance(this.store, this.km);

  final Store store;
  final double km;
}

/// A store's coordinates are usable only when both are present and not the
/// (0, 0) "null island" placeholder some rows carry when a merchant never
/// pinned the map.
bool _hasUsableCoordinates(Store s) {
  final lat = s.lat;
  final lng = s.lng;
  if (lat == null || lng == null) return false;
  return !(lat == 0 && lng == 0);
}

/// Stores ordered from nearest to farthest relative to ([lat], [lng]) — the
/// data behind the home «متاجر قريبة منك الآن» rail.
///
/// Previously that rail was simply the top-rated stores, so a customer in
/// Esenyurt was shown Fatih/Başakşehir stores 14–22 km away while the real
/// nearest ones (under 2 km) were buried. Stores without usable coordinates are
/// left out: we can't honestly call a store "near you" without knowing where it
/// is. Ties (identical distance, e.g. branches sharing a building) fall back to
/// the higher rating, then the id, so the order is deterministic.
List<StoreDistance> nearestStores(List<Store> stores, double lat, double lng, {int? limit}) {
  final ranked = <StoreDistance>[
    for (final s in stores)
      if (_hasUsableCoordinates(s)) StoreDistance(s, haversineKm(lat, lng, s.lat!, s.lng!)),
  ]..sort((a, b) {
      final byDistance = a.km.compareTo(b.km);
      if (byDistance != 0) return byDistance;
      final byRating = b.store.rating.compareTo(a.store.rating);
      return byRating != 0 ? byRating : a.store.id.compareTo(b.store.id);
    });
  return limit == null || ranked.length <= limit ? ranked : ranked.sublist(0, limit);
}

/// «0.7» — one decimal is enough for a list badge; a store 40 m away would read
/// «0.0», so anything under 100 m is floored to «0.1» rather than implying the
/// store is at the customer's exact position.
String formatDistanceKm(double km) => (km < 0.1 ? 0.1 : km).toStringAsFixed(1);
