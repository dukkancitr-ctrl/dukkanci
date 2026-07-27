import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../../../../core/localization/app_strings.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/press_scale.dart';
import '../../domain/home_category.dart';

/// Big photographic category tiles (reference: the website's home category
/// grid) — the first tile is full-width, the rest fall into a 2-column grid.
/// Each tile uses a REAL representative store photo for that category (never
/// invented imagery); a category with no store photo yet falls back to a brand
/// gradient so a tile is never a broken image.
class CategoryTiles extends StatelessWidget {
  const CategoryTiles({super.key, required this.categories, required this.imageFor, required this.onTap});

  final List<HomeCategory> categories;
  final String? Function(HomeCategory) imageFor;
  final void Function(HomeCategory) onTap;

  @override
  Widget build(BuildContext context) {
    if (categories.isEmpty) return const SizedBox.shrink();
    final first = categories.first;
    final rest = categories.skip(1).toList();
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
      child: Column(
        children: [
          _Tile(category: first, imageUrl: imageFor(first), height: 150, big: true, onTap: () => onTap(first)),
          for (var i = 0; i < rest.length; i += 2) ...[
            const SizedBox(height: AppSpacing.md),
            Row(
              children: [
                Expanded(child: _Tile(category: rest[i], imageUrl: imageFor(rest[i]), height: 128, onTap: () => onTap(rest[i]))),
                const SizedBox(width: AppSpacing.md),
                if (i + 1 < rest.length)
                  Expanded(child: _Tile(category: rest[i + 1], imageUrl: imageFor(rest[i + 1]), height: 128, onTap: () => onTap(rest[i + 1])))
                else
                  const Expanded(child: SizedBox()),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _Tile extends StatelessWidget {
  const _Tile({required this.category, required this.imageUrl, required this.height, required this.onTap, this.big = false});

  final HomeCategory category;
  final String? imageUrl;
  final double height;
  final VoidCallback onTap;
  final bool big;

  @override
  Widget build(BuildContext context) {
    return PressScale(
      onTap: onTap,
      child: Container(
        height: height,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          boxShadow: AppShadow.card,
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          fit: StackFit.expand,
          children: [
            if (imageUrl != null)
              CachedNetworkImage(
                imageUrl: imageUrl!,
                fit: BoxFit.cover,
                memCacheWidth: 700,
                errorWidget: (_, _, _) => const _GradientBg(),
              )
            else
              const _GradientBg(),
            const DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.centerRight,
                  end: Alignment.centerLeft,
                  colors: [Colors.black54, Colors.black12],
                ),
              ),
            ),
            Positioned(
              top: AppSpacing.sm,
              right: AppSpacing.sm,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 3),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(AppRadius.pill)),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.delivery_dining_rounded, size: 13, color: AppColors.green800),
                    const SizedBox(width: 3),
                    Text(AppStrings.fastDelivery, style: AppTextStyles.caption.copyWith(color: AppColors.green800, fontWeight: FontWeight.w700, fontSize: 11)),
                  ],
                ),
              ),
            ),
            Positioned(
              right: AppSpacing.md,
              bottom: AppSpacing.md,
              left: AppSpacing.md,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(category.label, style: (big ? AppTextStyles.headline : AppTextStyles.title).copyWith(color: Colors.white)),
                  const SizedBox(height: 2),
                  Text(
                    AppStrings.categoryTagline(category.key),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppTextStyles.caption.copyWith(color: Colors.white.withValues(alpha: 0.9)),
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

class _GradientBg extends StatelessWidget {
  const _GradientBg();

  @override
  Widget build(BuildContext context) {
    return const DecoratedBox(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topRight,
          end: Alignment.bottomLeft,
          colors: [AppColors.green800, AppColors.green900],
        ),
      ),
    );
  }
}
