import 'dart:async';
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
import '../../../core/utils/arabic.dart';
import '../../../core/utils/distance.dart';
import '../../../core/widgets/press_scale.dart';
import '../../../core/widgets/state_views.dart';
import '../../../core/widgets/voice_search_button.dart';
import '../../cart/application/cart_controller.dart' show localCacheProvider;
import '../../home/domain/home_category.dart';
import '../../home/presentation/widgets/store_card.dart';
import '../../location/application/location_controller.dart';
import '../../products/domain/product.dart';
import '../../stores/domain/store.dart';

enum _Filter { openNow, nearest, topRated, offers }

/// Matches the website's own cap (app.js `getMatchingProducts(query, limit = 60)`),
/// which also renders "60+" once it is hit rather than claiming an exact total.
const _productResultCap = 60;

/// A matched product together with the store that sells it. Search spans the
/// whole catalog, so — unlike the in-store menu — the store is essential
/// context, both to show the customer and to build the product route.
class _ProductHit {
  const _ProductHit(this.product, this.store);
  final Product product;
  final Store store;
}

/// No fresh reference screenshot was sent for this page — the redesign
/// applies the SAME real-data-only visual language already established on
/// every other screen this session (bordered pill chips, the shared
/// [HomeCategory] taxonomy) rather than inventing a new look. The one
/// genuinely new piece is real, functional "recent searches" (persisted
/// locally, only on explicit submit — not every debounced keystroke), since
/// a blank search landing page is worse than showing nothing while also not
/// being worth fabricating fake "trending searches" data for.
///
/// Results mirror the website's `/stores` search layout: matching PRODUCTS
/// first, then matching stores, each under a count + subtitle summary.
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

  /// Server-side candidates for [_query] — a deliberate superset, narrowed to
  /// exact matches by [_productHits]. Null means "not searched yet".
  List<Product>? _productCandidates;

  /// Products matched through a curated synonym (e.g. "döner" → شاورما).
  /// Already exact — deliberately NOT re-filtered against name/category,
  /// because the whole point is that the term does not appear there.
  List<Product> _synonymMatches = const [];
  bool _productsLoading = false;
  bool _productsFailed = false;

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
    _debounce = Timer(const Duration(milliseconds: 300), () => _applyQuery(query));
  }

  void _submitSearch(String query) {
    final q = query.trim();
    if (q.isEmpty) return;
    _debounce?.cancel();
    ref.read(localCacheProvider).addRecentSearch(q);
    _applyQuery(q);
  }

  void _applyRecentSearch(String query) {
    _controller.text = query;
    _controller.selection = TextSelection.collapsed(offset: query.length);
    _debounce?.cancel();
    _applyQuery(query);
  }

  void _applyQuery(String raw) {
    final q = raw.trim();
    setState(() => _query = q);
    _searchProducts(q);
  }

  Future<void> _searchProducts(String query) async {
    if (query.isEmpty) {
      setState(() {
        _productCandidates = null;
        _synonymMatches = const [];
        _productsLoading = false;
        _productsFailed = false;
      });
      return;
    }
    setState(() {
      _productsLoading = true;
      _productsFailed = false;
    });
    final repo = ref.read(storeRepositoryProvider);
    try {
      // Fired together: the synonym lookup is a separate query, and making it
      // wait on the main one would double the time to first result.
      final results = await (
        repo.searchProducts(query),
        repo.searchProductsBySynonym(query),
      ).wait;
      // Typing is debounced, not serialised — a slower earlier request must
      // never overwrite the results of the query the user is actually on.
      if (!mounted || query != _query) return;
      setState(() {
        _productCandidates = results.$1;
        _synonymMatches = results.$2;
        _productsLoading = false;
      });
    } catch (_) {
      if (!mounted || query != _query) return;
      setState(() {
        _productsFailed = true;
        _productsLoading = false;
      });
    }
  }

  /// Exact matches, from the permissive server-side candidate set.
  ///
  /// Products are joined against the visible-store map, which doubles as the
  /// approval gate: `fetchApprovedStores` already dropped pending/rejected
  /// stores, so a product whose store is missing here is silently excluded.
  /// Without this a global product search would happily surface items from a
  /// rejected store that is hidden everywhere else in the app.
  List<_ProductHit> get _productHits {
    final candidates = _productCandidates;
    final stores = _allStores;
    if (candidates == null || stores == null || _query.isEmpty) return const [];
    final terms = arabicSearchTerms(_query);
    if (terms.isEmpty) return const [];
    final storeById = {for (final s in stores) s.id: s};

    final hits = <_ProductHit>[];
    final seen = <int>{};
    void add(Product product) {
      if (!seen.add(product.id)) return; // a product can match by name AND synonym
      final store = storeById[product.storeId];
      if (store == null) return;
      hits.add(_ProductHit(product, store));
    }

    for (final product in candidates) {
      if (!matchesAllTerms('${product.name} ${product.category ?? ''}', terms)) continue;
      add(product);
    }
    // Synonym hits come last: a product whose own name matches is the more
    // literal answer, so it should not be pushed down by an alias match.
    for (final product in _synonymMatches) {
      add(product);
    }
    return hits;
  }

  List<Store> get _filtered {
    if (_allStores == null) return [];
    var list = List<Store>.from(_allStores!);

    if (_query.isNotEmpty) {
      final terms = arabicSearchTerms(_query);
      list = list.where((s) => matchesAllTerms('${s.name} ${s.category}', terms)).toList();
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

  void _openProduct(_ProductHit hit) {
    context.push(AppRoutes.productDetailPath(
      hit.store.slug ?? hit.store.id.toString(),
      hit.product.id.toString(),
    ));
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
                hintText: AppStrings.searchHint,
                prefixIcon: const Icon(Icons.search_rounded),
                suffixIcon: _controller.text.isEmpty
                    ? VoiceSearchButton(
                        onResult: (text) {
                          _controller.text = text;
                          _controller.selection = TextSelection.collapsed(offset: text.length);
                          _submitSearch(text);
                        },
                      )
                    : IconButton(
                        icon: const Icon(Icons.close_rounded),
                        onPressed: () {
                          _controller.clear();
                          _debounce?.cancel();
                          _applyQuery('');
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
                    : _SearchResults(
                        query: _query,
                        productHits: _productHits,
                        productsLoading: _productsLoading,
                        productsFailed: _productsFailed,
                        onRetryProducts: () => _searchProducts(_query),
                        onTapProduct: _openProduct,
                        stores: results,
                      ),
          ),
        ],
      ),
    );
  }
}

