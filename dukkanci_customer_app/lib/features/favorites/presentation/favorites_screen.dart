import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/widgets/press_scale.dart';
import '../../../core/widgets/state_views.dart';
import '../../../core/widgets/status_badge.dart';
import '../../../app/providers.dart' show storeRepositoryProvider;
import '../../home/domain/home_category.dart';
import '../../stores/domain/store.dart';
import '../application/favorites_controller.dart';

final _favoriteStoresProvider = FutureProvider.autoDispose<List<Store>>((ref) async {
  final ids = ref.watch(favoritesControllerProvider);
  if (ids.isEmpty) return [];
  final all = await ref.read(storeRepositoryProvider).fetchApprovedStores();
  return all.where((s) => ids.contains(s.id)).toList();
});

/// Reference layout: category tabs above a rich single-column store card
/// (cover + rating + ETA + delivery/min-order + a real offer banner). The
/// reference's fixed "Restoranlar/Marketler" 2-tab split doesn't fit
/// Dukkanci's real ~8-category taxonomy, so the filter row is built from
/// whichever categories the customer's OWN favorites actually span (never a
/// hard-coded pair) — see [HomeCategory], same grouping used on the home
/// screen. The reference's "İlk siparişte ücretsiz teslimat" / campaign
/// pills (e.g. "400₺'ye 300₺ indirim") are promotional claims Dukkanci has
/// no mechanism for — only a store's real [Store.offer] text is shown.
class FavoritesScreen extends ConsumerStatefulWidget {
  const FavoritesScreen({super.key});

  @override
  ConsumerState<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends ConsumerState<FavoritesScreen> {
  String? _selectedCategoryKey; // null = "الكل"

  @override
  Widget build(BuildContext context) {
    final storesAsync = ref.watch(_favoriteStoresProvider);
    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.navFavorites)),
      body: storesAsync.when(
        loading: () => const AppLoadingView(),
        error: (_, _) => AppErrorView(onRetry: () => ref.invalidate(_favoriteStoresProvider)),
        data: (stores) {
          if (stores.isEmpty) {
            return AppEmptyView(
              message: AppStrings.favoritesEmpty,
              icon: Icons.favorite_border_rounded,
              action: FilledButton.icon(
                onPressed: () => context.go(AppRoutes.home),
                icon: const Icon(Icons.storefront_rounded),
                label: const Text(AppStrings.heroWelcomeCta),
              ),
            );
          }
          final presentCategories = HomeCategory.all.where((c) => stores.any(c.matches)).toList();
          final filtered = _selectedCategoryKey == null
              ? stores
              : stores.where((s) => HomeCategory.byKey(_selectedCategoryKey!)?.matches(s) ?? true).toList();
          return Column(
            children: [
              if (presentCategories.length > 1)
                SizedBox(
                  height: 52,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
                    itemCount: presentCategories.length + 1,
                    separatorBuilder: (_, _) => const SizedBox(width: AppSpacing.sm),
                    itemBuilder: (context, i) {
                      final key = i == 0 ? null : presentCategories[i - 1].key;
                      final label = i == 0 ? AppStrings.favoritesFilterAll : presentCategories[i - 1].label;
                      final selected = _selectedCategoryKey == key;
                      return ChoiceChip(
                        label: Text(label),
                        selected: selected,
                        onSelected: (_) => setState(() => _selectedCategoryKey = key),
                      );
                    },
                  ),
                ),
              Expanded(
                child: ListView.separated(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  itemCount: filtered.length,
                  separatorBuilder: (_, _) => const SizedBox(height: AppSpacing.md),
                  itemBuilder: (context, i) => _FavoriteStoreCard(store: filtered[i]),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _FavoriteStoreCard extends ConsumerWidget {
  const _FavoriteStoreCard({required this.store});

  final Store store;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final hasOffer = store.hasOffer && store.offer != null && store.offer!.trim().isNotEmpty;
    return PressScale(
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
              aspectRatio: 16 / 9,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  if (store.displayImage != null)
                    CachedNetworkImage(imageUrl: store.displayImage!, fit: BoxFit.cover, errorWidget: (_, _, _) => Container(color: AppColors.creamDark))
                  else
                    Container(color: AppColors.creamDark, child: const Icon(Icons.storefront_rounded, color: AppColors.line, size: 40)),
                  Positioned(
                    top: AppSpacing.sm,
                    right: AppSpacing.sm,
                    child: PressScale(
                      onTap: () => ref.read(favoritesControllerProvider.notifier).toggle(store.id),
                      child: Container(
                        padding: const EdgeInsets.all(7),
                        decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                        child: const Icon(Icons.favorite_rounded, size: 18, color: AppColors.danger),
                      ),
                    ),
                  ),
                  Positioned(top: AppSpacing.sm, left: AppSpacing.sm, child: OpenClosedBadge(open: store.open)),
                  if (!store.open) Container(color: Colors.black.withValues(alpha: 0.4)),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(store.name, style: AppTextStyles.title.copyWith(fontSize: 16), maxLines: 1, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 2),
                  Text(store.category, style: AppTextStyles.caption, maxLines: 1, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: AppSpacing.sm),
                  Wrap(
                    spacing: AppSpacing.sm,
                    runSpacing: 6,
                    children: [
                      if (store.rating > 0) RatingPill(rating: store.rating, reviews: store.reviews, compact: true),
                      if (store.etaLabel != null) _MetaChip(icon: Icons.access_time_rounded, text: store.etaLabel!),
                      if (store.deliveryFeePerKm != null) _MetaChip(icon: Icons.delivery_dining_rounded, text: '${store.deliveryFeePerKm!.toStringAsFixed(0)} ${AppStrings.currencySuffix}${AppStrings.perKm}'),
                      if (store.minOrder != null) _MetaChip(icon: Icons.shopping_basket_rounded, text: '${AppStrings.minOrder}: ${store.minOrder!.toStringAsFixed(0)} ${AppStrings.currencySuffix}'),
                    ],
                  ),
                  if (hasOffer) ...[
                    const SizedBox(height: AppSpacing.sm),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
                      decoration: BoxDecoration(color: AppColors.orangeSoft, borderRadius: BorderRadius.circular(AppRadius.sm)),
                      child: Row(
                        children: [
                          const Icon(Icons.local_offer_rounded, size: 15, color: AppColors.orangeDark),
                          const SizedBox(width: AppSpacing.sm),
                          Expanded(child: Text(store.offer!.trim(), style: AppTextStyles.caption.copyWith(color: AppColors.orangeDark, fontWeight: FontWeight.w700), maxLines: 1, overflow: TextOverflow.ellipsis)),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MetaChip extends StatelessWidget {
  const _MetaChip({required this.icon, required this.text});

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 13, color: AppColors.muted),
        const SizedBox(width: 3),
        Text(text, style: AppTextStyles.caption),
      ],
    );
  }
}
