import 'package:supabase_flutter/supabase_flutter.dart';
import '../api/api_client.dart';
import '../api/supabase_bootstrap.dart';
import '../cache/secure_storage.dart';
import '../errors/failure.dart';

/// Phone + OTP auth — but note a real deviation from the generic spec:
/// Dukkanci delivers the OTP over WHATSAPP (via the same Meta Cloud API
/// number used for order notifications), not a generic SMS provider, and
/// login/checkout share one send endpoint with two different verify
/// endpoints. This mirrors app.js exactly (see sendWhatsappOtp /
/// verifyWhatsappOtp / startCheckoutOtp) — do not swap in Supabase's own
/// phone-auth provider, it isn't what's wired up server-side.
class AuthRepository {
  AuthRepository(this._api, this._secureStorage);

  final ApiClient _api;
  final SecureStorage _secureStorage;

  /// Sends a WhatsApp OTP to [phone] (E.164-ish, digits only, e.g. "905..."),
  /// used for BOTH account login and the checkout anti-fraud gate.
  Future<void> sendOtp(String phone) async {
    final res = await _api.post<Map<String, dynamic>>(
      '/api/notify-order?action=send-order-otp',
      data: {'phone': phone},
      parse: (json) => Map<String, dynamic>.from(json as Map),
    ).catchError((_) => <String, dynamic>{'ok': false});
    if (res['ok'] != true) {
      final reason = res['reason'] as String?;
      throw Failure.fromCode(
        switch (reason) {
          'too_soon' => 'TOO_SOON',
          'rate_limited' => 'RATE_LIMITED',
          'bad_phone' => 'BAD_PHONE',
          _ => 'OTP_SEND_FAILED',
        },
        fallbackMessage: 'تعذّر إرسال الرمز عبر واتساب، تأكد من الرقم وحاول مجدداً',
      );
    }
  }

  /// Verifies a login OTP and exchanges the server-minted token for a real
  /// Supabase session (mirrors verifyWhatsappOtp in app.js).
  Future<void> verifyLoginOtp({required String phone, required String code}) async {
    final res = await _api.post<Map<String, dynamic>>(
      '/api/notify-order?action=verify-login-otp',
      data: {'phone': phone, 'code': code},
      parse: (json) => Map<String, dynamic>.from(json as Map),
    );
    if (res['ok'] != true) {
      throw Failure.fromCode(
        switch (res['reason']) {
          'expired' => 'OTP_EXPIRED',
          'too_many' => 'RATE_LIMITED',
          _ => 'OTP_INVALID',
        },
        fallbackMessage: 'الرمز غير صحيح، حاول مجدداً',
      );
    }
    final tokenHash = res['tokenHash'] as String?;
    final AuthResponse authRes;
    if (tokenHash != null) {
      authRes = await supabase.auth.verifyOTP(tokenHash: tokenHash, type: OtpType.magiclink);
    } else {
      authRes = await supabase.auth.verifyOTP(
        email: res['email'] as String,
        token: res['emailOtp'] as String,
        type: OtpType.magiclink,
      );
    }
    final session = authRes.session;
    if (session != null) {
      await _secureStorage.saveTokens(accessToken: session.accessToken, refreshToken: session.refreshToken ?? '');
    }
    await _secureStorage.saveVerifiedPhone(phone);
  }

  /// Verifies a checkout OTP WITHOUT creating/needing an account (mirrors
  /// verifyOrderOtp / the anonymous checkout-only gate in app.js).
  Future<void> verifyCheckoutOtp({required String phone, required String code}) async {
    final res = await _api.post<Map<String, dynamic>>(
      '/api/notify-order?action=verify-order-otp',
      data: {'phone': phone, 'code': code},
      parse: (json) => Map<String, dynamic>.from(json as Map),
    );
    if (res['ok'] != true) {
      throw Failure.fromCode('OTP_INVALID', fallbackMessage: 'الرمز غير صحيح، حاول مجدداً');
    }
    await _secureStorage.saveVerifiedPhone(phone);
  }

  Future<bool> isPhoneAlreadyVerified(String phone) async =>
      (await _secureStorage.verifiedPhone) == phone;

  /// The last WhatsApp-verified phone on this device, if any — used to look
  /// up "طلباتي" (see orders_screen.dart's myOrdersProvider).
  Future<String?> get verifiedPhone => _secureStorage.verifiedPhone;

  Session? get currentSession => supabase.auth.currentSession;

  Future<void> signOut() async {
    await supabase.auth.signOut();
    await _secureStorage.clearTokens();
  }
}
