import 'package:flutter/foundation.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/supabase_bootstrap.dart';
import '../../../core/errors/failure.dart';
import '../domain/order.dart';

/// Places an order via the AUTHORITATIVE server endpoint create-order
/// (POST /api/notify-order?action=create-order): the server reprices every line
/// item from the products table, enforces store open/approved/subscription +
/// min-order, and both saves the order and sends the WhatsApp notifications in
/// one call. This replaces the old dual-write (notify-order default path +
/// direct Supabase upsert) which stored the client-supplied total verbatim — a
/// tampered client could dictate any total (see CLAUDE.md C2 fix, 2026-09-09).
///
/// The returned order id is the server's authoritative id (create-order mints
/// its own DK-… id). idempotencyKey = the draft id, so a retry of the same tap
/// returns the same order instead of creating a duplicate (create-order dedupes
/// on idempotency_key).
class OrderRepository {
  OrderRepository(this._api);

  final ApiClient _api;

  Future<String> submit(OrderDraft draft) async {
    try {
      final result = await _api.post<Map<String, dynamic>>(
        '/api/notify-order?action=create-order',
        data: draft.toCreateOrderBody(),
        idempotencyKey: draft.id,
        parse: (json) => Map<String, dynamic>.from(json as Map),
      );
      final order = result['order'];
      if (order is Map && order['id'] != null) return order['id'].toString();
      // create-order always returns the saved order on success; if the shape is
      // ever unexpected, fall back to the client draft id rather than crashing.
      return draft.id;
    } catch (e, st) {
      debugPrint('OrderRepository.submit create-order failed: $e\n$st');
      throw Failure.unknown('تعذّر إرسال طلبك، حاول مرة أخرى');
    }
  }

  /// Mirrors app.js's loadCustomerOrdersFromSupabase(): fetches THIS
  /// customer's own orders via the server's `customer-orders` action, keyed
  /// by phone AND/OR the specific order ids this device already knows about
  /// (never a raw client-side "all orders" query — that class of privacy bug
  /// was already fixed once server-side, see CLAUDE.md "نقل بحث طلبات الضيف
  /// بالهاتف للخادم"; don't reintroduce it in the mobile client).
  Future<List<OrderSummary>> fetchMyOrders({String? phone, required List<String> knownOrderIds}) async {
    final phoneKey = phone?.replaceAll(RegExp(r'\D'), '');
    if ((phoneKey == null || phoneKey.isEmpty) && knownOrderIds.isEmpty) return [];
    try {
      final rows = await _api.get<Map<String, dynamic>>(
        '/api/notify-order',
        query: {
          'action': 'customer-orders',
          if (phoneKey != null && phoneKey.isNotEmpty) 'phone': phoneKey,
          if (knownOrderIds.isNotEmpty) 'ids': knownOrderIds.take(50).join(','),
        },
        parse: (json) => Map<String, dynamic>.from(json as Map),
      );
      final orderRows = ((rows['orders'] as List?) ?? []).map((r) => Map<String, dynamic>.from(r as Map)).toList();
      if (orderRows.isEmpty) return [];

      final storeIds = orderRows.map((r) => r['store_id'] as int).toSet().toList();
      final storeNames = await _fetchStoreNames(storeIds);

      return orderRows
          .map((r) => OrderSummary.fromJson({...r, 'store_name': storeNames[r['store_id']] ?? ''}))
          .toList();
    } catch (e, st) {
      debugPrint('OrderRepository.fetchMyOrders failed: $e\n$st');
      throw Failure.network();
    }
  }

  Future<Map<int, String>> _fetchStoreNames(List<int> storeIds) async {
    if (storeIds.isEmpty) return {};
    final rows = await supabase.from('stores').select('id, name').inFilter('id', storeIds);
    return {for (final r in (rows as List)) (r as Map)['id'] as int: r['name'] as String? ?? ''};
  }
}
