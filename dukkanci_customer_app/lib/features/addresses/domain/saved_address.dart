import 'package:uuid/uuid.dart';
import '../../../core/utils/turkish_address.dart';

/// A saved delivery address ("عناويني"), using the same Turkish
/// administrative address system as the website (İl/İlçe/Mahalle-Köy
/// cascading picks + road/site/building/block/door-number/floor/postal
/// fields + a real map pin) — see migrations/20260722_turkish_address_system
/// .sql and app.js's composeFullAddressTr for the shared source of truth.
/// Every value here is Turkish; only field labels shown in the app's Arabic
/// UI are Arabic.
///
/// [legacyAddressText]/[legacyAddressDetails] are read from any address saved
/// before this rebuild (free-text city/district/neighborhood/street/building)
/// so old locally-cached data keeps displaying until the customer re-saves it.
class SavedAddress {
  final String id;
  final String label;

  final int? provinceId;
  final String provinceName; // İl
  final int? districtId;
  final String districtName; // İlçe
  final int? neighborhoodId;
  final String neighborhoodName; // Mahalle / Köy
  final String settlementType; // 'mahalle' | 'koy' | 'manual'
  final String settlementSource; // 'db' | 'manual'
  final String manualSettlementName; // only when settlementSource == 'manual'

  final String roadType; // Cadde / Sokak / ...
  final String roadName;
  final String siteName;
  final String buildingName;
  final String block;
  final String externalDoorNo; // Dış Kapı No
  final String internalDoorNo; // İç Kapı No
  final bool hasInternalDoor;
  final String floor; // Kat
  final String postalCode; // Posta Kodu
  final String addressNote; // Adres Tarifi

  final double? lat;
  final double? lng;
  final String locationSource; // 'gps' | 'map_selection' | 'geocoding' | 'manual'

  final String recipientName;
  final String recipientPhone;
  final bool isDefault;

  // Kept only so an address saved before this rebuild still displays.
  final String legacyAddressText;
  final String legacyAddressDetails;

  const SavedAddress({
    required this.id,
    required this.label,
    this.provinceId,
    this.provinceName = '',
    this.districtId,
    this.districtName = '',
    this.neighborhoodId,
    this.neighborhoodName = '',
    this.settlementType = 'mahalle',
    this.settlementSource = 'db',
    this.manualSettlementName = '',
    this.roadType = 'Cadde',
    this.roadName = '',
    this.siteName = '',
    this.buildingName = '',
    this.block = '',
    this.externalDoorNo = '',
    this.internalDoorNo = '',
    this.hasInternalDoor = true,
    this.floor = '',
    this.postalCode = '',
    this.addressNote = '',
    this.lat,
    this.lng,
    this.locationSource = 'manual',
    this.recipientName = '',
    this.recipientPhone = '',
    this.isDefault = false,
    this.legacyAddressText = '',
    this.legacyAddressDetails = '',
  });

  factory SavedAddress.newDraft() => SavedAddress(id: const Uuid().v4(), label: '');

  bool get hasLocation => lat != null && lng != null;

  TrAddressFields get _fields => TrAddressFields(
        provinceName: provinceName,
        districtName: districtName,
        neighborhoodName: neighborhoodName,
        roadType: roadType,
        roadName: roadName,
        siteName: siteName,
        buildingName: buildingName,
        block: block,
        externalDoorNo: externalDoorNo,
        internalDoorNo: internalDoorNo,
        hasInternalDoor: hasInternalDoor,
        floor: floor,
        postalCode: postalCode,
      );

  /// The full, Turkish-only assembled address — identical format to the
  /// website's composeFullAddressTr(). Falls back to the legacy free-text
  /// fields for addresses saved before this rebuild.
  String get fullAddressTr {
    final composed = composeFullAddressTr(_fields);
    if (composed.trim().isNotEmpty) return composed;
    return [legacyAddressText, legacyAddressDetails].where((s) => s.trim().isNotEmpty).join('\n');
  }

  /// First line only — used in compact list rows.
  String get formattedAddress => fullAddressTr.split('\n').first;

  /// Everything after the first line — used as a details/subtitle line.
  String get detailsLine {
    final lines = fullAddressTr.split('\n');
    return lines.length > 1 ? lines.sublist(1).join(' — ') : '';
  }

