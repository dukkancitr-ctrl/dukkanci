import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:dukkanci_customer_app/core/cache/local_cache.dart';
import 'package:dukkanci_customer_app/features/cart/application/cart_controller.dart' show localCacheProvider;
import 'package:dukkanci_customer_app/features/home/presentation/widgets/store_card.dart';
import 'package:dukkanci_customer_app/features/stores/domain/store.dart';

/// Regression for the store-card grid clipping its bottom line.
///
/// The category/search grids used `childAspectRatio: 0.72` (a fixed 173×240 card
/// on a phone) but the card's meta chips — rating, ETA, per-km fee — wrap onto 1,
/// 2 or 3 lines, so a store showing all three overflowed by 17px and the last
/// line was cut off. [StoreCardGrid] sizes each row to its content instead.
Store _store(int id, {bool full = false}) => Store(
      id: id,
      name: 'متجر $id',
      category: 'مطاعم',
      // `full` = the worst case: rating + ETA + per-km fee chips all present.
      rating: full ? 4.7 : 0,
      reviews: full ? 40 : 0,
      etaLabel: full ? '30 - 45 دقيقة' : null,
      deliveryFeePerKm: full ? 20 : null,
    );

Future<void> _pump(WidgetTester tester, List<Store> stores, {double textScale = 1.0, double width = 390}) async {
  SharedPreferences.setMockInitialValues({});
  final cache = LocalCache(await SharedPreferences.getInstance());
  tester.view.physicalSize = Size(width, 2400);
  tester.view.devicePixelRatio = 1.0;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(
    ProviderScope(
      overrides: [localCacheProvider.overrideWithValue(cache)],
      child: MaterialApp(
        localizationsDelegates: const [DefaultMaterialLocalizations.delegate, DefaultWidgetsLocalizations.delegate],
        builder: (context, child) => MediaQuery(
          data: MediaQuery.of(context).copyWith(textScaler: TextScaler.linear(textScale)),
          child: child!,
        ),
        home: Scaffold(
          body: Directionality(
            textDirection: TextDirection.rtl,
            child: CustomScrollView(
              slivers: [
                SliverPadding(
                  padding: const EdgeInsets.all(16),
                  sliver: StoreCardGrid(stores: stores),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
  await tester.pump();
}

void main() {
  testWidgets('a store with all three chips is not clipped', (tester) async {
    await _pump(tester, [_store(1, full: true), _store(2, full: true), _store(3, full: true), _store(4, full: true)]);
    // A RenderFlex overflow is reported as a FlutterError via takeException.
    expect(tester.takeException(), isNull);
    expect(find.byType(StoreCard), findsNWidgets(4));
  });

  testWidgets('still not clipped with a larger system font (1.6x)', (tester) async {
    await _pump(tester, [_store(1, full: true), _store(2, full: true)], textScale: 1.6);
    expect(tester.takeException(), isNull);
  });

  testWidgets('still not clipped on a narrow 320dp phone', (tester) async {
    await _pump(tester, [_store(1, full: true), _store(2, full: true)], width: 320);
    expect(tester.takeException(), isNull);
  });

  testWidgets('two cards in a row share one height (the shorter stretches)', (tester) async {
    await _pump(tester, [_store(1, full: true), _store(2)]);
    expect(tester.takeException(), isNull);
    final tall = tester.getSize(find.byType(StoreCard).at(0)).height;
    final short = tester.getSize(find.byType(StoreCard).at(1)).height;
    expect(short, tall);
  });

  testWidgets('rows are only as tall as their content', (tester) async {
    await _pump(tester, [_store(1, full: true), _store(2, full: true), _store(3), _store(4)]);
    expect(tester.takeException(), isNull);
    final fullRow = tester.getSize(find.byType(StoreCard).at(0)).height;
    final plainRow = tester.getSize(find.byType(StoreCard).at(2)).height;
    // No chips ⇒ a shorter card, not the same fixed height with dead space.
    expect(plainRow, lessThan(fullRow));
  });

  testWidgets('an odd last store keeps half width instead of stretching', (tester) async {
    await _pump(tester, [_store(1), _store(2), _store(3)]);
    expect(tester.takeException(), isNull);
    final first = tester.getSize(find.byType(StoreCard).at(0)).width;
    final last = tester.getSize(find.byType(StoreCard).at(2)).width;
    expect(last, first);
  });

  testWidgets('empty list renders nothing and does not throw', (tester) async {
    await _pump(tester, const []);
    expect(tester.takeException(), isNull);
    expect(find.byType(StoreCard), findsNothing);
  });
}