/// Products first, then stores — the same order and the same summary wording
/// the website uses for a search on `/stores`.
class _SearchResults extends StatelessWidget {
  const _SearchResults({
    required this.query,
    required this.productHits,
    required this.productsLoading,
    required this.productsFailed,
    required this.onRetryProducts,
    required this.onTapProduct,
    required this.stores,
  });

  final String query;
  final List<_ProductHit> productHits;
  final bool productsLoading;
  final bool productsFailed;
  final VoidCallback onRetryProducts;
  final ValueChanged<_ProductHit> onTapProduct;
  final List<Store> stores;

  @override
  Widget build(BuildContext context) {
    final capped = productHits.length > _productResultCap;
    final shown = capped ? productHits.take(_productResultCap).toList() : productHits;
    final searching = query.isNotEmpty;

    return CustomScrollView(
      slivers: [
        if (searching) ...[
          SliverToBoxAdapter(
            child: _SectionSummary(
              title: productsLoading || productsFailed
                  ? AppStrings.sectionProducts
                  : AppStrings.searchProductsCount(shown.length, capped: capped),
              subtitle: AppStrings.searchResultsFor(query),
            ),
          ),
          if (productsLoading)
            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: AppSpacing.xl),
                child: AppLoadingView(),
              ),
            )
          else if (productsFailed)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                child: _InlineNotice(
                  message: AppStrings.searchProductsFailed,
                  onRetry: onRetryProducts,
                ),
              ),
            )
          else if (shown.isEmpty)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                child: _InlineNotice(
                  message: '${AppStrings.searchProductsEmpty} — ${AppStrings.searchProductsEmptyHint}',
                  icon: Icons.search_off_rounded,
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              sliver: SliverList.separated(
                itemCount: shown.length,
                separatorBuilder: (_, _) => const SizedBox(height: AppSpacing.sm),
                itemBuilder: (context, i) => _ProductResultTile(hit: shown[i], onTap: () => onTapProduct(shown[i])),
              ),
            ),
        ],
        SliverToBoxAdapter(
          child: _SectionSummary(
            title: AppStrings.searchStoresCount(stores.length),
            subtitle: searching ? AppStrings.searchStoresMatch : AppStrings.searchStoresInArea,
          ),
        ),
        if (stores.isEmpty)
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              child: _InlineNotice(message: AppStrings.searchStoresEmpty, icon: Icons.storefront_outlined),
            ),
          )
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
                  final store = stores[i];
                  return StoreCard(
                    store: store,
                    onTap: () => context.push(AppRoutes.storeDetailPath(store.slug ?? store.id.toString())),
                  );
                },
                childCount: stores.length,
              ),
            ),
          ),
        const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl)),
      ],
    );
  }
}

