import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/widgets/press_scale.dart';
import '../domain/app_banner.dart';

/// Admin-managed banner strip (placement `app_home`).
///
/// Manual swipe only — **no auto-advance**, same standing product rule as
/// PromoHero and the website's banner strip. Banners arrive already filtered by
/// BannerRepository (live, scheduled, target resolves), so this widget only
/// draws them and reports impressions/clicks.
class BannerStrip extends StatefulWidget {
  const BannerStrip({
    super.key,
    required this.banners,
    required this.onImpression,
    required this.onClick,
  });

  final List<AppBanner> banners;
  final void Function(AppBanner) onImpression;
  final void Function(AppBanner) onClick;

  @override
  State<BannerStrip> createState() => _BannerStripState();
}

class _BannerStripState extends State<BannerStrip> {
  final _controller = PageController();
  int _page = 0;

  @override
  void initState() {
    super.initState();
    _controller.addListener(() {
      final p = _controller.page?.round() ?? 0;
      if (p != _page) {
        setState(() => _page = p);
        _reportImpression(p);
      }
    });
    // The first slide is on screen as soon as the strip is built.
    WidgetsBinding.instance.addPostFrameCallback((_) => _reportImpression(0));
  }

  /// Impression = this banner actually became the visible slide. Swiping back to
  /// an already-counted slide must not count twice, so the parent dedupes per
  /// banner id for the app session.
  void _reportImpression(int index) {
    if (!mounted || index < 0 || index >= widget.banners.length) return;
    widget.onImpression(widget.banners[index]);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _handleTap(AppBanner banner) async {
    widget.onClick(banner);
    switch (banner.linkType) {
      case 'store':
        if (banner.resolvedStoreSlugOrId != null) {
          context.push(AppRoutes.storeDetailPath(banner.resolvedStoreSlugOrId!));
        }
        break;
      case 'product':
        if (banner.resolvedStoreSlugOrId != null) {
          context.push(AppRoutes.productDetailPath(banner.resolvedStoreSlugOrId!, banner.linkValue));
        }
        break;
      case 'category':
        // linkValue is the destination. `categoryKey` is a different field — it
        // scopes WHERE a `category_top` banner is shown on the website, not
        // where it links to, so it must not be used as a navigation target.
        context.push(AppRoutes.categoryPath(banner.linkValue));
        break;
      case 'url':
        final uri = Uri.tryParse(banner.linkValue);
        if (uri != null) {
          await launchUrl(uri, mode: LaunchMode.externalApplication);
        }
        break;
      default:
        break; // 'none' — display-only banner
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.banners.isEmpty) return const SizedBox.shrink();
    return Column(
      children: [
        SizedBox(
          height: 150,
          child: PageView.builder(
            controller: _controller,
            itemCount: widget.banners.length,
            itemBuilder: (context, i) => Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              child: _BannerCard(
                banner: widget.banners[i],
                onTap: widget.banners[i].linkType == 'none' ? null : () => _handleTap(widget.banners[i]),
              ),
            ),
          ),
        ),
        if (widget.banners.length > 1) ...[
          const SizedBox(height: AppSpacing.sm),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              for (var i = 0; i < widget.banners.length; i++)
                AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: i == _page ? 20 : 7,
                  height: 7,
                  decoration: BoxDecoration(
                    color: i == _page ? AppColors.green700 : AppColors.creamDark,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
            ],
          ),
        ],
      ],
    );
  }
}

class _BannerCard extends StatelessWidget {
  const _BannerCard({required this.banner, this.onTap});

  final AppBanner banner;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final card = ClipRRect(
      borderRadius: BorderRadius.circular(18),
      child: Stack(
        fit: StackFit.expand,
        children: [
          if (banner.image != null && banner.image!.isNotEmpty)
            CachedNetworkImage(
              imageUrl: banner.image!,
              fit: BoxFit.cover,
              errorWidget: (_, _, _) => Container(color: AppColors.green900),
              placeholder: (_, _) => Container(color: AppColors.green900),
            )
          else
            Container(color: AppColors.green700),
          // Scrim runs right-to-left: text starts at the right edge in RTL, so
          // that side needs the darkening for legibility over any photo.
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.centerRight,
                end: Alignment.centerLeft,
                colors: [Color(0xB8000000), Color(0x66000000), Color(0x0D000000)],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (banner.headline.isNotEmpty)
                  Text(
                    banner.headline,
                    style: AppTextStyles.title.copyWith(color: Colors.white, fontSize: 18),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                if (banner.sub.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    banner.sub,
                    style: AppTextStyles.body.copyWith(color: Colors.white70, fontSize: 13),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
                if (banner.cta.isNotEmpty && onTap != null) ...[
                  const SizedBox(height: AppSpacing.sm),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      banner.cta,
                      style: AppTextStyles.body.copyWith(
                        color: AppColors.green900,
                        fontWeight: FontWeight.w700,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
    return onTap == null ? card : PressScale(onTap: onTap, child: card);
  }
}
