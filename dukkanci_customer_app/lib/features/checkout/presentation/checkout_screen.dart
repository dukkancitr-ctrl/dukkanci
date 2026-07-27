import 'dart:async';

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
import '../../addresses/application/addresses_controller.dart';
import '../../addresses/domain/saved_address.dart';
import '../../cart/application/cart_controller.dart';
import '../../notifications/application/cart_sync_service.dart';
import '../../notifications/data/device_registrar.dart';
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

/// Result of the pre-OTP-send phone confirmation dialog.
enum _PhoneConfirmAction { edit, send }

/// Returned by [_SavedAddressSheet] when the customer taps "إضافة عنوان
/// جديد" instead of an existing row — a dedicated sentinel (not a
/// SavedAddress) so the caller can tell "add a new one" apart from "picked
/// address #0" without any ambiguity, same pattern as address_form_screen
/// .dart's own manual-neighborhood sentinel.
final Object _addNewAddressSentinel = Object();

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _notesController = TextEditingController();
  final _otpController = TextEditingController();
  final _phoneFocusNode = FocusNode();
  // Lets both the pre-send confirmation dialog and the post-send "تغيير
  // الرقم؟" link scroll the phone field into view and focus it, instead of
  // silently leaving the customer stuck on an OTP screen for a number they
  // can no longer see or edit.
  final _phoneFieldKey = GlobalKey();
  PaymentMethod _paymentMethod = PaymentMethod.cash;
  bool _isPickup = false;
  bool _leaveAtDoor = false;
  bool _submitting = false;
  bool _awaitingOtp = false;
  bool _resendingOtp = false;
  String? _orderId;
  String? _error;
  // The delivery address, entered/edited exclusively through the same
  // structured Turkish-address form used by «عناويني» (province/district/
  // neighborhood pickers + road/building/floor/apartment-number boxes + a
  // notes box) — no free-text "type your whole address" field on this
  // screen anymore, so a delivery address is always well-structured.
  SavedAddress? _selectedAddress;

  @override
  void initState() {
    super.initState();
    // Pre-fill from the customer's default saved address, if any — the
    // whole point of marking one "افتراضي" is that checkout uses it without
    // being asked again. Never overwrites (fields start empty on a fresh
    // checkout screen anyway; the guard just documents the intent).
    final addresses = ref.read(addressesControllerProvider);
    if (addresses.isEmpty) return;
    final preferred = addresses.firstWhere((a) => a.isDefault, orElse: () => addresses.first);
    _applyAddress(preferred);
  }

  void _applyAddress(SavedAddress address) {
    _selectedAddress = address;
    if (address.recipientName.isNotEmpty) _nameController.text = address.recipientName;
    if (address.recipientPhone.isNotEmpty) _phoneController.text = address.recipientPhone;
  }

  /// "إضافة عنوان التوصيل" / "تغيير العنوان" — with no saved addresses yet,
  /// jumps straight to the structured form (nothing to pick from); otherwise
  /// opens the picker sheet, which itself offers "إضافة عنوان جديد" as one
  /// more row so the customer is never stuck choosing among only-wrong
  /// addresses.
  Future<void> _openAddressPicker() async {
    final addresses = ref.read(addressesControllerProvider);
    if (addresses.isEmpty) {
      final created = await context.push<SavedAddress>(AppRoutes.addressForm);
      if (created != null && mounted) setState(() => _applyAddress(created));
      return;
    }
    final result = await showModalBottomSheet<Object>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.lg))),
      builder: (sheetContext) => _SavedAddressSheet(addresses: addresses),
    );
    if (!mounted || result == null) return;
    if (identical(result, _addNewAddressSentinel)) {
      final created = await context.push<SavedAddress>(AppRoutes.addressForm);
      if (created != null && mounted) setState(() => _applyAddress(created));
      return;
    }
    if (result is SavedAddress) setState(() => _applyAddress(result));
  }

  /// Pencil icon on the selected-address card — corrects the *same* address
  /// (right city/district/neighborhood/street/building/floor/apartment
  /// boxes, pre-filled) instead of forcing the customer to build a whole new
  /// one from scratch just to fix a typo.
  Future<void> _editSelectedAddress() async {
    final current = _selectedAddress;
    if (current == null) return;
    final updated = await context.push<SavedAddress>(AppRoutes.addressForm, extra: current);
    if (updated != null && mounted) setState(() => _applyAddress(updated));
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _notesController.dispose();
    _otpController.dispose();
    _phoneFocusNode.dispose();
    super.dispose();
  }

  /// Scrolls the phone field into view and focuses it with the whole number
  /// selected — used both by the pre-send confirmation dialog's "تعديل
  /// الرقم" action and by the post-send "تغيير الرقم؟" link, so a wrong
  /// number is always one tap away from being fixed instead of requiring the
  /// customer to hunt for the field themselves.
  void _focusPhoneField() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final ctx = _phoneFieldKey.currentContext;
      if (ctx != null) {
        Scrollable.ensureVisible(ctx, duration: const Duration(milliseconds: 250), alignment: 0.1);
      }
      _phoneFocusNode.requestFocus();
      _phoneController.selection = TextSelection(baseOffset: 0, extentOffset: _phoneController.text.length);
    });
  }

  /// Shown once, right before the very first OTP send for this checkout —
  /// the whole point is to tell the customer a WhatsApp confirmation code is
  /// about to go out to a *specific* number, and give them a way to correct
  /// it before it's sent (rather than after, stuck on an OTP field with no
  /// visible way back — the exact bug this fixes).
  Future<bool> _confirmPhoneBeforeSendingOtp(String phone) async {
    final action = await showDialog<_PhoneConfirmAction>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text(AppStrings.otpConfirmPhoneTitle),
        content: Text(AppStrings.otpConfirmPhoneBody(phone)),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(_PhoneConfirmAction.edit),
            child: const Text(AppStrings.otpConfirmPhoneEdit),
          ),
          FilledButton(
            onPressed: () => Navigator.of(dialogContext).pop(_PhoneConfirmAction.send),
            child: const Text(AppStrings.otpConfirmPhoneSend),
          ),
        ],
      ),
    );
    if (action == _PhoneConfirmAction.edit) {
      _focusPhoneField();
      return false;
    }
    return action == _PhoneConfirmAction.send;
  }

  /// "تغيير الرقم؟" under the OTP field — for when the customer only
  /// realizes the number was wrong *after* seeing "الرمز غير صحيح" (a code
  /// sent to the wrong phone will never arrive, so retyping the code alone
  /// can never fix it). Drops back to the phone step without losing any of
  /// the other checkout fields already filled in.
  void _changePhoneNumber() {
    setState(() {
      _awaitingOtp = false;
      _otpController.clear();
      _error = null;
    });
    _focusPhoneField();
  }

  Future<void> _resendOtp() async {
    final phone = _phoneController.text.trim();
    setState(() {
      _resendingOtp = true;
      _error = null;
    });
    final auth = ref.read(authRepositoryProvider);
    final OtpSendResult result;
    try {
      result = await auth.sendOtp(phone);
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _resendingOtp = false;
        _error = e is Failure ? e.message : AppStrings.somethingWentWrong;
      });
      return;
    }
    if (!mounted) return;
    if (result == OtpSendResult.skippedWhatsappUnavailable) {
      // WhatsApp just became unavailable server-side — drop the OTP
      // requirement entirely, mirroring _submit()'s own soft-skip handling,
      // instead of resending into a channel that isn't there.
      setState(() {
        _resendingOtp = false;
        _awaitingOtp = false;
        _otpController.clear();
      });
      return;
    }
    setState(() {
      _resendingOtp = false;
      _otpController.clear();
    });
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(AppStrings.otpSentToPhone(phone))));
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
    if (!_isPickup && _selectedAddress == null) {
      setState(() => _error = 'يرجى إدخال عنوان التوصيل');
      return;
    }

    final auth = ref.read(authRepositoryProvider);
    final alreadyVerified = await auth.isPhoneAlreadyVerified(phone);

    // Confirm — or let the customer fix — the destination number BEFORE any
    // WhatsApp OTP goes out. Must happen before _submitting flips true so
    // the summary bar doesn't spin while waiting on the dialog.
    if (!alreadyVerified && !_awaitingOtp) {
      final proceed = await _confirmPhoneBeforeSendingOtp(phone);
      if (!mounted || !proceed) return;
    }

    setState(() {
      _submitting = true;
      _error = null;
    });

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
      if (!mounted) return;
      setState(() {
        _awaitingOtp = true;
        _submitting = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(AppStrings.otpSentToPhone(phone))));
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
    final selected = _selectedAddress;
    final draft = OrderDraft(
      id: _orderId!,
      storeId: cart.storeId!,
      items: cart.items,
      total: cart.subtotal,
      contactName: name,
      contactPhone: phone,
      isPickup: _isPickup,
      addressText: selected?.formattedAddress ?? '',
      addressDetails: selected?.detailsLine ?? '',
      structuredAddress: selected?.toJson(),
      fullAddressTr: selected?.fullAddressTr ?? '',
      paymentMethod: _paymentMethod,
      notes: noteParts.isEmpty ? null : noteParts.join(' — '),
      createdAt: DateTime.now(),
    );

    try {
      final orderId = await ref.read(orderRepositoryProvider).submit(draft);
      await ref.read(localCacheProvider).addMyOrderId(orderId);
      ref.read(cartControllerProvider.notifier).clear();
      // السلة تحوّلت لطلب فعلي. يجب أن يأتي **بعد** clear() مباشرة: الأخير
      // يجدول مزامنة «سلة فارغة» بعد ٣ ثوانٍ، و markConverted يلغيها — لولا
      // هذا الترتيب لهبطت تلك المزامنة بعد التحويل فبدا للخادم أن الزبون
      // هجر سلته، وقد يرسل له تذكيراً بسلة اشترى منها للتو.
      ref.read(cartSyncServiceProvider).markConverted();
      // صار الرقم معروفاً ومُتحقَّقاً منه (أو مرّ عبر مسار واتساب المعطّل) —
      // أعد تسجيل الجهاز به ليربط الخادم إشعارات هذا الطلب بهذا الجهاز.
      unawaited(ref.read(deviceRegistrarProvider).register(customerPhone: phone));
      if (!mounted) return;
      // go() (not push()) so cart/checkout drop out of the stack — the order
      // is done, there's nothing to "go back" into there. But go() alone
      // makes order-detail the new stack ROOT with nothing beneath it, so
      // the back button/gesture would exit the app entirely (the bug this
      // fixes). Landing the stack on "My Orders" first, then pushing the
      // detail screen on top, gives back a real target to pop to.
      context.go(AppRoutes.orders);
      context.push(AppRoutes.orderDetailPath(orderId));
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
                        key: _phoneFieldKey,
                        controller: _phoneController,
                        focusNode: _phoneFocusNode,
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
                        _selectedAddress == null
                            ? _AddAddressPrompt(onTap: _openAddressPicker)
                            : _SelectedAddressCard(
                                address: _selectedAddress!,
                                onEdit: _editSelectedAddress,
                                onChange: _openAddressPicker,
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
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(AppStrings.otpSentToPhone(_phoneController.text.trim()), style: AppTextStyles.bodyMuted),
                        const SizedBox(height: AppSpacing.sm),
                        TextField(
                          controller: _otpController,
                          keyboardType: TextInputType.number,
                          textAlign: TextAlign.center,
                          style: AppTextStyles.headline,
                          decoration: const InputDecoration(hintText: '••••••'),
                        ),
                        const SizedBox(height: AppSpacing.xs),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            TextButton(
                              onPressed: _submitting || _resendingOtp ? null : _changePhoneNumber,
                              child: const Text(AppStrings.otpChangePhoneNumber),
                            ),
                            TextButton(
                              onPressed: _submitting || _resendingOtp ? null : _resendOtp,
                              child: Text(_resendingOtp ? AppStrings.otpResending : AppStrings.resendOtp),
                            ),
                          ],
                        ),
                      ],
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

