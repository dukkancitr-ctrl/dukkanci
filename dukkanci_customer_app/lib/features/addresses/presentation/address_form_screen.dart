import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/utils/turkish_address.dart';
import '../application/addresses_controller.dart';
import '../data/tr_location_repository.dart';
import '../domain/saved_address.dart';
import '../domain/tr_location.dart';

enum _LabelChoice { home, work, other }

/// Add/edit form for one saved address — the same Turkish administrative
/// address system as the website: İl → İlçe → Mahalle/Köy cascading pickers
/// (with a "Listede yok" manual fallback), road/site/building/block/door-
/// number/floor/postal fields in the spec's exact order, and a real Google
/// Maps pin-drop picker. Pass an existing [SavedAddress] via go_router's
/// `extra` to edit it in place.
class AddressFormScreen extends ConsumerStatefulWidget {
  const AddressFormScreen({super.key, this.initial});

  final SavedAddress? initial;

  @override
  ConsumerState<AddressFormScreen> createState() => _AddressFormScreenState();
}

class _AddressFormScreenState extends ConsumerState<AddressFormScreen> {
  final _repo = TrLocationRepository();

  int? _provinceId;
  String _provinceName = '';
  int? _districtId;
  String _districtName = '';
  int? _neighborhoodId;
  String _neighborhoodName = '';
  String _settlementType = 'mahalle';
  String _settlementSource = 'db';

  String _roadType = 'Cadde';
  late final _roadNameCtrl = TextEditingController();
  late final _manualNeighborhoodCtrl = TextEditingController();
  late final _siteNameCtrl = TextEditingController();
  late final _buildingNameCtrl = TextEditingController();
  late final _blockCtrl = TextEditingController();
  late final _externalDoorCtrl = TextEditingController();
  late final _internalDoorCtrl = TextEditingController();
  bool _hasInternalDoor = true;
  late final _floorCtrl = TextEditingController();
  late final _postalCodeCtrl = TextEditingController();
  late final _noteCtrl = TextEditingController();
  late final _nameCtrl = TextEditingController();
  late final _phoneCtrl = TextEditingController();
  late final _customLabelCtrl = TextEditingController();

  double? _lat;
  double? _lng;
  String _locationSource = 'manual';
  GoogleMapController? _mapController;
  bool _locating = false;

  late _LabelChoice _choice;
  String? _error;
  bool _saving = false;

  static _LabelChoice _choiceFor(String? label) {
    if (label == null || label.isEmpty || label == AppStrings.addressLabelHome) return _LabelChoice.home;
    if (label == AppStrings.addressLabelWork) return _LabelChoice.work;
    return _LabelChoice.other;
  }

  @override
  void initState() {
    super.initState();
    final a = widget.initial;
    _choice = _choiceFor(a?.label);
    if (_choice == _LabelChoice.other) _customLabelCtrl.text = a?.label ?? '';
    _provinceId = a?.provinceId;
    _provinceName = a?.provinceName ?? '';
    _districtId = a?.districtId;
    _districtName = a?.districtName ?? '';
    _neighborhoodId = a?.neighborhoodId;
    _neighborhoodName = a?.settlementSource == 'manual' ? '' : (a?.neighborhoodName ?? '');
    _settlementType = a?.settlementType ?? 'mahalle';
    _settlementSource = a?.settlementSource ?? 'db';
    if (_settlementSource == 'manual') _manualNeighborhoodCtrl.text = a?.manualSettlementName ?? a?.neighborhoodName ?? '';
    _roadType = a?.roadType ?? 'Cadde';
    _roadNameCtrl.text = a?.roadName ?? '';
    _siteNameCtrl.text = a?.siteName ?? '';
    _buildingNameCtrl.text = a?.buildingName ?? '';
    _blockCtrl.text = a?.block ?? '';
    _externalDoorCtrl.text = a?.externalDoorNo ?? '';
    _internalDoorCtrl.text = a?.internalDoorNo ?? '';
    _hasInternalDoor = a?.hasInternalDoor ?? true;
    _floorCtrl.text = a?.floor ?? '';
    _postalCodeCtrl.text = a?.postalCode ?? '';
    _noteCtrl.text = a?.addressNote ?? '';
    _nameCtrl.text = a?.recipientName ?? '';
    _phoneCtrl.text = a?.recipientPhone ?? '';
    _lat = a?.lat;
    _lng = a?.lng;
    _locationSource = a?.locationSource ?? 'manual';
  }

