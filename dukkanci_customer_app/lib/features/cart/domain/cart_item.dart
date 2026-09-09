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
  // Real selection INDEXES — the only thing the server's create-order endpoint
  // can reprice from (labels aren't enough). optionSelections[i] = the chosen
  // value index within product.options[i]; addonSelections = the chosen indexes
  // into product.addons. Kept alongside the label fields (labels are for display,
  // indexes are for authoritative server repricing).
  final List<int> optionSelections;
  final List<int> addonSelections;
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
    this.optionSelections = const [],
    this.addonSelections = const [],
    this.notes,
  });

  double get lineTotal => unitPrice * quantity;

  /// A cart "line identity" — same product with the SAME option/addons combo
  /// stacks quantity; a different combo is a separate line, matching the
  /// website's cart behaviour.
  ///
  /// Sorts a COPY of selectedAddonIds — sorting the field in place (`...list
  /// ..sort()`) crashes with "Cannot modify an unmodifiable list" whenever the
  /// list is the default `const []` (e.g. the store page's quick-add "+" which
  /// passes no addons), and would also be a surprise side-effect on a getter.
  String get lineKey => [productId, selectedOptionId ?? '', ...([...selectedAddonIds]..sort())].join('|');

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
        optionSelections: optionSelections,
        addonSelections: addonSelections,
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
        'optionSelections': optionSelections,
        'addonSelections': addonSelections,
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
        optionSelections: ((json['optionSelections'] as List?) ?? []).map((e) => (e as num).toInt()).toList(),
        addonSelections: ((json['addonSelections'] as List?) ?? []).map((e) => (e as num).toInt()).toList(),
        notes: json['notes'] as String?,
      );
}
