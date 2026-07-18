import '../../cart/domain/cart_item.dart';

/// Real payment labels match app.js's exact literal Arabic strings stored in
/// `orders.delivery_details.payment` (reverse-engineered from the checkout
/// form's payment map, not guessed) — merchant dashboards/exports may match
/// on this exact text, so don't reword it.
enum PaymentMethod { cash, cardOnDelivery, bankTransfer }

extension PaymentMethodLabel on PaymentMethod {
  String get arabicLabel => switch (this) {
        PaymentMethod.cash => 'نقداً عند التسليم',
        PaymentMethod.cardOnDelivery => 'بطاقة عند التسليم (POS مع المندوب)',
        PaymentMethod.bankTransfer => 'تحويل بنكي',
      };
}

/// Real order status values ARE Arabic display strings stored directly in
/// `orders.status` — there is no English pending/accepted/... enum in the
/// database (found reverse-engineering app.js's status list at line ~11250;
/// an earlier version of this file wrongly assumed an English enum and
/// AppStrings.orderStatusLabel translated values that don't exist).
class OrderStatus {
  OrderStatus._();
  static const newOrder = 'طلب جديد';
  static const accepted = 'تم القبول';
  static const preparing = 'قيد التجهيز';
  static const readyForPickup = 'جاهز للاستلام';
  static const outForDelivery = 'خرج للتوصيل';
  static const completed = 'مكتمل';
  static const rejected = 'مرفوضة';

  static const terminal = [completed, rejected, 'تم التوصيل', 'ملغي', 'بانتظار الدفع'];
}

/// One order — items are snapshotted at submission time (name/price/options
/// baked in as `lineItems`) per spec section 28. Mirrors app.js's real
/// `newOrder` object + `pushOrderCloud`'s `orders` table payload exactly
/// (id format, delivery_details nesting, Arabic status/payment literals) —
/// see order_repository.dart for the dual-write this feeds.
class OrderDraft {
  final String id; // client-generated, e.g. "DK-123456789" — matches app.js's `DK-${Date.now()...}` format
  final int storeId;
  final List<CartItem> items;
  final double total;
  final String contactName;
  final String contactPhone;
  final bool isPickup;
  final String addressText;
  final String addressDetails;
  final PaymentMethod paymentMethod;
  final String? notes;
  final DateTime createdAt;

  const OrderDraft({
    required this.id,
    required this.storeId,
    required this.items,
    required this.total,
    required this.contactName,
    required this.contactPhone,
    this.isPickup = false,
    this.addressText = '',
    this.addressDetails = '',
    required this.paymentMethod,
    this.notes,
    required this.createdAt,
  });

  List<Map<String, dynamic>> get lineItemsJson => items
      .map((i) => {
            'productId': i.productId,
            'name': i.name,
            'qty': i.quantity,
            'price': i.unitPrice,
            'options': [
              if (i.selectedOptionLabel != null) i.selectedOptionLabel!,
              ...i.selectedAddonLabels,
            ].join('، '),
            'notes': i.notes ?? '',
          })
      .toList();

  /// Body for the AUTHORITATIVE save — POST /api/notify-order (no ?action=,
  /// service-role write + WhatsApp notify), matching notifyOrderWhatsapp()'s
  /// exact payload shape in app.js.
  Map<String, dynamic> toNotifyOrderBody() => {
        'id': id,
        'storeId': storeId,
        'customer': contactName,
        'customerPhone': contactPhone,
        'total': total,
        'fulfillment': isPickup ? 'pickup' : 'delivery',
        'address': isPickup ? '' : addressText,
        'payment': paymentMethod.arabicLabel,
        'lineItems': lineItemsJson,
        'status': OrderStatus.newOrder,
        'time': 'الآن',
        'items': items.length,
        'addressDetails': isPickup ? '' : addressDetails,
        'notes': notes ?? '',
        'substitution': '',
        'scheduleDay': '',
        'scheduleTime': '',
        'closedWhenOrdered': false,
        'createdAt': createdAt.toIso8601String(),
        'deliveryQuote': null,
      };