  @override
  void dispose() {
    for (final c in [
      _roadNameCtrl,
      _manualNeighborhoodCtrl,
      _siteNameCtrl,
      _buildingNameCtrl,
      _blockCtrl,
      _externalDoorCtrl,
      _internalDoorCtrl,
      _floorCtrl,
      _postalCodeCtrl,
      _noteCtrl,
      _nameCtrl,
      _phoneCtrl,
      _customLabelCtrl,
    ]) {
      c.dispose();
    }
    _mapController?.dispose();
    super.dispose();
  }

  TrAddressFields get _currentFields => TrAddressFields(
        provinceName: _provinceName,
        districtName: _districtName,
        neighborhoodName: _settlementSource == 'manual' ? _manualNeighborhoodCtrl.text.trim() : _neighborhoodName,
        roadType: _roadType,
        roadName: _roadNameCtrl.text,
        siteName: _siteNameCtrl.text,
        buildingName: _buildingNameCtrl.text,
        block: _blockCtrl.text,
        externalDoorNo: _externalDoorCtrl.text,
        internalDoorNo: _internalDoorCtrl.text,
        hasInternalDoor: _hasInternalDoor,
        floor: _floorCtrl.text,
        postalCode: _postalCodeCtrl.text,
      );

  Future<void> _pickProvince() async {
    final result = await _showLocationPicker<TrProvince>(
      title: AppStrings.addrProvinceLabel,
      fetch: _repo.fetchProvinces,
      nameOf: (p) => p.nameTr,
      searchNameOf: (p) => p.searchName,
      allowManual: false,
    );
    if (result is! TrProvince) return;
    final picked = result;
    setState(() {
      _provinceId = picked.id;
      _provinceName = picked.nameTr;
      _districtId = null;
      _districtName = '';
      _neighborhoodId = null;
      _neighborhoodName = '';
      _settlementType = 'mahalle';
      _settlementSource = 'db';
      _manualNeighborhoodCtrl.clear();
    });
  }

  Future<void> _pickDistrict() async {
    if (_provinceId == null) return;
    final result = await _showLocationPicker<TrDistrict>(
      title: AppStrings.addrDistrictLabel,
      fetch: () => _repo.fetchDistricts(_provinceId!),
      nameOf: (d) => d.nameTr,
      searchNameOf: (d) => d.searchName,
      allowManual: false,
    );
    if (result is! TrDistrict) return;
    final picked = result;
    setState(() {
      _districtId = picked.id;
      _districtName = picked.nameTr;
      _neighborhoodId = null;
      _neighborhoodName = '';
      _settlementType = 'mahalle';
      _settlementSource = 'db';
      _manualNeighborhoodCtrl.clear();
    });
  }

  Future<void> _pickNeighborhood() async {
    if (_districtId == null) return;
    final result = await _showLocationPicker<TrNeighborhood>(
      title: AppStrings.addrNeighborhoodLabel,
      fetch: () => _repo.fetchNeighborhoods(_districtId!),
      nameOf: (n) => n.nameTr,
      searchNameOf: (n) => n.searchName,
      allowManual: true,
    );
    if (result == null) return;
    if (identical(result, _manualSentinel)) {
      setState(() {
        _neighborhoodId = null;
        _neighborhoodName = '';
        _settlementType = 'manual';
        _settlementSource = 'manual';
      });
      return;
    }
    if (result is! TrNeighborhood) return;
    final n = result;
    setState(() {
      _neighborhoodId = n.id;
      _neighborhoodName = n.nameTr;
      _settlementType = n.settlementType;
      _settlementSource = 'db';
      _manualNeighborhoodCtrl.clear();
    });
  }

  // Sentinel returned by the picker sheet when the customer taps "Listede
  // yok" instead of a real row — a dedicated Object so it can never collide
  // with an actual TrNeighborhood instance. The picker's Future is typed as
  // Object? (not T?) precisely so this sentinel never needs an unsafe cast.
  static final Object _manualSentinel = Object();

