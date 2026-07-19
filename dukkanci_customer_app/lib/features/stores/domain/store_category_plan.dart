import '../../products/domain/product.dart';
import 'store.dart';

/// Dart port of the store-page category organizer built in `app.js`
/// (`buildStoreCategoryPlan` and friends). Groups a store's raw, free-text
/// `product.category` strings into an ordered, deduped, non-empty set of
/// display buckets: known synonyms of the same category collapse together,
/// tiny (<=2 product) one-off categories fold into a related bucket via a
/// curated keyword list (or land in "تصنيفات أخرى" when no confident match
/// exists), and admin/merchant manual overrides (`stores.category_settings`)
/// apply on top — same behavior as the website, byte-for-byte on the
/// canonical order lists and alias/merge tables, so a customer sees the same
/// category order/merge on the app as on the website.
///
/// This is display-layer only — it never mutates `product.category` and
/// nothing here is persisted; it's recomputed fresh on every build.
class CategoryBucket {
  final String label;
  final List<String> rawCategories;
  final List<Product> products;

  const CategoryBucket({required this.label, required this.rawCategories, required this.products});
}

const List<String> kRestaurantCategoryOrder = [
  'وجبات الإفطار', 'الشوربات', 'السلطات', 'المقبلات الباردة', 'المقبلات الساخنة', 'المقبلات',
  'الأطباق الرئيسية', 'المشاوي', 'البرغر', 'الشاورما', 'السندويشات', 'البيتزا',
  'المناقيش والمعجنات', 'الأرز والمعكرونة', 'الوجبات الفردية', 'الوجبات العائلية', 'وجبات الأطفال',
  'الأطباق الجانبية', 'الإضافات والصوصات', 'الحلويات', 'المشروبات الساخنة', 'العصائر والكوكتيلات',
  'المشروبات الباردة', 'المشروبات الغازية والمياه',
];

const List<String> kSupermarketCategoryOrder = [
  'وصل حديثاً', 'الخضروات والفواكه', 'اللحوم والدواجن', 'الأسماك والمأكولات البحرية', 'الألبان والأجبان',
  'البيض', 'المخبوزات والخبز', 'المواد الغذائية الأساسية', 'الأرز والحبوب', 'البقوليات',
  'المعكرونة والشعيرية', 'الطحين ومستلزمات الخَبز', 'الزيوت والسمن', 'السكر والملح', 'المعلبات',
  'الصلصات ومعجون الطماطم', 'التوابل والبهارات', 'المخللات والزيتون', 'منتجات الإفطار', 'العسل والمربى',
  'الشوكولاتة والحلويات', 'البسكويت والكيك', 'الشيبس والمقرمشات', 'المكسرات والفواكه المجففة', 'المجمدات',
  'الوجبات الجاهزة', 'المياه', 'المشروبات الغازية', 'العصائر', 'الشاي والقهوة', 'مشروبات الطاقة',
  'حليب الأطفال وأغذية الأطفال', 'العناية الشخصية', 'العناية بالشعر والجسم', 'المناديل والمنتجات الورقية',
  'المنظفات المنزلية', 'مستلزمات المطبخ', 'مستلزمات المنزل', 'منتجات الحيوانات الأليفة', 'تصنيفات موسمية',
];

/// Loose match key: trims, drops Arabic diacritics/tatweel, and strips a
/// leading "ال" from EACH word (not just the first) so "المشروبات"/"مشروبات"
/// or "المقبلات الباردة"/"مقبلات باردة" collapse to the same key without an
/// explicit alias for every "ال" variant.
String normalizeCategoryKey(String? raw) {
  final trimmed = (raw ?? '').trim();
  if (trimmed.isEmpty) return '';
  final noDiacritics = trimmed.replaceAll(RegExp(r'[ـً-ٟ]'), '');
  final collapsed = noDiacritics.replaceAll(RegExp(r'\s+'), ' ');
  return collapsed
      .split(' ')
      .map((w) => (w.length > 2 && w.startsWith('ال')) ? w.substring(2) : w)
      .join(' ');
}

