import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../app/providers.dart';
import '../../../core/auth/auth_repository.dart' show OtpSendResult;
import '../../../core/errors/failure.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';

/// Standalone WhatsApp-OTP login flow — same two-step phone→code exchange
/// checkout_screen.dart already runs inline for the anti-fraud gate, but
/// wired to [AuthRepository.verifyLoginOtp] (which mints a real Supabase
/// session) instead of [verifyCheckoutOtp] (which only marks a phone
/// verified for one order). This is what the profile screen's "دخول" button
/// was missing entirely — it had no login UI to open at all.
///
/// Returns `true` via `Navigator.pop` on a successful login; the caller
/// doesn't need to do anything else, since [authStateChangesProvider] makes
/// any screen watching it rebuild the moment the session is created.
Future<bool?> showLoginSheet(BuildContext context) {
  return showModalBottomSheet<bool>(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
    builder: (_) => const _LoginSheet(),
  );
}

class _LoginSheet extends ConsumerStatefulWidget {
  const _LoginSheet();

  @override
  ConsumerState<_LoginSheet> createState() => _LoginSheetState();
}

class _LoginSheetState extends ConsumerState<_LoginSheet> {
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  bool _awaitingOtp = false;
  bool _submitting = false;
  String? _error;

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final phone = _phoneController.text.trim();
    if (!_awaitingOtp && phone.replaceAll(RegExp(r'\D'), '').length < 10) {
      setState(() => _error = 'يرجى إدخال رقم واتساب صحيح');
      return;
    }

    setState(() {
      _submitting = true;
      _error = null;
    });

    final auth = ref.read(authRepositoryProvider);

    if (!_awaitingOtp) {
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
      if (result == OtpSendResult.skippedWhatsappUnavailable) {
        // No code was ever sent — unlike checkout, login has nothing to fall
        // back to (there's no order to place without verification), so this
        // is a real failure, not a soft-pass.
        setState(() {
          _submitting = false;
          _error = 'تعذّر إرسال رمز التحقق عبر واتساب حالياً، حاول لاحقاً';
        });
        return;
      }
      setState(() {
        _awaitingOtp = true;
        _submitting = false;
      });
      return;
    }

    try {
      await auth.verifyLoginOtp(phone: phone, code: _otpController.text.trim());
    } catch (e) {
      setState(() {
        _submitting = false;
        _error = e is Failure ? e.message : 'الرمز غير صحيح';
      });
      return;
    }
    if (!mounted) return;
    Navigator.of(context).pop(true);
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: AppSpacing.lg,
        right: AppSpacing.lg,
        top: AppSpacing.lg,
        bottom: AppSpacing.lg + MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(AppStrings.profileLogin, style: AppTextStyles.title),
          const SizedBox(height: 4),
          Text(AppStrings.profileGuestBody, style: AppTextStyles.bodyMuted),
          const SizedBox(height: AppSpacing.lg),
          TextField(
            controller: _phoneController,
            enabled: !_awaitingOtp,
            keyboardType: TextInputType.phone,
            decoration: const InputDecoration(labelText: AppStrings.enterPhone, hintText: '90XXXXXXXXXX'),
          ),
          if (_awaitingOtp) ...[
            const SizedBox(height: AppSpacing.md),
            TextField(
              controller: _otpController,
              autofocus: true,
              keyboardType: TextInputType.number,
              textAlign: TextAlign.center,
              style: AppTextStyles.headline,
              decoration: const InputDecoration(labelText: AppStrings.enterOtp, hintText: '••••••'),
            ),
            const SizedBox(height: AppSpacing.xs),
            Align(
              alignment: AlignmentDirectional.centerStart,
              child: TextButton(
                onPressed: _submitting ? null : () => setState(() => _awaitingOtp = false),
                child: const Text(AppStrings.resendOtp),
              ),
            ),
          ],
          if (_error != null) ...[
            const SizedBox(height: AppSpacing.sm),
            Row(children: [const Icon(Icons.error_outline_rounded, color: Colors.red, size: 18), const SizedBox(width: 6), Expanded(child: Text(_error!, style: const TextStyle(color: Colors.red)))]),
          ],
          const SizedBox(height: AppSpacing.lg),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _submitting ? null : _submit,
              child: _submitting
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                  : Text(_awaitingOtp ? AppStrings.verify : AppStrings.sendOtp),
            ),
          ),
        ],
      ),
    );
  }
}