  Future<Object?> _showLocationPicker<T>({
    required String title,
    required Future<List<T>> Function() fetch,
    required String Function(T) nameOf,
    required String Function(T) searchNameOf,
    required bool allowManual,
  }) {
    return showModalBottomSheet<Object>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.lg))),
      builder: (sheetContext) => _LocationPickerSheet<T>(
        title: title,
        fetch: fetch,
        nameOf: nameOf,
        searchNameOf: searchNameOf,
        allowManual: allowManual,
        manualSentinel: _manualSentinel,
      ),
    );
  }

  Future<void> _useCurrentLocation() async {
    setState(() => _locating = true);
    try {
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) return;
      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied || permission == LocationPermission.deniedForever) return;
      final position = await Geolocator.getCurrentPosition(locationSettings: const LocationSettings(accuracy: LocationAccuracy.high));
      if (!mounted) return;
      final target = LatLng(position.latitude, position.longitude);
      setState(() {
        _lat = target.latitude;
        _lng = target.longitude;
        _locationSource = 'gps';
      });
      await _mapController?.animateCamera(CameraUpdate.newLatLngZoom(target, 17));
    } finally {
      if (mounted) setState(() => _locating = false);
    }
  }

  void _onCameraIdle() async {
    final controller = _mapController;
    if (controller == null) return;
    final bounds = await controller.getVisibleRegion();
    final center = LatLng(
      (bounds.northeast.latitude + bounds.southwest.latitude) / 2,
      (bounds.northeast.longitude + bounds.southwest.longitude) / 2,
    );
    setState(() {
      _lat = center.latitude;
      _lng = center.longitude;
      if (_locationSource != 'gps') _locationSource = 'map_selection';
    });
  }

  Future<void> _save() async {
    if (_saving) return;
    if (_provinceId == null) return setState(() => _error = AppStrings.addrErrProvince);
    if (_districtId == null) return setState(() => _error = AppStrings.addrErrDistrict);
    final neighborhoodName = _settlementSource == 'manual' ? _manualNeighborhoodCtrl.text.trim() : _neighborhoodName;
    if (neighborhoodName.isEmpty) return setState(() => _error = AppStrings.addrErrNeighborhood);
    if (_settlementType != 'koy' && _roadNameCtrl.text.trim().isEmpty) return setState(() => _error = AppStrings.addrErrRoad);
    if (_externalDoorCtrl.text.trim().isEmpty) return setState(() => _error = AppStrings.addrErrExternalDoor);
    if (_hasInternalDoor && _internalDoorCtrl.text.trim().isEmpty) return setState(() => _error = AppStrings.addrErrInternalDoor);
    if (_lat == null || _lng == null) return setState(() => _error = AppStrings.addrErrLocation);

    setState(() {
      _saving = true;
      _error = null;
    });
    final label = switch (_choice) {
      _LabelChoice.home => AppStrings.addressLabelHome,
      _LabelChoice.work => AppStrings.addressLabelWork,
      _LabelChoice.other => _customLabelCtrl.text.trim().isEmpty ? AppStrings.addressLabelOther : _customLabelCtrl.text.trim(),
    };
    final address = (widget.initial ?? SavedAddress.newDraft()).copyWith(
      label: label,
      provinceId: _provinceId,
      provinceName: _provinceName,
      districtId: _districtId,
      districtName: _districtName,
      neighborhoodId: _settlementSource == 'manual' ? null : _neighborhoodId,
      clearNeighborhoodId: _settlementSource == 'manual',
      neighborhoodName: neighborhoodName,
      settlementType: _settlementType,
      settlementSource: _settlementSource,
      manualSettlementName: _settlementSource == 'manual' ? neighborhoodName : '',
      roadType: _roadType,
      roadName: _roadNameCtrl.text.trim(),
      siteName: _siteNameCtrl.text.trim(),
      buildingName: _buildingNameCtrl.text.trim(),
      block: _blockCtrl.text.trim(),
      externalDoorNo: _externalDoorCtrl.text.trim(),
      internalDoorNo: _hasInternalDoor ? _internalDoorCtrl.text.trim() : '',
      hasInternalDoor: _hasInternalDoor,
      floor: _floorCtrl.text.trim(),
      postalCode: _postalCodeCtrl.text.trim(),
      addressNote: _noteCtrl.text.trim(),
      lat: _lat,
      lng: _lng,
      locationSource: _locationSource,
      recipientName: _nameCtrl.text.trim(),
      recipientPhone: _phoneCtrl.text.trim(),
    );
    await ref.read(addressesControllerProvider.notifier).upsert(address);
    if (mounted) context.pop();
  }

  @override
  Widget build(BuildContext context) {
    final isEdit = widget.initial != null;
    final preview = composeFullAddressTr(_currentFields);
    return Scaffold(
      appBar: AppBar(title: Text(isEdit ? AppStrings.addressFormTitleEdit : AppStrings.addressFormTitleAdd)),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, 40),
        children: [
          Text(AppStrings.addressLabelFieldTitle, style: AppTextStyles.titleSmall),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              Expanded(child: _LabelChip(label: AppStrings.addressLabelHome, icon: Icons.home_rounded, selected: _choice == _LabelChoice.home, onTap: () => setState(() => _choice = _LabelChoice.home))),
              const SizedBox(width: AppSpacing.sm),
              Expanded(child: _LabelChip(label: AppStrings.addressLabelWork, icon: Icons.work_rounded, selected: _choice == _LabelChoice.work, onTap: () => setState(() => _choice = _LabelChoice.work))),
              const SizedBox(width: AppSpacing.sm),
              Expanded(child: _LabelChip(label: AppStrings.addressLabelOther, icon: Icons.location_on_rounded, selected: _choice == _LabelChoice.other, onTap: () => setState(() => _choice = _LabelChoice.other))),
            ],
          ),
          if (_choice == _LabelChoice.other) ...[
            const SizedBox(height: AppSpacing.md),
            TextField(controller: _customLabelCtrl, decoration: const InputDecoration(hintText: AppStrings.addressLabelCustomHint)),
          ],
          const SizedBox(height: AppSpacing.xl),

          // Real Google Maps pin-drop — a fixed center marker over a draggable
          // map, mirroring the website's map picker. Assist only: it never
          // replaces the İl/İlçe/Mahalle fields below (spec §5).
          _SectionLabel(AppStrings.addrMapHint),
          ClipRRect(
            borderRadius: BorderRadius.circular(AppRadius.md),
            child: SizedBox(
              height: 220,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  GoogleMap(
                    initialCameraPosition: CameraPosition(
                      target: LatLng(_lat ?? 41.0122, _lng ?? 28.976),
                      zoom: (_lat != null) ? 17 : 11,
                    ),
                    onMapCreated: (c) => _mapController = c,
                    onCameraIdle: _onCameraIdle,
                    myLocationButtonEnabled: false,
                    zoomControlsEnabled: false,
                  ),
                  const Padding(
                    padding: EdgeInsets.only(bottom: 34),
                    child: Icon(Icons.location_on, size: 40, color: AppColors.green800),
                  ),
                  Positioned(
                    bottom: 10,
                    left: 10,
                    child: FloatingActionButton.small(
                      heroTag: 'addr-locate',
                      onPressed: _locating ? null : _useCurrentLocation,
                      backgroundColor: Colors.white,
                      child: _locating
                          ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                          : const Icon(Icons.my_location_rounded, color: AppColors.green800),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.xl),

          _SectionLabel(AppStrings.addrSectionLocation),
          _PickerField(label: AppStrings.addrProvinceLabel, value: _provinceName, hint: AppStrings.addrProvinceHint, onTap: _pickProvince),
          const SizedBox(height: AppSpacing.md),
          _PickerField(label: AppStrings.addrDistrictLabel, value: _districtName, hint: _provinceId == null ? AppStrings.addrDistrictHintDisabled : AppStrings.addrDistrictHint, enabled: _provinceId != null, onTap: _pickDistrict),
          const SizedBox(height: AppSpacing.md),
          _PickerField(
            label: AppStrings.addrNeighborhoodLabel,
            value: _settlementSource == 'manual' ? '' : _neighborhoodName,
            hint: _districtId == null ? AppStrings.addrNeighborhoodHintDisabled : AppStrings.addrNeighborhoodHint,
            enabled: _districtId != null,
            onTap: _pickNeighborhood,
          ),
          if (_settlementSource == 'manual') ...[
            const SizedBox(height: AppSpacing.sm),
            Container(
              padding: const EdgeInsets.all(AppSpacing.sm),
              decoration: BoxDecoration(border: Border.all(color: AppColors.line), borderRadius: BorderRadius.circular(AppRadius.sm)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextField(controller: _manualNeighborhoodCtrl, decoration: const InputDecoration(hintText: AppStrings.addrNeighborhoodManualHint), onChanged: (_) => setState(() {})),
                  const SizedBox(height: 4),
                  const Text(AppStrings.addrNeighborhoodManualNote, style: AppTextStyles.caption),
                ],
              ),
            ),
          ],
          const SizedBox(height: AppSpacing.xl),

          _SectionLabel(AppStrings.addrSectionRoad),
          Row(
            children: [
              SizedBox(
                width: 130,
                child: DropdownButtonFormField<String>(
                  initialValue: _roadType,
                  isExpanded: true,
                  items: trRoadTypes.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                  onChanged: (v) => setState(() => _roadType = v ?? 'Cadde'),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(child: TextField(controller: _roadNameCtrl, decoration: const InputDecoration(hintText: AppStrings.addrRoadNameHint), onChanged: (_) => setState(() {}))),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            children: [
              Expanded(child: TextField(controller: _siteNameCtrl, decoration: const InputDecoration(hintText: AppStrings.addrSiteNameHint))),
              const SizedBox(width: AppSpacing.sm),
              Expanded(child: TextField(controller: _buildingNameCtrl, decoration: const InputDecoration(hintText: AppStrings.addrBuildingNameHint))),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          TextField(controller: _blockCtrl, decoration: const InputDecoration(hintText: AppStrings.addrBlockHint)),
          const SizedBox(height: AppSpacing.xl),

          _SectionLabel(AppStrings.addrSectionUnit),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(child: TextField(controller: _externalDoorCtrl, decoration: const InputDecoration(hintText: AppStrings.addrExternalDoorHint), onChanged: (_) => setState(() {}))),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: TextField(
                  controller: _internalDoorCtrl,
                  enabled: _hasInternalDoor,
                  decoration: const InputDecoration(hintText: AppStrings.addrInternalDoorHint),
                  onChanged: (_) => setState(() {}),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(child: TextField(controller: _floorCtrl, decoration: const InputDecoration(hintText: AppStrings.addrFloorHint))),
            ],
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Text(AppStrings.addrNoInternalDoor, style: AppTextStyles.caption),
              Checkbox(
                value: !_hasInternalDoor,
                onChanged: (v) => setState(() {
                  _hasInternalDoor = !(v ?? false);
                  if (!_hasInternalDoor) _internalDoorCtrl.clear();
                }),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          TextField(controller: _postalCodeCtrl, keyboardType: TextInputType.number, maxLength: 5, decoration: const InputDecoration(hintText: AppStrings.addrPostalCodeHint, counterText: '')),
          const SizedBox(height: AppSpacing.md),
          TextField(controller: _noteCtrl, maxLines: 2, maxLength: 250, decoration: const InputDecoration(labelText: AppStrings.addrNoteLabel, hintText: AppStrings.addrNoteHint)),
          const SizedBox(height: AppSpacing.md),

          // Live preview of the assembled Turkish address, same format the
          // website shows before saving.
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(color: AppColors.cream, borderRadius: BorderRadius.circular(AppRadius.sm)),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.location_on_rounded, size: 16, color: AppColors.green800),
                const SizedBox(width: 8),
                Expanded(child: Text(preview.isEmpty ? '—' : preview, style: AppTextStyles.caption)),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xl),

          _SectionLabel(AppStrings.addrSectionContact),
          TextField(controller: _nameCtrl, decoration: const InputDecoration(labelText: AppStrings.recipientNameLabel)),
          const SizedBox(height: AppSpacing.md),
          TextField(
            controller: _phoneCtrl,
            keyboardType: TextInputType.phone,
            textDirection: TextDirection.ltr,
            decoration: const InputDecoration(labelText: AppStrings.enterPhone, hintText: '90XXXXXXXXXX'),
          ),

          if (_error != null) ...[
            const SizedBox(height: AppSpacing.md),
            Row(children: [const Icon(Icons.error_outline_rounded, color: AppColors.danger, size: 18), const SizedBox(width: 6), Expanded(child: Text(_error!, style: const TextStyle(color: AppColors.danger)))]),
          ],
          const SizedBox(height: AppSpacing.xl),
          FilledButton(
            onPressed: _saving ? null : _save,
            child: _saving
                ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : const Text(AppStrings.save),
          ),
        ],
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  const _SectionLabel(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.md),
      child: Text(text, style: AppTextStyles.titleSmall),
    );
  }
}

class _LabelChip extends StatelessWidget {
  const _LabelChip({required this.label, required this.icon, required this.selected, required this.onTap});

  final String label;
  final IconData icon;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadius.sm),
      child: AnimatedContainer(
        duration: AppMotion.fast,
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
        decoration: BoxDecoration(
          color: selected ? AppColors.green50 : AppColors.cream,
          border: Border.all(color: selected ? AppColors.green800 : AppColors.line, width: selected ? 1.6 : 1),
          borderRadius: BorderRadius.circular(AppRadius.sm),
        ),
        child: Column(
          children: [
            Icon(icon, color: selected ? AppColors.green800 : AppColors.muted),
            const SizedBox(height: 6),
            Text(label, style: AppTextStyles.label.copyWith(color: selected ? AppColors.green800 : AppColors.muted)),
          ],
        ),
      ),
    );
  }
}

