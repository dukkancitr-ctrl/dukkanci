import 'package:flutter_test/flutter_test.dart';
import 'package:dukkanci_customer_app/core/utils/store_priority.dart';
import 'package:dukkanci_customer_app/features/stores/domain/store.dart';

/// The store-115 (روا) boost was removed 2026-09-29 — every store is ranked
/// equally, so both helpers must leave the list order untouched.
Store _store(int id, {double? lat, double? lng}) => Store(
      id: id,
      name: 'Store $id',
      category: 'x',
      lat: lat,
      lng: lng,
      rating: 4.0,
      open: true,
    );

void main() {
  const roaLat = 41.0114375, roaLng = 28.6858594; // متجر روا الحقيقي

  test('no store is configured for priority', () {
    expect(proximityPriorityStoreIds, isEmpty);
    expect(waterSearchPriorityStoreIds, isEmpty);
  });

  test('proximity sort keeps order even for store 115 within 2km', () {
    final list = [_store(1), _store(2), _store(115, lat: roaLat, lng: roaLng), _store(3)];
    final sorted = sortStoresByProximityPriority(list, roaLat, roaLng);
    expect(sorted.map((s) => s.id).toList(), [1, 2, 115, 3]);
  });

  test('search sort keeps order even when store 115 matched', () {
    final matched = [_store(7), _store(115), _store(9)];
    final sorted = sortStoresByWaterSearchPriority(matched);
    expect(sorted.map((s) => s.id).toList(), [7, 115, 9]);
  });
}
