import 'package:flutter_test/flutter_test.dart';
import 'package:dukkanci_customer_app/core/utils/store_priority.dart';
import 'package:dukkanci_customer_app/features/stores/domain/store.dart';

/// Mirrors the website's PROXIMITY_PRIORITY_RULES / WATER_SEARCH_PRIORITY_STORE_IDS
/// tests done live in the browser console (2026-07-27) — same assertions,
/// ported so the Dart logic has the same regression coverage.
Store _store(int id, {double? lat, double? lng, double rating = 4.0, bool open = true}) => Store(
      id: id,
      name: 'Store $id',
      category: 'x',
      lat: lat,
      lng: lng,
      rating: rating,
      open: open,
    );

void main() {
  group('sortStoresByProximityPriority', () {
    const roaLat = 41.0114375, roaLng = 28.6858594; // متجر روا الحقيقي

    test('boosts store 115 to the front when within 2km', () {
      final list = [_store(1), _store(2), _store(115, lat: roaLat, lng: roaLng), _store(3)];
      final sorted = sortStoresByProximityPriority(list, roaLat, roaLng);
      expect(sorted.first.id, 115);
    });

    test('does NOT boost store 115 when farther than 2km', () {
      final list = [_store(1), _store(2), _store(115, lat: 41.2, lng: 29.2), _store(3)];
      final sorted = sortStoresByProximityPriority(list, roaLat, roaLng);
      // stable sort: everyone ranks equally (1), so original order is kept.
      expect(sorted.map((s) => s.id).toList(), [1, 2, 115, 3]);
    });

    test('is a no-op with no customer location', () {
      final list = [_store(1), _store(115, lat: roaLat, lng: roaLng), _store(2)];
      final sorted = sortStoresByProximityPriority(list, null, null);
      expect(sorted.map((s) => s.id).toList(), [1, 115, 2]);
    });

    test('is a no-op when store 115 has no coordinates', () {
      final list = [_store(1), _store(115), _store(2)];
      final sorted = sortStoresByProximityPriority(list, roaLat, roaLng);
      expect(sorted.map((s) => s.id).toList(), [1, 115, 2]);
    });

    test('never boosts a store other than 115, however close', () {
      final list = [_store(1, lat: roaLat, lng: roaLng), _store(115, lat: 41.2, lng: 29.2)];
      final sorted = sortStoresByProximityPriority(list, roaLat, roaLng);
      // store 1 is genuinely closer but isn't the priority id, so order is untouched.
      expect(sorted.map((s) => s.id).toList(), [1, 115]);
    });
  });

  group('sortStoresByWaterSearchPriority', () {
    test('boosts store 115 to the front of already-matched stores', () {
      final matched = [_store(7), _store(115), _store(9)];
      final sorted = sortStoresByWaterSearchPriority(matched);
      expect(sorted.first.id, 115);
      expect(sorted.skip(1).map((s) => s.id).toList(), [7, 9]); // relative order preserved
    });

    test('never injects a store that was not already in the list', () {
      final matched = [_store(7), _store(9)];
      final sorted = sortStoresByWaterSearchPriority(matched);
      expect(sorted.map((s) => s.id).toSet(), {7, 9});
    });
  });
}
