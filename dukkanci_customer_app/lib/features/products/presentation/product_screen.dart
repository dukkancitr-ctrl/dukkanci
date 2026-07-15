import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/theme/app_colors.dart';
import '../../cart/application/cart_controller.dart';
import '../../cart/domain/cart_item.dart';
import '../../stores/presentation/store_screen.dart';
import '../domain/product.dart';

/// Spec section 13. Enforces required option groups before "أضف إلى السلة"
/// can be pressed, and shows the exact single-store conflict dialog from
/// spec section 14 when needed.
class ProductScreen extends ConsumerStatefulWidget {
  const ProductScreen({super.key, required this.storeSlugOrId, required this.productId});

  final String storeSlugOrId;
  final String productId;

  @override
  ConsumerState<ProductScreen> createState() => _ProductScreenState();
}

class _ProductScreenState extends ConsumerState<ProductScreen> {
  int _quantity = 1;
  final Map<String, String> _selectedOptionPerGroup = {}; // groupId -> choiceId
  final Set<String> _selectedAddonIds = {};
  final _notesController = TextEditingController();

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  bool _canAdd(Product product) {
    for (final group in product.options) {
      if (group.required && _selectedOptionPerGroup[group.id] == null) return false;
    }
    for (final group in product.addons) {
      final count = group.choices.where((c) => _selectedAddonIds.contains(c.id)).length;
      if (count < group.min) return false;
      if (group.max != null && count > group.max!) return false;
    }
    return true;
  }