/// A tappable field that opens a picker sheet — used for İl/İlçe/Mahalle.
class _PickerField extends StatelessWidget {
  const _PickerField({required this.label, required this.value, required this.hint, required this.onTap, this.enabled = true});

  final String label;
  final String value;
  final String hint;
  final bool enabled;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: enabled ? 1 : 0.55,
      child: InkWell(
        onTap: enabled ? onTap : null,
        borderRadius: BorderRadius.circular(AppRadius.sm),
        child: InputDecorator(
          decoration: InputDecoration(labelText: label, suffixIcon: const Icon(Icons.expand_more_rounded)),
          child: Text(value.isEmpty ? hint : value, style: value.isEmpty ? AppTextStyles.bodyMuted : AppTextStyles.body),
        ),
      ),
    );
  }
}

/// Searchable bottom-sheet list, shared by the İl/İlçe/Mahalle pickers.
/// Filtering is Turkish-accent-insensitive (spec §12: typing "Basaksehir" on
/// a plain keyboard must still find "Başakşehir").
class _LocationPickerSheet<T> extends StatefulWidget {
  const _LocationPickerSheet({
    required this.title,
    required this.fetch,
    required this.nameOf,
    required this.searchNameOf,
    required this.allowManual,
    required this.manualSentinel,
    super.key,
  });

