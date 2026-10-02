import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:dukkanci_customer_app/app/providers.dart';
import 'package:dukkanci_customer_app/core/cache/local_cache.dart';
import 'package:dukkanci_customer_app/core/utils/nearby_stores.dart';
import 'package:dukkanci_customer_app/features/cart/application/cart_controller.dart' show localCacheProvider;
import 'package:dukkanci_customer_app/features/home/presentation/home_screen.dart';
import 'package:dukkanci_customer_app/features/home/presentation/widgets/store_rail.dart';
import 'package:dukkanci_customer_app/features/location/application/location_controller.dart';
import 'package:dukkanci_customer_app/features/products/domain/product.dart';
import 'package:dukkanci_customer_app/features/stores/data/store_repository.dart';
import 'package:dukkanci_customer_app/features/stores/domain/store.dart';

/// Regression for «متاجر قريبة منك الآن» showing stores 14–22 km away.
///
/// The home rail used to be the top-rated stores and never looked at the
/// customer's location, so someone in Esenyurt saw Fatih/Başakşehir stores while
/// the real nearest ones (< 2 km) were buried. The coordinates below are real
/// store rows from production (read 2026-10-02).
const _esenyurt = (lat: 41.0148, lng: 28.6779); // the app's «إسنيورت» district centroid

Store _store(int id, String name, {double? lat, double? lng, double rating = 0, bool open = true}) => Store(
      id: id,
      name: name,
      category: 'مطاعم',
      lat: lat,
      lng: lng,
      rating: rating,
      open: open,
    );

// Real stores: two in Esenyurt (< 2 km), then Başakşehir (~14 km) and Fatih
// (~22 km) which have the HIGHEST ratings — exactly what the old rail surfaced.
final _byatHouse = _store(1, 'بايت هاوس', lat: 41.0185, lng: 28.6745, rating: 3.9);
final _zamzam = _store(2, 'زمزم ماركت', lat: 41.0215683, lng: 28.6603221, rating: 4.8);
final _turkwaz = _store(3, 'تركواز', lat: 41.1169983, lng: 28.7746913, rating: 4.6);
final _charco = _store(4, 'تشاركو تشيكن', lat: 41.0199967, lng: 28.9411767, rating: 4.7);

