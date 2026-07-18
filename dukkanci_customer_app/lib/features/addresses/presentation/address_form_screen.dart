import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../application/addresses_controller.dart';
import '../domain/saved_address.dart';

enum _LabelChoice { home, work, other }

/// Add/edit form for one saved address. Pass an existing [SavedAddress] via
/// go_router's `extra` to edit it in place; omit it to create a new one.
class AddressFormScreen extends ConsumerStatefulWidget {
  const AddressFormScreen({super.key, this.initial});

  final SavedAddress? initial;

  @override
  ConsumerState<AddressFormScreen> createState() => _AddressFormScreenState();
}

class _AddressFormScreenState extends ConsumerState<AddressFormScreen> {
  late final _addressController = TextEditingController(text: widget.initial?.addressText ?? '');
  late final _detailsController = TextEditingController(text: widget.initial?.addressDetails ?? '');
  late final _nameController = TextEditingController(text: widget.initial?.recipientName ?? '');
  late final _phoneController = TextEditingController(text: widget.initial?.recipientPhone ?? '');
  late final _customLabelController = TextEditingController(
    text: _choiceFor(widget.initial?.label) == _LabelChoice.other ? (widget.initial?.label ?? '') : '',
  );
  late _LabelChoice _choice = _choiceFor(widget.initial?.label);
  String? _error;
  bool _saving = false;

  static _LabelChoice _choiceFor(String? label) {
    if (label == null || label.isEmpty || label == AppStrings.addressLabelHome) return _LabelChoice.home;
    if (label == AppStrings.addressLabelWork) return _LabelChoice.work;
    return _LabelChoice.other;
  }

  @override
  void dispose() {
    _addressController.dispose();
    _detailsController.dispose();
    _nameController.dispose();
    _phoneController.dispose();
    _customLabelController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (_saving) return;
    if (_addressController.text.trim().isEmpty) {
      setState(() => _error = AppStrings.addressValidationError);
      return;
    }
    setState(() {
      _saving = true;
      _error = null;
    });
    final label = switch (_choice) {
      _LabelChoice.home => AppStrings.addressLabelHome,
      _LabelChoice.work => AppStrings.addressLabelWork,
      _LabelChoice.other => _customLabelController.text.trim().isEmpty ? AppStrings.addressLabelOther : _customLabelController.text.trim(),
    };
    final address = (widget.initial ?? SavedAddress.newDraft()).copyWith(
      label: label,
      addressText: _addressController.text.trim(),
      addressDetails: _detailsController.text.trim(),
      recipientName: _nameController.text.trim(),
      recipientPhone: _phoneController.text.trim(),
    );
    await ref.read(addressesControllerProvider.notifier).upsert(address);
    if (mounted) context.pop();
  }

  @override
  Widget build(BuildContext context) {
    final isEdit = widget.initial != null;
    return Scaffold(
      appBar: AppBar(title: Text(isEdit ? AppStrings.addressFormTitleEdit : AppStrings.addressFormTitleAdd)),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
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
            TextField(controller: _customLabelController, decoration: const InputDecoration(hintText: AppStrings.addressLabelCustomHint)),
          ],
          const SizedBox(height: AppSpacing.xl),
          TextField(controller: _addressController, maxLines: 3, decoration: const InputDecoration(labelText: AppStrings.addressTextLabel)),
          const SizedBox(height: AppSpacing.md),
          TextField(controller: _detailsController, decoration: const InputDecoration(labelText: AppStrings.addressDetailsLabel, hintText: AppStrings.addressDetailsHint)),
          const SizedBox(height: AppSpacing.xl),
          Text(AppStrings.recipientNameLabel, style: AppTextStyles.titleSmall),
          const SizedBox(height: AppSpacing.sm),
          TextField(controller: _nameController, decoration: const InputDecoration(labelText: AppStrings.recipientNameLabel)),
          const SizedBox(height: AppSpacing.md),
          TextField(
            controller: _phoneController,
            keyboardType: TextInputType.phone,
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
