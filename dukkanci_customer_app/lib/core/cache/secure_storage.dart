import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Wraps flutter_secure_storage for the handful of values that must never sit
/// in plain SharedPreferences: auth tokens and the verified-phone flag used
/// to skip a repeat WhatsApp OTP challenge (mirrors state.verifiedPhone on
/// the website, see app.js `startCheckoutOtp`).
class SecureStorage {
  SecureStorage(this._storage);

  final FlutterSecureStorage _storage;

  static const _kAccessToken = 'dk_access_token';
  static const _kRefreshToken = 'dk_refresh_token';
  static const _kVerifiedPhone = 'dk_verified_phone';

  Future<void> saveTokens({required String accessToken, required String refreshToken}) async {
    await _storage.write(key: _kAccessToken, value: accessToken);
    await _storage.write(key: _kRefreshToken, value: refreshToken);
  }

  Future<String?> get accessToken => _storage.read(key: _kAccessToken);
  Future<String?> get refreshToken => _storage.read(key: _kRefreshToken);

  Future<void> clearTokens() async {
    await _storage.delete(key: _kAccessToken);
    await _storage.delete(key: _kRefreshToken);
  }

  Future<void> saveVerifiedPhone(String phone) => _storage.write(key: _kVerifiedPhone, value: phone);
  Future<String?> get verifiedPhone => _storage.read(key: _kVerifiedPhone);
}
