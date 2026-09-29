/// Delivery price for ONE store → ONE address, exactly as the server computes it
/// (POST /api/delivery-quote with `storeId`). The server reads the store's real
/// per-km rate / fixed fee / max distance / named zones from the database, so
/// the number shown here is the number the website charges and the number
/// create-order will save — the app must never price delivery on its own.
class DeliveryQuote {
  const DeliveryQuote({
    required this.fee,
    required this.mode,
    this.oneWayKm,
    this.roundTripKm,
    this.ratePerKm,
    this.zoneLabel,
    this.estimatedMinutes,
    this.freeDeliveryThreshold,
    this.exceedsMaxDistance = false,
  });

  final double fee;

  /// `distance` | `fixed` | `zone`
  final String mode;
  final double? oneWayKm;
  final double? roundTripKm;
  final double? ratePerKm;
  final String? zoneLabel;
  final int? estimatedMinutes;

  /// Orders whose products subtotal reaches this are delivered free.
  final double? freeDeliveryThreshold;
  final bool exceedsMaxDistance;

  factory DeliveryQuote.fromJson(Map<String, dynamic> json) {
    double? d(Object? v) => v == null ? null : (v as num).toDouble();
    return DeliveryQuote(
      fee: d(json['fee']) ?? 0,
      mode: (json['mode'] as String?) ?? 'distance',
      oneWayKm: d(json['oneWayKm']),
      roundTripKm: d(json['roundTripKm']),
      ratePerKm: d(json['ratePerKm']),
      zoneLabel: json['zoneLabel'] as String?,
      estimatedMinutes: (json['estimatedMinutes'] as num?)?.toInt(),
      freeDeliveryThreshold: d(json['freeDeliveryThreshold']),
      exceedsMaxDistance: json['exceedsMaxDistance'] == true,
    );
  }

  /// The fee actually charged for a cart worth [subtotal] (free-delivery
  /// threshold applied — same rule create-order enforces server-side).
  double feeFor(double subtotal) {
    final t = freeDeliveryThreshold;
    if (t != null && subtotal >= t) return 0;
    return fee;
  }

  /// Snapshot stored on the order (`delivery_details.quote`).
  Map<String, dynamic> toJson(double charged) => {
        'fee': charged,
        if (oneWayKm != null) 'oneWayKm': oneWayKm,
        if (roundTripKm != null) 'roundTripKm': roundTripKm,
      };
}
