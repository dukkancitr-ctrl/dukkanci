import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/providers.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/widgets/shimmer_box.dart';
import '../../../core/widgets/state_views.dart';
import '../../home/domain/home_category.dart';
import '../../home/presentation/widgets/store_card.dart';
import '../../stores/domain/store.dart';

/// A full store listing reached from a home category tile or a rail's
/// "عرض الكل". [categoryKey] is either a real [HomeCategory] key or a
/// synthetic one: "offers" (has_offer), "popular" (by rating), "all".
class CategoryScreen extends ConsumerWidget {
  const CategoryScreen({super.key, required this.categoryKey});

  final String categoryKey;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final storesAsync = ref.watch(approvedStoresProvider);
    final cat = HomeCategory.byKey(categoryKey);
    final title = switch (categoryKey) {
      'offers' => AppStrings.railOffers,
      'popular' => AppStrings.railPopular,
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
          final List<Store> list;
          switch (categoryKey) {
            case 'offers':
              list = all.where((s) => s.hasOffer).toList();
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
          // Open stores first everywhere except the "popular" list, which keeps
          // its rating order.
          if (categoryKey != 'popular') {
            list.sort((a, b) {
              if (a.open != b.open) return a.open ? -1 : 1;
              return b.rating.compareTo(a.rating);
            });
          }
          if (list.isEmpty) {
            return const AppEmptyView(message: AppStrings.noResults, icon: Icons.storefront_outlined);
          }
          return GridView.builder(
            padding: const EdgeInsets.all(AppSpacing.lg),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: AppSpacing.md,
              crossAxisSpacing: AppSpacing.md,
              childAspectRatio: 0.72,
            ),
            itemCount: list.length,
            itemBuilder: (context, i) {
              final store = list[i];
              return StoreCard(
                store: store,
                onTap: () => context.push(AppRoutes.storeDetailPath(store.slug ?? store.id.toString())),
              );
            },
          );
        },
      ),
    );
  }
}
