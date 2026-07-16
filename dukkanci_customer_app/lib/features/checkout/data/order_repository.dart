import 'package:flutter/foundation.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/supabase_bootstrap.dart';
import '../../../core/errors/failure.dart';
import '../domain/order.dart';

/// Places an order via the SAME dual-write path app.js uses:
/// notifyOrderWhatsapp() → POST /api/notify-order (no ?action=, a same-origin
/// service-role write — THE authoritative save, plus the WhatsApp notify) and
/// pushOrderCloud() → direct Supabase upsert (best-effort secondary copy,
/// onConflict: id, harmless if both succeed). Field shapes reverse-engineered
/// from app.js's real `newOrder` object + both save functions — see
/// order.dart's toNotifyOrderBody()/toSupabaseRow() for the exact mapping.
///
/// CLAUDE.md documents a real 2026-07-02..07-10 production incident
/// ("فقدان طلبات صامت") where orders reached WhatsApp but were never saved
/// because only one of these two writes existed. Do NOT simplify to one
/// write. The notify-order call is the one that must succeed for the order
/// to count as placed; the direct Supabase upsert failing is swallowed.
class OrderRepository {
  OrderRepository(this._api);

  final ApiClient _api;

  Future<String> submit(OrderDraft draft) async {
    try {
      await _api.post<void>(
        '/api/notify-order',
        data: draft.toNotifyOrderBody(),
        idempotencyKey: draft.id, // order id IS the natural idempotency key — same id, same order
      );
    } catch (e, st) {
      debugPrint('OrderRepository.submit notify-order failed: $e\n$st');
      throw Failure.unknown('تعذّر إرسال طلبك، حاول مرة أخرى');
    }

    try {
      await supabase.from('orders').upsert(draft.toSupabaseRow(), onConflict: 'id');
    } catch (e, st) {
      debugPrint('OrderRepository.submit direct Supabase upsert failed (non-fatal, order already saved via notify-order): $e\n$st');
    }

    return draft.id;
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
