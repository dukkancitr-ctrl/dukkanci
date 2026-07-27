import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/localization/app_strings.dart';
import '../../../../core/widgets/press_scale.dart';
import '../../../../core/widgets/status_badge.dart';
import '../../../favorites/application/favorites_controller.dart';
import '../../../stores/domain/store.dart';

/// Every field here is real store data — never a placeholder rating or ETA
/// (spec section 10: "ممنوع عرض وقت توصيل أو تقييم غير حقيقي").
class StoreCard extends ConsumerWidget {
  const StoreCard({super.key, required this.store, required this.onTap});

  final Store store;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isFavorite = ref.watch(favoritesControllerProvider).contains(store.id);
    return PressScale(
      onTap: onTap,
      child: Card(
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
                      memCacheWidth: 640,
                      errorWidget: (_, _, _) => Container(color: AppColors.creamDark),
                    )
                  else
                    Container(color: AppColors.creamDark, child: const Icon(Icons.storefront_rounded, color: AppColors.line, size: 40)),
                  // Bottom scrim so the badge row stays legible over any photo.
                  Positioned(
                    left: 0,
                    right: 0,
                    bottom: 0,
                    child: Container(
                      height: 40,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [Colors.transparent, Colors.black.withValues(alpha: 0.35)],
                        ),
                      ),
                    ),
                  ),
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
                  if (store.offer != null && store.offer!.trim().isNotEmpty)
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
                  if (!store.open)
                    Container(color: Colors.black.withValues(alpha: 0.4)),
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
                  Text(store.category, maxLines: 1, overflow: TextOverflow.ellipsis, style: AppTextStyles.caption),
                  const SizedBox(height: AppSpacing.sm),
                  Wrap(
                    spacing: AppSpacing.sm,
                    runSpacing: 6,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      if (store.rating > 0) RatingPill(rating: store.rating, reviews: store.reviews, compact: true),
                      if (store.etaLabel != null) MetaChip(icon: Icons.access_time_rounded, label: store.etaLabel!),
                      if (store.deliveryFeePerKm != null)
                        MetaChip(
                          icon: Icons.delivery_dining_rounded,
                          label: '${store.deliveryFeePerKm!.toStringAsFixed(0)} ${AppStrings.currencySuffix}${AppStrings.perKm}',
                        ),
                    ],
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
