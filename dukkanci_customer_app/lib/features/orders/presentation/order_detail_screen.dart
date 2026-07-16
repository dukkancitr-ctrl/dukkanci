import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/widgets/state_views.dart';
import '../../checkout/domain/order.dart';
import 'orders_screen.dart';

/// Spec section 18. Deliberately does NOT render a fake driver map — spec
/// section 18: "ممنوع عرض خريطة سائق وهمية... تقليد خريطة Uber دون بيانات
/// سائق حقيقية تضليل وليس ميزة." Shows the real status timeline only, until
/// a driver app with real GPS exists.
class OrderDetailScreen extends ConsumerWidget {
  const OrderDetailScreen({super.key, required this.orderId});

  final String orderId;

  static const _steps = [OrderStatus.newOrder, OrderStatus.accepted, OrderStatus.preparing, OrderStatus.outForDelivery, OrderStatus.completed];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ordersAsync = ref.watch(myOrdersProvider);
    return Scaffold(
      appBar: AppBar(title: Text('طلب #$orderId')),
      body: ordersAsync.when(
        loading: () => const AppLoadingView(),
        error: (_, _) => AppErrorView(onRetry: () => ref.invalidate(myOrdersProvider)),
        data: (orders) {
          final matches = orders.where((o) => o.id == orderId);
          final order = matches.isEmpty ? null : matches.first;
          if (order == null) {
            return const AppEmptyView(message: 'تعذّر العثور على هذا الطلب', icon: Icons.search_off_rounded);
          }
          final isRejected = order.status == OrderStatus.rejected;
          final currentStepIndex = isRejected ? -1 : _steps.indexOf(order.status);
          return ListView(
            padding: const EdgeInsets.all(AppSpacing.lg),
            children: [
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(order.storeName, style: AppTextStyles.title),
                            const SizedBox(height: 4),
                            Text(order.status, style: AppTextStyles.body.copyWith(color: orderStatusColor(order.status), fontWeight: FontWeight.w700)),
                          ],
                        ),
                      ),
                      Text('${order.total.toStringAsFixed(0)} ${'₺'}', style: AppTextStyles.priceLarge),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.xl),
              if (isRejected)
                Card(
                  color: AppColors.green50,
                  child: const Padding(
                    padding: EdgeInsets.all(AppSpacing.lg),
                    child: Row(
                      children: [
                        Icon(Icons.cancel_rounded, color: AppColors.danger),
                        SizedBox(width: AppSpacing.md),
                        Expanded(child: Text('تعذّر قبول هذا الطلب من المتجر', style: AppTextStyles.body)),
                      ],
                    ),
                  ),
                )
              else
                _StatusTimeline(currentStepIndex: currentStepIndex < 0 ? 0 : currentStepIndex),
            ],
          );
        },
      ),
    );
  }
}

class _StatusTimeline extends StatelessWidget {
  const _StatusTimeline({required this.currentStepIndex});

  final int currentStepIndex;

  static const _labels = ['تم استلام الطلب', 'تم القبول', 'قيد التجهيز', 'خرج للتوصيل', 'مكتمل'];
  static const _icons = [Icons.receipt_long_rounded, Icons.check_circle_rounded, Icons.soup_kitchen_rounded, Icons.delivery_dining_rounded, Icons.home_rounded];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(_labels.length, (i) {
        final done = i <= currentStepIndex;
        final isLast = i == _labels.length - 1;
        return IntrinsicHeight(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Column(
                children: [
                  AnimatedContainer(
                    duration: AppMotion.base,
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: done ? AppColors.green800 : AppColors.creamDark,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(_icons[i], size: 18, color: done ? AppColors.white : AppColors.muted),
                  ),
                  if (!isLast)
                    Expanded(
                      child: Container(
                        width: 2,
                        margin: const EdgeInsets.symmetric(vertical: 2),
                        color: i < currentStepIndex ? AppColors.green800 : AppColors.line,
                      ),
                    ),
                ],
              ),
              const SizedBox(width: AppSpacing.md),
              Padding(
                padding: const EdgeInsets.only(top: 6, bottom: AppSpacing.lg),
                child: Text(
                  _labels[i],
                  style: done ? AppTextStyles.titleSmall : AppTextStyles.bodyMuted,
                ),
              ),
            ],
          ),
        );
      }),
    );
  }
}