  /// Row for the best-effort direct Supabase upsert (onConflict: id) —
  /// matches pushOrderCloud()'s exact `orders` row shape.
  Map<String, dynamic> toSupabaseRow() => {
        'id': id,
        'store_id': storeId,
        'customer': contactName,
        'total': total,
        'status': OrderStatus.newOrder,
        'time': 'الآن',
        'items': items.length,
        'delivery_details': {
          'quote': null,
          'phone': contactPhone,
          'phoneKey': contactPhone.replaceAll(RegExp(r'\D'), ''),
          'fulfillment': isPickup ? 'pickup' : 'delivery',
          'address': isPickup ? '' : addressText,
          'addressDetails': isPickup ? '' : addressDetails,
          'lineItems': lineItemsJson,
          'notes': notes ?? '',
          'substitution': '',
          'payment': paymentMethod.arabicLabel,
          'scheduleDay': '',
          'scheduleTime': '',
          'closedWhenOrdered': false,
          'createdAt': createdAt.toIso8601String(),
        },
        'source': 'android_app',
      };
}

/// One snapshotted line from `delivery_details.lineItems` — the exact same
/// shape app.js writes at checkout (`{productId, name, qty, price, options,
/// notes}`, see app.js line ~13836), so no per-order product image is
/// available here (never captured at order time). Order Detail shows a
/// generic icon per line instead of guessing/fetching a possibly-stale
/// current product image for what must stay a historical snapshot.
class OrderLineItem {
  final String name;
  final int qty;
  final double price;
  final String options;
  final String notes;

  const OrderLineItem({required this.name, required this.qty, required this.price, this.options = '', this.notes = ''});

  factory OrderLineItem.fromJson(Map<String, dynamic> json) => OrderLineItem(
        name: json['name'] as String? ?? '',
        qty: (json['qty'] as num?)?.toInt() ?? 1,
        price: (json['price'] as num?)?.toDouble() ?? 0,
        options: json['options'] as String? ?? '',
        notes: json['notes'] as String? ?? '',
      );
}

class OrderSummary {
  final String id;
  final int storeId;
  final String storeName;
  final double total;
  final String status;
  final DateTime createdAt;
  final List<OrderLineItem> lineItems;
  final bool isPickup;
  final String addressText;
  final String addressDetails;
  final String payment;
  final String notes;

  const OrderSummary({
    required this.id,
    required this.storeId,
    required this.storeName,
    required this.total,
    required this.status,
    required this.createdAt,
    this.lineItems = const [],
    this.isPickup = false,
    this.addressText = '',
    this.addressDetails = '',
    this.payment = '',
    this.notes = '',
  });

  bool get isTerminal => OrderStatus.terminal.contains(status);

  /// A short "٢× دجاج مشوي، أرز..." preview for list rows — real item
  /// names from the snapshot, not a generic "N items" placeholder.
  String get itemsPreview {
    if (lineItems.isEmpty) return '';
    final parts = lineItems.map((i) => i.qty > 1 ? '${i.qty}× ${i.name}' : i.name);
    return parts.join('، ');
  }

  factory OrderSummary.fromJson(Map<String, dynamic> json) {
    // delivery_details is a jsonb column — arrives as a nested map on the
    // customer-orders response (server does `select=*`, see
    // api/notify-order.js's customer-orders action), same shape this app's
    // own OrderDraft.toSupabaseRow() writes.
    final dd = json['delivery_details'] is Map ? Map<String, dynamic>.from(json['delivery_details'] as Map) : const <String, dynamic>{};
    final rawItems = dd['lineItems'] is List ? (dd['lineItems'] as List) : const [];
    return OrderSummary(
      id: json['id'].toString(),
      storeId: json['store_id'] as int,
      storeName: json['store_name'] as String? ?? '',
      total: (json['total'] as num?)?.toDouble() ?? 0,
      status: json['status'] as String? ?? OrderStatus.newOrder,
      createdAt: DateTime.tryParse(json['created_at']?.toString() ?? '') ?? DateTime.now(),
      lineItems: rawItems.map((i) => OrderLineItem.fromJson(Map<String, dynamic>.from(i as Map))).toList(),
      isPickup: dd['fulfillment'] == 'pickup',
      addressText: dd['address'] as String? ?? '',
      addressDetails: dd['addressDetails'] as String? ?? '',
      payment: dd['payment'] as String? ?? '',
      notes: dd['notes'] as String? ?? '',
    );
  }
}