/// Empty state shown until the customer has a delivery address at all —
/// the entry point into the structured Turkish-address form (province/
/// district/neighborhood + road/building/floor/apartment boxes), never a
/// free-text field.
class _AddAddressPrompt extends StatelessWidget {
  const _AddAddressPrompt({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadius.sm),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.md),
        decoration: BoxDecoration(border: Border.all(color: AppColors.line), borderRadius: BorderRadius.circular(AppRadius.sm)),
        child: Row(
          children: [
            const Icon(Icons.add_location_alt_outlined, color: AppColors.green800),
            const SizedBox(width: AppSpacing.sm),
            Expanded(child: Text(AppStrings.addressAddNew, style: AppTextStyles.body.copyWith(color: AppColors.green800, fontWeight: FontWeight.w700))),
            const Icon(Icons.chevron_left_rounded, color: AppColors.muted),
          ],
        ),
      ),
    );
  }
}

/// The chosen delivery address, shown as a summary card once it's a real
/// structured address (never the raw free-text box this replaces) — with a
/// pencil to fix a wrong field in place and a "تغيير العنوان" link to swap
/// to a different saved address or add a fresh one.
class _SelectedAddressCard extends StatelessWidget {
  const _SelectedAddressCard({required this.address, required this.onEdit, required this.onChange});

