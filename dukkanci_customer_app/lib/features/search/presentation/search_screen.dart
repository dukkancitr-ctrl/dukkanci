import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/providers.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/utils/distance.dart';
import '../../../core/widgets/press_scale.dart';
import '../../../core/widgets/state_views.dart';
import '../../cart/application/cart_controller.dart' show localCacheProvider;
import '../../home/domain/home_category.dart';
import '../../home/presentation/widgets/store_card.dart';
import '../../location/application/location_controller.dart';
import '../../stores/domain/store.dart';

enum _Filter { openNow, nearest, topRated, offers }

/// No fresh reference screenshot was sent for this page — the redesign
/// applies the SAME real-data-only visual language already established on
/// every other screen this session (bordered pill chips, the shared
/// [HomeCategory] taxonomy) rather than inventing a new look. The one
/// genuinely new piece is real, functional "recent searches" (persisted
/// locally, only on explicit submit — not every debounced keystroke), since
/// a blank search landing page is worse than showing nothing while also not
/// being worth fabricating fake "trending searches" data for.
class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  final _controller = TextEditingController();
  Timer? _debounce;
  List<Store>? _allStores;
  bool _loading = false;
  String _query = '';
  final _activeFilters = <_Filter>{};

  static const _filterMeta = {
    _Filter.openNow: ('مفتوح الآن', Icons.access_time_filled_rounded),
    _Filter.nearest: ('الأقرب', Icons.near_me_rounded),
    _Filter.topRated: ('الأعلى تقييماً', Icons.star_rounded),
    _Filter.offers: ('عروض وخصومات', Icons.local_offer_rounded),
  };

  @override
  void initState() {
    super.initState();
    _loadAll();
  }

  Future<void> _loadAll() async {
    setState(() => _loading = true);
    try {
      final stores = await ref.read(storeRepositoryProvider).fetchApprovedStores();
      if (mounted) setState(() => _allStores = stores);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _onChanged(String query) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 300), () => setState(() => _query = query.trim()));
  }

  void _submitSearch(String query) {
    final q = query.trim();
    if (q.isEmpty) return;
    ref.read(localCacheProvider).addRecentSearch(q);
    setState(() => _query = q); // also picks up the just-saved recent search on rebuild
  }

  void _applyRecentSearch(String query) {
    _controller.text = query;
    _controller.selection = TextSelection.collapsed(offset: query.length);
    setState(() => _query = query);
  }

  String _normalizeArabic(String input) => input
      .replaceAll(RegExp('[أإآا]'), 'ا')
      .replaceAll('ة', 'ه')
      .replaceAll('ى', 'ي')
      .toLowerCase();

  List<Store> get _filtered {
    if (_allStores == null) return [];
    var list = List<Store>.from(_allStores!);

    if (_query.isNotEmpty) {
      final normalizedQuery = _normalizeArabic(_query);
      list = list.where((s) => _normalizeArabic(s.name).contains(normalizedQuery) || _normalizeArabic(s.category).contains(normalizedQuery)).toList();
    }
    if (_activeFilters.contains(_Filter.openNow)) list = list.where((s) => s.open).toList();
    if (_activeFilters.contains(_Filter.offers)) list = list.where((s) => s.hasOffer).toList();

    final location = ref.read(locationControllerProvider);
    if (_activeFilters.contains(_Filter.nearest) && location != null) {
      list.sort((a, b) {
        final da = (a.lat != null && a.lng != null) ? haversineKm(location.lat, location.lng, a.lat!, a.lng!) : double.infinity;
        final db = (b.lat != null && b.lng != null) ? haversineKm(location.lat, location.lng, b.lat!, b.lng!) : double.infinity;
        return da.compareTo(db);
      });
    } else if (_activeFilters.contains(_Filter.topRated)) {
      list.sort((a, b) => b.rating.compareTo(a.rating));
    }
    return list;
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final hasLocation = ref.watch(locationControllerProvider) != null;
    final results = _filtered;
    final showingLanding = _query.isEmpty && _activeFilters.isEmpty;
    final recentSearches = ref.read(localCacheProvider).recentSearches;
    final categories = _allStores == null ? const <HomeCategory>[] : HomeCategory.all.where((c) => _allStores!.any(c.matches)).toList();

    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.navSearch)),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.sm, AppSpacing.lg, AppSpacing.sm),
            child: TextField(
              controller: _controller,
              textInputAction: TextInputAction.search,
              decoration: InputDecoration(
                hintText: 'ابحث عن متجر...',
                prefixIcon: const Icon(Icons.search_rounded),
                suffixIcon: _controller.text.isEmpty
                    ? null
                    : IconButton(
                        icon: const Icon(Icons.close_rounded),
                        onPressed: () {
                          _controller.clear();
                          setState(() => _query = '');
                        },
                      ),
              ),
              onChanged: _onChanged,
              onSubmitted: _submitSearch,
            ),
          ),
          SizedBox(
            height: 48,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
              itemCount: _Filter.values.length,
              separatorBuilder: (_, _) => const SizedBox(width: AppSpacing.sm),
              itemBuilder: (context, i) {
                final f = _Filter.values[i];
                final (label, icon) = _filterMeta[f]!;
                final selected = _activeFilters.contains(f);
                final disabled = f == _Filter.nearest && !hasLocation;
                return FilterChip(
                  avatar: Icon(icon, size: 16, color: selected ? Colors.white : AppColors.muted),
                  label: Text(label),
                  selected: selected,
                  onSelected: disabled
                      ? null
                      : (v) => setState(() {
                            if (v) {
                              _activeFilters.add(f);
                              if (f == _Filter.nearest) _activeFilters.remove(_Filter.topRated);
                              if (f == _Filter.topRated) _activeFilters.remove(_Filter.nearest);
                            } else {
                              _activeFilters.remove(f);
                            }
                          }),
                );
              },
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: _loading
                ? const AppLoadingView()
                : showingLanding
                    ? _SearchLanding(
                        recentSearches: recentSearches,
                        categories: categories,
                        onTapRecent: _applyRecentSearch,
                        onClearRecent: () async {
                          await ref.read(localCacheProvider).clearRecentSearches();
                          setState(() {});
                        },
                        results: results,
                      )
                    : results.isEmpty
                        ? const AppEmptyView(message: AppStrings.noResults, icon: Icons.search_off_rounded)
                        : _StoreResultsGrid(stores: results),
          ),
        ],
      ),
    );
  }
}

