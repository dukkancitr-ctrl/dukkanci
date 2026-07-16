import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

/// Non-sensitive local persistence: last known address, cached cart, last
/// home feed, onboarding-seen flag. Anything that must survive a killed app
/// and a lost connection so the customer doesn't lose an in-progress order
/// (spec section 31, "التخزين والعمل عند ضعف الإنترنت").
class LocalCache {
  LocalCache(this._prefs);

  final SharedPreferences _prefs;

  static const _kOnboardingSeen = 'dk_onboarding_seen';
  static const _kLastAddressId = 'dk_last_address_id';
  static const _kCartJson = 'dk_cart_json';
  static const _kNotificationsEnabled = 'dk_notifications_enabled';
  static const _kFavoriteStoreIds = 'dk_favorite_store_ids';
  static const _kMyOrderIds = 'dk_my_order_ids';
  static const _kAddressesJson = 'dk_addresses_json';

  bool get onboardingSeen => _prefs.getBool(_kOnboardingSeen) ?? false;
  Future<void> setOnboardingSeen() => _prefs.setBool(_kOnboardingSeen, true);

  String? get lastAddressId => _prefs.getString(_kLastAddressId);
  Future<void> setLastAddressId(String id) => _prefs.setString(_kLastAddressId, id);

  bool get notificationsEnabled => _prefs.getBool(_kNotificationsEnabled) ?? false;
  Future<void> setNotificationsEnabled(bool v) => _prefs.setBool(_kNotificationsEnabled, v);

  /// Cart is persisted as raw JSON (list of {productId, storeId, qty,
  /// selectedOptions, addons, notes}) — kept deliberately loose here; the
  /// cart feature owns the actual shape via CartItem.toJson/fromJson.
  Future<void> saveCartJson(List<Map<String, dynamic>> items) =>
      _prefs.setString(_kCartJson, jsonEncode(items));

  List<Map<String, dynamic>> readCartJson() {
    final raw = _prefs.getString(_kCartJson);
    if (raw == null || raw.isEmpty) return [];
    final decoded = jsonDecode(raw);
    if (decoded is! List) return [];
    return decoded.cast<Map<String, dynamic>>();
  }

  Future<void> clearCart() => _prefs.remove(_kCartJson);

  /// Favorite store ids — mirrors what a real /favorites backend would hold
  /// once one exists (see FavoritesController doc); local-only for now.
  Set<int> get favoriteStoreIds =>
      (_prefs.getStringList(_kFavoriteStoreIds) ?? []).map(int.parse).toSet();

  Future<void> saveFavoriteStoreIds(Set<int> ids) =>
      _prefs.setStringList(_kFavoriteStoreIds, ids.map((e) => e.toString()).toList());

  /// Order ids this device has placed — mirrors app.js's
  /// `localStorage["dukkanci-my-orders"]` id list, used to safely re-fetch
  /// THIS customer's own orders via the server's `customer-orders` action
  /// instead of an open phone-based query (see order_repository.dart).
  List<String> get myOrderIds => _prefs.getStringList(_kMyOrderIds) ?? [];

  Future<void> addMyOrderId(String id) async {
    final ids = myOrderIds;
    if (!ids.contains(id)) {
      await _prefs.setStringList(_kMyOrderIds, [id, ...ids].take(50).toList());
    }
  }

  /// Saved delivery addresses (spec section 9 field list), stored as raw
  /// JSON — Address feature owns the actual shape via Address.toJson/fromJson.
  Future<void> saveAddressesJson(List<Map<String, dynamic>> addresses) =>
      _prefs.setString(_kAddressesJson, jsonEncode(addresses));

  List<Map<String, dynamic>> readAddressesJson() {
    final raw = _prefs.getString(_kAddressesJson);
    if (raw == null || raw.isEmpty) return [];
    final decoded = jsonDecode(raw);
    if (decoded is! List) return [];
    return decoded.cast<Map<String, dynamic>>();
  }
}
