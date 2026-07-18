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
import '../../cart/application/cart_controller.dart' show localCacheProvider;
import '../../checkout/domain/order.dart';

final myOrdersProvider = FutureProvider.autoDispose<List<OrderSummary>>((ref) async {
  final localCache = ref.read(localCacheProvider);
  final phone = await ref.read(authRepositoryProvider).verifiedPhone;
  return ref.read(orderRepositoryProvider).fetchMyOrders(phone: phone, knownOrderIds: localCache.myOrderIds);
});

Color orderStatusColor(String status) {
  if ([OrderStatus.completed, OrderStatus.accepted, OrderStatus.readyForPickup].contains(status)) return AppColors.success;
  if ([OrderStatus.newOrder, 'بانتظار الدفع'].contains(status)) return AppColors.orangeDark;
  if ([OrderStatus.rejected, 'ملغي', 'ملغى'].contains(status)) return AppColors.danger;
  return AppColors.blue;
}

class OrdersScreen extends ConsumerWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ordersAsync = ref.watch(myOrdersProvider);
    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.navOrders)),
      body: RefreshIndicator(
        onRefresh: () async => ref.invalidate(myOrdersProvider),
        child: ordersAsync.when(
          loading: () => const AppLoadingView(),
          error: (_, _) => AppErrorView(onRetry: () => ref.invalidate(myOrdersProvider)),
          data: (orders) {
            if (orders.isEmpty) {
              return const AppEmptyView(message: 'لا توجد طلبات بعد', icon: Icons.receipt_long_rounded);
            }
            return ListView.separated(
              padding: const EdgeInsets.all(AppSpacing.lg),
              itemCount: orders.length,
              separatorBuilder: (_, _) => const SizedBox(height: AppSpacing.md),
              itemBuilder: (context, i) {
                final order = orders[i];
                final color = orderStatusColor(order.status);
                return PressScale(
                  onTap: () => context.push(AppRoutes.orderDetailPath(order.id)),
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(AppSpacing.lg),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(color: color.withValues(alpha: 0.1), shape: BoxShape.circle),
                                child: Icon(Icons.receipt_long_rounded, color: color, size: 20),
                              ),
                              const SizedBox(width: AppSpacing.md),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(order.storeName, style: AppTextStyles.titleSmall, maxLines: 1, overflow: TextOverflow.ellipsis),
                                    const SizedBox(height: 3),
                                    Text(order.status, style: AppTextStyles.caption.copyWith(color: color, fontWeight: FontWeight.w700)),
                                  ],
                                ),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text('${order.total.toStringAsFixed(0)} ${AppStrings.currencySuffix}', style: AppTextStyles.price.copyWith(fontSize: 15)),
                                  const Icon(Icons.chevron_left_rounded, color: AppColors.muted, size: 18),
                                ],
                              ),
                            ],
                          ),
                          if (order.itemsPreview.isNotEmpty) ...[
                            const SizedBox(height: AppSpacing.sm),
                            Text(order.itemsPreview, style: AppTextStyles.bodyMuted, maxLines: 1, overflow: TextOverflow.ellipsis),
                          ],
                          const SizedBox(height: AppSpacing.sm),
                          Align(
                            alignment: AlignmentDirectional.centerStart,
                            child: OutlinedButton.icon(
                              onPressed: () => context.push(AppRoutes.storeDetailPath(order.storeId.toString())),
                              icon: const Icon(Icons.replay_rounded, size: 16),
                              label: const Text(AppStrings.reorderCta),
                              style: OutlinedButton.styleFrom(visualDensity: VisualDensity.compact, padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 6)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }
}
