import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/providers.dart';
import '../../../core/theme/app_spacing.dart';
import '../domain/app_banner.dart';
import 'banner_strip.dart';

/// Impressions already counted during this app run.
///
/// Mirrors the website's `sessionStorage["dkbi:<id>"]` guard: a banner scrolled
/// past twice, or seen again after a pull-to-refresh, is one impression — not
/// several. Kept in memory only, so it resets when the app is killed, which is
/// the app equivalent of a browsing session.
final Set<String> _countedImpressions = <String>{};

/// Home-screen banner slot. Renders nothing at all when there are no live
/// banners (or while loading / on error) so the home layout never shows a gap
/// or an error box for what is decorative content.
class AppHomeBannerSection extends ConsumerWidget {
  const AppHomeBannerSection({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(appHomeBannersProvider);
    return async.maybeWhen(
      data: (banners) {
        if (banners.isEmpty) return const SizedBox.shrink();
        return Padding(
          padding: const EdgeInsets.only(bottom: AppSpacing.xl),
          child: BannerStrip(
            banners: banners,
            onImpression: (b) => _report(ref, b, 'impression', dedupe: true),
            onClick: (b) => _report(ref, b, 'click'),
          ),
        );
      },
      orElse: () => const SizedBox.shrink(),
    );
  }

  void _report(WidgetRef ref, AppBanner banner, String type, {bool dedupe = false}) {
    if (dedupe) {
      if (_countedImpressions.contains(banner.id)) return;
      _countedImpressions.add(banner.id);
    }
    // Fire-and-forget: the repository swallows every failure.
    ref.read(bannerRepositoryProvider).reportEvent(
          bannerId: banner.id,
          placement: banner.placement,
          type: type,
        );
  }
}
