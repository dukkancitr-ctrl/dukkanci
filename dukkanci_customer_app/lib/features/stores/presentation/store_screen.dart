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
import '../../cart/application/cart_controller.dart';
import '../../cart/domain/cart_item.dart';
import '../../favorites/application/favorites_controller.dart';
import '../../products/domain/product.dart';
import '../domain/store.dart';

final storeByKeyProvider = FutureProvider.autoDispose.family<Store?, String>((ref, slugOrId) {
  return ref.read(storeRepositoryProvider).fetchStoreBySlugOrId(slugOrId);
});

final storeProductsProvider = FutureProvider.autoDispose.family<List<Product>, int>((ref, storeId) {
  return ref.read(storeRepositoryProvider).fetchProductsForStore(storeId);
});

/// The store detail page — a rich menu layout (spec section 12): cover header
/// with actions, a store info card, a sticky jump-to-section category bar, and
/// products as a 2-column card grid with quick-add buttons. A persistent cart
/// bar appears at the bottom whenever the cart isn't empty (the shell's
/// floating cart button doesn't reach this root-pushed route).
class StoreScreen extends ConsumerWidget {
  const StoreScreen({super.key, required this.slugOrId});

  final String slugOrId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final storeAsync = ref.watch(storeByKeyProvider(slugOrId));
    final cart = ref.watch(cartControllerProvider);
    return Scaffold(
      body: storeAsync.when(
        loading: () => const AppLoadingView(),
        error: (_, _) => AppErrorView(onRetry: () => ref.invalidate(storeByKeyProvider(slugOrId))),
        data: (store) {
          if (store == null) {
            return const AppEmptyView(message: AppStrings.storeUnavailable, icon: Icons.storefront_outlined);
          }
          return _StoreBody(store: store);
        },
      ),
      bottomNavigationBar: cart.isEmpty ? null : _StoreCartBar(itemCount: cart.itemCount, subtotal: cart.subtotal),
    );
  }
}

class _StoreCartBar extends StatelessWidget {
  const _StoreCartBar({required this.itemCount, required this.subtotal});

