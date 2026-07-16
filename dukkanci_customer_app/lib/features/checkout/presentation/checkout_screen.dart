import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/providers.dart';
import '../../../core/auth/auth_repository.dart' show OtpSendResult;
import '../../../core/errors/failure.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../cart/application/cart_controller.dart';
import '../domain/order.dart';

/// Spec section 16 + section 17 anti-fraud gate. The order id is generated
/// ONCE per checkout attempt and reused across retries (e.g. after a
/// timeout) so a flaky connection can never create two orders — see spec
/// section 16, "منع الطلبات المكررة"; the id itself doubles as the
/// idempotency key since app.js's own dual-write is upsert(onConflict: id).
class CheckoutScreen extends ConsumerStatefulWidget {
  const CheckoutScreen({super.key});

  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  final _nameController = TextEditingController();
  final _addressController = TextEditingController();
  final _phoneController = TextEditingController();
  final _notesController = TextEditingController();
  final _otpController = TextEditingController();
  PaymentMethod _paymentMethod = PaymentMethod.cash;
  bool _isPickup = false;
  bool _submitting = false;
  bool _awaitingOtp = false;
  String? _orderId;
  String? _error;

  @override
  void dispose() {
    _nameController.dispose();
    _addressController.dispose();
    _phoneController.dispose();
    _notesController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final cart = ref.read(cartControllerProvider);
    if (cart.isEmpty || cart.storeId == null) return;
    final phone = _phoneController.text.trim();
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      setState(() => _error = 'يرجى إدخال اسمك للتواصل');
      return;
    }
    if (phone.replaceAll(RegExp(r'\D'), '').length < 10) {
      setState(() => _error = 'يرجى إدخال رقم واتساب صحيح');
      return;
    }
    if (!_isPickup && _addressController.text.trim().isEmpty) {
      setState(() => _error = 'يرجى إدخال عنوان التوصيل');
      return;
    }

    setState(() {
      _submitting = true;
      _error = null;
    });

    final auth = ref.read(authRepositoryProvider);
    final alreadyVerified = await auth.isPhoneAlreadyVerified(phone);
    if (!alreadyVerified && !_awaitingOtp) {
      final OtpSendResult result;
      try {
        result = await auth.sendOtp(phone);
      } catch (e) {
        setState(() {
          _submitting = false;
          _error = e is Failure ? e.message : AppStrings.somethingWentWrong;
        });
        return;
      }
      // WhatsApp itself unavailable → place the order anyway, exactly like
      // app.js's startCheckoutOtp does (`if (!r || r.soft) { onVerified() }`).
      // Blocking here would make an outage reject every order in the app
      // while the website keeps accepting them.
      if (result == OtpSendResult.skippedWhatsappUnavailable) {
        await _placeOrder(cart, name: name, phone: phone);
        return;
      }
      setState(() {
        _awaitingOtp = true;
        _submitting = false;
      });
      return;
    }

    if (_awaitingOtp && !alreadyVerified) {
      try {
        await auth.verifyCheckoutOtp(phone: phone, code: _otpController.text.trim());
      } catch (e) {
        setState(() {
          _submitting = false;
          _error = e is Failure ? e.message : 'الرمز غير صحيح';
        });
        return;
      }
    }