void main() {
  group('nearestStores', () {
    test('orders nearest first, regardless of rating', () {
      final result = nearestStores([_charco, _turkwaz, _zamzam, _byatHouse], _esenyurt.lat, _esenyurt.lng);
      expect(result.map((r) => r.store.id).toList(), [1, 2, 3, 4]);
      // Sanity-check the actual distances against what a person would expect.
      expect(result[0].km, lessThan(1));
      expect(result[1].km, lessThan(2));
      expect(result[2].km, inInclusiveRange(12, 16));
      expect(result[3].km, inInclusiveRange(20, 25));
    });

    test('the old top-rated order would have put far stores first (the bug)', () {
      final byRating = [_charco, _turkwaz, _zamzam, _byatHouse]..sort((a, b) => b.rating.compareTo(a.rating));
      expect(byRating.first.id, 2); // zamzam happens to be near, but…
      expect(byRating.map((s) => s.id).toList().sublist(1, 3), [4, 3]); // …the 2nd/3rd are 22 km / 14 km away
    });

    test('limit keeps only the nearest N', () {
      final result = nearestStores([_charco, _turkwaz, _zamzam, _byatHouse], _esenyurt.lat, _esenyurt.lng, limit: 2);
      expect(result.map((r) => r.store.id).toList(), [1, 2]);
    });

    test('stores without usable coordinates are left out, never ranked first', () {
      final result = nearestStores(
        [_store(10, 'بلا إحداثيات'), _store(11, 'خط الصفر', lat: 0, lng: 0), _store(12, 'نصف إحداثية', lat: 41.0), _byatHouse],
        _esenyurt.lat,
        _esenyurt.lng,
      );
      expect(result.map((r) => r.store.id).toList(), [1]);
    });

    test('identical distance falls back to rating, then id', () {
      final a = _store(20, 'a', lat: 41.02, lng: 28.68, rating: 3.0);
      final b = _store(21, 'b', lat: 41.02, lng: 28.68, rating: 4.5);
      final c = _store(22, 'c', lat: 41.02, lng: 28.68, rating: 4.5);
      final result = nearestStores([a, c, b], _esenyurt.lat, _esenyurt.lng);
      expect(result.map((r) => r.store.id).toList(), [21, 22, 20]);
    });

    test('a closed store is still ranked by distance (shown dimmed, not hidden)', () {
      final closed = _store(30, 'مغلق', lat: 41.0150, lng: 28.6780, open: false);
      final result = nearestStores([_zamzam, closed], _esenyurt.lat, _esenyurt.lng);
      expect(result.first.store.id, 30);
    });

    test('empty input is fine', () {
      expect(nearestStores(const [], 41.0, 28.6), isEmpty);
    });
  });

  group('formatDistanceKm', () {
    test('one decimal', () => expect(formatDistanceKm(0.66), '0.7'));
    test('never claims 0.0 km', () => expect(formatDistanceKm(0.02), '0.1'));
    test('far stores', () => expect(formatDistanceKm(22.14), '22.1'));
  });

  test('SelectedLocation.isGps tells a GPS fix from a hand-picked district', () {
    expect(const SelectedLocation(lat: 1, lng: 1, label: SelectedLocation.gpsLabel).isGps, isTrue);
    expect(const SelectedLocation(lat: 1, lng: 1, label: 'إسنيورت').isGps, isFalse);
  });

  group('home rail', () {
    // The whole point: with a saved Esenyurt location the rail must be sorted by
    // distance and say so; with no location it must not claim "near you".
    Future<void> pumpHome(WidgetTester tester, {Map<String, dynamic>? savedLocation}) async {
      SharedPreferences.setMockInitialValues({});
      final prefs = await SharedPreferences.getInstance();
      final cache = LocalCache(prefs);
      if (savedLocation != null) {
        await cache.saveLocation(
          lat: savedLocation['lat'] as double,
          lng: savedLocation['lng'] as double,
          label: savedLocation['label'] as String,
        );
      }
      tester.view.physicalSize = const Size(900, 4000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.reset);

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            storeRepositoryProvider.overrideWithValue(_FakeRepo([_charco, _turkwaz, _zamzam, _byatHouse])),
            localCacheProvider.overrideWithValue(cache),
          ],
          child: const MaterialApp(
            localizationsDelegates: [DefaultMaterialLocalizations.delegate, DefaultWidgetsLocalizations.delegate],
            home: Directionality(textDirection: TextDirection.rtl, child: HomeScreen()),
          ),
        ),
      );
      await tester.pump();
      await tester.pump();
    }

    testWidgets('a customer in Esenyurt gets Esenyurt stores first, with distances', (tester) async {
      await pumpHome(tester, savedLocation: {'lat': _esenyurt.lat, 'lng': _esenyurt.lng, 'label': 'إسنيورت'});

      final rail = tester.widgetList<StoreRail>(find.byType(StoreRail, skipOffstage: false)).first;
      expect(rail.title, 'متاجر قريبة منك الآن');
      expect(rail.stores.map((s) => s.id).toList(), [1, 2, 3, 4]);
      expect(rail.distancesKm, isNotNull);
      expect(rail.distancesKm![1]!, lessThan(1));
      expect(rail.distancesKm![4]!, greaterThan(20));
      // No "set your location" prompt when we already know where they are.
      expect(find.text('حدّد موقعك لنعرض لك الأقرب', skipOffstage: false), findsNothing);
    });

    testWidgets('with no saved location the rail does not claim "near you"', (tester) async {
      await pumpHome(tester);

      final rail = tester.widgetList<StoreRail>(find.byType(StoreRail, skipOffstage: false)).first;
      expect(rail.title, 'الأكثر رواجاً');
      expect(rail.distancesKm, isNull);
      expect(find.text('حدّد موقعك لنعرض لك الأقرب', skipOffstage: false), findsOneWidget);
    });
  });
}

/// Only the calls the home screen makes; everything else is irrelevant here.
class _FakeRepo extends StoreRepository {
  _FakeRepo(this.stores);

  final List<Store> stores;

  @override
  Future<List<Store>> fetchApprovedStores({String? category}) async => stores;

  @override
  Future<Set<int>> fetchStoreIdsWithDiscountedProducts() async => const <int>{};

  @override
  Future<List<Product>> fetchDiscountedProducts({int limit = 15}) async => const <Product>[];

  @override
  Future<List<Product>> fetchFeaturedProducts({int limit = 15}) async => const <Product>[];
}
