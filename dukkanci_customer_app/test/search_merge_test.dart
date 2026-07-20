import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:dukkanci_customer_app/app/providers.dart';
import 'package:dukkanci_customer_app/core/cache/local_cache.dart';
import 'package:dukkanci_customer_app/features/cart/application/cart_controller.dart' show localCacheProvider;
import 'package:dukkanci_customer_app/features/products/domain/product.dart';
import 'package:dukkanci_customer_app/features/search/presentation/search_screen.dart';
import 'package:dukkanci_customer_app/features/stores/data/store_repository.dart';
import 'package:dukkanci_customer_app/features/stores/domain/store.dart';

/// Covers the one piece of the search feature that lives purely in the screen
/// and therefore isn't reachable from the repository tests: how name/category
/// hits and synonym hits are merged, de-duplicated, and gated on store
/// approval before rendering.
///
/// Deliberately hermetic — the emulator proved too unstable to drive
/// reliably at the end of a long session, and this asserts the merge far more
/// precisely than eyeballing a screenshot could anyway.
class _FakeRepo extends StoreRepository {
  _FakeRepo({required this.stores, required this.nameHits, required this.synonymHits});

  final List<Store> stores;
  final List<Product> nameHits;
  final List<Product> synonymHits;

  @override
  Future<List<Store>> fetchApprovedStores({String? category}) async => stores;

  @override
  Future<List<Product>> searchProducts(String query, {int candidateLimit = 1000}) async => nameHits;

  @override
  Future<List<Product>> searchProductsBySynonym(String query, {int limit = 200}) async => synonymHits;
}

Store _store(int id, String name) => Store(id: id, name: name, category: 'سوبر ماركت', slug: 'store-$id');

Product _product({required int id, required int storeId, required String name}) =>
    Product(id: id, storeId: storeId, name: name, price: 100, category: 'عناية');

Future<void> _search(WidgetTester tester, _FakeRepo repo, String query) async {
  SharedPreferences.setMockInitialValues({});
  final prefs = await SharedPreferences.getInstance();

  await tester.pumpWidget(
    ProviderScope(
      overrides: [
        storeRepositoryProvider.overrideWithValue(repo),
        localCacheProvider.overrideWithValue(LocalCache(prefs)),
      ],
      child: const MaterialApp(
        localizationsDelegates: [DefaultMaterialLocalizations.delegate, DefaultWidgetsLocalizations.delegate],
        home: Directionality(textDirection: TextDirection.rtl, child: SearchScreen()),
      ),
    ),
  );
  await tester.pump(); // let fetchApprovedStores resolve
  await tester.pump();

  await tester.enterText(find.byType(TextField).first, query);
  await tester.pump(const Duration(milliseconds: 400)); // clear the 300ms debounce
  await tester.pump();
  await tester.pump();
}

void main() {
  testWidgets('synonym-only hits are shown alongside name hits', (tester) async {
    final repo = _FakeRepo(
      stores: [_store(1, 'صفا الشام')],
      nameHits: [_product(id: 10, storeId: 1, name: 'صابون عادي')],
      synonymHits: [_product(id: 20, storeId: 1, name: 'صابون دوف 100غ')],
    );
    // "صابون" is in the first product's name; the second is reachable only
    // because its curated synonym says "Dove".
    await _search(tester, repo, 'صابون');

    expect(find.text('صابون عادي'), findsOneWidget);
    expect(find.text('صابون دوف 100غ'), findsOneWidget, reason: 'synonym hit was dropped by the name/category filter');
    expect(find.textContaining('منتج'), findsWidgets);
  });

  testWidgets('a product matching BOTH paths is listed once', (tester) async {
    final dup = _product(id: 30, storeId: 1, name: 'صابون دوف');
    final repo = _FakeRepo(
      stores: [_store(1, 'صفا الشام')],
      nameHits: [dup],
      synonymHits: [dup], // same product id returned by both queries
    );
    await _search(tester, repo, 'صابون');

    expect(find.text('صابون دوف'), findsOneWidget, reason: 'duplicate across name+synonym paths was not de-duplicated');
  });

  testWidgets('synonym hits from a non-approved store are excluded', (tester) async {
    final repo = _FakeRepo(
      // fetchApprovedStores only ever returns visible stores, so store 99 is
      // absent here exactly as it would be in production.
      stores: [_store(1, 'صفا الشام')],
      nameHits: const [],
      synonymHits: [
        _product(id: 40, storeId: 1, name: 'صابون دوف مسموح'),
        _product(id: 41, storeId: 99, name: 'صابون دوف مخفي'),
      ],
    );
    await _search(tester, repo, 'صابون');

    expect(find.text('صابون دوف مسموح'), findsOneWidget);
    expect(find.text('صابون دوف مخفي'), findsNothing,
        reason: 'a product from a pending/rejected store leaked into search results');
  });

  testWidgets('name hits that do not actually match are still filtered out', (tester) async {
    // searchProducts returns a deliberately permissive candidate set; the
    // screen must narrow it. Synonym hits must NOT be narrowed the same way.
    final repo = _FakeRepo(
      stores: [_store(1, 'صفا الشام')],
      nameHits: [
        _product(id: 50, storeId: 1, name: 'صابون دوف'),
        _product(id: 51, storeId: 1, name: 'شامبو غير مطابق'),
      ],
      synonymHits: const [],
    );
    await _search(tester, repo, 'صابون');

    expect(find.text('صابون دوف'), findsOneWidget);
    expect(find.text('شامبو غير مطابق'), findsNothing, reason: 'permissive server candidate was not narrowed');
  });
}
