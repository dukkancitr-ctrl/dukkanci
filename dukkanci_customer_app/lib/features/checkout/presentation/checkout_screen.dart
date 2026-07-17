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
import '../../stores/presentation/store_screen.dart';
import '../domain/order.dart';

/// Reference layout: a 3-step "Menu → Cart → Checkout" progress header,
/// card-style delivery/payment sections, and a sticky summary+CTA bar — all
/// reproduced with real data/behaviour. Two reference elements are
/// deliberately NOT reproduced: the "Direct / Standard / Scheduled" tiered
/// delivery-speed options (Dukkanci has one flat per-km rate — no fast-track
/// service, no scheduling backend, `scheduleDay`/`scheduleTime` are always
/// sent empty per app.js's own real payload shape) and a computed
/// "incl. fees and tax" total with a fake discount strikethrough (delivery
/// fee isn't computed client-side — spec gap, see [[flutter-v2-android-app]]
/// — so the total shown is honestly just the subtotal, with a caption
/// explaining the store confirms delivery cost over WhatsApp, which is how
/// the platform actually works).
class CheckoutScreen extends ConsumerStatefulWidget {
  const CheckoutScreen({super.key});

  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  final _nameController = TextEditingController();
  final _addressController = TextEditingController();
  final _addressDetailsController = TextEditingController();
  final _phoneController = TextEditingController();
  final _notesController = TextEditingController();
  final _otpController = TextEditingController();
  PaymentMethod _paymentMethod = PaymentMethod.cash;
  bool _isPickup = false;
  bool _leaveAtDoor = false;
  bool _submitting = false;
  bool _awaitingOtp = false;
  String? _orderId;
  String? _error;

  @override
  void dispose() {
    _nameController.dispose();
    _addressController.dispose();
    _addressDetailsController.dispose();
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
    // "Leave at the door" has no dedicated backend column — it's folded into
    // the free-text notes the merchant reads over WhatsApp, exactly as if the
    // customer had typed it themselves. Honest because it's real text the
    // merchant actually sees, not a UI promise with no effect.
    final noteParts = [
      if (_notesController.text.trim().isNotEmpty) _notesController.text.trim(),
      if (!_isPickup && _leaveAtDoor) 'يرجى ترك الطلب عند الباب دون الحاجة لمقابلتي',
    ];
    final draft = OrderDraft(
      id: _orderId!,
      storeId: cart.storeId!,
      items: cart.items,
      total: cart.subtotal,
      contactName: name,
      contactPhone: phone,
      isPickup: _isPickup,
      addressText: _addressController.text.trim(),
      addressDetails: _addressDetailsController.text.trim(),
      paymentMethod: _paymentMethod,
      notes: noteParts.isEmpty ? null : noteParts.join(' — '),
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
    final storeAsync = cart.storeId != null ? ref.watch(storeByKeyProvider(cart.storeId.toString())) : null;
    final store = storeAsync?.when(data: (s) => s, loading: () => null, error: (_, _) => null);

    return Scaffold(
      appBar: AppBar(
        title: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(AppStrings.checkoutTitle, style: AppTextStyles.title),
            if (store != null) Text(store.name, style: AppTextStyles.caption),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(AppSpacing.lg),
              children: [
                const _CheckoutStepper(),
                const SizedBox(height: AppSpacing.xl),
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
                    ],
                  ),
                ),
                if (!_isPickup) ...[
                  const SizedBox(height: AppSpacing.lg),
                  _SectionCard(
                    title: AppStrings.deliveryAddress,
                    child: Column(
                      children: [
                        TextField(
                          controller: _addressController,
                          decoration: const InputDecoration(labelText: 'العنوان بالتفصيل'),
                          maxLines: 2,
                        ),
                        const SizedBox(height: AppSpacing.md),
                        TextField(
                          controller: _addressDetailsController,
                          decoration: const InputDecoration(labelText: AppStrings.addressDetailsLabel, hintText: AppStrings.addressDetailsHint),
                        ),
                        const SizedBox(height: AppSpacing.md),
                        _LeaveAtDoorRow(value: _leaveAtDoor, onChanged: (v) => setState(() => _leaveAtDoor = v)),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: AppSpacing.lg),
                _SectionCard(
                  title: AppStrings.paymentMethod,
                  child: Column(
                    children: [
                      for (final m in PaymentMethod.values) ...[
                        _PaymentTile(
                          label: m.arabicLabel,
                          selected: _paymentMethod == m,
                          onTap: () => setState(() => _paymentMethod = m),
                        ),
                        if (m != PaymentMethod.values.last) const SizedBox(height: AppSpacing.sm),
                      ],
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
              ],
            ),
          ),
          _CheckoutSummaryBar(
            subtotal: cart.subtotal,
            submitting: _submitting,
            buttonLabel: _awaitingOtp ? AppStrings.verify : AppStrings.placeOrder,
            onSubmit: _submit,
          ),
        ],
      ),
    );
  }
}

/// "Menu → Cart → Checkout" breadcrumb — a real representation of the
/// navigation the customer already did (store menu → cart → this screen),
/// not a fabricated multi-step checkout wizard.
class _CheckoutStepper extends StatelessWidget {
  const _CheckoutStepper();

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const _StepNode(number: '1', label: AppStrings.checkoutStepMenu, color: AppColors.ink),
        const _StepConnector(),
        const _StepNode(number: '2', label: AppStrings.checkoutStepCart, color: AppColors.ink),
        const _StepConnector(),
        const _StepNode(number: '3', label: AppStrings.checkoutStepPayment, color: AppColors.green800),
      ],
    );
  }
}

