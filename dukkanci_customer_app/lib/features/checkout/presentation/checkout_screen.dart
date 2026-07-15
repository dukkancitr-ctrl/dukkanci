import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/providers.dart';
import '../../../core/errors/failure.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../cart/application/cart_controller.dart';
import '../domain/order.dart';

/// Spec section 16 + section 17 anti-fraud gate. One Idempotency-Key is
/// generated ONCE per submission attempt and reused across retries of the
/// SAME tap (e.g. after a timeout) so a flaky connection can never create
/// two orders — see spec section 16, "منع الطلبات المكررة".
class CheckoutScreen extends ConsumerStatefulWidget {
  const CheckoutScreen({super.key});

  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  final _addressController = TextEditingController();
  final _phoneController = TextEditingController();
  final _notesController = TextEditingController();
  final _otpController = TextEditingController();
  PaymentMethod _paymentMethod = PaymentMethod.cash;
  bool _submitting = false;
  bool _awaitingOtp = false;
  String? _idempotencyKey;
  String? _error;

  @override
  void dispose() {
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
    if (phone.isEmpty || _addressController.text.trim().isEmpty) {
      setState(() => _error = 'يرجى تعبئة رقم الهاتف والعنوان');
      return;
    }

    setState(() {
      _submitting = true;
      _error = null;
    });

    final auth = ref.read(authRepositoryProvider);
    final alreadyVerified = await auth.isPhoneAlreadyVerified(phone);
    if (!alreadyVerified && !_awaitingOtp) {
      try {
        await auth.sendOtp(phone);
        setState(() {
          _awaitingOtp = true;
          _submitting = false;
        });
      } catch (e) {
        setState(() {
          _submitting = false;
          _error = e is Failure ? e.message : AppStrings.somethingWentWrong;
        });
      }
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

    await _placeOrder(cart, phone);
  }

  Future<void> _placeOrder(CartState cart, String phone) async {
    _idempotencyKey ??= ref.read(apiClientProvider).newIdempotencyKey();
    final draft = OrderDraft(
      storeId: cart.storeId!,
      items: cart.items,
      subtotal: cart.subtotal,
      deliveryFee: 0, // TODO(team): real delivery quote once /delivery-zones exists server-side.
      total: cart.subtotal,
      contactPhone: phone,
      addressText: _addressController.text.trim(),
      paymentMethod: _paymentMethod,
      notes: _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
      idempotencyKey: _idempotencyKey!,
    );

    try {
      final orderId = await ref.read(orderRepositoryProvider).submit(draft);
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
        padding: const EdgeInsets.all(16),
        children: [
          Text(AppStrings.deliveryAddress, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          TextField(controller: _addressController, decoration: const InputDecoration(hintText: 'العنوان بالتفصيل'), maxLines: 2),
          const SizedBox(height: 16),
          TextField(
            controller: _phoneController,
            keyboardType: TextInputType.phone,
            decoration: const InputDecoration(labelText: AppStrings.enterPhone, hintText: '90XXXXXXXXXX'),
          ),
          const SizedBox(height: 16),
          Text(AppStrings.paymentMethod, style: Theme.of(context).textTheme.titleMedium),
          RadioListTile(
            title: const Text(AppStrings.paymentCash),
            value: PaymentMethod.cash,
            groupValue: _paymentMethod,
            onChanged: (v) => setState(() => _paymentMethod = v!),
          ),
          RadioListTile(
            title: const Text(AppStrings.paymentCardOnDelivery),
            value: PaymentMethod.cardOnDelivery,
            groupValue: _paymentMethod,
            onChanged: (v) => setState(() => _paymentMethod = v!),
          ),
          RadioListTile(
            title: const Text(AppStrings.paymentBankTransfer),
            value: PaymentMethod.bankTransfer,
            groupValue: _paymentMethod,
            onChanged: (v) => setState(() => _paymentMethod = v!),
          ),
          const SizedBox(height: 8),
          TextField(controller: _notesController, decoration: const InputDecoration(labelText: AppStrings.orderNotes), maxLines: 2),
          if (_awaitingOtp) ...[
            const SizedBox(height: 16),
            Text(AppStrings.enterOtp, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            TextField(
              controller: _otpController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(hintText: '6 أرقام'),
            ),
          ],
          if (_error != null) ...[
            const SizedBox(height: 12),
            Text(_error!, style: const TextStyle(color: Colors.red)),
          ],
          const SizedBox(height: 24),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [const Text('المجموع الفرعي'), Text('${cart.subtotal.toStringAsFixed(0)} ${AppStrings.currencySuffix}')]),
                  const Divider(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('الإجمالي', style: TextStyle(fontWeight: FontWeight.bold)),
                      Text('${cart.subtotal.toStringAsFixed(0)} ${AppStrings.currencySuffix}', style: const TextStyle(fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: _submitting ? null : _submit,
            child: _submitting
                ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : Text(_awaitingOtp ? AppStrings.verify : AppStrings.placeOrder),
          ),
        ],
      ),
    );
  }
}
