/// İl / İlçe / Mahalle-Köy reference rows, read straight from the public,
/// read-only `tr_provinces`/`tr_districts`/`tr_neighborhoods` tables (same
/// tables the website's cascading combos read — see migrations/20260722_
/// turkish_address_system.sql). Names here are always the official Turkish
/// name, never translated.
class TrProvince {
  final int id;
  final String nameTr;
  final String searchName;

  const TrProvince({required this.id, required this.nameTr, required this.searchName});

  factory TrProvince.fromJson(Map<String, dynamic> json) => TrProvince(
        id: json['id'] as int,
        nameTr: json['name_tr'] as String? ?? '',
        searchName: json['search_name'] as String? ?? '',
      );
}

class TrDistrict {
  final int id;
  final int provinceId;
  final String nameTr;
  final String searchName;

  const TrDistrict({required this.id, required this.provinceId, required this.nameTr, required this.searchName});

  factory TrDistrict.fromJson(Map<String, dynamic> json) => TrDistrict(
        id: json['id'] as int,
        provinceId: json['province_id'] as int,
        nameTr: json['name_tr'] as String? ?? '',
        searchName: json['search_name'] as String? ?? '',
      );
}

class TrNeighborhood {
  final int id;
  final int districtId;
  final String nameTr;
  final String searchName;
  final String settlementType; // 'mahalle' | 'koy' | 'belde' | 'kirsal'

  const TrNeighborhood({
    required this.id,
    required this.districtId,
    required this.nameTr,
    required this.searchName,
    required this.settlementType,
  });

  factory TrNeighborhood.fromJson(Map<String, dynamic> json) => TrNeighborhood(
        id: json['id'] as int,
        districtId: json['district_id'] as int,
        nameTr: json['name_tr'] as String? ?? '',
        searchName: json['search_name'] as String? ?? '',
        settlementType: json['settlement_type'] as String? ?? 'mahalle',
      );
}
