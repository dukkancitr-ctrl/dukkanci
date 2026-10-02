import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import '../../../core/utils/distance.dart';
import '../../cart/application/cart_controller.dart' show localCacheProvider;

/// The customer's selected delivery location — set from
/// LocationPickerScreen (current GPS fix or manual district choice) and read
/// by Home (header chip + the nearby-stores rail), Search and the category
/// lists (distance sort). Persisted via LocalCache so it survives an app
/// restart; an in-memory-only version made the customer re-pick their district
/// on every launch.
///
/// Real reverse-geocoding to a human address needs a Google Geocoding key
/// the app doesn't have yet (see README "Required manual setup") — until
/// then this holds raw coordinates + a short label.
class SelectedLocation {
  /// Label given to a location taken from the device GPS (as opposed to a
  /// manually chosen district). Used to tell the two apart: only a GPS-derived
  /// location may be refreshed silently — a district the customer picked by hand
  /// is a deliberate choice and must never be overwritten.
  static const gpsLabel = 'موقعي الحالي';

  final double lat;
  final double lng;
  final String label;

  const SelectedLocation({required this.lat, required this.lng, required this.label});

  bool get isGps => label == gpsLabel;
}

class LocationController extends Notifier<SelectedLocation?> {
  /// A GPS fix that moved less than this since the saved one isn't worth
  /// re-ranking every list for — it's just GPS jitter.
  static const _minMoveKm = 0.3;

  @override
  SelectedLocation? build() {
    final saved = ref.read(localCacheProvider).readLocation();
    if (saved == null) return null;
    final lat = (saved['lat'] as num?)?.toDouble();
    final lng = (saved['lng'] as num?)?.toDouble();
    final label = saved['label'] as String?;
    if (lat == null || lng == null || label == null) return null;
    final location = SelectedLocation(lat: lat, lng: lng, label: label);
    // The saved GPS fix is as old as the last time the customer opened the
    // picker — if they've moved since, "near you" would be near where they
    // *were*. Refresh it in the background (deferred so build() stays pure).
    if (location.isGps) Future.microtask(refreshFromGps);
    return location;
  }

  void set(SelectedLocation location) {
    state = location;
    ref.read(localCacheProvider).saveLocation(lat: location.lat, lng: location.lng, label: location.label);
  }

  /// Re-reads the device position and updates the saved location when the
  /// customer has moved. Strictly silent: it only checks the permission the
  /// customer already granted and never asks for it (spec section 9 — location
  /// permission is requested only from an explicit tap on «استخدام موقعي
  /// الحالي»), and it does nothing if the customer is on a manually chosen
  /// district or has meanwhile picked a different one.
  Future<void> refreshFromGps() async {
    try {
      if (!await Geolocator.isLocationServiceEnabled()) return;
      final permission = await Geolocator.checkPermission();
      if (permission != LocationPermission.whileInUse && permission != LocationPermission.always) return;
      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.medium, timeLimit: Duration(seconds: 8)),
      );
      if (!ref.mounted) return;
      final current = state;
      if (current == null || !current.isGps) return;
      if (haversineKm(current.lat, current.lng, position.latitude, position.longitude) < _minMoveKm) return;
      set(SelectedLocation(lat: position.latitude, lng: position.longitude, label: SelectedLocation.gpsLabel));
    } catch (e, st) {
      // A failed refresh just leaves the previous location in place — but log
      // it so a broken GPS path isn't invisible.
      debugPrint('LocationController.refreshFromGps failed: $e\n$st');
    }
  }
}

final locationControllerProvider = NotifierProvider<LocationController, SelectedLocation?>(LocationController.new);
