import '../../../core/utils/asset_url.dart';

/// Mirrors `mapDbProduct()` in app.js / Supabase's `products` table.
///
/// `options`/`addons` shapes below were reverse-engineered from REAL data in
/// Supabase + app.js's actual rendering code (openProductModal, addToCart),
/// not guessed — see product_screen.dart for why that mattered (an earlier,
/// invented {id, choices: [...]} shape didn't match reality and crashed on
/// the first product with real variants).
class Product {
  final int id;
  final int storeId;
  final String name;
  final String? image;
  final double price;
  final double? oldPrice;
  final bool priceOnRequest;
  final String? unit;
  final String? category;
  final bool available;
  final bool featured;
  final String? description;
  final List<OptionGroup> options;
  final List<Addon> addons;

  const Product({
    required this.id,
    required this.storeId,
    required this.name,
    this.image,
    required this.price,
    this.oldPrice,
    this.priceOnRequest = false,
    this.unit,
    this.category,
    this.available = true,
    this.featured = false,
    this.description,
    this.options = const [],
    this.addons = const [],
  });

  factory Product.fromJson(Map<String, dynamic> json) => Product(
        id: json['id'] as int,
        storeId: json['store_id'] as int,
        name: json['name'] as String? ?? '',
        image: resolveAssetUrl(json['image'] as String?),
        price: (json['price'] as num?)?.toDouble() ?? 0,
        oldPrice: (json['old_price'] as num?)?.toDouble(),
        priceOnRequest: json['price_on_request'] as bool? ?? false,
        unit: json['unit'] as String?,
        category: json['category'] as String?,
        available: json['available'] as bool? ?? true,
        featured: json['featured'] as bool? ?? false,
        description: json['description'] as String?,
        options: ((json['options'] as List?) ?? [])
            .map((o) => OptionGroup.fromJson(Map<String, dynamic>.from(o as Map)))
            .toList(),
        addons: ((json['addons'] as List?) ?? [])
            .map((a) => Addon.fromJson(Map<String, dynamic>.from(a as Map)))
            .toList(),
      );

  /// Server is the source of truth for the final price of a variant/addon
  /// combo — this is a client-side estimate ONLY, always re-validated before
  /// order creation (spec section 14, "يجب إعادة التحقق من الأسعار... قبل
  /// إنشاء الطلب"). Matches app.js's own math exactly: price + selected
  /// option delta + sum of selected addon prices (never an absolute
  /// replacement price — every option is base+delta, always).
  double estimatedTotal({List<int?> selectedValueIndexPerOption = const [], Set<int> selectedAddonIndexes = const {}}) {
    var total = price;
    for (var i = 0; i < options.length; i++) {
      final selectedIndex = i < selectedValueIndexPerOption.length ? selectedValueIndexPerOption[i] : null;
      final index = selectedIndex ?? 0; // app.js defaults the first radio to checked
      if (index < options[i].extra.length) total += options[i].extra[index];
    }
    for (var i = 0; i < addons.length; i++) {
      if (selectedAddonIndexes.contains(i)) total += addons[i].price;
    }
    return total;
  }
}

/// A single-select option group rendered as radio buttons, first value
/// defaulted to checked (e.g. "الكمية: كيلو / نصف كيلو") — there is no
/// "optional" variant of this in the real data; a product either has no
/// options or exactly one always-selected choice per group.
class OptionGroup {
  final String name;
  final List<String> values;
  final List<double> extra;

  const OptionGroup({required this.name, this.values = const [], this.extra = const []});

  factory OptionGroup.fromJson(Map<String, dynamic> json) => OptionGroup(
        name: json['name'] as String? ?? '',
        values: ((json['values'] as List?) ?? []).map((v) => v.toString()).toList(),
        extra: ((json['extra'] as List?) ?? []).map((e) => (e as num?)?.toDouble() ?? 0).toList(),
      );
}

/// A single independent checkbox addon (e.g. "جبنة إضافية +20") — addons are
/// a flat list, NOT grouped; each one is its own optional multi-select item.
class Addon {
  final String name;
  final double price;

  const Addon({required this.name, this.price = 0});

  factory Addon.fromJson(Map<String, dynamic> json) => Addon(
        name: json['name'] as String? ?? '',
        price: (json['price'] as num?)?.toDouble() ?? 0,
      );
}
