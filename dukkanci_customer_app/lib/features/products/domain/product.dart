/// Mirrors `mapDbProduct()` in app.js / Supabase's `products` table.
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
  final List<AddonGroup> addons;

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
        image: json['image'] as String?,
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
            .map((a) => AddonGroup.fromJson(Map<String, dynamic>.from(a as Map)))
            .toList(),
      );

  /// Server is the source of truth for the final price of a variant/addon
  /// combo — this is a client-side estimate ONLY, always re-validated before
  /// order creation (spec section 14, "يجب إعادة التحقق من الأسعار... قبل
  /// إنشاء الطلب").
  double estimatedTotal({String? selectedOptionId, List<String> selectedAddonIds = const []}) {
    var total = price;
    if (selectedOptionId != null) {
      for (final group in options) {
        for (final choice in group.choices) {
          if (choice.id == selectedOptionId) total = choice.absolutePrice ?? (price + (choice.priceDelta ?? 0));
        }
      }
    }
    for (final group in addons) {
      for (final choice in group.choices) {
        if (selectedAddonIds.contains(choice.id)) total += choice.priceDelta ?? 0;
      }
    }
    return total;
  }
}

/// A mandatory/optional single-choice group (e.g. "الحجم: صغير/وسط/كبير").
class OptionGroup {
  final String id;
  final String name;
  final bool required;
  final List<OptionChoice> choices;

  const OptionGroup({required this.id, required this.name, this.required = false, this.choices = const []});

  factory OptionGroup.fromJson(Map<String, dynamic> json) => OptionGroup(
        id: json['id']?.toString() ?? '',
        name: json['name'] as String? ?? '',
        required: json['required'] as bool? ?? false,
        choices: ((json['choices'] as List?) ?? [])
            .map((c) => OptionChoice.fromJson(Map<String, dynamic>.from(c as Map)))
            .toList(),
      );
}

class OptionChoice {
  final String id;
  final String label;
  /// If set, this choice REPLACES the base price (e.g. "كبير" = 180 TRY flat)
  /// rather than adding a delta — the buyer modal must show this full price,
  /// not base+delta (see memory: product-variant-price-fix, a real prior bug
  /// where the modal showed base+delta and double-counted).
  final double? absolutePrice;
  final double? priceDelta;

  const OptionChoice({required this.id, required this.label, this.absolutePrice, this.priceDelta});

  factory OptionChoice.fromJson(Map<String, dynamic> json) => OptionChoice(
        id: json['id']?.toString() ?? '',
        label: json['label'] as String? ?? '',
        absolutePrice: (json['price'] as num?)?.toDouble(),
        priceDelta: (json['delta'] as num?)?.toDouble(),
      );
}

/// A multi-select addon group (e.g. "الإضافات") with its own min/max.
class AddonGroup {
  final String id;
  final String name;
  final int min;
  final int? max;
  final List<AddonChoice> choices;

  const AddonGroup({required this.id, required this.name, this.min = 0, this.max, this.choices = const []});

  factory AddonGroup.fromJson(Map<String, dynamic> json) => AddonGroup(
        id: json['id']?.toString() ?? '',
        name: json['name'] as String? ?? '',
        min: (json['min'] as num?)?.toInt() ?? 0,
        max: (json['max'] as num?)?.toInt(),
        choices: ((json['choices'] as List?) ?? [])
            .map((c) => AddonChoice.fromJson(Map<String, dynamic>.from(c as Map)))
            .toList(),
      );
}

class AddonChoice {
  final String id;
  final String label;
  final double? priceDelta;
  final bool available;

  const AddonChoice({required this.id, required this.label, this.priceDelta, this.available = true});

  factory AddonChoice.fromJson(Map<String, dynamic> json) => AddonChoice(
        id: json['id']?.toString() ?? '',
        label: json['label'] as String? ?? '',
        priceDelta: (json['delta'] as num?)?.toDouble(),
        available: json['available'] as bool? ?? true,
      );
}
