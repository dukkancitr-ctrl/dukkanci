import 'package:flutter/material.dart';
import '../../stores/domain/store.dart';

/// Curated category taxonomy for the home shortcuts + category pages.
///
/// The raw `stores.category` column carries messy legacy duplicates
/// ("ملاحم" vs "ملحمة ومشاوي", "بن ومكسرات" vs "مكسرات وبهارات"), so each
/// button here maps to *all* the raw strings that belong under it. Counts are
/// always computed from the real fetched store list — a button with zero live
/// stores simply never renders (see HomeScreen), never a hard-coded number.
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

  bool matches(Store s) => rawCategories.contains(s.category);

  static const all = <HomeCategory>[
    HomeCategory(key: 'restaurants', label: 'مطاعم', icon: Icons.restaurant_rounded, rawCategories: ['مطاعم']),
    HomeCategory(key: 'sweets', label: 'حلويات', icon: Icons.cake_rounded, rawCategories: ['حلويات']),
    HomeCategory(key: 'supermarket', label: 'سوبر ماركت', icon: Icons.shopping_cart_rounded, rawCategories: ['سوبر ماركت']),
    HomeCategory(key: 'butcher', label: 'ملاحم', icon: Icons.outdoor_grill_rounded, rawCategories: ['ملاحم', 'ملحمة ومشاوي']),
    HomeCategory(key: 'nuts', label: 'مكسرات وبن', icon: Icons.coffee_rounded, rawCategories: ['بن ومكسرات', 'مكسرات وبهارات']),
    HomeCategory(key: 'specialty', label: 'مواد غذائية', icon: Icons.local_grocery_store_rounded, rawCategories: ['مواد غذائية متخصصة']),
    HomeCategory(key: 'juices', label: 'عصائر', icon: Icons.local_drink_rounded, rawCategories: ['عصائر']),
    HomeCategory(key: 'home_kitchen', label: 'مطابخ منزلية', icon: Icons.soup_kitchen_rounded, rawCategories: ['مطابخ منزلية']),
  ];

  static HomeCategory? byKey(String key) {
    for (final c in all) {
      if (c.key == key) return c;
    }
    return null;
  }
}