  final int itemCount;
  final double subtotal;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: PressScale(
          onTap: () => context.push(AppRoutes.cart),
          child: Container(
            height: 54,
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            decoration: BoxDecoration(
              color: AppColors.green800,
              borderRadius: BorderRadius.circular(AppRadius.sm),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
                  decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.22), borderRadius: BorderRadius.circular(AppRadius.pill)),
                  child: Text('$itemCount', style: AppTextStyles.label.copyWith(color: Colors.white)),
                ),
                const SizedBox(width: AppSpacing.sm),
                Text(AppStrings.viewCart, style: AppTextStyles.title.copyWith(color: Colors.white, fontSize: 15)),
                const Spacer(),
                Text('${subtotal.toStringAsFixed(0)} ${AppStrings.currencySuffix}', style: AppTextStyles.title.copyWith(color: Colors.white, fontSize: 16)),
                const SizedBox(width: AppSpacing.xs),
                const Icon(Icons.shopping_cart_rounded, color: Colors.white, size: 20),
              ],
            ),
          ),
        ),
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
  final _searchController = TextEditingController();
  String _query = '';
  String? _selectedCategory;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_syncActiveCategory);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_syncActiveCategory);
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  /// Highlight the category whose section is currently under the sticky bar as
  /// the user scrolls, so the tab bar tracks the content (reference behaviour).
  void _syncActiveCategory() {
    if (_query.isNotEmpty || _sectionKeys.isEmpty) return;
    final barBottom = MediaQuery.of(context).padding.top + kToolbarHeight + 52 + 8;
    String? current;
    for (final entry in _sectionKeys.entries) {
      final ctx = entry.value.currentContext;
      if (ctx == null) continue;
      final box = ctx.findRenderObject() as RenderBox?;
      if (box == null || !box.attached) continue;
      final dy = box.localToGlobal(Offset.zero).dy;
      if (dy <= barBottom) {
        current = entry.key;
      } else {
        break;
      }
    }
    if (current != null && current != _selectedCategory) {
      setState(() => _selectedCategory = current);
    }
  }

  void _scrollToCategory(String category) {
    setState(() => _selectedCategory = category);
    final ctx = _sectionKeys[category]?.currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(ctx, duration: AppMotion.base, curve: Curves.easeOut, alignmentPolicy: ScrollPositionAlignmentPolicy.explicit);
    }
  }

  void _onProductAdd(Product product) {
    // Products with choices must be configured on the detail screen; a bare
    // "+" can't express which size/addons the customer wants.
    if (product.options.isNotEmpty || product.addons.isNotEmpty) {
      context.push(AppRoutes.productDetailPath(widget.store.slug ?? widget.store.id.toString(), product.id.toString()));
      return;
    }
    final item = CartItem(
      productId: product.id,
      storeId: product.storeId,
      name: product.name,
      image: product.image,
      unitPrice: product.price,
    );
    final result = ref.read(cartControllerProvider.notifier).addItem(item);
    if (result == AddToCartResult.otherStoreConflict) {
      _showConflictDialog(item);
      return;
    }
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text('أُضيف "${product.name}" إلى السلة'), duration: const Duration(milliseconds: 1200)));
  }

  void _showConflictDialog(CartItem item) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text(AppStrings.cartConflictTitle),
        content: const Text(AppStrings.cartConflictBody),
        actions: [
          TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text(AppStrings.cartConflictKeep)),
          FilledButton(
            onPressed: () {
              ref.read(cartControllerProvider.notifier).clearAndAdd(item);
              Navigator.of(context).pop();
            },
            child: const Text(AppStrings.cartConflictClear),
          ),
        ],
      ),
    );
  }

  void _openProduct(Product product) {
    context.push(AppRoutes.productDetailPath(widget.store.slug ?? widget.store.id.toString(), product.id.toString()));
  }

  @override
  Widget build(BuildContext context) {
    final store = widget.store;
    final productsAsync = ref.watch(storeProductsProvider(store.id));
    final isFavorite = ref.watch(favoritesControllerProvider).contains(store.id);

    return CustomScrollView(
      controller: _scrollController,
      slivers: [
        SliverAppBar(
          expandedHeight: 210,
          pinned: true,
          automaticallyImplyLeading: false,
          backgroundColor: AppColors.cream,
          surfaceTintColor: AppColors.cream,
          leading: _CircleAction(icon: Icons.arrow_forward_rounded, onTap: () => context.pop()),
          actions: [
            _CircleAction(
              icon: isFavorite ? Icons.favorite_rounded : Icons.favorite_border_rounded,
              iconColor: isFavorite ? AppColors.danger : AppColors.ink,
              onTap: () => ref.read(favoritesControllerProvider.notifier).toggle(store.id),
            ),
          ],
          flexibleSpace: FlexibleSpaceBar(
            background: Stack(
              fit: StackFit.expand,
              children: [
                if (store.coverImage != null || store.image != null)
                  CachedNetworkImage(
                    imageUrl: (store.coverImage ?? store.image)!,
                    fit: BoxFit.cover,
                    errorWidget: (_, _, _) => Container(color: AppColors.creamDark),
                  )
                else
                  Container(color: AppColors.creamDark),
                const DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.transparent, Colors.black26],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        SliverToBoxAdapter(child: _StoreInfoCard(store: store)),
        SliverToBoxAdapter(child: _MenuSearchField(controller: _searchController, onChanged: (v) => setState(() => _query = v.trim()))),
        productsAsync.when(
          loading: () => const SliverToBoxAdapter(child: Padding(padding: EdgeInsets.only(top: 60), child: AppLoadingView())),
          error: (_, _) => SliverToBoxAdapter(child: Padding(padding: const EdgeInsets.only(top: 60), child: AppErrorView(onRetry: () => ref.invalidate(storeProductsProvider(store.id))))),
          data: (products) => _buildProductSlivers(context, products),
        ),
      ],
    );
  }

  Widget _buildProductSlivers(BuildContext context, List<Product> products) {
    if (products.isEmpty) {
      return const SliverToBoxAdapter(child: Padding(padding: EdgeInsets.only(top: 60), child: AppEmptyView(message: AppStrings.noResults, icon: Icons.no_food_rounded)));
    }

    // Card height = square image (its width) + a fixed text block, computed
    // from the real card width so cards never overflow on a narrow screen and
    // never leave a big empty gap on a wide one.
    final cardWidth = (MediaQuery.of(context).size.width - AppSpacing.lg * 2 - AppSpacing.md) / 2;
    final gridDelegate = SliverGridDelegateWithFixedCrossAxisCount(
      crossAxisCount: 2,
      mainAxisSpacing: AppSpacing.md,
      crossAxisSpacing: AppSpacing.md,
      mainAxisExtent: cardWidth + 70,
    );

    // Search mode: a single flat grid of matches, no category bar/sections.
    if (_query.isNotEmpty) {
      final q = _normalize(_query);
      final matches = products.where((p) => _normalize(p.name).contains(q)).toList();
      if (matches.isEmpty) {
        return const SliverToBoxAdapter(child: Padding(padding: EdgeInsets.only(top: 40), child: AppEmptyView(message: AppStrings.noResults, icon: Icons.search_off_rounded)));
      }
      return SliverPadding(
        padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, 100),
        sliver: SliverGrid(
          gridDelegate: gridDelegate,
          delegate: SliverChildBuilderDelegate(
            (context, i) => _ProductGridCard(product: matches[i], onTap: () => _openProduct(matches[i]), onAdd: () => _onProductAdd(matches[i])),
            childCount: matches.length,
          ),
        ),
      );
    }

    // Categorized mode: sticky bar + a titled 2-column grid per category.
    final byCategory = <String, List<Product>>{};
    for (final p in products) {
      byCategory.putIfAbsent(p.category ?? 'أخرى', () => []).add(p);
    }
    // Stable keys across rebuilds (recreating GlobalKeys every build would
    // detach the sections and break scroll-to / active tracking).
    for (final k in byCategory.keys) {
      _sectionKeys.putIfAbsent(k, () => GlobalKey());
    }
    _selectedCategory ??= byCategory.keys.first;

    return SliverMainAxisGroup(
      slivers: [
        SliverPersistentHeader(
          pinned: true,
          delegate: _CategoryBarDelegate(
            categories: byCategory.keys.toList(),
            selected: _selectedCategory,
            onTap: _scrollToCategory,
          ),
        ),
        for (final entry in byCategory.entries) ...[
          SliverToBoxAdapter(
            child: Padding(
              key: _sectionKeys[entry.key],
              padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, AppSpacing.md),
              child: Text(entry.key, style: AppTextStyles.headline.copyWith(fontSize: 19)),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            sliver: SliverGrid(
              gridDelegate: gridDelegate,
              delegate: SliverChildBuilderDelegate(
                (context, i) => _ProductGridCard(product: entry.value[i], onTap: () => _openProduct(entry.value[i]), onAdd: () => _onProductAdd(entry.value[i])),
                childCount: entry.value.length,
              ),
            ),
          ),
        ],
        const SliverToBoxAdapter(child: SizedBox(height: 100)),
      ],
    );
  }

  String _normalize(String s) => s
      .replaceAll(RegExp('[أإآا]'), 'ا')
      .replaceAll('ة', 'ه')
      .replaceAll('ى', 'ي')
      .replaceAll(RegExp(r'\s+'), ' ')
      .toLowerCase()
      .trim();
}

class _CircleAction extends StatelessWidget {
  const _CircleAction({required this.icon, required this.onTap, this.iconColor});

  final IconData icon;
  final VoidCallback onTap;
  final Color? iconColor;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(6),
      child: Material(
        color: Colors.white,
        shape: const CircleBorder(),
        elevation: 1,
        child: InkWell(
          onTap: onTap,
          customBorder: const CircleBorder(),
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: Icon(icon, size: 20, color: iconColor ?? AppColors.ink),
          ),
        ),
      ),
    );
  }
}