class _StepNode extends StatelessWidget {
  const _StepNode({required this.number, required this.label, required this.color});

  final String number;
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          alignment: Alignment.center,
          child: Text(number, style: AppTextStyles.label.copyWith(color: Colors.white)),
        ),
        const SizedBox(height: 5),
        Text(label, style: AppTextStyles.caption.copyWith(color: color, fontWeight: FontWeight.w700)),
      ],
    );
  }
}

class _StepConnector extends StatelessWidget {
  const _StepConnector();

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.only(top: 13),
        child: Container(height: 2, color: AppColors.ink),
      ),
    );
  }
}

class _LeaveAtDoorRow extends StatelessWidget {
  const _LeaveAtDoorRow({required this.value, required this.onChanged});

  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => onChanged(!value),
      borderRadius: BorderRadius.circular(AppRadius.sm),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
        decoration: BoxDecoration(color: AppColors.cream, borderRadius: BorderRadius.circular(AppRadius.sm)),
        child: Row(
          children: [
            const Icon(Icons.no_meeting_room_rounded, color: AppColors.muted, size: 20),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(AppStrings.leaveAtDoorLabel, style: AppTextStyles.body),
                  Text(AppStrings.leaveAtDoorNote, style: AppTextStyles.caption),
                ],
              ),
            ),
            Switch(value: value, onChanged: onChanged),
          ],
        ),
      ),
    );
  }
}

class _PaymentTile extends StatelessWidget {
  const _PaymentTile({required this.label, required this.selected, required this.onTap});

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadius.sm),
      child: AnimatedContainer(
        duration: AppMotion.fast,
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
        decoration: BoxDecoration(
          color: selected ? AppColors.green50 : AppColors.cream,
          border: Border.all(color: selected ? AppColors.green800 : AppColors.line, width: selected ? 1.6 : 1),
          borderRadius: BorderRadius.circular(AppRadius.sm),
        ),
        child: Row(
          children: [
            Icon(selected ? Icons.radio_button_checked_rounded : Icons.radio_button_unchecked_rounded, color: selected ? AppColors.green800 : AppColors.muted, size: 20),
            const SizedBox(width: AppSpacing.sm),
            Expanded(child: Text(label, style: AppTextStyles.body)),
          ],
        ),
      ),
    );
  }
}

class _CheckoutSummaryBar extends StatelessWidget {
  const _CheckoutSummaryBar({
    required this.subtotal,
    required this.submitting,
    required this.buttonLabel,
    required this.onSubmit,
  });

  final double subtotal;
  final bool submitting;
  final String buttonLabel;
  final VoidCallback onSubmit;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        color: AppColors.white,
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 12, offset: const Offset(0, -4))],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.md, AppSpacing.lg, AppSpacing.lg),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(AppStrings.checkoutSubtotal, style: AppTextStyles.bodyMuted),
                  Text('${subtotal.toStringAsFixed(0)} ${AppStrings.currencySuffix}', style: AppTextStyles.body),
                ],
              ),
              const SizedBox(height: 4),
              Text(AppStrings.checkoutDeliveryFeeNote, style: AppTextStyles.caption),
              const SizedBox(height: AppSpacing.md),
              Row(
                children: [
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(AppStrings.cartTotal, style: AppTextStyles.caption),
                      Text('${subtotal.toStringAsFixed(0)} ${AppStrings.currencySuffix}', style: AppTextStyles.price),
                    ],
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: submitting ? null : onSubmit,
                      child: submitting
                          ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : Text(buttonLabel),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({this.title, required this.child});

  final String? title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (title != null) ...[
              Text(title!, style: AppTextStyles.titleSmall),
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
