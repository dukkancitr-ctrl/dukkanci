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
import '../application/cart_controller.dart';
import '../domain/cart_item.dart';

class CartScreen extends ConsumerWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(cartControllerProvider);
    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.cartTitle)),
      // The summary bar lives INSIDE the body (Column + Expanded), not in the
      // Scaffold's bottomNavigationBar slot. That slot lays its child out with
      // LOOSE constraints (maxHeight = full screen), and this bar's subtree
      // expanded to fill all of it — a screen-tall white bar over a cream
      // background that just looked like an empty page, while the body got
      // squeezed to zero height. No exception was ever thrown, which made it
      // look like the cart was simply empty. product_screen.dart already uses
      // this same in-body pattern successfully; keep them consistent.
      body: cart.isEmpty
          ? AppEmptyView(
              message: AppStrings.cartEmpty,
              icon: Icons.shopping_cart_outlined,
              action: OutlinedButton(onPressed: () => context.go(AppRoutes.home), child: const Text('تصفّح المتاجر')),
            )
          : Column(
              children: [
                Expanded(child: _itemList(context, ref, cart)),
                _summaryBar(context, cart),
              ],
            ),
    );
  }

  Widget _itemList(BuildContext context, WidgetRef ref, CartState cart) {
    return ListView.separated(
              padding: const EdgeInsets.all(AppSpacing.lg),
              itemCount: cart.items.length,
              separatorBuilder: (_, _) => const SizedBox(height: AppSpacing.md),
              itemBuilder: (context, i) {
                final item = cart.items[i];
                return Dismissible(
                  key: ValueKey(item.lineKey),
                  direction: DismissDirection.endToStart,
                  confirmDismiss: (_) => _confirmRemove(context, item),
                  onDismissed: (_) => ref.read(cartControllerProvider.notifier).removeLine(item.lineKey),
                  background: Container(
                    alignment: AlignmentDirectional.centerEnd,
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                    decoration: BoxDecoration(color: AppColors.danger, borderRadius: BorderRadius.circular(AppRadius.md)),
                    child: const Icon(Icons.delete_rounded, color: Colors.white),
                  ),
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(AppSpacing.md),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(AppRadius.sm),
                            child: SizedBox(
                              width: 56,
                              height: 56,
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
                                    _stepperButton(Icons.remove, () => ref.read(cartControllerProvider.notifier).updateQuantity(item.lineKey, item.quantity - 1)),
                                    SizedBox(width: 28, child: Text('${item.quantity}', textAlign: TextAlign.center, style: AppTextStyles.label)),
                                    _stepperButton(Icons.add, () => ref.read(cartControllerProvider.notifier).updateQuantity(item.lineKey, item.quantity + 1)),
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
                  ),
                );
              },
            );
  }

  Widget _summaryBar(BuildContext context, CartState cart) {
    return DecoratedBox(
              decoration: BoxDecoration(
                color: AppColors.white,
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 12, offset: const Offset(0, -4))],
              ),
              child: SafeArea(
                top: false,
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  // Mirrors product_screen.dart's bottom bar, which is proven to
                  // render: the flexible child is the BUTTON, and the text block
                  // sizes to its content. Bisected on the emulator — an earlier
                  // version wrapped the text Column in Expanded instead, and the
                  // whole bar (and the list above it) silently failed to paint
                  // with no exception logged.
                  child: Row(
                    children: [
                      Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('الإجمالي (${cart.itemCount} منتج)', style: AppTextStyles.caption),
                          Text('${cart.subtotal.toStringAsFixed(0)} ${AppStrings.currencySuffix}', style: AppTextStyles.price),
                        ],
                      ),
                      const SizedBox(width: AppSpacing.md),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () => context.push(AppRoutes.checkout),
                          child: const Text(AppStrings.checkoutTitle),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
  }

  Widget _stepperButton(IconData icon, VoidCallback onTap) {
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

  Future<bool> _confirmRemove(BuildContext context, CartItem item) async {
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
}
