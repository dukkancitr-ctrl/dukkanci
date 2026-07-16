import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/providers.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/widgets/shimmer_box.dart';
import '../../../core/widgets/state_views.dart';
import '../../location/application/location_controller.dart';
import '../../stores/domain/store.dart';
import 'widgets/store_card.dart';

final _homeStoresProvider = FutureProvider.autoDispose<List<Store>>((ref) {
  return ref.read(storeRepositoryProvider).fetchApprovedStores();
});

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final storesAsync = ref.watch(_homeStoresProvider);
    final location = ref.watch(locationControllerProvider);
    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async => ref.invalidate(_homeStoresProvider),
          child: CustomScrollView(
            slivers: [
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, AppSpacing.md),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      InkWell(
                        onTap: () => context.push(AppRoutes.locationPicker),
                        borderRadius: BorderRadius.circular(AppRadius.sm),
                        child: Row(
                          children: [
                            const Icon(Icons.location_on_rounded, size: 18, color: AppColors.green800),
                            const SizedBox(width: 4),
                            Flexible(
                              child: Text(
                                location?.label ?? 'حدّد موقعك',
                                style: AppTextStyles.label.copyWith(color: AppColors.green800),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const Icon(Icons.keyboard_arrow_down_rounded, size: 18, color: AppColors.green800),
                          ],
                        ),
                      ),
                      const SizedBox(height: AppSpacing.sm),
                      Text(AppStrings.appName, style: AppTextStyles.display),
                      const SizedBox(height: AppSpacing.lg),
                      InkWell(
                        onTap: () => context.push(AppRoutes.search),
                        borderRadius: BorderRadius.circular(AppRadius.sm),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
                          decoration: BoxDecoration(
                            color: AppColors.white,
                            borderRadius: BorderRadius.circular(AppRadius.sm),
                            border: Border.all(color: AppColors.line),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.search_rounded, color: AppColors.muted),
                              const SizedBox(width: AppSpacing.sm),
                              Text('ابحث عن متجر أو منتج...', style: AppTextStyles.bodyMuted),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              storesAsync.when(
                loading: () => SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                  sliver: SliverGrid(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      mainAxisSpacing: AppSpacing.md,
                      crossAxisSpacing: AppSpacing.md,
                      childAspectRatio: 0.72,
                    ),
                    delegate: SliverChildBuilderDelegate((context, i) => const StoreCardSkeleton(), childCount: 6),
                  ),
                ),
                error: (err, _) => SliverFillRemaining(
                  hasScrollBody: false,
                  child: AppErrorView(onRetry: () => ref.invalidate(_homeStoresProvider)),
                ),
                data: (stores) {
                  if (stores.isEmpty) {
                    return const SliverFillRemaining(
                      hasScrollBody: false,
                      child: AppEmptyView(message: AppStrings.noResults, icon: Icons.storefront_outlined),
                    );
                  }
                  return SliverPadding(
                    padding: const EdgeInsets.fromLTRB(AppSpacing.lg, 0, AppSpacing.lg, AppSpacing.xxxl),
                    sliver: SliverGrid(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        mainAxisSpacing: AppSpacing.md,
                        crossAxisSpacing: AppSpacing.md,
                        childAspectRatio: 0.72,
                      ),
                      delegate: SliverChildBuilderDelegate(
                        (context, i) {
                          final store = stores[i];
                          return StoreCard(
                            store: store,
                            onTap: () => context.push(AppRoutes.storeDetailPath(store.slug ?? store.id.toString())),
                          );
                        },
                        childCount: stores.length,
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
