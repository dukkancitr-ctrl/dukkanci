/// Spec section 9 field list — every address needs all of these before
/// checkout, not just lat/lng.
class Address {
  final String id;
  final String label; // "المنزل" / "العمل" / اسم مخصص
  final String city;
  final String district;
  final String neighborhood;
  final String street;
  final String buildingNo;
  final String? floor;
  final String? apartmentNo;
  final String? extraDescription;
  final String recipientName;
  final String recipientPhone;
  final double lat;
  final double lng;
  final String? driverNotes;
  final String? compoundName;

  const Address({
    required this.id,
    required this.label,
    required this.city,
    required this.district,
    required this.neighborhood,
    required this.street,
    required this.buildingNo,
    this.floor,
    this.apartmentNo,
    this.extraDescription,
    required this.recipientName,
    required this.recipientPhone,
    required this.lat,
    required this.lng,
    this.driverNotes,
    this.compoundName,
  });

  String get displayLine => [neighborhood, street, buildingNo].where((s) => s.isNotEmpty).join('، ');

  Map<String, dynamic> toJson() => {
        'id': id,
        'label': label,
        'city': city,
        'district': district,
        'neighborhood': neighborhood,
        'street': street,
        'building_no': buildingNo,
        'floor': floor,
        'apartment_no': apartmentNo,
        'extra_description': extraDescription,
        'recipient_name': recipientName,
        'recipient_phone': recipientPhone,
        'lat': lat,
        'lng': lng,
        'driver_notes': driverNotes,
        'compound_name': compoundName,
      };

  factory Address.fromJson(Map<String, dynamic> json) => Address(
        id: json['id'].toString(),
        label: json['label'] as String? ?? '',
        city: json['city'] as String? ?? '',
        district: json['district'] as String? ?? '',
        neighborhood: json['neighborhood'] as String? ?? '',
        street: json['street'] as String? ?? '',
        buildingNo: json['building_no'] as String? ?? '',
        floor: json['floor'] as String?,
        apartmentNo: json['apartment_no'] as String?,
        extraDescription: json['extra_description'] as String?,
        recipientName: json['recipient_name'] as String? ?? '',
        recipientPhone: json['recipient_phone'] as String? ?? '',
        lat: (json['lat'] as num?)?.toDouble() ?? 0,
        lng: (json['lng'] as num?)?.toDouble() ?? 0,
        driverNotes: json['driver_notes'] as String?,
        compoundName: json['compound_name'] as String?,
      );
}
