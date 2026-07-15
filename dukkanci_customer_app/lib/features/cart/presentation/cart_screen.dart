import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../application/cart_controller.dart';

class CartScreen extends ConsumerWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(cartControllerProvider);
    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.cartTitle)),
      body: cart.isEmpty
          ? const Center(child: Text(AppStrings.cartEmpty))
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                for (final item in cart.items)
                  Card(
                    margin: const EdgeInsets.only(bottom: 10),
                    child: ListTile(
                      title: Text(item.name),
                      subtitle: Text([
                        if (item.selectedOptionLabel != null) item.selectedOptionLabel!,
                        ...item.selectedAddonLabels,
                      ].join('، ')),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.remove_circle_outline),
                            onPressed: () => ref.read(cartControllerProvider.notifier).updateQuantity(item.lineKey, item.quantity - 1),
                          ),
                          Text('${item.quantity}'),
                          IconButton(
                            icon: const Icon(Icons.add_circle_outline),
                            onPressed: () => ref.read(cartControllerProvider.notifier).updateQuantity(item.lineKey, item.quantity + 1),
                          ),
                          const SizedBox(width: 8),
                          Text('${item.lineTotal.toStringAsFixed(0)} ${AppStrings.currencySuffix}'),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
      bottomNavigationBar: cart.isEmpty
          ? null
          : SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        '${AppStrings.cartTitle}: ${cart.subtotal.toStringAsFixed(0)} ${AppStrings.currencySuffix}',
                        style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.ink),
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () => context.push(AppRoutes.checkout),
                      child: const Text(AppStrings.checkoutTitle),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
