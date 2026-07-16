import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/widgets/state_views.dart';
import '../../cart/application/cart_controller.dart';
import '../../cart/domain/cart_item.dart';
import '../../stores/presentation/store_screen.dart';
import '../domain/product.dart';

/// Spec section 13 + 14. Option groups are single-select radios that always
/// default to their first value (matches app.js's openProductModal — there
/// is no "unselected" state), so there is nothing to validate/require before
/// enabling "أضف إلى السلة"; addons are independent optional checkboxes.
class ProductScreen extends ConsumerStatefulWidget {
  const ProductScreen({super.key, required this.storeSlugOrId, required this.productId});

  final String storeSlugOrId;
  final String productId;

  @override
  ConsumerState<ProductScreen> createState() => _ProductScreenState();
}

class _ProductScreenState extends ConsumerState<ProductScreen> {
  int _quantity = 1;
  final List<int> _selectedValueIndexPerOption = []; // one entry per product.options[i], defaults to 0
  final Set<int> _selectedAddonIndexes = {};
  final _notesController = TextEditingController();

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  void _ensureOptionDefaults(Product product) {
    while (_selectedValueIndexPerOption.length < product.options.length) {
      _selectedValueIndexPerOption.add(0);
    }
  }

  void _addToCart(Product product) {
    _ensureOptionDefaults(product);
    final unitPrice = product.estimatedTotal(
      selectedValueIndexPerOption: _selectedValueIndexPerOption,
      selectedAddonIndexes: _selectedAddonIndexes,
    );
    final optionLabels = [
      for (var i = 0; i < product.options.length; i++)
        if (_selectedValueIndexPerOption[i] < product.options[i].values.length)
          product.options[i].values[_selectedValueIndexPerOption[i]],
    ];
    final addonLabels = [
      for (var i = 0; i < product.addons.length; i++)
        if (_selectedAddonIndexes.contains(i)) '+${product.addons[i].name}',
    ];

    final item = CartItem(
      productId: product.id,
      storeId: product.storeId,
      name: product.name,
      image: product.image,
      unitPrice: unitPrice,
      quantity: _quantity,
      selectedOptionId: optionLabels.isEmpty ? null : optionLabels.join('، '),
      selectedOptionLabel: optionLabels.isEmpty ? null : optionLabels.join('، '),
      selectedAddonIds: List.generate(addonLabels.length, (i) => i.toString()),
      selectedAddonLabels: addonLabels,
      notes: _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
    );

    final result = ref.read(cartControllerProvider.notifier).addItem(item);
    if (result == AddToCartResult.otherStoreConflict) {
      _showConflictDialog(item);
      return;
    }
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('أُضيف "${product.name}" إلى السلة')));
      Navigator.of(context).maybePop();
    }
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
              Navigator.of(context).maybePop();
            },
            child: const Text(AppStrings.cartConflictClear),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final storeAsync = ref.watch(storeByKeyProvider(widget.storeSlugOrId));
    return Scaffold(
      appBar: AppBar(backgroundColor: AppColors.cream),
      extendBodyBehindAppBar: false,
      body: storeAsync.when(
        loading: () => const AppLoadingView(),
        error: (_, _) => AppErrorView(onRetry: () => ref.invalidate(storeByKeyProvider(widget.storeSlugOrId))),
        data: (store) {
          if (store == null) return const AppEmptyView(message: 'غير متاح', icon: Icons.error_outline_rounded);
          final productsAsync = ref.watch(storeProductsProvider(store.id));
          return productsAsync.when(
            loading: () => const AppLoadingView(),
            error: (_, _) => AppErrorView(onRetry: () => ref.invalidate(storeProductsProvider(store.id))),
            data: (products) {
              final matches = products.where((p) => p.id.toString() == widget.productId);
              final product = matches.isEmpty ? null : matches.first;
              if (product == null) return const AppEmptyView(message: 'هذا المنتج غير متاح', icon: Icons.no_food_rounded);
              _ensureOptionDefaults(product);
              return _ProductBody(
                product: product,
                quantity: _quantity,
                selectedValueIndexPerOption: _selectedValueIndexPerOption,
                selectedAddonIndexes: _selectedAddonIndexes,
                notesController: _notesController,
                onQuantityChanged: (q) => setState(() => _quantity = q),
                onOptionSelected: (groupIndex, valueIndex) => setState(() => _selectedValueIndexPerOption[groupIndex] = valueIndex),
                onAddonToggled: (addonIndex, selected) => setState(() => selected ? _selectedAddonIndexes.add(addonIndex) : _selectedAddonIndexes.remove(addonIndex)),
                onAdd: () => _addToCart(product),
              );
            },
          );
        },
      ),
    );
  }
}

class _ProductBody extends StatelessWidget {
  const _ProductBody({
    required this.product,
    required this.quantity,
    required this.selectedValueIndexPerOption,
    required this.selectedAddonIndexes,
    required this.notesController,
    required this.onQuantityChanged,
    required this.onOptionSelected,
    required this.onAddonToggled,
    required this.onAdd,
  });

