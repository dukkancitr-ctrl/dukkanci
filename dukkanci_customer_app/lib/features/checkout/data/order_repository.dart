import '../../../core/api/api_client.dart';
import '../../../core/api/supabase_bootstrap.dart';
import '../../../core/errors/failure.dart';
import '../domain/order.dart';

/// Places an order via the SAME dual-write path app.js uses
/// (commitOrder() → pushOrderCloud() direct-to-Supabase INSERT +
/// notifyOrderWhatsapp() via /api/notify-order). CLAUDE.md documents a real
/// 2026-07-02..07-10 production incident ("فقدان طلبات صامت") where orders
/// reached WhatsApp notifications but were never saved to `orders` because
/// only one of these two writes existed. Do NOT "simplify" this to a single
/// write — both are required, and the Supabase insert must succeed (it's
/// the source of truth for order history / merchant dashboard) even if the
/// WhatsApp notify call fails.
class OrderRepository {
  OrderRepository(this._api);

  final ApiClient _api;

  /// Throws [Failure] on the Supabase insert failing (that's the failure
  /// that actually matters to the customer — no order was placed). A failed
  /// WhatsApp notify is swallowed with a warning: the order still exists and
  /// the merchant dashboard's own polling will pick it up.
  Future<String> submit(OrderDraft draft) async {
    final Map<String, dynamic> inserted;
    try {
      final row = await supabase
          .from('orders')
          .insert(draft.toInsertRow())
          .select('id')
          .single();
      inserted = Map<String, dynamic>.from(row);
    } catch (_) {
      throw Failure.unknown('تعذّر إرسال طلبك، حاول مرة أخرى');
    }

    final orderId = inserted['id'].toString();

    try {
      await _api.post<void>(
        '/api/notify-order?action=new-order',
        data: {'orderId': orderId, ...draft.toInsertRow()},
        idempotencyKey: draft.idempotencyKey,
      );
    } catch (_) {
      // Swallowed on purpose — see class doc. Order already exists in `orders`.
    }

    return orderId;
  }

  Future<List<OrderSummary>> fetchMyOrders() async {
    try {
      final rows = await supabase
          .from('orders')
          .select('id, store_id, stores(name), total, status, created_at')
          .order('created_at', ascending: false);
      return (rows as List).map((r) {
        final map = Map<String, dynamic>.from(r as Map);
        final storeJoin = map['stores'];
        return OrderSummary.fromJson({
          ...map,
          'store_name': storeJoin is Map ? storeJoin['name'] : null,
        });
      }).toList();
    } catch (_) {
      throw Failure.network();
    }
  }
}
