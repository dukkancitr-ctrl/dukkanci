import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';
import '../domain/delivery_quote.dart';

/// Why a quote could not be produced — lets the checkout show the RIGHT message
/// instead of one generic error.
enum DeliveryQuoteFailure { noLocation, storeNotFound, network }

class DeliveryQuoteException implements Exception {
  const DeliveryQuoteException(this.reason);
  final DeliveryQuoteFailure reason;
}

/// Asks the server for the delivery price (POST /api/delivery-quote in its
/// `storeId` mode). Everything that matters — the store's coordinates, its
/// per-km rate, fixed fee, max distance, named zones — is resolved server-side
/// from the database, so the app can't drift from the website's prices.
class DeliveryQuoteRepository {
  DeliveryQuoteRepository(this._api);

  final ApiClient _api;

  Future<DeliveryQuote> quote({
    required int storeId,
    double? lat,
    double? lng,
    String addressText = '',
  }) async {
    try {
      final json = await _api.post<Map<String, dynamic>>(
        '/api/delivery-quote',
        data: {
          'storeId': storeId,
          if (lat != null && lng != null) 'destination': {'lat': lat, 'lng': lng},
          'addressText': addressText,
        },
        parse: (j) => Map<String, dynamic>.from(j as Map),
      );
      return DeliveryQuote.fromJson(json);
    } on ApiException catch (e) {
      if (e.statusCode == 400) throw const DeliveryQuoteException(DeliveryQuoteFailure.noLocation);
      if (e.statusCode == 404) throw const DeliveryQuoteException(DeliveryQuoteFailure.storeNotFound);
      throw const DeliveryQuoteException(DeliveryQuoteFailure.network);
    } catch (_) {
      throw const DeliveryQuoteException(DeliveryQuoteFailure.network);
    }
  }
}
