import 'package:flutter_test/flutter_test.dart';
import 'package:dukkanci_customer_app/features/stores/domain/store.dart';

Store _store({required int id, bool hasOffer = false}) =>
    Store(id: id, name: 'متجر $id', category: 'مطاعم', hasOffer: hasOffer);

void main() {
  group('Store.hasAnyOffer', () {
    test('the has_offer banner flag alone still counts', () {
      // e.g. حلويات زيتونة — a merchant-authored "خصم 10%" banner with no
      // product-level old_price anywhere.
      expect(_store(id: 12, hasOffer: true).hasAnyOffer(const {}), isTrue);
    });

    test('real discounted products count even when the flag is false', () {
      // This is the reported bug: باشا بيتزريا (56) has 30 discounted pizzas
      // but has_offer = false, so it never appeared under «عروض وخصومات».
      expect(_store(id: 56).hasAnyOffer(const {56}), isTrue);
    });

    test('a store with neither is not an offer', () {
      expect(_store(id: 7).hasAnyOffer(const {56}), isFalse);
    });

    test('an empty id set degrades to flag-only, never to fewer results', () {
      // The id set arrives asynchronously; while it is loading the rail must
      // keep showing what it always showed, not go empty.
      expect(_store(id: 12, hasOffer: true).hasAnyOffer(const {}), isTrue);
      expect(_store(id: 56).hasAnyOffer(const {}), isFalse);
    });
  });
}
