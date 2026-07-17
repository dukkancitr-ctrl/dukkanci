import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/localization/app_strings.dart';
import '../../../../core/routing/app_routes.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/press_scale.dart';
import '../../../../core/widgets/status_badge.dart';
import '../../../favorites/application/favorites_controller.dart';
import '../../../stores/domain/store.dart';

/// A titled horizontal rail of stores (reference: "Popüler restoranlar",
/// "Express teslimatlı restoranlar" …). Renders nothing when empty so the
/// home never shows a hollow section header with no cards under it.
class StoreRail extends StatelessWidget {
  const StoreRail({
    super.key,
    required this.title,
    required this.stores,
    this.onSeeAll,
    this.highlightOffer = false,
  });

  final String title;
  final List<Store> stores;
  final VoidCallback? onSeeAll;
  final bool highlightOffer;

  @override
  Widget build(BuildContext context) {
    if (stores.isEmpty) return const SizedBox.shrink();
    // Responsive card width: show ~2 full cards + a small deliberate peek of
    // the next (a "scroll for more" affordance) instead of one-and-a-half
    // awkwardly-cut cards. Height tracks the card's image + content block.
    final cardWidth = (MediaQuery.of(context).size.width - AppSpacing.lg * 2 - AppSpacing.md) / 2.2;
    final railHeight = cardWidth * 10 / 16 + 128;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(AppSpacing.lg, 0, AppSpacing.lg, AppSpacing.md),
          child: Row(
            children: [
              Expanded(child: Text(title, style: AppTextStyles.title)),
              if (onSeeAll != null)
                PressScale(
                  onTap: onSeeAll!,
                  child: Row(
                    children: [
                      Text(AppStrings.seeAll, style: AppTextStyles.label.copyWith(color: AppColors.green800)),
                      const Icon(Icons.chevron_left_rounded, size: 18, color: AppColors.green800),
                    ],
                  ),
                ),
            ],
          ),
        ),
        SizedBox(
          height: railHeight,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            itemCount: stores.length,
            separatorBuilder: (_, _) => const SizedBox(width: AppSpacing.md),
            itemBuilder: (context, i) => StoreRailCard(store: stores[i], width: cardWidth, highlightOffer: highlightOffer),
          ),
        ),
      ],
    );
  }
}

/// A fixed-width store card for use inside a horizontal [StoreRail]. Same
/// visual language as the grid [StoreCard], never a placeholder rating/ETA
/// (spec section 10).
class StoreRailCard extends ConsumerWidget {
  const StoreRailCard({super.key, required this.store, required this.width, this.highlightOffer = false});

  final Store store;
  final double width;
  final bool highlightOffer;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isFavorite = ref.watch(favoritesControllerProvider).contains(store.id);
    final offerText = (store.offer != null && store.offer!.trim().isNotEmpty) ? store.offer!.trim() : null;
    final showOffer = highlightOffer && offerText != null;
    return SizedBox(
      width: width,
      child: PressScale(
        onTap: () => context.push(AppRoutes.storeDetailPath(store.slug ?? store.id.toString())),
        child: Container(
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(AppRadius.md),
            border: Border.all(color: AppColors.line),
          ),
          clipBehavior: Clip.antiAlias,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              AspectRatio(
                aspectRatio: 16 / 10,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    if (store.displayImage != null)
                      CachedNetworkImage(
                        imageUrl: store.displayImage!,
                        fit: BoxFit.cover,
                        errorWidget: (_, _, _) => Container(color: AppColors.creamDark),
                      )
                    else
                      Container(color: AppColors.creamDark, child: const Icon(Icons.storefront_rounded, color: AppColors.line, size: 40)),
                    Positioned(top: AppSpacing.sm, right: AppSpacing.sm, child: OpenClosedBadge(open: store.open)),
                    Positioned(
                      top: AppSpacing.sm,
                      left: AppSpacing.sm,
                      child: PressScale(
                        onTap: () => ref.read(favoritesControllerProvider.notifier).toggle(store.id),
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                          child: Icon(isFavorite ? Icons.favorite_rounded : Icons.favorite_border_rounded, size: 16, color: isFavorite ? AppColors.danger : AppColors.muted),
                        ),
                      ),
                    ),
                    if (showOffer)
                      Positioned(
                        bottom: AppSpacing.sm,
                        right: AppSpacing.sm,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 3),
                          decoration: BoxDecoration(color: AppColors.orange, borderRadius: BorderRadius.circular(AppRadius.pill)),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.local_offer_rounded, size: 12, color: Colors.white),
                              const SizedBox(width: 3),
                              Text(AppStrings.offerLabel, style: AppTextStyles.caption.copyWith(color: Colors.white, fontWeight: FontWeight.w700)),
                            ],
                          ),
                        ),
                      ),
                    if (!store.open) Container(color: Colors.black.withValues(alpha: 0.4)),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(store.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: AppTextStyles.titleSmall),
                    const SizedBox(height: 3),
                    Text(showOffer ? offerText : store.category, maxLines: 1, overflow: TextOverflow.ellipsis, style: AppTextStyles.caption),
                    const SizedBox(height: AppSpacing.sm),
                    // Rating and ETA stacked on their own lines: on a narrow
                    // rail card they don't both fit on one row, and a truncated
                    // "30 - 60 دق…" looks broken. Each renders in full here.
                    if (store.rating > 0) RatingPill(rating: store.rating, reviews: store.reviews, compact: true),
                    if (store.rating > 0 && store.etaLabel != null) const SizedBox(height: 6),
                    if (store.etaLabel != null)
                      Row(
                        children: [
                          const Icon(Icons.access_time_rounded, size: 14, color: AppColors.muted),
                          const SizedBox(width: 3),
                          Expanded(child: Text(store.etaLabel!, maxLines: 1, overflow: TextOverflow.ellipsis, style: AppTextStyles.caption)),
                        ],
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