  final String title;
  final Future<List<T>> Function() fetch;
  final String Function(T) nameOf;
  final String Function(T) searchNameOf;
  final bool allowManual;
  final Object manualSentinel;

  @override
  State<_LocationPickerSheet<T>> createState() => _LocationPickerSheetState<T>();
}

class _LocationPickerSheetState<T> extends State<_LocationPickerSheet<T>> {
  final _searchCtrl = TextEditingController();
  List<T>? _rows;
  String _query = '';

  @override
  void initState() {
    super.initState();
    widget.fetch().then((rows) {
      if (mounted) setState(() => _rows = rows);
    });
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final rows = _rows;
    final q = normalizeTrSearch(_query);
    final filtered = rows == null
        ? const []
        : (q.isEmpty ? rows : rows.where((r) => widget.searchNameOf(r).contains(q)).toList());

    return SafeArea(
      child: Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, 0),
              child: Text(widget.title, style: AppTextStyles.title),
            ),
            Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: TextField(
                controller: _searchCtrl,
                autofocus: false,
                decoration: const InputDecoration(prefixIcon: Icon(Icons.search_rounded), hintText: '...'),
                onChanged: (v) => setState(() => _query = v),
              ),
            ),
            Flexible(
              child: rows == null
                  ? const Padding(padding: EdgeInsets.all(AppSpacing.xl), child: Center(child: CircularProgressIndicator()))
                  : ListView(
                      shrinkWrap: true,
                      children: [
                        for (final r in filtered)
                          ListTile(title: Text(widget.nameOf(r)), onTap: () => Navigator.of(context).pop(r)),
                        if (filtered.isEmpty)
                          const Padding(padding: EdgeInsets.all(AppSpacing.lg), child: Text('Sonuç bulunamadı')),
                        if (widget.allowManual)
                          ListTile(
                            leading: const Icon(Icons.add_rounded, color: AppColors.green800),
                            title: const Text(AppStrings.addrNeighborhoodManualOption, style: TextStyle(color: AppColors.green800, fontWeight: FontWeight.w700)),
                            onTap: () => Navigator.of(context).pop(widget.manualSentinel),
                          ),
                      ],
                    ),
            ),
            const SizedBox(height: AppSpacing.md),
          ],
        ),
      ),
    );
  }
}
