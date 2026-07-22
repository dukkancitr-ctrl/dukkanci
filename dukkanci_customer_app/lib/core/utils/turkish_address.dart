/// Turkish administrative address helpers — a Dart port of the same logic in
/// the website's app.js (normTrSearch/composeRoadText/composeFullAddressTr),
/// kept character-for-character identical so the app and the site always
/// produce the same final Turkish address text from the same structured
/// fields. Every value handled here (province/district/neighborhood names,
/// street names, the assembled address) is the real Turkish name — this file
/// never translates anything to Arabic.
library;

const List<String> trRoadTypes = ['Cadde', 'Sokak', 'Bulvar', 'Meydan', 'Yol', 'Küme Evleri', 'Mevki', 'Diğer'];

const Map<String, String> _roadTypeSuffix = {
  'Cadde': 'Caddesi',
  'Sokak': 'Sokağı',
  'Bulvar': 'Bulvarı',
  'Meydan': 'Meydanı',
  'Yol': 'Yolu',
  'Küme Evleri': 'Küme Evleri',
  'Mevki': 'Mevkii',
  'Diğer': '',
};

/// Accent-insensitive, case-insensitive Turkish search key — lets a customer
/// type "Basaksehir" on a plain Latin keyboard and still match "Başakşehir".
String normalizeTrSearch(String input) => input
    .replaceAll('İ', 'I')
    .replaceAll('ı', 'i')
    .replaceAll('Ş', 'S')
    .replaceAll('ş', 's')
    .replaceAll('Ğ', 'G')
    .replaceAll('ğ', 'g')
    .replaceAll('Ü', 'U')
    .replaceAll('ü', 'u')
    .replaceAll('Ö', 'O')
    .replaceAll('ö', 'o')
    .replaceAll('Ç', 'C')
    .replaceAll('ç', 'c')
    .toUpperCase()
    .trim();

/// "Cadde"+"Atatürk" → "Atatürk Caddesi"; guards against double-suffixing
/// when the customer already typed the suffix (or picked "Diğer").
String composeTrRoadText(String roadType, String roadName) {
  final name = roadName.trim();
  if (name.isEmpty) return '';
  final suffix = _roadTypeSuffix[roadType] ?? '';
  if (suffix.isEmpty) return name;
  final lower = name.toLowerCase();
  if (lower.endsWith(suffix.toLowerCase()) || lower.endsWith(roadType.toLowerCase())) return name;
  return '$name $suffix';
}

/// The structured fields needed to assemble a Turkish address — same shape as
/// the website's `address.structured` object (see app.js composeFullAddressTr).
class TrAddressFields {
  final String provinceName;
  final String districtName;
  final String neighborhoodName;
  final String roadType;
  final String roadName;
  final String siteName;
  final String buildingName;
  final String block;
  final String externalDoorNo;
  final String internalDoorNo;
  final bool hasInternalDoor;
  final String floor;
  final String postalCode;

  const TrAddressFields({
    this.provinceName = '',
    this.districtName = '',
    this.neighborhoodName = '',
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
  });
}

/// Assembles the final Turkish-only address (spec §7) — the single source of
/// truth for display everywhere (checkout, account, order snapshot). Missing
/// fields are dropped cleanly, never left as stray commas/blank lines.
String composeFullAddressTr(TrAddressFields s) {
  final line1Parts = [s.neighborhoodName, composeTrRoadText(s.roadType, s.roadName)].where((p) => p.trim().isNotEmpty).join(', ');
  final line2Parts = [s.siteName, s.buildingName, if (s.block.trim().isNotEmpty) '${s.block} Blok'].where((p) => p.trim().isNotEmpty).join(', ');
  final line3Bits = <String>[
    if (s.externalDoorNo.trim().isNotEmpty) 'Dış Kapı No: ${s.externalDoorNo.trim()}',
    if (s.hasInternalDoor && s.internalDoorNo.trim().isNotEmpty) 'İç Kapı No: ${s.internalDoorNo.trim()}',
    if (s.floor.trim().isNotEmpty) 'Kat: ${s.floor.trim()}',
  ];
  final line3 = line3Bits.join(', ');
  final adminLine = [s.districtName, s.provinceName].where((p) => p.trim().isNotEmpty).join(' / ');
  final line4 = [adminLine, s.postalCode].where((p) => p.trim().isNotEmpty).join(', ');
  return [line1Parts, line2Parts, line3, line4].where((l) => l.trim().isNotEmpty).join(',\n');
}