  void _addToCart(Product product) {
    final storeId = product.storeId;
    OptionChoice? selectedOption;
    for (final group in product.options) {
      final choiceId = _selectedOptionPerGroup[group.id];
      if (choiceId != null) {
        selectedOption = group.choices.firstWhere((c) => c.id == choiceId);
      }
    }
    final selectedAddons = <AddonChoice>[
      for (final group in product.addons) ...group.choices.where((c) => _selectedAddonIds.contains(c.id)),
    ];
    final unitPrice = product.estimatedTotal(
      selectedOptionId: selectedOption?.id,
      selectedAddonIds: selectedAddons.map((a) => a.id).toList(),
    );

    final item = CartItem(
      productId: product.id,
      storeId: storeId,
      name: product.name,
      image: product.image,
      unitPrice: unitPrice,
      quantity: _quantity,
      selectedOptionId: selectedOption?.id,
      selectedOptionLabel: selectedOption?.label,
      selectedAddonIds: selectedAddons.map((a) => a.id).toList(),
      selectedAddonLabels: selectedAddons.map((a) => a.label).toList(),
      notes: _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
    );

    final result = ref.read(cartControllerProvider.notifier).addItem(item);
    if (result == AddToCartResult.otherStoreConflict) {
      _showConflictDialog(item);
      return;
    }
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('أُضيف إلى السلة')));
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
    final productsAsync = ref.watch(storeByKeyProvider(widget.storeSlugOrId));
    return Scaffold(
      body: productsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (_, _) => const Center(child: Text(AppStrings.somethingWentWrong)),
        data: (store) {
          if (store == null) return const Center(child: Text('غير متاح'));
          final productsAsync2 = ref.watch(storeProductsProvider(store.id));
          return productsAsync2.when(
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (_, _) => const Center(child: Text(AppStrings.somethingWentWrong)),
            data: (products) {
              final matches = products.where((p) => p.id.toString() == widget.productId);
              final product = matches.isEmpty ? null : matches.first;
              if (product == null) return const Center(child: Text('هذا المنتج غير متاح'));
              return _ProductBody(
                product: product,
                quantity: _quantity,
                selectedOptionPerGroup: _selectedOptionPerGroup,
                selectedAddonIds: _selectedAddonIds,
                notesController: _notesController,
                canAdd: _canAdd(product),
                onQuantityChanged: (q) => setState(() => _quantity = q),
                onOptionSelected: (groupId, choiceId) => setState(() => _selectedOptionPerGroup[groupId] = choiceId),
                onAddonToggled: (choiceId, selected) => setState(() => selected ? _selectedAddonIds.add(choiceId) : _selectedAddonIds.remove(choiceId)),
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
    required this.selectedOptionPerGroup,
    required this.selectedAddonIds,
    required this.notesController,
    required this.canAdd,
    required this.onQuantityChanged,
    required this.onOptionSelected,
    required this.onAddonToggled,
    required this.onAdd,
  });

  final Product product;
  final int quantity;
  final Map<String, String> selectedOptionPerGroup;
  final Set<String> selectedAddonIds;
  final TextEditingController notesController;
  final bool canAdd;
  final ValueChanged<int> onQuantityChanged;
  final void Function(String groupId, String choiceId) onOptionSelected;
  final void Function(String choiceId, bool selected) onAddonToggled;
  final VoidCallback onAdd;

  @override
  Widget build(BuildContext context) {
    final total = product.estimatedTotal(
      selectedOptionId: selectedOptionPerGroup.values.isEmpty ? null : selectedOptionPerGroup.values.last,
      selectedAddonIds: selectedAddonIds.toList(),
    ) * quantity;

    return Column(
      children: [
        Expanded(
          child: ListView(
            children: [
              AspectRatio(
                aspectRatio: 4 / 3,
                child: product.image != null
                    ? CachedNetworkImage(imageUrl: product.image!, fit: BoxFit.cover)
                    : Container(color: AppColors.creamDark),
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(product.name, style: Theme.of(context).textTheme.headlineSmall),
                    if (product.description != null) ...[
                      const SizedBox(height: 8),
                      Text(product.description!, style: const TextStyle(color: AppColors.muted)),
                    ],
                    const SizedBox(height: 12),
                    Text(
                      product.priceOnRequest ? 'السعر عند الطلب' : '${product.price.toStringAsFixed(0)} ${AppStrings.currencySuffix}',
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.green800),
                    ),
                  ],
                ),
              ),
              for (final group in product.options)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${group.name}${group.required ? ' *' : ''}', style: const TextStyle(fontWeight: FontWeight.bold)),
                      ...group.choices.map((choice) => RadioListTile<String>(
                            contentPadding: EdgeInsets.zero,
                            title: Text(choice.label),
                            value: choice.id,
                            groupValue: selectedOptionPerGroup[group.id],
                            onChanged: (v) => onOptionSelected(group.id, v!),
                          )),
                    ],
                  ),
                ),
              for (final group in product.addons)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(group.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                      ...group.choices.map((choice) => CheckboxListTile(
                            contentPadding: EdgeInsets.zero,
                            title: Text('${choice.label}${choice.priceDelta != null && choice.priceDelta! > 0 ? ' (+${choice.priceDelta!.toStringAsFixed(0)})' : ''}'),
                            value: selectedAddonIds.contains(choice.id),
                            enabled: choice.available,
                            onChanged: (v) => onAddonToggled(choice.id, v ?? false),
                          )),
                    ],
                  ),
                ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: TextField(
                  controller: notesController,
                  decoration: const InputDecoration(labelText: 'ملاحظات على المنتج'),
                  maxLines: 2,
                ),
              ),
            ],
          ),
        ),
        SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                _QuantityStepper(quantity: quantity, onChanged: onQuantityChanged),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: canAdd && product.available ? onAdd : null,
                    child: Text('${AppStrings.addToCart} · ${total.toStringAsFixed(0)} ${AppStrings.currencySuffix}'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
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
      decoration: BoxDecoration(border: Border.all(color: AppColors.line), borderRadius: BorderRadius.circular(12)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(onPressed: quantity > 1 ? () => onChanged(quantity - 1) : null, icon: const Icon(Icons.remove)),
          Text('$quantity', style: const TextStyle(fontWeight: FontWeight.bold)),
          IconButton(onPressed: () => onChanged(quantity + 1), icon: const Icon(Icons.add)),
        ],
      ),
    );
  }
}
