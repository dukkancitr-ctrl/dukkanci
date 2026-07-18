import 'package:uuid/uuid.dart';

/// A saved delivery address ("عناويني"). Deliberately mirrors the exact
/// shape checkout already collects — [addressText] (free-text street/
/// building line) + [addressDetails] (floor/apartment/landmark) — rather
/// than a granular city/district/neighborhood/lat-lng structure: the app
/// has no map-pin picker or geocoding wired up yet, so a form asking for
/// coordinates it can't actually capture would be a fake field. Recipient
/// name/phone travel with the address because a household's "المنزل" and
/// "العمل" addresses often have different people accepting delivery.
class SavedAddress {
  final String id;
  final String label; // "المنزل" / "العمل" / اسم مخصص
  final String addressText;
  final String addressDetails;
  final String recipientName;
  final String recipientPhone;
  final bool isDefault;

  const SavedAddress({
    required this.id,
    required this.label,
    required this.addressText,
    this.addressDetails = '',
    this.recipientName = '',
    this.recipientPhone = '',
    this.isDefault = false,
  });

  factory SavedAddress.newDraft() => SavedAddress(id: const Uuid().v4(), label: '', addressText: '');

  SavedAddress copyWith({
    String? label,
    String? addressText,
    String? addressDetails,
    String? recipientName,
    String? recipientPhone,
    bool? isDefault,
  }) {
    return SavedAddress(
      id: id,
      label: label ?? this.label,
      addressText: addressText ?? this.addressText,
      addressDetails: addressDetails ?? this.addressDetails,
      recipientName: recipientName ?? this.recipientName,
      recipientPhone: recipientPhone ?? this.recipientPhone,
      isDefault: isDefault ?? this.isDefault,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'label': label,
        'address_text': addressText,
        'address_details': addressDetails,
        'recipient_name': recipientName,
        'recipient_phone': recipientPhone,
        'is_default': isDefault,
      };

  factory SavedAddress.fromJson(Map<String, dynamic> json) => SavedAddress(
        id: json['id'] as String? ?? const Uuid().v4(),
        label: json['label'] as String? ?? '',
        addressText: json['address_text'] as String? ?? '',
        addressDetails: json['address_details'] as String? ?? '',
        recipientName: json['recipient_name'] as String? ?? '',
        recipientPhone: json['recipient_phone'] as String? ?? '',
        isDefault: json['is_default'] as bool? ?? false,
      );
}
