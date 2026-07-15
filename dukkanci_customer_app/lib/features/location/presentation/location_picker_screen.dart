import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';

/// Spec section 9: location permission is requested ONLY when the customer
/// explicitly taps "استخدام موقعي الحالي" — never at app launch — and it is
/// always WHILE-IN-USE, never background (Geolocator never requests
/// "always" unless you call the always-specific API, which this screen must
/// never do).
class LocationPickerScreen extends StatefulWidget {
  const LocationPickerScreen({super.key});

  @override
  State<LocationPickerScreen> createState() => _LocationPickerScreenState();
}

class _LocationPickerScreenState extends State<LocationPickerScreen> {
  bool _requesting = false;
  String? _error;

  Future<void> _useCurrentLocation() async {
    setState(() {
      _requesting = true;
      _error = null;
    });
    try {
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        setState(() => _error = 'خدمة الموقع غير مفعّلة على جهازك');
        return;
      }
      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.denied || permission == LocationPermission.deniedForever) {
        setState(() => _error = AppStrings.locationPermissionDenied);
        return;
      }
      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.medium),
      );
      if (!mounted) return;
      // TODO(team): reverse-geocode position -> Address via Google Geocoding
      // (same API the website already uses through /api/maps-key) and pass
      // it forward instead of just navigating home.
      debugPrint('Picked location: ${position.latitude}, ${position.longitude}');
      context.go(AppRoutes.home);
    } catch (e) {
      setState(() => _error = 'تعذّر تحديد موقعك، حاول اختيار المنطقة يدوياً');
    } finally {
      if (mounted) setState(() => _requesting = false);
    }
  }

  void _chooseManually() {
    // TODO(team): push a manual area/district picker screen backed by the
    // same delivery-zone list the backend will eventually expose
    // (GET /delivery-zones per spec section 26).
    context.go(AppRoutes.home);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.location_on_rounded, size: 72, color: AppColors.green800),
              const SizedBox(height: 16),
              Text('أين نوصّل طلبك؟', style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 24),
              if (_error != null) ...[
                Text(_error!, style: const TextStyle(color: AppColors.danger), textAlign: TextAlign.center),
                const SizedBox(height: 16),
              ],
              ElevatedButton.icon(
                onPressed: _requesting ? null : _useCurrentLocation,
                icon: _requesting
                    ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : const Icon(Icons.my_location_rounded),
                label: const Text(AppStrings.useCurrentLocation),
              ),
              const SizedBox(height: 12),
              OutlinedButton(onPressed: _chooseManually, child: const Text(AppStrings.chooseAreaManually)),
            ],
          ),
        ),
      ),
    );
  }
}