class _StoreInfoCard extends StatelessWidget {
  const _StoreInfoCard({required this.store});

  final Store store;

  @override
  Widget build(BuildContext context) {
    final hasOffer = store.hasOffer && store.offer != null && store.offer!.trim().isNotEmpty;
    return Container(
      margin: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, AppSpacing.sm),
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (store.logoImage != null) ...[
                ClipRRect(
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                  child: CachedNetworkImage(
                    imageUrl: store.logoImage!,
                    width: 52,
                    height: 52,
                    fit: BoxFit.cover,
                    errorWidget: (_, _, _) => Container(width: 52, height: 52, color: AppColors.creamDark),
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
              ],
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(store.name, style: AppTextStyles.headline.copyWith(fontSize: 20), maxLines: 1, overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        if (store.category.isNotEmpty)
                          Flexible(child: Text(store.category, style: AppTextStyles.caption, maxLines: 1, overflow: TextOverflow.ellipsis)),
                      ],
                    ),
                  ],
                ),
              ),
              OpenClosedBadge(open: store.open),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: [
              if (store.rating > 0) _MetaPill(icon: Icons.star_rounded, iconColor: AppColors.orangeDark, text: '${store.rating.toStringAsFixed(1)}${store.reviews > 0 ? ' (${store.reviews})' : ''}'),
              if (store.etaLabel != null) _MetaPill(icon: Icons.access_time_rounded, text: store.etaLabel!),
              if (store.deliveryFeePerKm != null) _MetaPill(icon: Icons.delivery_dining_rounded, text: '${store.deliveryFeePerKm!.toStringAsFixed(0)} ${AppStrings.currencySuffix}${AppStrings.perKm}'),
              if (store.minOrder != null) _MetaPill(icon: Icons.shopping_basket_rounded, text: '${AppStrings.minOrder}: ${store.minOrder!.toStringAsFixed(0)} ${AppStrings.currencySuffix}'),
            ],
          ),
          if (hasOffer) ...[
            const SizedBox(height: AppSpacing.md),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
              decoration: BoxDecoration(color: AppColors.orangeSoft, borderRadius: BorderRadius.circular(AppRadius.sm)),
              child: Row(
                children: [
                  const Icon(Icons.local_offer_rounded, size: 16, color: AppColors.orangeDark),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(child: Text(store.offer!.trim(), style: AppTextStyles.label.copyWith(color: AppColors.orangeDark), maxLines: 2, overflow: TextOverflow.ellipsis)),
                ],
              ),
            ),
          ],
          if (store.description != null && store.description!.trim().isNotEmpty) ...[
            const SizedBox(height: AppSpacing.md),
            Text(store.description!.trim(), style: AppTextStyles.bodyMuted, maxLines: 3, overflow: TextOverflow.ellipsis),
          ],
        ],
      ),
    );
  }
}

