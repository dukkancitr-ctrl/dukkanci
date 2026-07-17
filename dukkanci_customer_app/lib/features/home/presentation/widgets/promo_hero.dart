import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/localization/app_strings.dart';
import '../../../../core/routing/app_routes.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/press_scale.dart';
import '../../../stores/domain/store.dart';

/// The top promo carousel (reference: the big welcome banner).
///
/// Manual swipe only — **no auto-advance**. Auto-motion carousels were an
/// explicit product rejection on the website (see the mobile category strip
/// history); the same rule applies here. Slides are a branded welcome card
/// plus real offer/featured stores, never invented discounts.
class PromoHero extends StatefulWidget {
  const PromoHero({super.key, required this.promoStores});

  final List<Store> promoStores;

  @override
  State<PromoHero> createState() => _PromoHeroState();
}

class _PromoHeroState extends State<PromoHero> {
  // Full-width pages (no side peek) so a slide never looks half-cut; the dot
  // indicator communicates "there's more" instead.
  final _controller = PageController();
  int _page = 0;

  @override
  void initState() {
    super.initState();
    _controller.addListener(() {
      final p = _controller.page?.round() ?? 0;
      if (p != _page) setState(() => _page = p);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final slides = <Widget>[
      const _WelcomeSlide(),
      for (final s in widget.promoStores) _StorePromoSlide(store: s),
    ];
    return Column(
      children: [
        SizedBox(
          height: 170,
          child: PageView.builder(
            controller: _controller,
            itemCount: slides.length,
            itemBuilder: (context, i) => Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              child: slides[i],
            ),
          ),
        ),
        if (slides.length > 1) ...[
          const SizedBox(height: AppSpacing.md),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              for (int i = 0; i < slides.length; i++)
                AnimatedContainer(
                  duration: AppMotion.fast,
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: i == _page ? 20 : 7,
                  height: 7,
                  decoration: BoxDecoration(
                    color: i == _page ? AppColors.green800 : AppColors.line,
                    borderRadius: BorderRadius.circular(AppRadius.pill),
                  ),
                ),
            ],
          ),
        ],
      ],
    );
  }
}

class _WelcomeSlide extends StatelessWidget {
  const _WelcomeSlide();

  @override
  Widget build(BuildContext context) {
    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(AppRadius.md),
        gradient: const LinearGradient(
          begin: Alignment.topRight,
          end: Alignment.bottomLeft,
          colors: [AppColors.green800, AppColors.green900],
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            left: -12,
            bottom: -22,
            child: Icon(Icons.storefront_rounded, size: 128, color: Colors.white.withValues(alpha: 0.10)),
          ),
          Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(AppStrings.heroWelcomeTitle, maxLines: 1, overflow: TextOverflow.ellipsis, style: AppTextStyles.headline.copyWith(color: Colors.white)),
                const SizedBox(height: 6),
                Text(
                  AppStrings.heroWelcomeBody,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: AppTextStyles.bodyMuted.copyWith(color: Colors.white.withValues(alpha: 0.9)),
                ),
                const SizedBox(height: AppSpacing.md),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 7),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(AppRadius.pill)),
                  child: Text(AppStrings.heroWelcomeCta, style: AppTextStyles.label.copyWith(color: AppColors.green800)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StorePromoSlide extends StatelessWidget {
  const _StorePromoSlide({required this.store});

  final Store store;

  @override
  Widget build(BuildContext context) {
    final img = store.displayImage;
    final offerText = (store.offer != null && store.offer!.trim().isNotEmpty) ? store.offer!.trim() : null;
    return PressScale(
      onTap: () => context.push(AppRoutes.storeDetailPath(store.slug ?? store.id.toString())),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(AppRadius.md),
        child: Stack(
          fit: StackFit.expand,
          children: [
            if (img != null)
              CachedNetworkImage(imageUrl: img, fit: BoxFit.cover, errorWidget: (_, _, _) => Container(color: AppColors.green900))
            else
              Container(color: AppColors.green900),
            DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.centerRight,
                  end: Alignment.centerLeft,
                  colors: [Colors.black.withValues(alpha: 0.80), Colors.black.withValues(alpha: 0.12)],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  if (offerText != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 4),
                      decoration: BoxDecoration(color: AppColors.orange, borderRadius: BorderRadius.circular(AppRadius.pill)),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.local_offer_rounded, size: 13, color: Colors.white),
                          const SizedBox(width: 4),
                          Text(AppStrings.offerLabel, style: AppTextStyles.caption.copyWith(color: Colors.white, fontWeight: FontWeight.w700)),
                        ],
                      ),
                    ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(store.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: AppTextStyles.title.copyWith(color: Colors.white)),
                  const SizedBox(height: 2),
                  Text(
                    offerText ?? store.category,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppTextStyles.bodyMuted.copyWith(color: Colors.white.withValues(alpha: 0.92)),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 6),
                    decoration: BoxDecoration(color: AppColors.green800, borderRadius: BorderRadius.circular(AppRadius.pill)),
                    child: Text(AppStrings.orderNow, style: AppTextStyles.label.copyWith(color: Colors.white)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
