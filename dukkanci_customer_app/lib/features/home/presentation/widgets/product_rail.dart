import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/localization/app_strings.dart';
import '../../../../core/routing/app_routes.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/press_scale.dart';
import '../../../cart/application/cart_controller.dart';
import '../../../cart/domain/cart_item.dart';
import '../../../products/domain/product.dart';

/// A titled horizontal rail of individual products (reference: the website's
/// «عروض اليوم» / «منتجات مقترحة لك» rails). Renders nothing when empty.
/// [storeNames] maps storeId → store name, so a card can show which store a
/// product belongs to (Product carries only storeId).
class ProductRail extends StatelessWidget {
  const ProductRail({
    super.key,
    required this.title,
    this.subtitle,
    required this.products,
    required this.storeNames,
    this.onSeeAll,
  });

  final String title;
  final String? subtitle;
  final List<Product> products;
  final Map<int, String> storeNames;
  final VoidCallback? onSeeAll;

  @override
  Widget build(BuildContext context) {
    if (products.isEmpty) return const SizedBox.shrink();
    final cardWidth = (MediaQuery.of(context).size.width - AppSpacing.lg * 2 - AppSpacing.md) / 2.2;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.fromLTRB(AppSpacing.lg, 0, AppSpacing.lg, subtitle == null ? AppSpacing.md : 2),
          child: Row(
            children: [
              Expanded(child: Text(title, style: AppTextStyles.title)),
              if (onSeeAll != null)
                PressScale(
                  onTap: onSeeAll!,
                  child: Row(
                    children: [
                      Text(AppStrings.seeAll, style: AppTextStyles.label.copyWith(color: AppColors.green800)),
                      const Icon(Icons.chevron_left_rounded, size: 18, color: AppColors.green800),
                    ],
                  ),
                ),
            ],
          ),
        ),
        if (subtitle != null)
          Padding(
            padding: const EdgeInsets.fromLTRB(AppSpacing.lg, 0, AppSpacing.lg, AppSpacing.md),
            child: Text(subtitle!, style: AppTextStyles.caption),
          ),
        SizedBox(
          height: cardWidth + 132,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.fromLTRB(AppSpacing.lg, 2, AppSpacing.lg, 20),
            itemCount: products.length,
            separatorBuilder: (_, _) => const SizedBox(width: AppSpacing.md),
            itemBuilder: (context, i) => ProductRailCard(product: products[i], width: cardWidth, storeName: storeNames[products[i].storeId]),
          ),
        ),
      ],
    );
  }
}

class ProductRailCard extends ConsumerWidget {
  const ProductRailCard({super.key, required this.product, required this.width, this.storeName});

  final Product product;
  final double width;
  final String? storeName;

  void _openProduct(BuildContext context) {
    context.push(AppRoutes.productDetailPath(product.storeId.toString(), product.id.toString()));
  }

  void _onAdd(BuildContext context, WidgetRef ref) {
    // A product with options/addons must be configured on its own screen — a
    // bare "+" can't express which variant the customer wants.
    if (product.options.isNotEmpty || product.addons.isNotEmpty) {
      _openProduct(context);
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
      _showConflictDialog(context, ref, item);
      return;
    }
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text('أُضيف "${product.name}" إلى السلة'), duration: const Duration(milliseconds: 1200)));
  }

  void _showConflictDialog(BuildContext context, WidgetRef ref, CartItem item) {
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

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final showOld = product.oldPrice != null && product.oldPrice! > product.price;
    final canAdd = product.available && !product.priceOnRequest;
    return SizedBox(
      width: width,
      child: PressScale(
        onTap: () => _openProduct(context),
        child: Container(
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(AppRadius.md),
            boxShadow: AppShadow.card,
          ),
          clipBehavior: Clip.antiAlias,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              AspectRatio(
                aspectRatio: 1,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    if (product.image != null)
                      CachedNetworkImage(
                        imageUrl: product.image!,
                        fit: BoxFit.cover,
                        memCacheWidth: 400,
                        errorWidget: (_, _, _) => Container(color: AppColors.creamDark, child: const Icon(Icons.fastfood_rounded, color: AppColors.line)),
                      )
                    else
                      Container(color: AppColors.creamDark, child: const Icon(Icons.fastfood_rounded, color: AppColors.line, size: 36)),
                    if (showOld)
                      Positioned(
                        top: AppSpacing.sm,
                        right: AppSpacing.sm,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 3),
                          decoration: BoxDecoration(color: AppColors.orange, borderRadius: BorderRadius.circular(AppRadius.pill)),
                          child: Text(AppStrings.railTodayOffers, style: AppTextStyles.caption.copyWith(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 11)),
                        ),
                      ),
                    if (canAdd)
                      Positioned(
                        left: AppSpacing.sm,
                        bottom: AppSpacing.sm,
                        child: GestureDetector(
                          behavior: HitTestBehavior.opaque,
                          onTap: () => _onAdd(context, ref),
                          child: Container(
                            width: 34,
                            height: 34,
                            decoration: BoxDecoration(
                              color: AppColors.green800,
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                              boxShadow: [BoxShadow(color: AppColors.green900.withValues(alpha: 0.3), blurRadius: 6, offset: const Offset(0, 2))],
                            ),
                            child: const Icon(Icons.add_rounded, color: Colors.white, size: 20),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(product.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: AppTextStyles.titleSmall),
                    if (storeName != null) ...[
                      const SizedBox(height: 2),
                      Text(storeName!, maxLines: 1, overflow: TextOverflow.ellipsis, style: AppTextStyles.caption.copyWith(color: AppColors.green800)),
                    ],
                    const SizedBox(height: AppSpacing.sm),
                    if (product.priceOnRequest)
                      Text(AppStrings.priceOnRequestLabel, style: AppTextStyles.price.copyWith(fontSize: 15))
                    else
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('${product.price.toStringAsFixed(0)} ${AppStrings.currencySuffix}', style: AppTextStyles.price.copyWith(fontSize: 16)),
                          if (showOld) ...[
                            const SizedBox(width: 5),
                            Expanded(
                              child: Text(
                                '${product.oldPrice!.toStringAsFixed(0)} ${AppStrings.currencySuffix}',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: AppTextStyles.caption.copyWith(color: AppColors.muted, decoration: TextDecoration.lineThrough),
                              ),
                            ),
                          ],
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
  }
}
