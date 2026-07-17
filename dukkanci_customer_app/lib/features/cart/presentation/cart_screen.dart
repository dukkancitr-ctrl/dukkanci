import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/widgets/state_views.dart';
import '../../products/domain/product.dart';
import '../../stores/domain/store.dart';
import '../../stores/presentation/store_screen.dart';
import '../application/cart_controller.dart';
import '../domain/cart_item.dart';

/// Reference layout: an "other items from this store" quick-add rail, a
/// summary block, and a sticky CTA — reproduced with ONLY real data. Two
/// reference elements are deliberately NOT reproduced: the "diğer müşteriler
/// de bunları aldı" (frequently-bought-together) framing — we have no
/// co-purchase statistics, so the rail here is honestly labeled "أضف المزيد
/// من [المتجر]" (browse the rest of the real menu, not a fake correlation) —
/// and the paid-membership ("Yemeksepeti Pro" free-delivery) banner, since
/// Dukkanci has no customer subscription product. The real [Store.minOrder]
/// IS enforced here (it wasn't before this redesign) since that's genuine
/// data already loaded with the store.
class CartScreen extends ConsumerWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(cartControllerProvider);
    if (cart.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text(AppStrings.cartTitle)),
        body: AppEmptyView(
          message: AppStrings.cartEmpty,
          icon: Icons.shopping_cart_outlined,
          action: OutlinedButton(onPressed: () => context.go(AppRoutes.home), child: const Text('تصفّح المتاجر')),
        ),
      );
    }

    final storeAsync = ref.watch(storeByKeyProvider(cart.storeId.toString()));
    final store = storeAsync.when(data: (s) => s, loading: () => null, error: (_, _) => null);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(icon: const Icon(Icons.close_rounded), onPressed: () => Navigator.of(context).maybePop()),
        title: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(AppStrings.cartTitle, style: AppTextStyles.title),
            if (store != null) Text(store.name, style: AppTextStyles.caption),
          ],
        ),
      ),
      // Same in-body pattern as product_screen.dart's bottom bar (not
      // Scaffold.bottomNavigationBar — that slot gives LOOSE constraints and
      // an Expanded child inside it silently fills the whole screen with a
      // blank bar while the list above collapses to zero height, with no
      // exception ever thrown).
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(AppSpacing.lg),
              children: [
                for (final item in cart.items) ...[
                  _CartItemCard(item: item),
                  const SizedBox(height: AppSpacing.md),
                ],
                if (store != null) ...[
                  const SizedBox(height: AppSpacing.md),
                  _AddMoreFromStoreRail(store: store, cartProductIds: cart.items.map((i) => i.productId).toSet()),
                ],
              ],
            ),
          ),
          _SummaryBar(cart: cart, store: store),
        ],
      ),
    );
  }
}

class _CartItemCard extends ConsumerWidget {
  const _CartItemCard({required this.item});

  final CartItem item;

