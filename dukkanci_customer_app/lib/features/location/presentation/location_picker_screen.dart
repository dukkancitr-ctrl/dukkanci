import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/widgets/press_scale.dart';
import '../application/location_controller.dart';

/// Spec section 9: location permission is requested ONLY when the customer
/// explicitly taps "استخدام موقعي الحالي" — never at app launch — and it is
/// always WHILE-IN-USE, never background (Geolocator never requests
/// "always" unless you call the always-specific API, which this screen must
/// never do).
///
/// The manual district list below matches the exact rollout order from spec
/// section 41 ("مراحل الإطلاق") — coordinates are approximate district
/// centroids, not precise addresses; real reverse-geocoding needs a Google
/// Geocoding key the app doesn't have yet (see README).
class LocationPickerScreen extends ConsumerStatefulWidget {
  const LocationPickerScreen({super.key});

  @override
  ConsumerState<LocationPickerScreen> createState() => _LocationPickerScreenState();
}

class _District {
  final String name;
  final double lat;
  final double lng;
  const _District(this.name, this.lat, this.lng);
}

const _launchDistricts = [
  _District('إسنيورت', 41.0148, 28.6779),
  _District('بيليك دوزو', 40.9903, 28.6414),
  _District('أفجلار', 40.9793, 28.7212),
  _District('باشاك شهير', 41.0949, 28.8039),
  _District('كوتشوك تشكمجة', 41.0000, 28.7833),
];

class _LocationPickerScreenState extends ConsumerState<LocationPickerScreen> {
  bool _requesting = false;
  String? _error;
  bool _showDistricts = false;

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
      ref.read(locationControllerProvider.notifier).set(
            SelectedLocation(lat: position.latitude, lng: position.longitude, label: 'موقعي الحالي'),
          );
      context.go(AppRoutes.home);
    } catch (e) {
      setState(() => _error = 'تعذّر تحديد موقعك، حاول اختيار المنطقة يدوياً');
    } finally {
      if (mounted) setState(() => _requesting = false);
    }
  }

  void _pickDistrict(_District d) {
    ref.read(locationControllerProvider.notifier).set(SelectedLocation(lat: d.lat, lng: d.lng, label: d.name));
    context.go(AppRoutes.home);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      body: SafeArea(
        child: AnimatedSwitcher(
          duration: AppMotion.base,
          child: _showDistricts ? _districtList() : _initialChoice(),
        ),
      ),
    );
  }

  Widget _initialChoice() {
    return Padding(
      key: const ValueKey('choice'),
      padding: const EdgeInsets.all(AppSpacing.xl),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 120,
            height: 120,
            decoration: const BoxDecoration(color: AppColors.green50, shape: BoxShape.circle),
            child: const Icon(Icons.location_on_rounded, size: 56, color: AppColors.green800),
          ),
          const SizedBox(height: AppSpacing.xl),
          Text('أين نوصّل طلبك؟', style: AppTextStyles.headline),
          const SizedBox(height: AppSpacing.sm),
          Text('حدّد موقعك لعرض المتاجر التي توصل إليك', style: AppTextStyles.bodyMuted, textAlign: TextAlign.center),
          const SizedBox(height: AppSpacing.xl),
          if (_error != null) ...[
            Text(_error!, style: const TextStyle(color: AppColors.danger), textAlign: TextAlign.center),
            const SizedBox(height: AppSpacing.lg),
          ],
          ElevatedButton.icon(
            onPressed: _requesting ? null : _useCurrentLocation,
            icon: _requesting
                ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : const Icon(Icons.my_location_rounded),
            label: const Text(AppStrings.useCurrentLocation),
          ),
          const SizedBox(height: AppSpacing.md),
          OutlinedButton(onPressed: () => setState(() => _showDistricts = true), child: const Text(AppStrings.chooseAreaManually)),
        ],
      ),
    );
  }

  Widget _districtList() {
    return Column(
      key: const ValueKey('districts'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, AppSpacing.sm),
          child: Row(
            children: [
              IconButton(onPressed: () => setState(() => _showDistricts = false), icon: const Icon(Icons.arrow_forward_rounded)),
              const SizedBox(width: AppSpacing.sm),
              Text('اختر منطقتك', style: AppTextStyles.title),
            ],
          ),
        ),
        Expanded(
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            itemCount: _launchDistricts.length,
            separatorBuilder: (_, _) => const SizedBox(height: AppSpacing.sm),
            itemBuilder: (context, i) {
              final d = _launchDistricts[i];
              return PressScale(
                onTap: () => _pickDistrict(d),
                child: Card(
                  child: ListTile(
                    leading: const Icon(Icons.location_city_rounded, color: AppColors.green800),
                    title: Text(d.name, style: AppTextStyles.body),
                    trailing: const Icon(Icons.chevron_left_rounded, color: AppColors.muted),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
