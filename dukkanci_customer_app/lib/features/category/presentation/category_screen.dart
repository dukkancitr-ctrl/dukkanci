import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../app/providers.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/utils/nearby_stores.dart';
import '../../../core/utils/store_priority.dart';
import '../../../core/widgets/shimmer_box.dart';
import '../../../core/widgets/state_views.dart';
import '../../home/domain/home_category.dart';
import '../../home/presentation/widgets/store_card.dart';
import '../../location/application/location_controller.dart';
import '../../stores/domain/store.dart';

/// A full store listing reached from a home category tile or a rail's
/// "عرض الكل". [categoryKey] is either a real [HomeCategory] key or a
/// synthetic one: "offers" (has_offer), "popular" (by rating), "nearby" (by
/// distance from the customer), "all".
class CategoryScreen extends ConsumerWidget {
  const CategoryScreen({super.key, required this.categoryKey});

  final String categoryKey;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final storesAsync = ref.watch(approvedStoresProvider);
    // resolve (not byKey): generated `raw:<category>` keys for categories the
    // curated list doesn't know yet must open their own store list, not fall
    // through to "all stores" under the wrong title.
    final cat = HomeCategory.resolve(categoryKey);
    final title = switch (categoryKey) {
      'offers' => AppStrings.railOffers,
      'popular' => AppStrings.railPopular,
      'nearby' => AppStrings.railNearby,
      'all' => AppStrings.allStores,
      _ => cat?.label ?? AppStrings.allStores,
    };

    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: storesAsync.when(
        loading: () => GridView.builder(
          padding: const EdgeInsets.all(AppSpacing.lg),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: AppSpacing.md,
            crossAxisSpacing: AppSpacing.md,
            childAspectRatio: 0.72,
          ),
          itemCount: 6,
          itemBuilder: (_, _) => const StoreCardSkeleton(),
        ),
        error: (_, _) => AppErrorView(onRetry: () => ref.invalidate(approvedStoresProvider)),
        data: (all) {
          // Distance per store for the "nearby" list (empty otherwise) — also
          // what each card shows as its distance badge.
          final distances = <int, double>{};
          List<Store> list;
          switch (categoryKey) {
            case 'nearby':
              final here = ref.watch(locationControllerProvider);
              if (here != null) {
                final nearest = nearestStores(all, here.lat, here.lng);
                for (final n in nearest) {
                  distances[n.store.id] = n.km;
                }
                list = [for (final n in nearest) n.store];
              } else {
                // No saved location: the best honest ordering is by rating,
                // same as "popular" (the home rail only links here once a
                // location exists, so this is a deep-link/edge case).
                list = [...all]..sort((a, b) {
                    final r = b.rating.compareTo(a.rating);
                    return r != 0 ? r : b.reviews.compareTo(a.reviews);
                  });
              }
            case 'offers':
              final discounted = ref.watch(discountedStoreIdsProvider).value ?? const <int>{};
              list = all.where((s) => s.hasAnyOffer(discounted)).toList();
            case 'popular':
              list = [...all]..sort((a, b) {
                  final r = b.rating.compareTo(a.rating);
                  return r != 0 ? r : b.reviews.compareTo(a.reviews);
                });
            case 'all':
              list = [...all];
            default:
              list = cat == null ? [...all] : all.where(cat.matches).toList();
          }
          // Open stores first everywhere except the "popular" and "nearby"
          // lists, which keep their rating / distance order.
          if (categoryKey != 'popular' && categoryKey != 'nearby') {
            list.sort((a, b) {
              if (a.open != b.open) return a.open ? -1 : 1;
              return b.rating.compareTo(a.rating);
            });
            // طلب المستخدم 2026-07-27: روا يتصدر ضمن 2 كم فعلياً — يُطبَّق
            // AFTER الفرز أعلاه (فرز مستقر: من ليس روا القريب يحتفظ بترتيبه)،
            // لا أثر عملي إلا على قائمة "all" (روا لا ينتمي لأي تصنيف آخر
            // أصلاً فيبقى غائباً عنه بصرف النظر عن هذا الفرز).
            final location = ref.watch(locationControllerProvider);
            list = sortStoresByProximityPriority(list, location?.lat, location?.lng);
          }
          if (list.isEmpty) {
            return const AppEmptyView(message: AppStrings.noResults, icon: Icons.storefront_outlined);
          }
          return CustomScrollView(
            slivers: [
              SliverPadding(
                padding: const EdgeInsets.all(AppSpacing.lg),
                sliver: StoreCardGrid(stores: list, distancesKm: distances.isEmpty ? null : distances),
              ),
            ],
          );
        },
      ),
    );
  }
}
