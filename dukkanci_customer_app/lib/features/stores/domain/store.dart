import '../../../core/utils/asset_url.dart';

/// Mirrors the subset of Supabase's `stores` table (and app.js's
/// `mapDbStore()`) the customer app actually needs. Field names here are
/// camelCase Dart; `fromJson` maps from the DB's snake_case columns exactly
/// like the website does, so both clients stay interchangeable against the
/// same rows.
class Store {
  final int id;
  final String name;
  final String? slug;
  final String category;
  final String? image;
  final String? coverImage;
  final String? logoImage;
  final double rating;
  final int reviews;
  final double? deliveryFeePerKm;
  final double? minOrder;
  /// Free-text delivery-time label as stored in Supabase (e.g. "45 - 75
  /// دقيقة") — NOT a number. `stores.time` is a `text` column on real data,
  /// already formatted for display; never parse/cast it as numeric.
  final String? etaLabel;
  final double? lat;
  final double? lng;
  final bool open;
  final bool featured;
  final bool hasOffer;
  final String? offer;
  final bool priceOnRequest;
  final String? description;
  final String? address;
  final String? phone;
  final String? whatsapp;
  final String? hours;
  final PaymentMethods paymentMethods;
  final String approvalStatus;
  final StoreCategorySettings categorySettings;

  const Store({
    required this.id,
    required this.name,
    this.slug,
    required this.category,
    this.image,
    this.coverImage,
    this.logoImage,
    this.rating = 0,
    this.reviews = 0,
    this.deliveryFeePerKm,
    this.minOrder,
    this.etaLabel,
    this.lat,
    this.lng,
    this.open = true,
    this.featured = false,
    this.hasOffer = false,
    this.offer,
    this.priceOnRequest = false,
    this.description,
    this.address,
    this.phone,
    this.whatsapp,
    this.hours,
    this.paymentMethods = const PaymentMethods(),
    this.approvalStatus = 'approved',
    this.categorySettings = const StoreCategorySettings(),
  });

  /// Only stores worth showing to a customer at all — mirrors
  /// isStoreApproved()/applyPublishingRules() gating on the website: a
  /// 'pending' or 'rejected' store must never render in lists, even if a
  /// direct deep-link to it is still reachable for the merchant's own
  /// preview.
  bool get isPubliclyVisible => approvalStatus == 'approved' || approvalStatus.isEmpty;

  factory Store.fromJson(Map<String, dynamic> json) {
    final paymentMethodsJson = json['payment_methods'];
    final categorySettingsJson = json['category_settings'];
    final rawTime = (json['time'] as String?)?.trim();
    return Store(
      id: json['id'] as int,
      name: json['name'] as String? ?? '',
      slug: json['slug'] as String?,
      category: json['category'] as String? ?? '',
      image: resolveAssetUrl(json['image'] as String?),
      coverImage: resolveAssetUrl(json['cover_image'] as String?),
      logoImage: resolveAssetUrl(json['logo_image'] as String?),
      rating: (json['rating'] as num?)?.toDouble() ?? 0,
      reviews: (json['reviews'] as num?)?.toInt() ?? 0,
      deliveryFeePerKm: (json['delivery'] as num?)?.toDouble(),
      minOrder: (json['min_order'] as num?)?.toDouble(),
      etaLabel: (rawTime == null || rawTime.isEmpty) ? null : rawTime,
      lat: (json['lat'] as num?)?.toDouble(),
      lng: (json['lng'] as num?)?.toDouble(),
      open: json['open'] as bool? ?? true,
      featured: json['featured'] as bool? ?? false,
      hasOffer: json['has_offer'] as bool? ?? false,
      offer: json['offer'] as String?,
      priceOnRequest: json['price_on_request'] as bool? ?? false,
      description: json['description'] as String?,
      address: json['address'] as String?,
      phone: json['phone'] as String?,
      whatsapp: json['whatsapp'] as String?,
      hours: json['hours'] as String?,
      paymentMethods: paymentMethodsJson is Map
          ? PaymentMethods.fromJson(Map<String, dynamic>.from(paymentMethodsJson))
          : const PaymentMethods(),
      approvalStatus: json['approval_status'] as String? ?? 'approved',
      categorySettings: categorySettingsJson is Map
          ? StoreCategorySettings.fromJson(Map<String, dynamic>.from(categorySettingsJson))
          : const StoreCategorySettings(),
    );
  }

  String? get displayImage => coverImage ?? image ?? logoImage;
}

class PaymentMethods {
  final bool cash;
  final bool card;
  final bool bank;

  const PaymentMethods({this.cash = true, this.card = true, this.bank = true});

  factory PaymentMethods.fromJson(Map<String, dynamic> json) => PaymentMethods(
        cash: json['cash'] != false,
        card: json['card'] != false,
        bank: json['bank'] != false,
      );
}

/// One manual admin/merchant override for a single raw `product.category`
/// string within a store — mirrors the shape written by the website's
/// `save-store-categories` action (api/notify-order.js) exactly.
class CategoryOverride {
  final String? mergeInto;
  final bool disableAutoMerge;
  final bool forceVisible;
  final bool hidden;
  final int? sortOrder;

  const CategoryOverride({
    this.mergeInto,
    this.disableAutoMerge = false,
    this.forceVisible = false,
    this.hidden = false,
    this.sortOrder,
  });

  factory CategoryOverride.fromJson(Map<String, dynamic> json) => CategoryOverride(
        mergeInto: json['mergeInto'] as String?,
        disableAutoMerge: json['disableAutoMerge'] == true,
        forceVisible: json['forceVisible'] == true,
        hidden: json['hidden'] == true,
        sortOrder: (json['sortOrder'] as num?)?.toInt(),
      );
}

/// `stores.category_settings` jsonb — `{admin: {[raw]: override}, merchant:
/// {[raw]: override}}`. Written from the admin/merchant panel on the website
/// (Phase 2 of the store-page category engine); read here so the Flutter app
/// reflects the exact same manual overrides, not just the automatic plan.
class StoreCategorySettings {
  final Map<String, CategoryOverride> admin;
  final Map<String, CategoryOverride> merchant;

  const StoreCategorySettings({this.admin = const {}, this.merchant = const {}});

  factory StoreCategorySettings.fromJson(Map<String, dynamic> json) {
    return StoreCategorySettings(
      admin: _parseScope(json['admin']),
      merchant: _parseScope(json['merchant']),
    );
  }

  static Map<String, CategoryOverride> _parseScope(dynamic raw) {
    if (raw is! Map) return const {};
    final result = <String, CategoryOverride>{};
    raw.forEach((key, value) {
      if (key is String && value is Map) {
        result[key] = CategoryOverride.fromJson(Map<String, dynamic>.from(value));
      }
    });
    return result;
  }

  /// Platform-admin's override for a raw category wins wholesale over the
  /// merchant's for that SAME raw category when both exist — mirrors
  /// `resolveCategoryOverride()` in app.js exactly (whole record wins, not a
  /// field-by-field merge).
  CategoryOverride? resolve(String raw) => admin[raw] ?? merchant[raw];
}