/// Bold count + muted subtitle — the app's take on the website's
/// `.result-summary` block.
class _SectionSummary extends StatelessWidget {
  const _SectionSummary({required this.title, required this.subtitle});

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, AppSpacing.md),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.baseline,
        textBaseline: TextBaseline.alphabetic,
        children: [
          Text(title, style: AppTextStyles.title),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Text(subtitle, style: AppTextStyles.caption, maxLines: 1, overflow: TextOverflow.ellipsis),
          ),
        ],
      ),
    );
  }
}

/// A compact in-flow notice, so an empty or failed PRODUCTS section does not
/// hide the store results underneath it the way a full-screen empty view would.
class _InlineNotice extends StatelessWidget {
  const _InlineNotice({required this.message, this.icon, this.onRetry});

  final String message;
  final IconData? icon;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.line),
      ),
      child: Row(
        children: [
          Icon(icon ?? Icons.error_outline_rounded, size: 20, color: AppColors.muted),
          const SizedBox(width: AppSpacing.sm),
          Expanded(child: Text(message, style: AppTextStyles.bodyMuted)),
          if (onRetry != null)
            TextButton(onPressed: onRetry, child: const Text(AppStrings.retry)),
        ],
      ),
    );
  }
}

/// A cross-store product result. Deliberately a row, not the square card the
/// store menu uses: here the customer needs to know WHICH store sells it, and
/// a wide row has the space for that line.
class _ProductResultTile extends StatelessWidget {
  const _ProductResultTile({required this.hit, required this.onTap});

  final _ProductHit hit;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final product = hit.product;
    final showOldPrice = product.oldPrice != null && product.oldPrice! > product.price;

    return PressScale(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.sm),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(AppRadius.md),
          border: Border.all(color: AppColors.line),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(AppRadius.sm),
              child: SizedBox(
                width: 68,
                height: 68,
                child: product.image != null
                    ? CachedNetworkImage(
                        imageUrl: product.image!,
                        fit: BoxFit.cover,
                        errorWidget: (_, _, _) => Container(color: AppColors.creamDark, child: const Icon(Icons.fastfood_rounded, color: AppColors.line)),
                      )
                    : Container(color: AppColors.creamDark, child: const Icon(Icons.fastfood_rounded, color: AppColors.line, size: 28)),
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(product.name, style: AppTextStyles.label, maxLines: 2, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 3),
                  Row(
                    children: [
                      const Icon(Icons.storefront_rounded, size: 13, color: AppColors.muted),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(hit.store.name, style: AppTextStyles.caption, maxLines: 1, overflow: TextOverflow.ellipsis),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Row(
                    children: [
                      Text(
                        product.priceOnRequest
                            ? AppStrings.priceOnRequestLabel
                            : '${product.price.toStringAsFixed(0)} ${AppStrings.currencySuffix}',
                        style: AppTextStyles.price.copyWith(fontSize: 15),
                      ),
                      if (showOldPrice && !product.priceOnRequest) ...[
                        const SizedBox(width: AppSpacing.sm),
                        Text(
                          '${product.oldPrice!.toStringAsFixed(0)} ${AppStrings.currencySuffix}',
                          style: AppTextStyles.caption.copyWith(decoration: TextDecoration.lineThrough),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
            const Padding(
              padding: EdgeInsets.only(top: AppSpacing.lg),
              child: Icon(Icons.chevron_left_rounded, color: AppColors.muted),
            ),
          ],
        ),
      ),
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
