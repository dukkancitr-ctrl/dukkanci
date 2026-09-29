import 'package:flutter/material.dart';
import '../../stores/domain/store.dart';

/// Category taxonomy for the home shortcuts + category pages.
///
/// The raw `stores.category` column carries messy legacy duplicates
/// ("ملاحم" vs "ملحمة ومشاوي", "بن ومكسرات" vs "مكسرات وبهارات"), so each
/// curated button maps to *all* the raw strings that belong under it. Counts
/// are always computed from the real fetched store list — a button with zero
/// live stores simply never renders, never a hard-coded number.
///
/// 🔴 The curated list alone is NOT the source of truth. It used to be, and
/// every category added or renamed on the website (e.g. «المياه المعدنية»,
/// «مطابخ منزلية» → «مطابخ سحابية» on 2026-09-23) silently made its stores
/// unreachable in the app — they existed in the fetched list but belonged to
/// no tile. Always build the visible list with [forStores]: any raw category
/// not covered below gets its own generated tile automatically, so a store
/// added to the website shows up in the app with zero app changes.
class HomeCategory {
  final String key;
  final String label;
  final IconData icon;
  final List<String> rawCategories;

  const HomeCategory({
    required this.key,
    required this.label,
    required this.icon,
    required this.rawCategories,
  });

  bool matches(Store s) => rawCategories.contains(s.category.trim());

  /// Key prefix for generated (non-curated) categories. The raw Arabic name
  /// travels in the key itself, so a generated tile's page can always be
  /// rebuilt from its route alone — see [resolve].
  static const _rawPrefix = 'raw:';

  /// Curated entries: nicer labels/icons and legacy-duplicate merging. Order
  /// here is the display order; generated categories follow after.
  static const all = <HomeCategory>[
    HomeCategory(key: 'restaurants', label: 'مطاعم', icon: Icons.restaurant_rounded, rawCategories: ['مطاعم']),
    HomeCategory(key: 'sweets', label: 'حلويات', icon: Icons.cake_rounded, rawCategories: ['حلويات']),
    HomeCategory(key: 'supermarket', label: 'سوبر ماركت', icon: Icons.shopping_cart_rounded, rawCategories: ['سوبر ماركت']),
    HomeCategory(key: 'butcher', label: 'ملاحم', icon: Icons.outdoor_grill_rounded, rawCategories: ['ملاحم', 'ملحمة ومشاوي']),
    HomeCategory(key: 'nuts', label: 'مكسرات وبن', icon: Icons.coffee_rounded, rawCategories: ['بن ومكسرات', 'مكسرات وبهارات']),
    HomeCategory(key: 'specialty', label: 'مواد غذائية', icon: Icons.local_grocery_store_rounded, rawCategories: ['مواد غذائية متخصصة']),
    HomeCategory(key: 'juices', label: 'عصائر', icon: Icons.local_drink_rounded, rawCategories: ['عصائر']),
    // Renamed on the website 2026-09-23; the old name is kept so a store row
    // still carrying it is not orphaned.
    HomeCategory(key: 'home_kitchen', label: 'مطابخ سحابية', icon: Icons.soup_kitchen_rounded, rawCategories: ['مطابخ سحابية', 'مطابخ منزلية']),
    HomeCategory(key: 'mineral_water', label: 'المياه المعدنية', icon: Icons.water_drop_rounded, rawCategories: ['المياه المعدنية']),
  ];

  static HomeCategory? byKey(String key) {
    for (final c in all) {
      if (c.key == key) return c;
    }
    return null;
  }

  /// Curated key, or a generated `raw:<category>` key. Returns null only for
  /// synthetic keys ("all", "offers", "popular") and garbage.
  static HomeCategory? resolve(String key) {
    final curated = byKey(key);
    if (curated != null) return curated;
    if (key.startsWith(_rawPrefix)) {
      final raw = key.substring(_rawPrefix.length).trim();
      if (raw.isNotEmpty) return _generated(raw);
    }
    return null;
  }

  static HomeCategory _generated(String raw) => HomeCategory(
        key: '$_rawPrefix$raw',
        label: raw,
        icon: Icons.storefront_rounded,
        rawCategories: [raw],
      );

  /// Every category that has at least one store in [stores]: curated ones
  /// first (in their fixed order), then one generated tile per raw category
  /// no curated entry covers. Guarantees every store is reachable from a tile.
  static List<HomeCategory> forStores(List<Store> stores) {
    final curated = all.where((c) => stores.any(c.matches)).toList();
    final covered = {for (final c in all) ...c.rawCategories};
    final extra = <String, int>{};
    for (final s in stores) {
      final raw = s.category.trim();
      if (raw.isEmpty || covered.contains(raw)) continue;
      extra[raw] = (extra[raw] ?? 0) + 1;
    }
    final generated = extra.keys.toList()..sort((a, b) => extra[b]!.compareTo(extra[a]!));
    return [...curated, for (final raw in generated) _generated(raw)];
  }
}
