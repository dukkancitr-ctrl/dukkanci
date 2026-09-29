import 'package:flutter_test/flutter_test.dart';
import 'package:dukkanci_customer_app/features/home/domain/home_category.dart';
import 'package:dukkanci_customer_app/features/stores/domain/store.dart';

Store _s(int id, String category) => Store(id: id, name: 'S$id', category: category);

void main() {
  // Every raw category live in production on 2026-09-29.
  const liveCategories = [
    'المياه المعدنية', 'بن ومكسرات', 'حلويات', 'سوبر ماركت', 'عصائر',
    'مطابخ سحابية', 'مطاعم', 'مكسرات وبهارات', 'ملاحم', 'ملحمة ومشاوي',
    'مواد غذائية متخصصة',
  ];

  test('every live store belongs to at least one visible category', () {
    final stores = [for (var i = 0; i < liveCategories.length; i++) _s(i, liveCategories[i])];
    final cats = HomeCategory.forStores(stores);
    for (final s in stores) {
      expect(cats.any((c) => c.matches(s)), isTrue, reason: s.category);
    }
  });

  test('a category the app has never heard of gets its own tile', () {
    final stores = [_s(1, 'مطاعم'), _s(2, 'زهور وهدايا'), _s(3, 'زهور وهدايا')];
    final cats = HomeCategory.forStores(stores);
    final flowers = cats.firstWhere((c) => c.label == 'زهور وهدايا');
    expect(stores.where(flowers.matches).length, 2);
    // Its key round-trips through the router back to the same category.
    final resolved = HomeCategory.resolve(flowers.key)!;
    expect(resolved.label, 'زهور وهدايا');
    expect(resolved.matches(stores[1]), isTrue);
  });

  test('renamed category keeps old and new names under one tile', () {
    final cats = HomeCategory.forStores([_s(1, 'مطابخ سحابية'), _s(2, 'مطابخ منزلية')]);
    expect(cats.length, 1);
    expect(cats.single.key, 'home_kitchen');
  });

  test('curated categories with no stores are hidden; synthetic keys do not resolve', () {
    expect(HomeCategory.forStores([_s(1, 'مطاعم')]).map((c) => c.key), ['restaurants']);
    expect(HomeCategory.resolve('all'), isNull);
    expect(HomeCategory.resolve('offers'), isNull);
    expect(HomeCategory.resolve('raw:'), isNull);
  });
}