class _MetaPill extends StatelessWidget {
  const _MetaPill({required this.icon, required this.text, this.iconColor});

  final IconData icon;
  final String text;
  final Color? iconColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 5),
      decoration: BoxDecoration(color: AppColors.cream, borderRadius: BorderRadius.circular(AppRadius.pill), border: Border.all(color: AppColors.line)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: iconColor ?? AppColors.muted),
          const SizedBox(width: 4),
          Text(text, style: AppTextStyles.caption.copyWith(color: AppColors.ink)),
        ],
      ),
    );
  }
}

class _MenuSearchField extends StatelessWidget {
  const _MenuSearchField({required this.controller, required this.onChanged});

  final TextEditingController controller;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.sm, AppSpacing.lg, AppSpacing.md),
      child: TextField(
        controller: controller,
        onChanged: onChanged,
        textInputAction: TextInputAction.search,
        decoration: InputDecoration(
          hintText: AppStrings.storeMenuSearchHint,
          prefixIcon: const Icon(Icons.search_rounded, color: AppColors.muted),
          suffixIcon: controller.text.isEmpty
              ? null
              : IconButton(
                  icon: const Icon(Icons.close_rounded, color: AppColors.muted),
                  onPressed: () {
                    controller.clear();
                    onChanged('');
                  },
                ),
          isDense: true,
        ),
      ),
    );
  }
}

class _ProductGridCard extends StatelessWidget {
  const _ProductGridCard({required this.product, required this.onTap, required this.onAdd});

  final Product product;
  final VoidCallback onTap;
  final VoidCallback onAdd;

