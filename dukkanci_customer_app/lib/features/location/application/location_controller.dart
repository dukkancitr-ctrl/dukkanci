import 'package:flutter_riverpod/flutter_riverpod.dart';

/// The customer's selected delivery location — set once from
/// LocationPickerScreen (current GPS fix or manual choice) and read by Home
/// (header chip), Search (distance sort), and Checkout (prefills address
/// text when available). Real reverse-geocoding to a human address needs a
/// Google Geocoding key the app doesn't have yet (see README "Required
/// manual setup") — until then this holds raw coordinates + a short label.
class SelectedLocation {
  final double lat;
  final double lng;
  final String label;

  const SelectedLocation({required this.lat, required this.lng, required this.label});
}

class LocationController extends Notifier<SelectedLocation?> {
  @override
  SelectedLocation? build() => null;

  void set(SelectedLocation location) => state = location;
}

final locationControllerProvider = NotifierProvider<LocationController, SelectedLocation?>(LocationController.new);
