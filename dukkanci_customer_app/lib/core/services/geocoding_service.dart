import 'package:dio/dio.dart';

/// Reverse-geocodes a map pin into Turkish administrative components — a
/// straight Dart port of the website's `googleReverseFull()`/
/// `pickAddressComponent()` in app.js, so a dropped pin auto-fills the same
/// İl/İlçe/Mahalle/street the site would suggest for the same coordinates.
class ReverseGeocodeResult {
  const ReverseGeocodeResult({
    required this.province,
    required this.district,
    required this.neighborhood,
    required this.road,
  });

  final String province; // İl
  final String district; // İlçe
  final String neighborhood; // Mahalle
  final String road; // Cadde/Sokak name, no suffix
}

/// Talks straight to `https://www.dukkanci.com.tr/api/maps-key` and Google's
/// REST Geocoding API on its own `Dio()` — deliberately NOT the shared
/// `ApiClient`, whose interceptor attaches this customer's bearer token to
/// every request; that token has no business leaving the dukkanci API for
/// Google's or being sent to an unauthenticated key-vending endpoint.
class GeocodingService {
  GeocodingService([Dio? dio]) : _dio = dio ?? Dio();

  final Dio _dio;
  String? _cachedKey;

  Future<String?> _apiKey() async {
    final cached = _cachedKey;
    if (cached != null) return cached;
    try {
      final res = await _dio.get<Map<String, dynamic>>('https://www.dukkanci.com.tr/api/maps-key');
      final key = res.data?['key'] as String?;
      if (key == null || key.isEmpty) return null;
      _cachedKey = key;
      return key;
    } catch (_) {
      return null;
    }
  }

  static String _pick(List<dynamic> components, List<String> wantedTypes) {
    for (final wanted in wantedTypes) {
      for (final raw in components) {
        final c = raw as Map<String, dynamic>;
        final types = (c['types'] as List?)?.cast<String>() ?? const [];
        if (types.contains(wanted)) return (c['long_name'] as String?) ?? '';
      }
    }
    return '';
  }

  /// Best-effort only — returns null on any failure (no key, no network, no
  /// results). This is pure assistance: the manual İl/İlçe/Mahalle pickers
  /// below the map always still work when it returns null, exactly like the
  /// website's `commitAddressPin()` (spec §5: never rely on the map alone).
  Future<ReverseGeocodeResult?> reverseGeocode(double lat, double lng) async {
    final key = await _apiKey();
    if (key == null) return null;
    try {
      final res = await _dio.get<Map<String, dynamic>>(
        'https://maps.googleapis.com/maps/api/geocode/json',
        queryParameters: {'latlng': '$lat,$lng', 'key': key, 'language': 'tr'},
      );
      final results = res.data?['results'] as List?;
      if (results == null || results.isEmpty) return null;
      final first = results.first as Map<String, dynamic>;
      final components = (first['address_components'] as List?) ?? const [];
      final province = _pick(components, const ['administrative_area_level_1']);
      final district = _pick(components, const ['administrative_area_level_2', 'sublocality_level_1']);
      final neighborhood = _pick(components, const ['neighborhood', 'sublocality_level_2', 'sublocality']);
      final road = _pick(components, const ['route']);
      if (province.isEmpty && district.isEmpty && neighborhood.isEmpty) return null;
      return ReverseGeocodeResult(province: province, district: district, neighborhood: neighborhood, road: road);
    } catch (_) {
      return null;
    }
  }
}
