import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/localization/app_strings.dart';
import 'orders_screen.dart';

/// Spec section 18. Deliberately does NOT render a fake driver map — spec
/// section 18: "ممنوع عرض خريطة سائق وهمية... تقليد خريطة Uber دون بيانات
/// سائق حقيقية تضليل وليس ميزة." Shows the real status timeline only, until
/// a driver app with real GPS exists.
class OrderDetailScreen extends ConsumerWidget {
  const OrderDetailScreen({super.key, required this.orderId});

  final String orderId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ordersAsync = ref.watch(myOrdersProvider);
    return Scaffold(
      appBar: AppBar(title: Text('طلب رقم $orderId')),
      body: ordersAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (_, _) => const Center(child: Text(AppStrings.somethingWentWrong)),
        data: (orders) {
          final matches = orders.where((o) => o.id == orderId);
          final order = matches.isEmpty ? null : matches.first;
          if (order == null) {
            return const Center(child: Text('تعذّر العثور على هذا الطلب'));
          }
          return Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(order.storeName, style: Theme.of(context).textTheme.headlineSmall),
                const SizedBox(height: 8),
                Text(AppStrings.orderStatusLabel(order.status), style: const TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                Text('${order.total.toStringAsFixed(0)} ${AppStrings.currencySuffix}'),
              ],
            ),
          );
        },
      ),
    );
  }
}