  final SavedAddress address;
  final VoidCallback onEdit;
  final VoidCallback onChange;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const CircleAvatar(radius: 18, backgroundColor: AppColors.green50, child: Icon(Icons.location_on_rounded, color: AppColors.green800, size: 18)),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(address.label.isEmpty ? AppStrings.myAddresses : address.label, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w700)),
                  const SizedBox(height: 2),
                  Text(address.formattedAddress, style: AppTextStyles.bodyMuted),
                  if (address.detailsLine.isNotEmpty) Text(address.detailsLine, style: AppTextStyles.caption),
                ],
              ),
            ),
            IconButton(onPressed: onEdit, icon: const Icon(Icons.edit_outlined, size: 20), tooltip: AppStrings.addressEdit),
          ],
        ),
        const SizedBox(height: AppSpacing.sm),
        Row(
          children: [
            Icon(Icons.place_rounded, size: 16, color: address.hasLocation ? AppColors.green800 : AppColors.muted),
            const SizedBox(width: 6),
            Expanded(
              child: Text(
                address.hasLocation ? AppStrings.addrLocationReady : AppStrings.addrLocationMissing,
                style: AppTextStyles.caption.copyWith(color: address.hasLocation ? AppColors.green800 : AppColors.muted),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.xs),
        Align(
          alignment: AlignmentDirectional.centerStart,
          child: TextButton.icon(
            onPressed: onChange,
            icon: const Icon(Icons.swap_horiz_rounded, size: 18),
            label: const Text(AppStrings.changeAddress),
          ),
        ),
      ],
    );
  }
}