Map<String, String> _buildCategoryAliasMap(List<String> orderList, Map<String, String> extraSynonyms) {
  final map = <String, String>{};
  for (final name in orderList) {
    map[normalizeCategoryKey(name)] = name;
  }
  extraSynonyms.forEach((k, v) => map[normalizeCategoryKey(k)] = v);
  return map;
}

/// Explicit synonym examples from the spec beyond what the "ال"-stripping
/// above already unifies on its own.
final Map<String, String> kRestaurantCategoryAliases = _buildCategoryAliasMap(kRestaurantCategoryOrder, {
  'مشروب': 'المشروبات الباردة',
  'الحلو': 'الحلويات',
  'قسم الحلويات': 'الحلويات',
  'عصير طبيعي': 'العصائر والكوكتيلات',
  'عصائر طازجة': 'العصائر والكوكتيلات',
  'عصائر': 'العصائر والكوكتيلات',
  'أنواع السلطات': 'السلطات',
  'السلطة': 'السلطات',
  'مقبلات متنوعة': 'المقبلات',
});

final Map<String, String> kSupermarketCategoryAliases = _buildCategoryAliasMap(kSupermarketCategoryOrder, {
  'صلصات': 'الصلصات ومعجون الطماطم',
  'طحينة': 'الصلصات ومعجون الطماطم',
});

class CategoryMergeRule {
  final String target;
  final List<String> keywords;
  const CategoryMergeRule(this.target, this.keywords);
}

/// Small (<=2 product) categories that don't match an official name outright
/// get one more chance via these keyword lists before falling into "تصنيفات
/// أخرى". Never applied to a category that already resolved to an official
/// name — official categories are never auto-merged away just for being small.
const List<CategoryMergeRule> kRestaurantMergeTargets = [
  CategoryMergeRule('المقبلات الباردة', ['حمص', 'متبل', 'لبنة', 'ورق عنب', 'بابا غنوج']),
  CategoryMergeRule('المقبلات الساخنة', ['كبة مقلية', 'كبة', 'سمبوسك', 'أصابع جبن', 'بطاطا مقلية', 'بطاطا']),
  CategoryMergeRule('الإضافات والصوصات', ['كاتشب', 'مايونيز', 'ثوم', 'خبز إضافي', 'صوص']),
  CategoryMergeRule('الأطباق الجانبية', ['أرز جانبي', 'خضار مشكل', 'برغل']),
  CategoryMergeRule('المشروبات الباردة', ['مياه', 'عيران', 'كولا', 'مشروب غازي', 'مشروبات غازية']),
  CategoryMergeRule('المشروبات الساخنة', ['قهوة', 'شاي', 'نسكافيه']),
  CategoryMergeRule('الحلويات', ['كنافة', 'بقلاوة', 'كيك', 'مهلبية']),
];

const List<CategoryMergeRule> kSupermarketMergeTargets = [
  CategoryMergeRule('البقوليات', ['عدس', 'حمص', 'فاصولياء', 'فاصوليا']),
  CategoryMergeRule('الأرز والحبوب', ['أرز مصري', 'أرز بسمتي', 'برغل', 'أرز']),
  CategoryMergeRule('الزيوت والسمن', ['زيت دوار الشمس', 'زيت زيتون', 'سمن', 'زيت']),
  CategoryMergeRule('السكر والملح', ['سكر', 'ملح']),
  CategoryMergeRule('الصلصات ومعجون الطماطم', ['كاتشب', 'مايونيز', 'دبس رمان', 'طحينة', 'صلصة']),
  CategoryMergeRule('العسل والمربى', ['مربى', 'عسل', 'دبس']),
  CategoryMergeRule('العناية الشخصية', ['شامبو', 'صابون', 'مزيل عرق']),
  CategoryMergeRule('المنظفات المنزلية', ['مسحوق غسيل', 'سائل جلي', 'منظف أرضيات', 'منظف']),
  CategoryMergeRule('المناديل والمنتجات الورقية', ['محارم', 'ورق تواليت', 'مناديل مطبخ', 'مناديل']),
];

