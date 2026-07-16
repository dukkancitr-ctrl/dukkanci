import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../api/api_client.dart';
import '../api/supabase_bootstrap.dart';
import '../cache/secure_storage.dart';
import '../errors/failure.dart';

/// Outcome of asking the server to send a checkout OTP.
enum OtpSendResult {
  /// Code sent — show the OTP field and require it.
  sent,

  /// WhatsApp itself is unavailable server-side (not configured / transport
  /// failed). app.js's startCheckoutOtp treats this as "don't block the
  /// order" and places it WITHOUT an OTP (`if (!r || r.soft) { onVerified() }`).
  /// The app must mirror that: otherwise a WhatsApp outage would make the
  /// app refuse every order while the website keeps taking them.
  skippedWhatsappUnavailable,
}

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
  ///
  /// Mirrors app.js's startCheckoutOtp semantics exactly:
  /// - `{ok:true}`           → [OtpSendResult.sent]
  /// - `{soft:true}` / transport failure → [OtpSendResult.skippedWhatsappUnavailable]
  ///   (WhatsApp itself is down/unconfigured — the order must still go through)
  /// - anything else (too_soon / rate_limited / bad_phone) → throws [Failure]
  ///   (a real, user-fixable problem — blocking is correct here)
  Future<OtpSendResult> sendOtp(String phone) async {
    final Map<String, dynamic> res;
    try {
      res = await _api.post<Map<String, dynamic>>(
        '/api/notify-order?action=send-order-otp',
        data: {'phone': phone},
        parse: (json) => Map<String, dynamic>.from(json as Map),
      );
    } catch (e, st) {
      // app.js: `catch (e) { return { ok: false, soft: true }; }` — a transport
      // failure here must not block checkout.
      debugPrint('AuthRepository.sendOtp transport failure (treating as soft): $e\n$st');
      return OtpSendResult.skippedWhatsappUnavailable;
    }
    if (res['ok'] == true) return OtpSendResult.sent;
    if (res['soft'] == true) return OtpSendResult.skippedWhatsappUnavailable;

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
