@Tags(['network'])
library;

import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:dukkanci_customer_app/core/config/app_config.dart';
import 'package:dukkanci_customer_app/core/utils/arabic.dart';
import 'package:dukkanci_customer_app/features/stores/data/store_repository.dart';

/// Hits the REAL Supabase catalog (read-only) through the REAL supabase-dart
/// client. This exists because the Arabic search path has one risk that no
/// hermetic test can cover: the app has never before sent Arabic text to
/// PostgREST as a filter value, so the client's URL construction and
/// percent-encoding of an Arabic `ilike` pattern — plus the repeated-`or`
/// AND behaviour — are only proven by an actual round trip.
///
/// Run with: flutter test test/product_search_network_test.dart
void main() {
  setUpAll(() async {
    TestWidgetsFlutterBinding.ensureInitialized();
    // flutter_test installs an HttpOverrides that 400s every request so widget
    // tests can't hit the network. This suite deliberately needs the real one.
    HttpOverrides.global = null;
    SharedPreferences.setMockInitialValues({});
    await Supabase.initialize(
      url: AppConfig.supabaseUrl,
      anonKey: AppConfig.supabaseAnonKey,
      debug: false,
    );
  });

  final repo = StoreRepository();

  test('single Arabic term round-trips and every exact match is Arabic-correct', () async {
    final candidates = await repo.searchProducts('شاورما');
    expect(candidates, isNotEmpty, reason: 'Arabic ilike filter returned nothing — encoding or pattern is broken');

    final terms = arabicSearchTerms('شاورما');
    final exact = candidates.where((p) => matchesAllTerms('${p.name} ${p.category ?? ''}', terms)).toList();
    expect(exact.length, greaterThan(100), reason: 'live catalog has 367 شاورما matches; got ${exact.length}');
  }, timeout: const Timeout(Duration(minutes: 2)));

  test('multi-term ANDs server-side and is order-independent', () async {
    final terms = arabicSearchTerms('دجاج مشوي');
    int exactCount(List<dynamic> rows) =>
        rows.where((p) => matchesAllTerms('${p.name} ${p.category ?? ''}', terms)).length;

    final forward = await repo.searchProducts('دجاج مشوي');
    final reversed = await repo.searchProducts('مشوي دجاج');

    expect(exactCount(forward), greaterThan(20));
    expect(exactCount(forward), exactCount(reversed), reason: 'term order must not change results');
  }, timeout: const Timeout(Duration(minutes: 2)));

  test('deletion tolerance: "حمص" still finds products stored with a shadda', () async {
    final candidates = await repo.searchProducts('حمص');
    final withShadda = candidates.where((p) => p.name.contains('حمّص')).toList();
    // Confirmed present in the live catalog: "حمّص", "حمّص بالقريدس".
    // A literal `*حمص*` pattern cannot match these — only the *-joined one can.
    expect(withShadda, isNotEmpty, reason: 'shadda rows missing — the *-join deletion tolerance regressed');
  }, timeout: const Timeout(Duration(minutes: 2)));

  test('spelling variance: typing "ارز" finds products stored as "أرز"', () async {
    final candidates = await repo.searchProducts('ارز');
    final withHamza = candidates.where((p) => p.name.contains('أرز')).toList();
    expect(withHamza, isNotEmpty, reason: 'alef-variant folding regressed');
  }, timeout: const Timeout(Duration(minutes: 2)));

  test('synonyms: Turkish "döner" reaches Arabic شاورما products', () async {
    final hits = await repo.searchProductsBySynonym('döner');
    expect(hits, isNotEmpty, reason: 'the !inner join or the status filter regressed');
    // The whole point: the matched term is NOT in the product's own text.
    final aliasOnly = hits.where((p) => !'${p.name} ${p.category ?? ''}'.toLowerCase().contains('döner'));
    expect(aliasOnly, isNotEmpty, reason: 'synonyms added nothing over a plain name search');
  }, timeout: const Timeout(Duration(minutes: 2)));

  test('synonyms: lowercase "dove" still matches the stored "Dove"', () async {
    // Array containment is case-sensitive — this passes only because
    // synonymMatchCandidates sends the capitalised variant too.
    final hits = await repo.searchProductsBySynonym('dove');
    expect(hits, isNotEmpty, reason: 'case variants regressed; cs.{dove} alone matches nothing');
  }, timeout: const Timeout(Duration(minutes: 2)));

  test('synonyms fail soft and never take down the main results', () async {
    final hits = await repo.searchProductsBySynonym('زقزقزقزق');
    expect(hits, isEmpty);
  }, timeout: const Timeout(Duration(minutes: 2)));

  test('offers: discounted-store ids include stores whose has_offer flag is false', () async {
    final ids = await repo.fetchStoreIdsWithDiscountedProducts();
    expect(ids, isNotEmpty);
    // باشا بيتزريا: 30 discounted pizzas, has_offer = false in the DB. It is
    // the store the user reported missing from «عروض وخصومات».
    expect(ids, contains(56), reason: 'store 56 has real discounts; the offers rail would miss it again');

    // And the flag-only view really is narrower — proving the fix adds stores
    // rather than just reshuffling them.
    final stores = await repo.fetchApprovedStores();
    final flagged = stores.where((s) => s.hasOffer).map((s) => s.id).toSet();
    final gained = stores.where((s) => !s.hasOffer && ids.contains(s.id));
    expect(gained, isNotEmpty, reason: 'expected stores discoverable only via product discounts');
    expect(flagged.contains(56), isFalse, reason: 'if 56 got flagged upstream, this test needs a new example');
  }, timeout: const Timeout(Duration(minutes: 2)));

  test('a nonsense query returns nothing rather than everything', () async {
    final candidates = await repo.searchProducts('زقزقزقزق');
    final terms = arabicSearchTerms('زقزقزقزق');
    final exact = candidates.where((p) => matchesAllTerms('${p.name} ${p.category ?? ''}', terms));
    expect(exact, isEmpty);
  }, timeout: const Timeout(Duration(minutes: 2)));
}
