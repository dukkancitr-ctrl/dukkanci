import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

import '../../../core/api/supabase_bootstrap.dart';
import '../../../core/config/app_config.dart';
import '../../stores/domain/store.dart';
import '../domain/app_banner.dart';

/// A bare Dio for the counter endpoint only — intentionally NOT the shared
/// ApiClient, whose interceptor attaches the customer's auth token. A banner
/// counter must stay anonymous, must not retry, and must not be able to leak a
/// session token to an endpoint that has no use for one.
final Dio _counterDio = Dio(BaseOptions(
  baseUrl: AppConfig.apiBaseUrl,
  connectTimeout: const Duration(seconds: 5),
  receiveTimeout: const Duration(seconds: 5),
  headers: const {'Content-Type': 'application/json'},
));

/// Reads admin-managed banners and reports impression/click counters.
///
/// This is the first place the app touches `site_settings` at all — the table is
/// a flat key/value JSON store the website has used for a long time
/// (`loadSiteSettings()` in app.js). We read exactly one key: `banners`.
class BannerRepository {
  /// Banners for one placement, already filtered to what should actually be on
  /// screen: active, inside its scheduled window, has content, and — critically
  /// — its link target still resolves. A banner pointing at a deleted or
  /// unapproved store is dropped rather than rendered as a dead tap, matching
  /// `activeBanners()` on the website.
  Future<List<AppBanner>> fetchBanners({
    required String placement,
    required List<Store> approvedStores,
  }) async {
    try {
      final row = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'banners')
          .maybeSingle();
      if (row == null) return const [];

      final value = row['value'];
      if (value is! Map) return const [];
      final rawItems = value['items'];
      if (rawItems is! List) return const [];

      final all = rawItems
          .whereType<Map>()
          .map((m) => AppBanner.fromJson(Map<String, dynamic>.from(m)))
          .where((b) => b.id.isNotEmpty && b.placement == placement)
          .where((b) => b.isLive() && b.hasContent)
          .toList()
        ..sort((a, b) => a.sort.compareTo(b.sort));

      return _resolveTargets(all, approvedStores);
    } catch (e, st) {
      // A banner strip is decoration: never let it take the home screen down.
      debugPrint('BannerRepository.fetchBanners failed: $e\n$st');
      return const [];
    }
  }

  /// Drops banners whose destination no longer exists and attaches the owning
  /// store for product links (the app's product route needs both ids).
  Future<List<AppBanner>> _resolveTargets(List<AppBanner> banners, List<Store> stores) async {
    final storeById = {for (final s in stores) s.id: s};

    // Resolve every product-linked banner in ONE query rather than per banner.
    final productIds = banners
        .where((b) => b.linkType == 'product')
        .map((b) => int.tryParse(b.linkValue))
        .whereType<int>()
        .toList();
    final Map<int, int> productToStore = {};
    if (productIds.isNotEmpty) {
      try {
        final rows = await supabase.from('products').select('id,store_id').inFilter('id', productIds);
        for (final r in (rows as List)) {
          final m = Map<String, dynamic>.from(r as Map);
          final pid = (m['id'] as num?)?.toInt();
          final sid = (m['store_id'] as num?)?.toInt();
          if (pid != null && sid != null) productToStore[pid] = sid;
        }
      } catch (e) {
        debugPrint('BannerRepository: product link resolve failed: $e');
      }
    }

    final out = <AppBanner>[];
    for (final b in banners) {
      switch (b.linkType) {
        case 'store':
          final store = storeById[int.tryParse(b.linkValue)];
          if (store == null || !store.isPubliclyVisible) continue;
          out.add(b.copyWith(resolvedStoreSlugOrId: store.slug ?? '${store.id}'));
          break;
        case 'product':
          final pid = int.tryParse(b.linkValue);
          final sid = pid == null ? null : productToStore[pid];
          final store = sid == null ? null : storeById[sid];
          if (store == null || !store.isPubliclyVisible) continue;
          out.add(b.copyWith(resolvedStoreSlugOrId: store.slug ?? '${store.id}'));
          break;
        case 'category':
        case 'url':
        case 'none':
          out.add(b);
          break;
        default:
          break; // unknown link type from a newer website build — skip safely
      }
    }
    return out;
  }

  /// Fire-and-forget impression/click counter. Anonymous: the request carries no
  /// user identifier at all, only the banner id (see the banner_events table
  /// comment in migrations/20260719_banners_and_banner_events.sql).
  ///
  /// Deliberately a bare HTTP POST rather than going through ApiClient: this must
  /// never attach the customer's auth token, never retry, and never surface an
  /// error into the UI.
  Future<void> reportEvent({
    required String bannerId,
    required String placement,
    required String type,
  }) async {
    try {
      await _counterDio.post(
        '/api/notify-order',
        queryParameters: const {'action': 'banner-event'},
        data: {
          'bannerId': bannerId,
          'placement': placement,
          'type': type,
          'source': 'app',
        },
      );
    } catch (e) {
      debugPrint('BannerRepository.reportEvent ignored: $e');
    }
  }
}