/// Resolves this store's manual override (if any) for one raw
/// `product.category` string. Platform-admin's override wins wholesale over
/// the merchant's for the same raw category when both exist.
CategoryOverride? resolveCategoryOverride(Store store, String raw) => store.categorySettings.resolve(raw);

bool _hasAnyOverrides(Store store) => store.categorySettings.admin.isNotEmpty || store.categorySettings.merchant.isNotEmpty;

/// Products whose raw category was manually marked "hidden" never reach the
/// storefront at all — same treatment as an unavailable product. Call this on
/// the store's product list BEFORE anything else derives from it (offers/
/// popular rails, counts), so a hidden category disappears consistently
/// everywhere, not just from the category bar.
List<Product> filterHiddenCategoryProducts(Store store, List<Product> list) {
  if (!_hasAnyOverrides(store)) return list;
  final hiddenRaw = <String>{};
  for (final p in list) {
    final raw = (p.category ?? '').trim();
    if (hiddenRaw.contains(raw)) continue;
    final ov = resolveCategoryOverride(store, raw);
    if (ov != null && ov.hidden) hiddenRaw.add(raw);
  }
  if (hiddenRaw.isEmpty) return list;
  return list.where((p) => !hiddenRaw.contains((p.category ?? '').trim())).toList();
}

/// Applies a manual sort-order override on top of an already-computed bucket
/// list. Explicit numbers (lower = earlier) win outright; buckets nobody
/// customized keep their existing relative order, placed after any numbered
/// ones. "تصنيفات أخرى" always stays last — its members are by definition the
/// ones nobody bothered to customize.
List<CategoryBucket> applyManualCategoryOrder(Store store, List<CategoryBucket> buckets) {
  if (!_hasAnyOverrides(store)) return buckets;
  CategoryBucket? other;
  final rest = <CategoryBucket>[];
  for (final b in buckets) {
    if (b.label == 'تصنيفات أخرى') {
      other = b;
    } else {
      rest.add(b);
    }
  }
  final keyed = <MapEntry<int, CategoryBucket>>[];
  for (var i = 0; i < rest.length; i++) {
    final b = rest[i];
    int? best;
    for (final raw in b.rawCategories) {
      final ov = resolveCategoryOverride(store, raw);
      if (ov != null && ov.sortOrder != null && (best == null || ov.sortOrder! < best)) {
        best = ov.sortOrder;
      }
    }
    keyed.add(MapEntry(best ?? (1000 + i), b));
  }
  keyed.sort((a, b) => a.key.compareTo(b.key));
  final result = keyed.map((e) => e.value).toList();
  if (other != null) result.add(other);
  return result;
}

class _MutableBucket {
  final Set<String> rawCategories = {};
  final List<Product> products = [];
  bool isOfficial = false;
}

