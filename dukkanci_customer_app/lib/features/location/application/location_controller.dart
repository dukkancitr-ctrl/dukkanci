import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../cart/application/cart_controller.dart' show localCacheProvider;

/// The customer's selected delivery location — set from
/// LocationPickerScreen (current GPS fix or manual district choice) and read
/// by Home (header chip) and Search (distance sort). Persisted via
/// LocalCache so it survives an app restart; an in-memory-only version made
/// the customer re-pick their district on every launch.
///
/// Real reverse-geocoding to a human address needs a Google Geocoding key
/// the app doesn't have yet (see README "Required manual setup") — until
/// then this holds raw coordinates + a short label.
class SelectedLocation {
  final double lat;
  final double lng;
  final String label;

  const SelectedLocation({required this.lat, required this.lng, required this.label});
}

class LocationController extends Notifier<SelectedLocation?> {
  @override
  SelectedLocation? build() {
    final saved = ref.read(localCacheProvider).readLocation();
    if (saved == null) return null;
    final lat = (saved['lat'] as num?)?.toDouble();
    final lng = (saved['lng'] as num?)?.toDouble();
    final label = saved['label'] as String?;
    if (lat == null || lng == null || label == null) return null;
    return SelectedLocation(lat: lat, lng: lng, label: label);
  }

  void set(SelectedLocation location) {
    state = location;
    ref.read(localCacheProvider).saveLocation(lat: location.lat, lng: location.lng, label: location.label);
  }
}

final locationControllerProvider = NotifierProvider<LocationController, SelectedLocation?>(LocationController.new);
