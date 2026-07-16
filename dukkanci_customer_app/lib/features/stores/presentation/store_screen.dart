import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/providers.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/widgets/press_scale.dart';
import '../../../core/widgets/state_views.dart';
import '../../../core/widgets/status_badge.dart';
import '../../products/domain/product.dart';
import '../domain/store.dart';

final storeByKeyProvider = FutureProvider.autoDispose.family<Store?, String>((ref, slugOrId) {
  return ref.read(storeRepositoryProvider).fetchStoreBySlugOrId(slugOrId);
});

final storeProductsProvider = FutureProvider.autoDispose.family<List<Product>, int>((ref, storeId) {
  return ref.read(storeRepositoryProvider).fetchProductsForStore(storeId);
});

/// Spec section 12. Now implements the sticky jump-to-section category
/// shelf described there — tapping a category chip scrolls its section into
/// view (spec: "عند اختيار قسم، ينتقل المستخدم مباشرة إلى مكانه داخل الصفحة").
class StoreScreen extends ConsumerWidget {
  const StoreScreen({super.key, required this.slugOrId});

  final String slugOrId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final storeAsync = ref.watch(storeByKeyProvider(slugOrId));
    return Scaffold(
      body: storeAsync.when(
        loading: () => const AppLoadingView(),
        error: (_, _) => AppErrorView(onRetry: () => ref.invalidate(storeByKeyProvider(slugOrId))),
        data: (store) {
          if (store == null) {
            return const AppEmptyView(message: 'هذا المتجر غير متاح', icon: Icons.storefront_outlined);
          }
          return _StoreBody(store: store);
        },
      ),
    );
  }
}

class _StoreBody extends ConsumerStatefulWidget {
  const _StoreBody({required this.store});

  final Store store;

  @override
  ConsumerState<_StoreBody> createState() => _StoreBodyState();
}