  @override
  Widget build(BuildContext context) {
    final canAdd = product.available && !product.priceOnRequest;
    final showOldPrice = product.oldPrice != null && product.oldPrice! > product.price;
    return Opacity(
      opacity: product.available ? 1 : 0.55,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(AppRadius.md),
          border: Border.all(color: AppColors.line),
        ),
        clipBehavior: Clip.antiAlias,
        child: LayoutBuilder(
          builder: (context, constraints) {
            final imageSize = constraints.maxWidth;
            return Stack(
              children: [
                // Pure visual content — carries no gesture, so the whole-card
                // tap layer and the "+" button (siblings below/above it) never
                // fight in a nested gesture arena the way a wrapping PressScale
                // did (which silently swallowed every "+" tap).
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(
                      width: imageSize,
                      height: imageSize,
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          if (product.image != null)
                            CachedNetworkImage(imageUrl: product.image!, fit: BoxFit.cover, errorWidget: (_, _, _) => Container(color: AppColors.creamDark, child: const Icon(Icons.fastfood_rounded, color: AppColors.line)))
                          else
                            Container(color: AppColors.creamDark, child: const Icon(Icons.fastfood_rounded, color: AppColors.line, size: 36)),
                          if (product.featured)
                            Positioned(
                              top: AppSpacing.sm,
                              right: AppSpacing.sm,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 3),
                                decoration: BoxDecoration(color: AppColors.orange, borderRadius: BorderRadius.circular(AppRadius.pill)),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.local_fire_department_rounded, size: 12, color: Colors.white),
                                    const SizedBox(width: 3),
                                    Text(AppStrings.featuredBadge, style: AppTextStyles.caption.copyWith(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 11)),
                                  ],
                                ),
                              ),
                            ),
                          if (!product.available)
                            Positioned(
                              left: AppSpacing.sm,
                              bottom: AppSpacing.sm,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 3),
                                decoration: BoxDecoration(color: AppColors.ink.withValues(alpha: 0.75), borderRadius: BorderRadius.circular(AppRadius.pill)),
                                child: Text(AppStrings.productUnavailable, style: AppTextStyles.caption.copyWith(color: Colors.white, fontWeight: FontWeight.w700)),
                              ),
                            ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(AppSpacing.sm + 2),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Single-line name keeps every card compact and the
                          // price row aligned across the grid; the full name is
                          // on the product detail screen.
                          Text(product.name, style: AppTextStyles.titleSmall, maxLines: 1, overflow: TextOverflow.ellipsis),
                          const SizedBox(height: AppSpacing.xs),
                          if (product.priceOnRequest)
                            Text(AppStrings.priceOnRequestLabel, style: AppTextStyles.label.copyWith(color: AppColors.green800))
                          else
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text('${product.price.toStringAsFixed(0)} ${AppStrings.currencySuffix}', style: AppTextStyles.price.copyWith(fontSize: 16)),
                                if (showOldPrice) ...[
                                  const SizedBox(width: AppSpacing.xs + 1),
                                  Text(
                                    '${product.oldPrice!.toStringAsFixed(0)} ${AppStrings.currencySuffix}',
                                    style: AppTextStyles.caption.copyWith(color: AppColors.muted, decoration: TextDecoration.lineThrough),
                                  ),
                                ],
                              ],
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
                // Whole-card tap → product detail (below the "+").
                Positioned.fill(child: GestureDetector(behavior: HitTestBehavior.opaque, onTap: onTap)),
                // Quick-add, on top so it intercepts its own taps first.
                if (canAdd)
                  Positioned(
                    top: imageSize - 46,
                    left: AppSpacing.sm,
                    child: GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onTap: onAdd,
                      child: Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: AppColors.green800,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 2),
                          boxShadow: [BoxShadow(color: AppColors.green900.withValues(alpha: 0.3), blurRadius: 6, offset: const Offset(0, 2))],
                        ),
                        child: const Icon(Icons.add_rounded, color: Colors.white, size: 22),
                      ),
                    ),
                  ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _CategoryBarDelegate extends SliverPersistentHeaderDelegate {
  _CategoryBarDelegate({required this.categories, required this.selected, required this.onTap});

  final List<String> categories;
  final String? selected;
  final void Function(String) onTap;

  @override
  double get minExtent => 52;
  @override
  double get maxExtent => 52;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: AppColors.cream,
      alignment: Alignment.centerRight,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
        itemCount: categories.length,
        separatorBuilder: (_, _) => const SizedBox(width: AppSpacing.sm),
        itemBuilder: (context, i) {
          final isActive = categories[i] == selected;
          return PressScale(
            onTap: () => onTap(categories[i]),
            child: Container(
              alignment: Alignment.center,
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
              decoration: BoxDecoration(
                color: isActive ? AppColors.green800 : AppColors.white,
                borderRadius: BorderRadius.circular(AppRadius.pill),
                border: Border.all(color: isActive ? AppColors.green800 : AppColors.line),
              ),
              child: Text(
                categories[i],
                style: AppTextStyles.label.copyWith(color: isActive ? Colors.white : AppColors.ink),
              ),
            ),
          );
        },
      ),
    );
  }

  @override
  bool shouldRebuild(covariant _CategoryBarDelegate oldDelegate) => oldDelegate.categories != categories || oldDelegate.selected != selected;
}
