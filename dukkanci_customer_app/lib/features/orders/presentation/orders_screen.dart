import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/providers.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../checkout/domain/order.dart';

final myOrdersProvider = FutureProvider.autoDispose<List<OrderSummary>>((ref) {
  return ref.read(orderRepositoryProvider).fetchMyOrders();
});

class OrdersScreen extends ConsumerWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ordersAsync = ref.watch(myOrdersProvider);
    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.navOrders)),
      body: ordersAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (_, _) => Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(AppStrings.somethingWentWrong),
              TextButton(onPressed: () => ref.invalidate(myOrdersProvider), child: const Text(AppStrings.retry)),
            ],
          ),
        ),
        data: (orders) {
          if (orders.isEmpty) {
            return const Center(child: Text('لا توجد طلبات بعد'));
          }
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: orders.length,
            separatorBuilder: (_, _) => const SizedBox(height: 10),
            itemBuilder: (context, i) {
              final order = orders[i];
              return Card(
                child: ListTile(
                  title: Text(order.storeName),
                  subtitle: Text(AppStrings.orderStatusLabel(order.status)),
                  trailing: Text('${order.total.toStringAsFixed(0)} ${AppStrings.currencySuffix}'),
                  onTap: () => context.push(AppRoutes.orderDetailPath(order.id)),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