  SavedAddress copyWith({
    String? label,
    int? provinceId,
    String? provinceName,
    int? districtId,
    String? districtName,
    int? neighborhoodId,
    String? neighborhoodName,
    String? settlementType,
    String? settlementSource,
    String? manualSettlementName,
    String? roadType,
    String? roadName,
    String? siteName,
    String? buildingName,
    String? block,
    String? externalDoorNo,
    String? internalDoorNo,
    bool? hasInternalDoor,
    String? floor,
    String? postalCode,
    String? addressNote,
    double? lat,
    double? lng,
    String? locationSource,
    String? recipientName,
    String? recipientPhone,
    bool? isDefault,
    bool clearNeighborhoodId = false,
  }) {
    return SavedAddress(
      id: id,
      label: label ?? this.label,
      provinceId: provinceId ?? this.provinceId,
      provinceName: provinceName ?? this.provinceName,
      districtId: districtId ?? this.districtId,
      districtName: districtName ?? this.districtName,
      neighborhoodId: clearNeighborhoodId ? null : (neighborhoodId ?? this.neighborhoodId),
      neighborhoodName: neighborhoodName ?? this.neighborhoodName,
      settlementType: settlementType ?? this.settlementType,
      settlementSource: settlementSource ?? this.settlementSource,
      manualSettlementName: manualSettlementName ?? this.manualSettlementName,
      roadType: roadType ?? this.roadType,
      roadName: roadName ?? this.roadName,
      siteName: siteName ?? this.siteName,
      buildingName: buildingName ?? this.buildingName,
      block: block ?? this.block,
      externalDoorNo: externalDoorNo ?? this.externalDoorNo,
      internalDoorNo: internalDoorNo ?? this.internalDoorNo,
      hasInternalDoor: hasInternalDoor ?? this.hasInternalDoor,
      floor: floor ?? this.floor,
      postalCode: postalCode ?? this.postalCode,
      addressNote: addressNote ?? this.addressNote,
      lat: lat ?? this.lat,
      lng: lng ?? this.lng,
      locationSource: locationSource ?? this.locationSource,
      recipientName: recipientName ?? this.recipientName,
      recipientPhone: recipientPhone ?? this.recipientPhone,
      isDefault: isDefault ?? this.isDefault,
      legacyAddressText: legacyAddressText,
      legacyAddressDetails: legacyAddressDetails,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'label': label,
        'province_id': provinceId,
        'province_name': provinceName,
        'district_id': districtId,
        'district_name': districtName,
        'neighborhood_id': neighborhoodId,
        'neighborhood_name': neighborhoodName,
        'settlement_type': settlementType,
        'settlement_source': settlementSource,
        'manual_settlement_name': manualSettlementName,
        'road_type': roadType,
        'road_name': roadName,
        'site_name': siteName,
        'building_name': buildingName,
        'block': block,
        'external_door_no': externalDoorNo,
        'internal_door_no': internalDoorNo,
        'has_internal_door': hasInternalDoor,
        'floor': floor,
        'postal_code': postalCode,
        'address_note': addressNote,
        'lat': lat,
        'lng': lng,
        'location_source': locationSource,
        'recipient_name': recipientName,
        'recipient_phone': recipientPhone,
        'is_default': isDefault,
      };

  factory SavedAddress.fromJson(Map<String, dynamic> json) => SavedAddress(
        id: json['id'] as String? ?? const Uuid().v4(),
        label: json['label'] as String? ?? '',
        provinceId: json['province_id'] as int?,
        provinceName: json['province_name'] as String? ?? json['city'] as String? ?? '',
        districtId: json['district_id'] as int?,
        districtName: json['district_name'] as String? ?? json['district'] as String? ?? '',
        neighborhoodId: json['neighborhood_id'] as int?,
        neighborhoodName: json['neighborhood_name'] as String? ?? json['neighborhood'] as String? ?? '',
        settlementType: json['settlement_type'] as String? ?? 'mahalle',
        settlementSource: json['settlement_source'] as String? ?? 'db',
        manualSettlementName: json['manual_settlement_name'] as String? ?? '',
        roadType: json['road_type'] as String? ?? 'Cadde',
        roadName: json['road_name'] as String? ?? json['street'] as String? ?? '',
        siteName: json['site_name'] as String? ?? '',
        buildingName: json['building_name'] as String? ?? '',
        block: json['block'] as String? ?? '',
        externalDoorNo: json['external_door_no'] as String? ?? json['building'] as String? ?? '',
        internalDoorNo: json['internal_door_no'] as String? ?? json['apartment'] as String? ?? '',
        hasInternalDoor: json['has_internal_door'] as bool? ?? true,
        floor: json['floor'] as String? ?? '',
        postalCode: json['postal_code'] as String? ?? '',
        addressNote: json['address_note'] as String? ?? json['note'] as String? ?? '',
        lat: (json['lat'] as num?)?.toDouble(),
        lng: (json['lng'] as num?)?.toDouble(),
        locationSource: json['location_source'] as String? ?? 'manual',
        recipientName: json['recipient_name'] as String? ?? '',
        recipientPhone: json['recipient_phone'] as String? ?? '',
        isDefault: json['is_default'] as bool? ?? false,
        legacyAddressText: json['address_text'] as String? ?? '',
        legacyAddressDetails: json['address_details'] as String? ?? '',
      );
}
