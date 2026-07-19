import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/providers.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/widgets/press_scale.dart';
import '../../../core/widgets/shimmer_box.dart';
import '../../../core/widgets/state_views.dart';
import '../../banners/presentation/app_home_banner_section.dart';
import '../../location/application/location_controller.dart';
import '../../stores/domain/store.dart';
import '../domain/home_category.dart';
import 'widgets/category_strip.dart';
import 'widgets/promo_hero.dart';
import 'widgets/store_rail.dart';

/// The redesigned home feed: an edge-to-edge red brand header, a manual-swipe
/// promo hero, a category shortcut strip, and several horizontal rails
/// (offers, popular, and the biggest real categories). Every section is
/// derived from a single [approvedStoresProvider] fetch — no invented content.
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final storesAsync = ref.watch(approvedStoresProvider);
    final locationLabel = ref.watch(locationControllerProvider)?.label;
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light.copyWith(statusBarColor: Colors.transparent),
      child: Scaffold(
        backgroundColor: AppColors.cream,
        body: RefreshIndicator(
          onRefresh: () async => ref.invalidate(approvedStoresProvider),
          child: CustomScrollView(
            slivers: [
              SliverToBoxAdapter(child: _HomeHeader(locationLabel: locationLabel)),
              storesAsync.when(
                loading: () => const SliverToBoxAdapter(child: _HomeLoading()),
                error: (_, _) => SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 80),
                    child: AppErrorView(onRetry: () => ref.invalidate(approvedStoresProvider)),
                  ),
                ),
                data: (stores) => SliverToBoxAdapter(child: _HomeBody(stores: stores)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _HomeHeader extends StatelessWidget {
  const _HomeHeader({required this.locationLabel});

  final String? locationLabel;

  @override
  Widget build(BuildContext context) {
    final topPad = MediaQuery.of(context).padding.top;
    return Container(
      padding: EdgeInsets.fromLTRB(AppSpacing.lg, topPad + AppSpacing.md, AppSpacing.lg, AppSpacing.xl),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topRight,
          end: Alignment.bottomLeft,
          colors: [AppColors.green800, AppColors.green700],
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(AppRadius.lg),
          bottomRight: Radius.circular(AppRadius.lg),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.location_on_rounded, size: 20, color: Colors.white),
              const SizedBox(width: 4),
              Expanded(
                child: PressScale(
                  onTap: () => context.push(AppRoutes.locationPicker),
                  child: Row(
                    children: [
                      Flexible(
                        child: Text(
                          locationLabel ?? AppStrings.setLocation,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppTextStyles.label.copyWith(color: Colors.white, fontSize: 14),
                        ),
                      ),
                      const Icon(Icons.keyboard_arrow_down_rounded, size: 20, color: Colors.white),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              PressScale(
                onTap: () => context.go(AppRoutes.favorites),
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.18), shape: BoxShape.circle),
                  child: const Icon(Icons.favorite_rounded, size: 20, color: Colors.white),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),
          PressScale(
            onTap: () => context.push(AppRoutes.search),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md + 1),
              decoration: BoxDecoration(color: AppColors.white, borderRadius: BorderRadius.circular(AppRadius.sm)),
              child: Row(
                children: [
                  const Icon(Icons.search_rounded, color: AppColors.muted),
                  const SizedBox(width: AppSpacing.sm),
                  Text(AppStrings.homeSearchHint, style: AppTextStyles.bodyMuted),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _HomeBody extends StatelessWidget {
  const _HomeBody({required this.stores});

  final List<Store> stores;

  /// Paid header placement — the same four merchant-paid stores as the
  /// website's PAID_PRIORITY_STORE_IDS (app.js): مطعم الخوالي، باشا بيتزريا،
  /// ملحمة الدوماني، ماركت صفا الشام. They lead the home hero slides; an id
  /// that's missing from the approved-stores fetch simply doesn't render.
  static const List<int> _paidHeroIds = [31, 56, 84, 50];

  List<Store> _sortedCategory(String key) {
    final c = HomeCategory.byKey(key);
    if (c == null) return const [];
    return stores.where(c.matches).toList()
      ..sort((a, b) {
        if (a.open != b.open) return a.open ? -1 : 1;
        return b.rating.compareTo(a.rating);
      });
  }

  @override
  Widget build(BuildContext context) {
    if (stores.isEmpty) {
      return const Padding(
        padding: EdgeInsets.only(top: 80),
        child: AppEmptyView(message: AppStrings.noResults, icon: Icons.storefront_outlined),
      );
    }

    final categories = HomeCategory.all.where((c) => stores.any(c.matches)).toList();
    final offers = stores.where((s) => s.hasOffer).toList();
    final popular = [...stores]
      ..sort((a, b) {
        final r = b.rating.compareTo(a.rating);
        return r != 0 ? r : b.reviews.compareTo(a.reviews);
      });
    final restaurants = _sortedCategory('restaurants');
    final sweets = _sortedCategory('sweets');
    final supermarket = _sortedCategory('supermarket');

    // Paid placements first (in their fixed order), then the previous behavior
    // (offer stores, else popular stores) fills the remaining slides.
    final paidHeroStores = [
      for (final id in _paidHeroIds)
        for (final s in stores)
          if (s.id == id) s,
    ];
    final promoStores = offers.where((s) => s.displayImage != null).take(5).toList();
    final fillStores = (promoStores.isNotEmpty
            ? promoStores
            : popular.where((s) => s.displayImage != null).take(5).toList())
        .where((s) => !_paidHeroIds.contains(s.id))
        .toList();
    final heroStores = [...paidHeroStores, ...fillStores].take(6).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: AppSpacing.lg),
        PromoHero(promoStores: heroStores),
        const SizedBox(height: AppSpacing.xl),
        // Admin-managed banners (site_settings.banners, placement `app_home`) —
        // the same row the website reads, so one edit in the admin panel covers
        // both. Renders nothing when there are no live banners.
        const AppHomeBannerSection(),
        Padding(
          padding: const EdgeInsets.fromLTRB(AppSpacing.lg, 0, AppSpacing.lg, AppSpacing.md),
          child: Text(AppStrings.sectionCategories, style: AppTextStyles.title),
        ),
        CategoryStrip(
          categories: categories,
          onTap: (c) => context.push(AppRoutes.categoryPath(c.key)),
        ),
        const SizedBox(height: AppSpacing.xl),
        if (offers.isNotEmpty) ...[
          StoreRail(
            title: AppStrings.railOffers,
            stores: offers,
            highlightOffer: true,
            onSeeAll: () => context.push(AppRoutes.categoryPath('offers')),
          ),
          const SizedBox(height: AppSpacing.xl),
        ],
        StoreRail(
          title: AppStrings.railPopular,
          stores: popular.take(12).toList(),
          onSeeAll: () => context.push(AppRoutes.categoryPath('popular')),
        ),
        const SizedBox(height: AppSpacing.xl),
        if (restaurants.isNotEmpty) ...[
          StoreRail(
            title: 'مطاعم',
            stores: restaurants.take(12).toList(),
            onSeeAll: () => context.push(AppRoutes.categoryPath('restaurants')),
          ),
          const SizedBox(height: AppSpacing.xl),
        ],
        if (sweets.isNotEmpty) ...[
          StoreRail(
            title: 'حلويات',
            stores: sweets.take(12).toList(),
            onSeeAll: () => context.push(AppRoutes.categoryPath('sweets')),
          ),
          const SizedBox(height: AppSpacing.xl),
        ],
        if (supermarket.isNotEmpty) ...[
          StoreRail(
            title: 'سوبر ماركت',
            stores: supermarket.take(12).toList(),
            onSeeAll: () => context.push(AppRoutes.categoryPath('supermarket')),
          ),
          const SizedBox(height: AppSpacing.xl),
        ],
        const SizedBox(height: AppSpacing.xxl),
      ],
    );
  }
}

class _HomeLoading extends StatelessWidget {
  const _HomeLoading();

  @override
  Widget build(BuildContext context) {
    final cardWidth = (MediaQuery.of(context).size.width - AppSpacing.lg * 2 - AppSpacing.md) / 2.2;
    final railHeight = cardWidth * 10 / 16 + 128;
    return Padding(
      padding: const EdgeInsets.only(top: AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            child: ShimmerBox(height: 160, borderRadius: BorderRadius.circular(AppRadius.md)),
          ),
          const SizedBox(height: AppSpacing.xl),
          SizedBox(
            height: 90,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              itemCount: 6,
              separatorBuilder: (_, _) => const SizedBox(width: AppSpacing.md),
              itemBuilder: (_, _) => const SizedBox(
                width: 64,
                child: Column(
                  children: [
                    ShimmerBox(width: 64, height: 64),
                    SizedBox(height: 8),
                    ShimmerBox(width: 48, height: 10),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            child: ShimmerBox(width: 140, height: 20),
          ),
          const SizedBox(height: AppSpacing.md),
          SizedBox(
            height: railHeight,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              itemCount: 4,
              separatorBuilder: (_, _) => const SizedBox(width: AppSpacing.md),
              itemBuilder: (_, _) => SizedBox(width: cardWidth, child: const StoreCardSkeleton()),
            ),
          ),
        ],
      ),
    );
  }
}
