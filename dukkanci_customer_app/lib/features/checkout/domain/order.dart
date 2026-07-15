import '../../cart/domain/cart_item.dart';

enum PaymentMethod { cash, cardOnDelivery, bankTransfer }

extension PaymentMethodDb on PaymentMethod {
  String get dbValue => switch (this) {
        PaymentMethod.cash => 'cash',
        PaymentMethod.cardOnDelivery => 'card_on_delivery',
        PaymentMethod.bankTransfer => 'bank_transfer',
      };
}

/// One order — items are snapshotted at submission time (name/price/options
/// baked in) per spec section 28: "لا يعتمد الطلب القديم على بيانات المنتج
/// الحالية". Never re-hydrate a past order's price from the live Product.
class OrderDraft {
  final int storeId;
  final List<CartItem> items;
  final double subtotal;
  final double deliveryFee;
  final double total;
  final String contactPhone;
  final String addressText;
  final double? lat;
  final double? lng;
  final PaymentMethod paymentMethod;
  final String? notes;
  final String idempotencyKey;

  const OrderDraft({
    required this.storeId,
    required this.items,
    required this.subtotal,
    required this.deliveryFee,
    required this.total,
    required this.contactPhone,
    required this.addressText,
    this.lat,
    this.lng,
    required this.paymentMethod,
    this.notes,
    required this.idempotencyKey,
  });

  Map<String, dynamic> toInsertRow() => {
        'store_id': storeId,
        'items': items.map((i) => i.toJson()).toList(),
        'subtotal': subtotal,
        'delivery_fee': deliveryFee,
        'total': total,
        'contact_phone': contactPhone,
        'address': addressText,
        'lat': lat,
        'lng': lng,
        'payment_method': paymentMethod.dbValue,
        'customer_notes': notes,
        'status': 'pending',
        'idempotency_key': idempotencyKey,
      };
}

class OrderSummary {
  final String id;
  final int storeId;
  final String storeName;
  final double total;
  final String status;
  final DateTime createdAt;

  const OrderSummary({
    required this.id,
    required this.storeId,
    required this.storeName,
    required this.total,
    required this.status,
    required this.createdAt,
  });

  factory OrderSummary.fromJson(Map<String, dynamic> json) => OrderSummary(
        id: json['id'].toString(),
        storeId: json['store_id'] as int,
        storeName: json['store_name'] as String? ?? '',
        total: (json['total'] as num?)?.toDouble() ?? 0,
        status: json['status'] as String? ?? 'pending',
        createdAt: DateTime.tryParse(json['created_at']?.toString() ?? '') ?? DateTime.now(),
      );
}
