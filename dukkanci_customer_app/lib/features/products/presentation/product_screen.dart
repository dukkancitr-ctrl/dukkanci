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
///
/// Layout modeled on a rich reference (Yemeksepeti-style product sheet) the
/// user sent: badged option sections ("مطلوب"/"اختياري"), a discount pill on
/// the price, and a bordered notes box. The reference's "quick preset combo"
/// and "goes well with" upsell rails are NOT reproduced — we have no preset
/// combos or per-product upsell data in Supabase, and inventing them would
/// show the customer options that don't actually exist.
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
      appBar: AppBar(
        backgroundColor: AppColors.cream,
        title: const Text(AppStrings.productDetailsTitle),
        leading: IconButton(
          icon: const Icon(Icons.close_rounded),
          onPressed: () => Navigator.of(context).maybePop(),
        ),
      ),
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

  String _priceDeltaLabel(double delta) {
    if (delta == 0) return AppStrings.freeLabel;
    final sign = delta > 0 ? '+' : '-';
    return '$sign${delta.abs().toStringAsFixed(0)} ${AppStrings.currencySuffix}';
  }

  @override
  Widget build(BuildContext context) {
    final total = product.estimatedTotal(
          selectedValueIndexPerOption: selectedValueIndexPerOption,
          selectedAddonIndexes: selectedAddonIndexes,
        ) *
        quantity;
    final hasDiscount = product.oldPrice != null && product.oldPrice! > product.price;
    final discountPercent = hasDiscount ? (((product.oldPrice! - product.price) / product.oldPrice!) * 100).round() : 0;

    return Column(
      children: [
        Expanded(
          child: ListView(
            padding: EdgeInsets.zero,
            children: [
              Stack(
                children: [
                  AspectRatio(
                    aspectRatio: 4 / 3,
                    child: product.image != null
                        ? CachedNetworkImage(imageUrl: product.image!, fit: BoxFit.cover, errorWidget: (_, _, _) => Container(color: AppColors.creamDark))
                        : Container(color: AppColors.creamDark, child: const Icon(Icons.fastfood_rounded, size: 48, color: AppColors.line)),
                  ),
                  if (product.featured)
                    Positioned(
                      top: AppSpacing.md,
                      right: AppSpacing.md,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 4),
                        decoration: BoxDecoration(color: AppColors.orange, borderRadius: BorderRadius.circular(AppRadius.pill)),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.local_fire_department_rounded, size: 14, color: Colors.white),
                            const SizedBox(width: 4),
                            Text(AppStrings.featuredBadge, style: AppTextStyles.caption.copyWith(color: Colors.white, fontWeight: FontWeight.w700)),
                          ],
                        ),
                      ),
                    ),
                  if (!product.available)
                    Positioned.fill(
                      child: Container(
                        color: Colors.black.withValues(alpha: 0.45),
                        alignment: Alignment.center,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
                          decoration: BoxDecoration(color: AppColors.ink, borderRadius: BorderRadius.circular(AppRadius.pill)),
                          child: Text(AppStrings.productUnavailableNotice, style: AppTextStyles.label.copyWith(color: Colors.white)),
                        ),
                      ),
                    ),
                ],
              ),
              Padding(
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(product.name, style: AppTextStyles.headline),
                    const SizedBox(height: AppSpacing.sm),
                    if (product.priceOnRequest)
                      Text(AppStrings.priceOnRequestLabel, style: AppTextStyles.priceLarge)
                    else
                      Wrap(
                        crossAxisAlignment: WrapCrossAlignment.center,
                        spacing: AppSpacing.sm,
                        runSpacing: 4,
                        children: [
                          Text('${product.price.toStringAsFixed(0)} ${AppStrings.currencySuffix}', style: AppTextStyles.priceLarge),
                          if (hasDiscount)
                            Text(
                              '${product.oldPrice!.toStringAsFixed(0)} ${AppStrings.currencySuffix}',
                              style: AppTextStyles.body.copyWith(color: AppColors.muted, decoration: TextDecoration.lineThrough),
                            ),
                          if (hasDiscount && discountPercent > 0)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 3),
                              decoration: BoxDecoration(color: AppColors.orangeSoft, borderRadius: BorderRadius.circular(AppRadius.pill)),
                              child: Text('خصم $discountPercent%', style: AppTextStyles.caption.copyWith(color: AppColors.orangeDark, fontWeight: FontWeight.w700)),
                            ),
                        ],
                      ),
                    if (product.description != null && product.description!.trim().isNotEmpty) ...[
                      const SizedBox(height: AppSpacing.md),
                      Text(product.description!.trim(), style: AppTextStyles.bodyMuted),
                    ],
                  ],
                ),
              ),
              for (var groupIndex = 0; groupIndex < product.options.length; groupIndex++)
                _SectionDivider(
                  child: _OptionSection(
                    title: product.options[groupIndex].name,
                    values: product.options[groupIndex].values,
                    extra: product.options[groupIndex].extra,
                    selectedIndex: groupIndex < selectedValueIndexPerOption.length ? selectedValueIndexPerOption[groupIndex] : 0,
                    priceDeltaLabel: _priceDeltaLabel,
                    onSelected: (v) => onOptionSelected(groupIndex, v),
                  ),
                ),
              if (product.addons.isNotEmpty)
                _SectionDivider(
                  child: _AddonSection(
                    addons: product.addons,
                    selectedIndexes: selectedAddonIndexes,
                    priceDeltaLabel: _priceDeltaLabel,
                    onToggled: onAddonToggled,
                  ),
                ),
              _SectionDivider(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(AppStrings.productNoteLabel, style: AppTextStyles.title),
                      const SizedBox(height: AppSpacing.sm),
                      TextField(
                        controller: notesController,
                        decoration: const InputDecoration(hintText: AppStrings.productNoteHint),
                        maxLines: 3,
                        maxLength: 200,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.md),
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

/// A hairline divider between product-detail sections, matching the
/// reference's full-bleed section separators (not a boxed Card like the
/// previous design).
class _SectionDivider extends StatelessWidget {
  const _SectionDivider({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Divider(height: 1, thickness: 8, color: AppColors.cream),
        child,
      ],
    );
  }
}