/// Bottom sheet listing the customer's saved addresses ("عناويني") for a
/// one-tap pick, plus an "إضافة عنوان جديد" row that resolves to
/// [_addNewAddressSentinel] instead of an address — the caller pushes the
/// structured form itself so this sheet doesn't need to know about routing.
class _SavedAddressSheet extends StatelessWidget {
  const _SavedAddressSheet({required this.addresses});

  final List<SavedAddress> addresses;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, AppSpacing.md),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(AppStrings.savedAddressSheetTitle, style: AppTextStyles.title),
            const SizedBox(height: AppSpacing.md),
            ConstrainedBox(
              constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.5),
              child: ListView.separated(
                shrinkWrap: true,
                itemCount: addresses.length,
                separatorBuilder: (_, _) => const Divider(height: 1),
                itemBuilder: (context, i) {
                  final a = addresses[i];
                  return ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const CircleAvatar(radius: 18, backgroundColor: AppColors.green50, child: Icon(Icons.location_on_rounded, color: AppColors.green800, size: 18)),
                    title: Text(a.label.isEmpty ? AppStrings.myAddresses : a.label, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w700)),
                    subtitle: Text(a.formattedAddress, maxLines: 1, overflow: TextOverflow.ellipsis, style: AppTextStyles.bodyMuted),
                    onTap: () => Navigator.of(context).pop(a),
                  );
                },
              ),
            ),
            const Divider(height: 1),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const CircleAvatar(radius: 18, backgroundColor: AppColors.cream, child: Icon(Icons.add_rounded, color: AppColors.green800, size: 18)),
              title: Text(AppStrings.addressAddNew, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w700, color: AppColors.green800)),
              onTap: () => Navigator.of(context).pop(_addNewAddressSentinel),
            ),
            const SizedBox(height: AppSpacing.sm),
            TextButton.icon(
              onPressed: () {
                Navigator.of(context).pop();
                context.push(AppRoutes.addresses);
              },
              icon: const Icon(Icons.settings_outlined, size: 18),
              label: const Text(AppStrings.manageAddresses),
            ),
          ],
        ),
      ),
    );
  }
}