  Future<bool> _confirmRemove(BuildContext context) async {
    return await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('إزالة من السلة؟'),
            content: Text('سيتم حذف "${item.name}" من السلة.'),
            actions: [
              TextButton(onPressed: () => Navigator.of(context).pop(false), child: const Text(AppStrings.cancel)),
              FilledButton(onPressed: () => Navigator.of(context).pop(true), child: const Text('حذف')),
            ],
          ),
        ) ??
        false;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Dismissible(
      key: ValueKey(item.lineKey),
      direction: DismissDirection.endToStart,
      confirmDismiss: (_) => _confirmRemove(context),
      onDismissed: (_) => ref.read(cartControllerProvider.notifier).removeLine(item.lineKey),
      background: Container(
        alignment: AlignmentDirectional.centerEnd,
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
        decoration: BoxDecoration(color: AppColors.danger, borderRadius: BorderRadius.circular(AppRadius.md)),
        child: const Icon(Icons.delete_rounded, color: Colors.white),
      ),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(AppRadius.md),
          border: Border.all(color: AppColors.line),
        ),
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(AppRadius.sm),
              child: SizedBox(
                width: 64,
                height: 64,
                child: item.image != null
                    ? CachedNetworkImage(imageUrl: item.image!, fit: BoxFit.cover, errorWidget: (_, _, _) => Container(color: AppColors.creamDark))
                    : Container(color: AppColors.creamDark),
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(item.name, style: AppTextStyles.titleSmall, maxLines: 1, overflow: TextOverflow.ellipsis),
                  if (item.selectedOptionLabel != null || item.selectedAddonLabels.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(
                      [if (item.selectedOptionLabel != null) item.selectedOptionLabel!, ...item.selectedAddonLabels].join('، '),
                      style: AppTextStyles.caption,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                  const SizedBox(height: AppSpacing.sm),
                  Row(
                    children: [
                      _StepperDot(icon: Icons.remove, onTap: () => ref.read(cartControllerProvider.notifier).updateQuantity(item.lineKey, item.quantity - 1)),
                      SizedBox(width: 28, child: Text('${item.quantity}', textAlign: TextAlign.center, style: AppTextStyles.label)),
                      _StepperDot(icon: Icons.add, onTap: () => ref.read(cartControllerProvider.notifier).updateQuantity(item.lineKey, item.quantity + 1)),
                      const Spacer(),
                      Text('${item.lineTotal.toStringAsFixed(0)} ${AppStrings.currencySuffix}', style: AppTextStyles.price.copyWith(fontSize: 15)),
                    ],
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

class _StepperDot extends StatelessWidget {
  const _StepperDot({required this.icon, required this.onTap});

  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadius.pill),
      child: Container(
        width: 26,
        height: 26,
        decoration: const BoxDecoration(color: AppColors.creamDark, shape: BoxShape.circle),
        child: Icon(icon, size: 15, color: AppColors.ink),
      ),
    );
  }
}

/// A horizontal "browse the rest of the menu" rail — real products from the
/// SAME store, already in the cart excluded, cheapest-conflict-free since
/// they share the store already in the cart.
class _AddMoreFromStoreRail extends ConsumerWidget {
  const _AddMoreFromStoreRail({required this.store, required this.cartProductIds});

  final Store store;
  final Set<int> cartProductIds;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productsAsync = ref.watch(storeProductsProvider(store.id));
    return productsAsync.when(
      loading: () => const SizedBox.shrink(),
      error: (_, _) => const SizedBox.shrink(),
      data: (products) {
        final candidates = products.where((p) => p.available && !cartProductIds.contains(p.id)).toList()
          ..sort((a, b) {
            if (a.featured != b.featured) return a.featured ? -1 : 1;
            return a.id.compareTo(b.id);
          });
        if (candidates.isEmpty) return const SizedBox.shrink();
        final items = candidates.take(10).toList();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('أضف المزيد من ${store.name}', style: AppTextStyles.title),
            const SizedBox(height: 2),
            Text(AppStrings.cartAddMoreSubtitle, style: AppTextStyles.caption),
            const SizedBox(height: AppSpacing.md),
            SizedBox(
              height: 190,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: items.length,
                separatorBuilder: (_, _) => const SizedBox(width: AppSpacing.md),
                itemBuilder: (context, i) => _QuickAddCard(product: items[i]),
              ),
            ),
          ],
        );
      },
    );
  }
}

class _QuickAddCard extends ConsumerWidget {
  const _QuickAddCard({required this.product});

  final Product product;