    await _placeOrder(cart, name: name, phone: phone);
  }

  Future<void> _placeOrder(CartState cart, {required String name, required String phone}) async {
    _orderId ??= 'DK-${DateTime.now().millisecondsSinceEpoch.toString().substring(3)}';
    final draft = OrderDraft(
      id: _orderId!,
      storeId: cart.storeId!,
      items: cart.items,
      total: cart.subtotal,
      contactName: name,
      contactPhone: phone,
      isPickup: _isPickup,
      addressText: _addressController.text.trim(),
      paymentMethod: _paymentMethod,
      notes: _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
      createdAt: DateTime.now(),
    );

    try {
      final orderId = await ref.read(orderRepositoryProvider).submit(draft);
      await ref.read(localCacheProvider).addMyOrderId(orderId);
      ref.read(cartControllerProvider.notifier).clear();
      if (!mounted) return;
      context.go(AppRoutes.orderDetailPath(orderId));
    } catch (e) {
      setState(() => _error = e is Failure ? e.message : AppStrings.somethingWentWrong);
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = ref.watch(cartControllerProvider);
    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.checkoutTitle)),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          _SectionCard(
            title: 'طريقة الاستلام',
            child: Row(
              children: [
                Expanded(child: _FulfillmentTile(label: 'توصيل', icon: Icons.delivery_dining_rounded, selected: !_isPickup, onTap: () => setState(() => _isPickup = false))),
                const SizedBox(width: AppSpacing.md),
                Expanded(child: _FulfillmentTile(label: 'استلام من المتجر', icon: Icons.store_rounded, selected: _isPickup, onTap: () => setState(() => _isPickup = true))),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
          _SectionCard(
            title: 'بيانات التواصل',
            child: Column(
              children: [
                TextField(controller: _nameController, decoration: const InputDecoration(labelText: 'الاسم')),
                const SizedBox(height: AppSpacing.md),
                TextField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(labelText: AppStrings.enterPhone, hintText: '90XXXXXXXXXX'),
                ),
                if (!_isPickup) ...[
                  const SizedBox(height: AppSpacing.md),
                  TextField(
                    controller: _addressController,
                    decoration: const InputDecoration(labelText: 'العنوان بالتفصيل'),
                    maxLines: 2,
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
          _SectionCard(
            title: AppStrings.paymentMethod,
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                for (final m in PaymentMethod.values)
                  RadioListTile(
                    title: Text(m.arabicLabel, style: AppTextStyles.body),
                    value: m,
                    groupValue: _paymentMethod,
                    onChanged: (v) => setState(() => _paymentMethod = v!),
                  ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
          _SectionCard(
            title: AppStrings.orderNotes,
            child: TextField(controller: _notesController, decoration: const InputDecoration(hintText: 'اختياري'), maxLines: 2),
          ),
          if (_awaitingOtp) ...[
            const SizedBox(height: AppSpacing.lg),
            _SectionCard(
              title: AppStrings.enterOtp,
              child: TextField(
                controller: _otpController,
                keyboardType: TextInputType.number,
                textAlign: TextAlign.center,
                style: AppTextStyles.headline,
                decoration: const InputDecoration(hintText: '••••••'),
              ),
            ),
          ],
          if (_error != null) ...[
            const SizedBox(height: AppSpacing.md),
            Row(children: [const Icon(Icons.error_outline_rounded, color: AppColors.danger, size: 18), const SizedBox(width: 6), Expanded(child: Text(_error!, style: const TextStyle(color: AppColors.danger)))]),
          ],
          const SizedBox(height: AppSpacing.xl),
          _SectionCard(
            child: Column(
              children: [
                _totalRow('المجموع الفرعي', cart.subtotal, muted: true),
                const Padding(padding: EdgeInsets.symmetric(vertical: AppSpacing.sm), child: Divider()),
                _totalRow('الإجمالي', cart.subtotal, muted: false),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
          ElevatedButton(
            onPressed: _submitting ? null : _submit,
            child: _submitting
                ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : Text(_awaitingOtp ? AppStrings.verify : AppStrings.placeOrder),
          ),
          const SizedBox(height: AppSpacing.xl),
        ],
      ),
    );
  }

  Widget _totalRow(String label, double value, {required bool muted}) {
    final style = muted ? AppTextStyles.bodyMuted : AppTextStyles.title;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: style),
        Text('${value.toStringAsFixed(0)} ${AppStrings.currencySuffix}', style: muted ? AppTextStyles.body : AppTextStyles.price),
      ],
    );
  }
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({this.title, required this.child, this.padding = const EdgeInsets.all(AppSpacing.lg)});

  final String? title;
  final Widget child;
  final EdgeInsets padding;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: padding,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (title != null) ...[
              Padding(
                padding: padding == EdgeInsets.zero ? const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, 0) : EdgeInsets.zero,
                child: Text(title!, style: AppTextStyles.titleSmall),
              ),
              const SizedBox(height: AppSpacing.md),
            ],
            child,
          ],
        ),
      ),
    );
  }
}

class _FulfillmentTile extends StatelessWidget {
  const _FulfillmentTile({required this.label, required this.icon, required this.selected, required this.onTap});

  final String label;
  final IconData icon;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadius.sm),
      child: AnimatedContainer(
        duration: AppMotion.fast,
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
        decoration: BoxDecoration(
          color: selected ? AppColors.green50 : AppColors.cream,
          border: Border.all(color: selected ? AppColors.green800 : AppColors.line, width: selected ? 1.6 : 1),
          borderRadius: BorderRadius.circular(AppRadius.sm),
        ),
        child: Column(
          children: [
            Icon(icon, color: selected ? AppColors.green800 : AppColors.muted),
            const SizedBox(height: 6),
            Text(label, style: AppTextStyles.label.copyWith(color: selected ? AppColors.green800 : AppColors.muted)),
          ],
        ),
      ),
    );
  }
}
