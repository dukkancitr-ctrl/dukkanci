class CartItem {
  final int productId;
  final int storeId;
  final String name;
  final String? image;
  final double unitPrice;
  final int quantity;
  final String? selectedOptionId;
  final String? selectedOptionLabel;
  final List<String> selectedAddonIds;
  final List<String> selectedAddonLabels;
  final String? notes;

  const CartItem({
    required this.productId,
    required this.storeId,
    required this.name,
    this.image,
    required this.unitPrice,
    this.quantity = 1,
    this.selectedOptionId,
    this.selectedOptionLabel,
    this.selectedAddonIds = const [],
    this.selectedAddonLabels = const [],
    this.notes,
  });

  double get lineTotal => unitPrice * quantity;

  /// A cart "line identity" — same product with the SAME option/addons combo
  /// stacks quantity; a different combo is a separate line, matching the
  /// website's cart behaviour.
  String get lineKey => [productId, selectedOptionId ?? '', ...selectedAddonIds..sort()].join('|');

  CartItem copyWith({int? quantity}) => CartItem(
        productId: productId,
        storeId: storeId,
        name: name,
        image: image,
        unitPrice: unitPrice,
        quantity: quantity ?? this.quantity,
        selectedOptionId: selectedOptionId,
        selectedOptionLabel: selectedOptionLabel,
        selectedAddonIds: selectedAddonIds,
        selectedAddonLabels: selectedAddonLabels,
        notes: notes,
      );

  Map<String, dynamic> toJson() => {
        'productId': productId,
        'storeId': storeId,
        'name': name,
        'image': image,
        'unitPrice': unitPrice,
        'quantity': quantity,
        'selectedOptionId': selectedOptionId,
        'selectedOptionLabel': selectedOptionLabel,
        'selectedAddonIds': selectedAddonIds,
        'selectedAddonLabels': selectedAddonLabels,
        'notes': notes,
      };

  factory CartItem.fromJson(Map<String, dynamic> json) => CartItem(
        productId: json['productId'] as int,
        storeId: json['storeId'] as int,
        name: json['name'] as String? ?? '',
        image: json['image'] as String?,
        unitPrice: (json['unitPrice'] as num?)?.toDouble() ?? 0,
        quantity: (json['quantity'] as num?)?.toInt() ?? 1,
        selectedOptionId: json['selectedOptionId'] as String?,
        selectedOptionLabel: json['selectedOptionLabel'] as String?,
        selectedAddonIds: ((json['selectedAddonIds'] as List?) ?? []).cast<String>(),
        selectedAddonLabels: ((json['selectedAddonLabels'] as List?) ?? []).cast<String>(),
        notes: json['notes'] as String?,
      );
}