/// "مطلوب"/"اختياري" pill next to a section title (spec: every real
/// [OptionGroup] always has a pre-selected default, so it's accurately
/// "required" in the sense the customer can't leave it unanswered; addons are
/// genuinely optional multi-select).
class _SectionBadge extends StatelessWidget {
  const _SectionBadge({required this.required});

  final bool required;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 4),
      decoration: BoxDecoration(
        color: required ? AppColors.ink : AppColors.creamDark,
        borderRadius: BorderRadius.circular(AppRadius.pill),
      ),
      child: Text(
        required ? AppStrings.requiredBadge : AppStrings.optionalBadge,
        style: AppTextStyles.caption.copyWith(color: required ? Colors.white : AppColors.muted, fontWeight: FontWeight.w700),
      ),
    );
  }
}

class _OptionSection extends StatelessWidget {
  const _OptionSection({
    required this.title,
    required this.values,
    required this.extra,
    required this.selectedIndex,
    required this.priceDeltaLabel,
    required this.onSelected,
  });

  final String title;
  final List<String> values;
  final List<double> extra;
  final int selectedIndex;
  final String Function(double) priceDeltaLabel;
  final ValueChanged<int> onSelected;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.md, AppSpacing.lg, AppSpacing.sm),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text(title, style: AppTextStyles.title)),
              const SizedBox(width: AppSpacing.sm),
              const _SectionBadge(required: true),
            ],
          ),
          const SizedBox(height: 2),
          Text(AppStrings.chooseOneOnly, style: AppTextStyles.caption),
          const SizedBox(height: AppSpacing.xs),
          for (var i = 0; i < values.length; i++)
            _SelectableRow(
              label: values[i],
              trailingLabel: priceDeltaLabel(i < extra.length ? extra[i] : 0),
              trailingIsFree: (i < extra.length ? extra[i] : 0) == 0,
              selected: i == selectedIndex,
              control: Radio<int>(
                value: i,
                groupValue: selectedIndex,
                onChanged: (v) => onSelected(v!),
                materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              onTap: () => onSelected(i),
            ),
        ],
      ),
    );
  }
}

class _AddonSection extends StatelessWidget {
  const _AddonSection({
    required this.addons,
    required this.selectedIndexes,
    required this.priceDeltaLabel,
    required this.onToggled,
  });

  final List<Addon> addons;
  final Set<int> selectedIndexes;
  final String Function(double) priceDeltaLabel;
  final void Function(int index, bool selected) onToggled;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.md, AppSpacing.lg, AppSpacing.sm),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text(AppStrings.addonsSectionTitle, style: AppTextStyles.title)),
              const SizedBox(width: AppSpacing.sm),
              const _SectionBadge(required: false),
            ],
          ),
          const SizedBox(height: 2),
          Text(AppStrings.addonsSectionSubtitle, style: AppTextStyles.caption),
          const SizedBox(height: AppSpacing.xs),
          for (var i = 0; i < addons.length; i++)
            _SelectableRow(
              label: addons[i].name,
              trailingLabel: priceDeltaLabel(addons[i].price),
              trailingIsFree: addons[i].price == 0,
              selected: selectedIndexes.contains(i),
              control: Checkbox(
                value: selectedIndexes.contains(i),
                onChanged: (v) => onToggled(i, v ?? false),
                materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              onTap: () => onToggled(i, !selectedIndexes.contains(i)),
            ),
        ],
      ),
    );
  }
}

/// One tappable option/addon row: control (radio or checkbox) + label +
/// trailing price delta. Shared by both section types so a radio group and a
/// checkbox list read as the same visual language.
class _SelectableRow extends StatelessWidget {
  const _SelectableRow({
    required this.label,
    required this.trailingLabel,
    required this.trailingIsFree,
    required this.selected,
    required this.control,
    required this.onTap,
  });

  final String label;
  final String trailingLabel;
  final bool trailingIsFree;
  final bool selected;
  final Widget control;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadius.sm),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.xs),
        child: Row(
          children: [
            control,
            const SizedBox(width: AppSpacing.xs),
            Expanded(child: Text(label, style: AppTextStyles.body)),
            Text(
              trailingLabel,
              style: AppTextStyles.label.copyWith(color: trailingIsFree ? AppColors.muted : AppColors.green800),
            ),
          ],
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