class _StoreBodyState extends ConsumerState<_StoreBody> {
  final _sectionKeys = <String, GlobalKey>{};
  final _scrollController = ScrollController();

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToCategory(String category) {
    final key = _sectionKeys[category];
    final ctx = key?.currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(ctx, duration: AppMotion.base, curve: Curves.easeOut, alignment: 0, alignmentPolicy: ScrollPositionAlignmentPolicy.explicit);
    }
  }

  @override
  Widget build(BuildContext context) {
    final store = widget.store;
    final productsAsync = ref.watch(storeProductsProvider(store.id));
    return CustomScrollView(
      controller: _scrollController,
      slivers: [
        SliverAppBar(
          expandedHeight: 200,
          pinned: true,
          backgroundColor: AppColors.cream,
          flexibleSpace: FlexibleSpaceBar(
            background: store.displayImage != null
                ? CachedNetworkImage(
                    imageUrl: store.displayImage!,
                    fit: BoxFit.cover,
                    errorWidget: (_, _, _) => Container(color: AppColors.creamDark),
                  )
                : Container(color: AppColors.creamDark),
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(store.name, style: AppTextStyles.headline),
                const SizedBox(height: AppSpacing.sm),
                Row(
                  children: [
                    OpenClosedBadge(open: store.open),
                    const SizedBox(width: AppSpacing.sm),
                    RatingPill(rating: store.rating, reviews: store.reviews),
                  ],
                ),
                if (store.description != null) ...[
                  const SizedBox(height: AppSpacing.md),
                  Text(store.description!, style: AppTextStyles.bodyMuted),
                ],
                const SizedBox(height: AppSpacing.lg),
                Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(color: AppColors.white, borderRadius: BorderRadius.circular(AppRadius.sm), border: Border.all(color: AppColors.line)),
                  child: Column(
                    children: [
                      if (store.minOrder != null) _infoRow(Icons.shopping_basket_rounded, AppStrings.minOrder, '${store.minOrder!.toStringAsFixed(0)} ${AppStrings.currencySuffix}'),
                      if (store.deliveryFeePerKm != null) _infoRow(Icons.delivery_dining_rounded, AppStrings.deliveryFee, '${store.deliveryFeePerKm!.toStringAsFixed(0)} ${AppStrings.currencySuffix}/كم'),
                      if (store.etaLabel != null) _infoRow(Icons.access_time_rounded, AppStrings.deliveryTime, store.etaLabel!),
                      if (store.hours != null) _infoRow(Icons.schedule_rounded, 'ساعات العمل', store.hours!, isLast: true),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        productsAsync.when(
          loading: () => const SliverFillRemaining(hasScrollBody: false, child: AppLoadingView()),
          error: (_, _) => SliverFillRemaining(hasScrollBody: false, child: AppErrorView(onRetry: () => ref.invalidate(storeProductsProvider(store.id)))),
          data: (products) {
            if (products.isEmpty) {
              return const SliverFillRemaining(hasScrollBody: false, child: AppEmptyView(message: AppStrings.noResults, icon: Icons.no_food_rounded));
            }
            final byCategory = <String, List<Product>>{};
            for (final p in products) {
              byCategory.putIfAbsent(p.category ?? 'أخرى', () => []).add(p);
            }
            for (final key in byCategory.keys) {
              _sectionKeys.putIfAbsent(key, () => GlobalKey());
            }
            return SliverMainAxisGroup(
              slivers: [
                SliverPersistentHeader(
                  pinned: true,
                  delegate: _CategoryBarDelegate(
                    categories: byCategory.keys.toList(),
                    onTap: _scrollToCategory,
                  ),
                ),
                SliverList(
                  delegate: SliverChildListDelegate([
                    for (final entry in byCategory.entries) ...[
                      Padding(
                        key: _sectionKeys[entry.key],
                        padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, AppSpacing.sm),
                        child: Text(entry.key, style: AppTextStyles.title),
                      ),
                      for (final product in entry.value)
                        PressScale(
                          onTap: () => context.push(AppRoutes.productDetailPath(store.slug ?? store.id.toString(), product.id.toString())),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.xs),
                            child: Opacity(
                              opacity: product.available ? 1 : 0.5,
                              child: Row(
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(AppRadius.sm),
                                    child: SizedBox(
                                      width: 64,
                                      height: 64,
                                      child: product.image != null
                                          ? CachedNetworkImage(imageUrl: product.image!, fit: BoxFit.cover, errorWidget: (_, _, _) => Container(color: AppColors.creamDark))
                                          : Container(color: AppColors.creamDark),
                                    ),
                                  ),
                                  const SizedBox(width: AppSpacing.md),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(product.name, style: AppTextStyles.body, maxLines: 2, overflow: TextOverflow.ellipsis),
                                        const SizedBox(height: 4),
                                        Text(
                                          product.priceOnRequest ? 'السعر عند الطلب' : '${product.price.toStringAsFixed(0)} ${AppStrings.currencySuffix}',
                                          style: AppTextStyles.price.copyWith(fontSize: 15),
                                        ),
                                      ],
                                    ),
                                  ),
                                  if (!product.available) Text('غير متوفر', style: AppTextStyles.caption.copyWith(color: AppColors.danger)),
                                ],
                              ),
                            ),
                          ),
                        ),
                      const Divider(height: AppSpacing.lg, indent: AppSpacing.lg, endIndent: AppSpacing.lg),
                    ],
                  ]),
                ),
              ],
            );
          },
        ),
      ],
    );
  }

  Widget _infoRow(IconData icon, String label, String value, {bool isLast = false}) {
    return Padding(
      padding: EdgeInsets.only(bottom: isLast ? 0 : AppSpacing.sm),
      child: Row(
        children: [
          Icon(icon, size: 18, color: AppColors.green800),
          const SizedBox(width: AppSpacing.sm),
          Expanded(child: Text(label, style: AppTextStyles.bodyMuted)),
          Text(value, style: AppTextStyles.label),
        ],
      ),
    );
  }
}

class _CategoryBarDelegate extends SliverPersistentHeaderDelegate {
  _CategoryBarDelegate({required this.categories, required this.onTap});

  final List<String> categories;
  final void Function(String) onTap;

  @override
  double get minExtent => 52;
  @override
  double get maxExtent => 52;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return ColoredBox(
      color: AppColors.cream,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
        itemCount: categories.length,
        separatorBuilder: (_, _) => const SizedBox(width: AppSpacing.sm),
        itemBuilder: (context, i) => ActionChip(label: Text(categories[i]), onPressed: () => onTap(categories[i])),
      ),
    );
  }

  @override
  bool shouldRebuild(covariant _CategoryBarDelegate oldDelegate) => oldDelegate.categories != categories;
}
