import '../../../core/utils/asset_url.dart';

/// A merchant/admin-managed promotional banner.
///
/// Mirrors the website's banner engine in `app.js` (`BANNER_PLACEMENTS`,
/// `activeBanners`, `bannerScheduleState`, `bannerTime`). Both clients read the
/// SAME row — `site_settings.banners` in Supabase — so the admin edits a banner
/// once and it appears on the website and in this app. Keep the two in sync:
/// any change to the schedule or validity rules here must be mirrored in
/// `activeBanners()` in app.js, and vice versa.
///
/// Named `AppBanner`, not `Banner`, because `Banner` is a built-in Flutter
/// widget (the debug corner ribbon) and shadowing it makes for nasty imports.
class AppBanner {
  const AppBanner({
    required this.id,
    required this.title,
    required this.placement,
    this.image,
    this.headline = '',
    this.sub = '',
    this.cta = '',
    this.linkType = 'none',
    this.linkValue = '',
    this.categoryKey = '',
    this.startAt = '',
    this.endAt = '',
    this.active = true,
    this.sort = 0,
    this.resolvedStoreSlugOrId,
  });

  final String id;
  final String title;
  final String placement;
  final String? image;
  final String headline;
  final String sub;
  final String cta;
  final String linkType;
  final String linkValue;
  final String categoryKey;
  final String startAt;
  final String endAt;
  final bool active;
  final int sort;

  /// For `linkType == 'product'` only. The banner stores just a product id, but
  /// the app's product route needs the owning store too
  /// (`/store/:slugOrId/product/:productId`). The repository resolves it once at
  /// load time and drops any banner whose product no longer exists, so a tap can
  /// never dead-end — the same render-time truth check the website applies.
  final String? resolvedStoreSlugOrId;

  factory AppBanner.fromJson(Map<String, dynamic> json) {
    return AppBanner(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      placement: json['placement'] as String? ?? '',
      image: resolveAssetUrl(json['image'] as String?),
      headline: json['headline'] as String? ?? '',
      sub: json['sub'] as String? ?? '',
      cta: json['cta'] as String? ?? '',
      linkType: json['linkType'] as String? ?? 'none',
      linkValue: (json['linkValue'] ?? '').toString(),
      categoryKey: json['categoryKey'] as String? ?? '',
      startAt: json['startAt'] as String? ?? '',
      endAt: json['endAt'] as String? ?? '',
      active: json['active'] as bool? ?? true,
      // Postgres/jsonb gives whole numbers as int, but a hand-edited value could
      // arrive as a double or a string — go through num defensively.
      sort: (json['sort'] is num) ? (json['sort'] as num).toInt() : int.tryParse('${json['sort']}') ?? 0,
    );
  }

  AppBanner copyWith({String? resolvedStoreSlugOrId}) => AppBanner(
        id: id,
        title: title,
        placement: placement,
        image: image,
        headline: headline,
        sub: sub,
        cta: cta,
        linkType: linkType,
        linkValue: linkValue,
        categoryKey: categoryKey,
        startAt: startAt,
        endAt: endAt,
        active: active,
        sort: sort,
        resolvedStoreSlugOrId: resolvedStoreSlugOrId ?? this.resolvedStoreSlugOrId,
      );

  /// Parses a banner date field. The admin form writes date-only values
  /// ("2026-08-01"). An end date must mean "through the end of that day" — the
  /// website makes the same adjustment in `bannerTime(value, endOfDay)`;
  /// without it a banner would vanish at midnight *starting* the chosen day.
  static DateTime? parseDate(String raw, {required bool endOfDay}) {
    final value = raw.trim();
    if (value.isEmpty) return null;
    final dateOnly = RegExp(r'^\d{4}-\d{2}-\d{2}$').hasMatch(value);
    final parsed = DateTime.tryParse(dateOnly ? '${value}T00:00:00' : value);
    if (parsed == null) return null;
    return (dateOnly && endOfDay)
        ? parsed.add(const Duration(days: 1)).subtract(const Duration(milliseconds: 1))
        : parsed;
  }

  /// True when the banner should be on screen right now.
  bool isLive([DateTime? nowOverride]) {
    if (!active) return false;
    final now = nowOverride ?? DateTime.now();
    final start = parseDate(startAt, endOfDay: false);
    final end = parseDate(endAt, endOfDay: true);
    if (start != null && now.isBefore(start)) return false;
    if (end != null && now.isAfter(end)) return false;
    return true;
  }

  /// A banner with neither an image nor a headline would render as an empty
  /// box — the website drops those too.
  bool get hasContent => (image != null && image!.isNotEmpty) || headline.trim().isNotEmpty;
}
