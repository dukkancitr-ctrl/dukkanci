import 'package:dukkanci_customer_app/features/checkout/domain/delivery_quote.dart';
import 'package:dukkanci_customer_app/features/checkout/domain/order.dart';
import 'package:flutter_test/flutter_test.dart';

/// The app must never price delivery on its own: the number comes from
/// POST /api/delivery-quote (server, real store settings). These tests pin the
/// parts that live in the app — parsing that response, the free-delivery rule,
/// and that the fee actually reaches the order the store receives (orders
/// DK-0661634416 / DK-0662089943 reached the store with NO delivery figure).
void main() {
  group('DeliveryQuote', () {
    test('parses the server response (distance mode)', () {
      final q = DeliveryQuote.fromJson({
        'ok': true,
        'mode': 'distance',
        'fee': 350,
        'oneWayKm': 8.21,
        'roundTripKm': 16.42,
        'ratePerKm': 20,
        'estimatedMinutes': 46,
        'exceedsMaxDistance': false,
        'freeDeliveryThreshold': null,
      });
      expect(q.fee, 350);
      expect(q.oneWayKm, 8.21);
      expect(q.exceedsMaxDistance, isFalse);
      expect(q.feeFor(1944), 350);
    });

    test('free-delivery threshold zeroes the fee at/above the subtotal', () {
      final q = DeliveryQuote.fromJson({'fee': 200, 'mode': 'distance', 'freeDeliveryThreshold': 500});
      expect(q.feeFor(499), 200);
      expect(q.feeFor(500), 0);
      expect(q.feeFor(900), 0);
    });

    test('a zone quote (fixed price for a listed complex) parses without distances', () {
      final q = DeliveryQuote.fromJson({'fee': 100, 'mode': 'zone', 'zoneLabel': 'مجمع برستيج بارك'});
      expect(q.mode, 'zone');
      expect(q.oneWayKm, isNull);
      expect(q.feeFor(300), 100);
    });

    test('out-of-range is surfaced, not priced silently', () {
      final q = DeliveryQuote.fromJson({'fee': 900, 'mode': 'distance', 'exceedsMaxDistance': true});
      expect(q.exceedsMaxDistance, isTrue);
    });
  });

  group('OrderDraft carries the delivery to the server', () {
    OrderDraft draft({required bool pickup, double fee = 350}) => OrderDraft(
          id: 'DK-1',
          storeId: 119,
          items: const [],
          total: 1944 + (pickup ? 0 : fee),
          contactName: 'Aseel',
          contactPhone: '05068748032',
          isPickup: pickup,
          addressText: 'Mustafa Kemal Paşa Mahallesi, Karataş Sokak',
          paymentMethod: PaymentMethod.cash,
          createdAt: DateTime(2026, 9, 29),
          deliveryFee: fee,
          deliveryQuote: const {'fee': 350, 'oneWayKm': 8.2},
          destinationLat: 40.99688698861496,
          destinationLng: 28.705763462930918,
        );

    test('create-order body: fee + the door pin, no more hard-coded zero', () {
      final b = draft(pickup: false).toCreateOrderBody();
      expect(b['clientDeliveryFee'], 350);
      expect(b['destination'], {'lat': 40.99688698861496, 'lng': 28.705763462930918});
      expect(b['addressLat'], 40.99688698861496);
      expect(b['source'], 'android_app');
    });

    test('pickup orders carry no delivery at all', () {
      final b = draft(pickup: true).toCreateOrderBody();
      expect(b['clientDeliveryFee'], 0);
      expect(b.containsKey('destination'), isFalse);
    });

    test('legacy body and Supabase row record the quote', () {
      final d = draft(pickup: false);
      expect(d.toNotifyOrderBody()['deliveryQuote'], {'fee': 350, 'oneWayKm': 8.2});
      final dd = d.toSupabaseRow()['delivery_details'] as Map;
      expect(dd['deliveryFee'], 350);
      expect(dd['quote'], {'fee': 350, 'oneWayKm': 8.2});
    });
  });
}