  void _onAdd(BuildContext context, WidgetRef ref) {
    if (product.options.isNotEmpty || product.addons.isNotEmpty) {
      context.push(AppRoutes.productDetailPath(product.storeId.toString(), product.id.toString()));
      return;
    }
    // Same store already in the cart — a plain add can never hit the
    // one-store conflict dialog here, unlike the store page's quick-add.
    ref.read(cartControllerProvider.notifier).addItem(CartItem(
          productId: product.id,
          storeId: product.storeId,
          name: product.name,
          image: product.image,
          unitPrice: product.price,
        ));
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text('أُضيف "${product.name}" إلى السلة'), duration: const Duration(milliseconds: 1200)));
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final canAdd = product.available && !product.priceOnRequest;
    return SizedBox(
      width: 130,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(AppRadius.md),
          border: Border.all(color: AppColors.line),
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  width: 130,
                  height: 130,
                  child: product.image != null
                      ? CachedNetworkImage(imageUrl: product.image!, fit: BoxFit.cover, errorWidget: (_, _, _) => Container(color: AppColors.creamDark))
                      : Container(color: AppColors.creamDark, child: const Icon(Icons.fastfood_rounded, color: AppColors.line)),
                ),
                Padding(
                  padding: const EdgeInsets.all(AppSpacing.sm),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(product.name, style: AppTextStyles.caption.copyWith(color: AppColors.ink, fontWeight: FontWeight.w600), maxLines: 1, overflow: TextOverflow.ellipsis),
                      const SizedBox(height: 3),
                      Text(
                        product.priceOnRequest ? AppStrings.priceOnRequestLabel : '${product.price.toStringAsFixed(0)} ${AppStrings.currencySuffix}',
                        style: AppTextStyles.label.copyWith(color: AppColors.green800),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            // Whole-card tap opens the product; the "+" sibling sits on top so
            // it always wins its own taps (see store_screen.dart's fix for
            // why a nested control inside the card's tap layer would not).
            Positioned.fill(
              bottom: 50,
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTap: () => context.push(AppRoutes.productDetailPath(product.storeId.toString(), product.id.toString())),
              ),
            ),
            if (canAdd)
              Positioned(
                top: 94,
                left: AppSpacing.sm,
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () => _onAdd(context, ref),
                  child: Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: AppColors.green800,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 2),
                      boxShadow: [BoxShadow(color: AppColors.green900.withValues(alpha: 0.3), blurRadius: 6, offset: const Offset(0, 2))],
                    ),
                    child: const Icon(Icons.add_rounded, color: Colors.white, size: 18),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _SummaryBar extends StatelessWidget {
  const _SummaryBar({required this.cart, required this.store});

  final CartState cart;
  final Store? store;

  @override
  Widget build(BuildContext context) {
    final minOrder = store?.minOrder;
    final belowMin = minOrder != null && cart.subtotal < minOrder;
    final missing = belowMin ? minOrder - cart.subtotal : 0;

    return DecoratedBox(
      decoration: BoxDecoration(
        color: AppColors.white,
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 12, offset: const Offset(0, -4))],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.md, AppSpacing.lg, AppSpacing.lg),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('${AppStrings.cartSubtotal} (${cart.itemCount})', style: AppTextStyles.bodyMuted),
                  Text('${cart.subtotal.toStringAsFixed(0)} ${AppStrings.currencySuffix}', style: AppTextStyles.body),
                ],
              ),
              const SizedBox(height: 4),
              Text(AppStrings.cartDeliveryNote, style: AppTextStyles.caption),
              if (belowMin) ...[
                const SizedBox(height: AppSpacing.sm),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
                  decoration: BoxDecoration(color: AppColors.orangeSoft, borderRadius: BorderRadius.circular(AppRadius.sm)),
                  child: Row(
                    children: [
                      const Icon(Icons.info_outline_rounded, size: 16, color: AppColors.orangeDark),
                      const SizedBox(width: AppSpacing.sm),
                      Expanded(
                        child: Text(
                          'أضف ${missing.toStringAsFixed(0)} ${AppStrings.currencySuffix} أخرى — الحد الأدنى للطلب من هذا المتجر ${minOrder.toStringAsFixed(0)} ${AppStrings.currencySuffix}',
                          style: AppTextStyles.caption.copyWith(color: AppColors.orangeDark),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
              const SizedBox(height: AppSpacing.md),
              Row(
                children: [
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(AppStrings.cartTotal, style: AppTextStyles.caption),
                      Text('${cart.subtotal.toStringAsFixed(0)} ${AppStrings.currencySuffix}', style: AppTextStyles.price),
                    ],
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: belowMin ? null : () => context.push(AppRoutes.checkout),
                      child: const Text(AppStrings.checkoutTitle),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