List<CategoryBucket> buildStoreCategoryPlan(Store store, List<Product> allStoreProducts) {
  final isRestaurant = store.category == 'مطاعم';
  final isSupermarket = store.category == 'سوبر ماركت';
  final orderList = isRestaurant ? kRestaurantCategoryOrder : (isSupermarket ? kSupermarketCategoryOrder : null);

  final rawGroups = <String, List<Product>>{};
  for (final p in allStoreProducts) {
    final raw = (p.category ?? '').trim();
    rawGroups.putIfAbsent(raw, () => []).add(p);
  }

  if (orderList == null) {
    // Store types outside "مطاعم"/"سوبر ماركت": no automatic merge/reorder, but
    // a manual mergeInto override still applies for any store type — an
    // admin/merchant can fold one raw category into another by hand.
    final merged = <String, _MutableBucket>{};
    rawGroups.forEach((raw, prods) {
      final ov = resolveCategoryOverride(store, raw);
      final target = ov?.mergeInto;
      final label = (target != null && target.isNotEmpty) ? target : raw;
      final bucket = merged.putIfAbsent(label, () => _MutableBucket());
      bucket.rawCategories.add(raw);
      bucket.products.addAll(prods);
    });
    final plan = merged.entries
        .map((e) => CategoryBucket(label: e.key, rawCategories: e.value.rawCategories.toList(), products: e.value.products))
        .toList();
    return applyManualCategoryOrder(store, plan);
  }

  final aliasMap = isRestaurant ? kRestaurantCategoryAliases : kSupermarketCategoryAliases;
  final mergeTargets = isRestaurant ? kRestaurantMergeTargets : kSupermarketMergeTargets;

  // Single map keyed by FINAL label (not two separate official/custom maps —
  // a manual mergeInto target can collide textually with another raw
  // category's own name; splitting into two maps would let each land under
  // the same label text in a different map and render as two duplicate
  // pills instead of merging into one). isOfficial is a per-bucket flag.
  final buckets = <String, _MutableBucket>{};
  final pinned = <String>{}; // raw categories forced standalone (disableAutoMerge/forceVisible)
  rawGroups.forEach((raw, prods) {
    final ov = resolveCategoryOverride(store, raw);
    final manualTarget = (ov?.mergeInto != null && ov!.mergeInto!.isNotEmpty) ? ov.mergeInto : null;
    final aliasTarget = aliasMap[normalizeCategoryKey(raw)];
    final isOfficial = manualTarget != null || aliasTarget != null;
    final label = manualTarget ?? aliasTarget ?? raw;
    if (manualTarget == null && ov != null && (ov.disableAutoMerge || ov.forceVisible)) pinned.add(raw);
    final bucket = buckets.putIfAbsent(label, () => _MutableBucket());
    if (isOfficial) bucket.isOfficial = true;
    bucket.rawCategories.add(raw);
    bucket.products.addAll(prods);
  });

  // Shrink pass: any bucket nobody officially claimed (no alias/manual match)
  // and with <=2 products, and not pinned standalone, tries an automatic
  // keyword merge target next, else falls into "تصنيفات أخرى". Official/
  // manually-targeted buckets are NEVER shrunk, however small.
  final otherBucket = _MutableBucket();
  final shrinkCandidates = buckets.entries
      .where((e) => !e.value.isOfficial && e.value.products.length <= 2 && !e.value.rawCategories.any(pinned.contains))
      .map((e) => e.key)
      .toList();
  for (final label in shrinkCandidates) {
    final bucket = buckets.remove(label)!;
    final key = normalizeCategoryKey(label);
    CategoryMergeRule? match;
    for (final rule in mergeTargets) {
      if (rule.keywords.any((kw) => key.contains(normalizeCategoryKey(kw)))) {
        match = rule;
        break;
      }
    }
    if (match != null) {
      final target = buckets.putIfAbsent(match.target, () => _MutableBucket());
      target.isOfficial = true;
      target.rawCategories.addAll(bucket.rawCategories);
      target.products.addAll(bucket.products);
    } else {
      otherBucket.rawCategories.addAll(bucket.rawCategories);
      otherBucket.products.addAll(bucket.products);
    }
  }

  final orderedOfficial = <CategoryBucket>[];
  for (final label in orderList) {
    final b = buckets.remove(label);
    if (b != null) {
      orderedOfficial.add(CategoryBucket(label: label, rawCategories: b.rawCategories.toList(), products: b.products));
    }
  }
  // Whatever's left (custom categories, and manual mergeInto targets outside
  // orderList — e.g. a brand-new admin-chosen heading) stays in
  // first-appearance order.
  final standaloneCustom = buckets.entries
      .map((e) => CategoryBucket(label: e.key, rawCategories: e.value.rawCategories.toList(), products: e.value.products))
      .toList();

  final result = [...orderedOfficial, ...standaloneCustom];
  if (otherBucket.products.isNotEmpty) {
    result.add(CategoryBucket(label: 'تصنيفات أخرى', rawCategories: otherBucket.rawCategories.toList(), products: otherBucket.products));
  }
  return applyManualCategoryOrder(store, result);
}