class _StoreResultsGrid extends StatelessWidget {
  const _StoreResultsGrid({required this.stores});

  final List<Store> stores;

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.all(AppSpacing.lg),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: AppSpacing.md,
        crossAxisSpacing: AppSpacing.md,
        childAspectRatio: 0.72,
      ),
      itemCount: stores.length,
      itemBuilder: (context, i) {
        final store = stores[i];
        return StoreCard(
          store: store,
          onTap: () => context.push(AppRoutes.storeDetailPath(store.slug ?? store.id.toString())),
        );
      },
    );
  }
}

/// The pre-search state: real recent searches (if any) + a category
/// shortcut strip, followed by the full "browse everything" grid — additive,
/// not a replacement for the existing browse-all behaviour.
class _SearchLanding extends StatelessWidget {
  const _SearchLanding({
    required this.recentSearches,
    required this.categories,
    required this.onTapRecent,
    required this.onClearRecent,
    required this.results,
  });

  final List<String> recentSearches;
  final List<HomeCategory> categories;
  final ValueChanged<String> onTapRecent;
  final VoidCallback onClearRecent;
  final List<Store> results;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        if (recentSearches.isNotEmpty)
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.md, AppSpacing.lg, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(child: Text(AppStrings.searchRecentTitle, style: AppTextStyles.titleSmall)),
                      PressScale(onTap: onClearRecent, child: Text(AppStrings.searchClearAll, style: AppTextStyles.label.copyWith(color: AppColors.green800))),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Wrap(
                    spacing: AppSpacing.sm,
                    runSpacing: AppSpacing.sm,
                    children: [
                      for (final q in recentSearches)
                        ActionChip(
                          avatar: const Icon(Icons.history_rounded, size: 16, color: AppColors.muted),
                          label: Text(q),
                          onPressed: () => onTapRecent(q),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        if (categories.isNotEmpty)
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.xl, AppSpacing.lg, AppSpacing.md),
              child: Text(AppStrings.sectionCategories, style: AppTextStyles.titleSmall),
            ),
          ),
        if (categories.isNotEmpty)
          SliverToBoxAdapter(
            child: SizedBox(
              height: 92,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                itemCount: categories.length,
                separatorBuilder: (_, _) => const SizedBox(width: AppSpacing.md),
                itemBuilder: (context, i) {
                  final c = categories[i];
                  return PressScale(
                    onTap: () => context.push(AppRoutes.categoryPath(c.key)),
                    child: SizedBox(
                      width: 68,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 60,
                            height: 60,
                            decoration: BoxDecoration(
                              color: AppColors.green50,
                              borderRadius: BorderRadius.circular(AppRadius.md),
                              border: Border.all(color: AppColors.green100),
                            ),
                            child: Icon(c.icon, color: AppColors.green800, size: 26),
                          ),
                          const SizedBox(height: 6),
                          Text(c.label, maxLines: 1, overflow: TextOverflow.ellipsis, style: AppTextStyles.caption.copyWith(color: AppColors.ink, fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.xl, AppSpacing.lg, AppSpacing.md),
            child: Text(AppStrings.allStores, style: AppTextStyles.titleSmall),
          ),
        ),
        if (results.isEmpty)
          const SliverFillRemaining(hasScrollBody: false, child: AppEmptyView(message: 'لا توجد متاجر بعد', icon: Icons.storefront_outlined))
        else
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: AppSpacing.md,
                crossAxisSpacing: AppSpacing.md,
                childAspectRatio: 0.72,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, i) {
                  final store = results[i];
                  return StoreCard(
                    store: store,
                    onTap: () => context.push(AppRoutes.storeDetailPath(store.slug ?? store.id.toString())),
                  );
                },
                childCount: results.length,
              ),
            ),
          ),
        const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl)),
      ],
    );
  }
}