  final Product product;
  final int quantity;
  final List<int> selectedValueIndexPerOption;
  final Set<int> selectedAddonIndexes;
  final TextEditingController notesController;
  final ValueChanged<int> onQuantityChanged;
  final void Function(int groupIndex, int valueIndex) onOptionSelected;
  final void Function(int addonIndex, bool selected) onAddonToggled;
  final VoidCallback onAdd;

  @override
  Widget build(BuildContext context) {
    final total = product.estimatedTotal(
          selectedValueIndexPerOption: selectedValueIndexPerOption,
          selectedAddonIndexes: selectedAddonIndexes,
        ) *
        quantity;

    return Column(
      children: [
        Expanded(
          child: ListView(
            padding: EdgeInsets.zero,
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(bottom: Radius.circular(AppRadius.md)),
                child: AspectRatio(
                  aspectRatio: 4 / 3,
                  child: product.image != null
                      ? CachedNetworkImage(imageUrl: product.image!, fit: BoxFit.cover, errorWidget: (_, _, _) => Container(color: AppColors.creamDark))
                      : Container(color: AppColors.creamDark, child: const Icon(Icons.fastfood_rounded, size: 48, color: AppColors.line)),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(product.name, style: AppTextStyles.headline),
                    if (product.description != null) ...[
                      const SizedBox(height: AppSpacing.sm),
                      Text(product.description!, style: AppTextStyles.bodyMuted),
                    ],
                    const SizedBox(height: AppSpacing.md),
                    Text(
                      product.priceOnRequest ? 'السعر عند الطلب' : '${product.price.toStringAsFixed(0)} ${AppStrings.currencySuffix}',
                      style: AppTextStyles.priceLarge,
                    ),
                  ],
                ),
              ),
              for (var groupIndex = 0; groupIndex < product.options.length; groupIndex++)
                _OptionCard(
                  title: product.options[groupIndex].name,
                  child: Column(
                    children: [
                      for (var valueIndex = 0; valueIndex < product.options[groupIndex].values.length; valueIndex++)
                        RadioListTile<int>(
                          contentPadding: EdgeInsets.zero,
                          title: Text(
                            product.options[groupIndex].values[valueIndex],
                            style: AppTextStyles.body,
                          ),
                          secondary: product.options[groupIndex].extra[valueIndex] != 0
                              ? Text(
                                  '${product.options[groupIndex].extra[valueIndex] > 0 ? '+' : ''}${product.options[groupIndex].extra[valueIndex].toStringAsFixed(0)}',
                                  style: AppTextStyles.label.copyWith(color: AppColors.green800),
                                )
                              : null,
                          value: valueIndex,
                          groupValue: groupIndex < selectedValueIndexPerOption.length ? selectedValueIndexPerOption[groupIndex] : 0,
                          onChanged: (v) => onOptionSelected(groupIndex, v!),
                        ),
                    ],
                  ),
                ),
              if (product.addons.isNotEmpty)
                _OptionCard(
                  title: 'إضافات (اختياري)',
                  child: Column(
                    children: [
                      for (var i = 0; i < product.addons.length; i++)
                        CheckboxListTile(
                          contentPadding: EdgeInsets.zero,
                          title: Text(product.addons[i].name, style: AppTextStyles.body),
                          secondary: product.addons[i].price > 0
                              ? Text('+${product.addons[i].price.toStringAsFixed(0)}', style: AppTextStyles.label.copyWith(color: AppColors.green800))
                              : null,
                          value: selectedAddonIndexes.contains(i),
                          onChanged: (v) => onAddonToggled(i, v ?? false),
                        ),
                    ],
                  ),
                ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
                child: TextField(
                  controller: notesController,
                  decoration: const InputDecoration(labelText: 'ملاحظات على المنتج', hintText: 'اختياري'),
                  maxLines: 2,
                ),
              ),
              const SizedBox(height: AppSpacing.xl),
            ],
          ),
        ),
        DecoratedBox(
          decoration: BoxDecoration(
            color: AppColors.white,
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 12, offset: const Offset(0, -4))],
          ),
          child: SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Row(
                children: [
                  _QuantityStepper(quantity: quantity, onChanged: onQuantityChanged),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: product.available ? onAdd : null,
                      child: Text('${AppStrings.addToCart} · ${total.toStringAsFixed(0)} ${AppStrings.currencySuffix}'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _OptionCard extends StatelessWidget {
  const _OptionCard({required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: AppTextStyles.titleSmall),
              child,
            ],
          ),
        ),
      ),
    );
  }
}

class _QuantityStepper extends StatelessWidget {
  const _QuantityStepper({required this.quantity, required this.onChanged});

  final int quantity;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(border: Border.all(color: AppColors.line), borderRadius: BorderRadius.circular(AppRadius.sm)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(onPressed: quantity > 1 ? () => onChanged(quantity - 1) : null, icon: const Icon(Icons.remove)),
          SizedBox(width: 24, child: Text('$quantity', textAlign: TextAlign.center, style: AppTextStyles.titleSmall)),
          IconButton(onPressed: () => onChanged(quantity + 1), icon: const Icon(Icons.add)),
        ],
      ),
    );
  }
}
