import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../application/addresses_controller.dart';
import '../domain/saved_address.dart';

/// Reference: "Adreslerim" — a list of saved addresses with edit/delete per
/// row and a prominent add button. Local-only (see [AddressesController]
/// doc) but otherwise a full CRUD book, per the user's explicit choice to
/// build the complete feature rather than defer it.
class AddressesScreen extends ConsumerWidget {
  const AddressesScreen({super.key});

  Future<void> _confirmDelete(BuildContext context, WidgetRef ref, SavedAddress address) async {
    final confirmed = await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text(AppStrings.addressDeleteConfirmTitle),
            content: Text('${address.label.isEmpty ? address.formattedAddress : address.label}\n\n${AppStrings.addressDeleteConfirmBody}'),
            actions: [
              TextButton(onPressed: () => Navigator.of(context).pop(false), child: const Text(AppStrings.cancel)),
              FilledButton(onPressed: () => Navigator.of(context).pop(true), child: const Text(AppStrings.addressDelete)),
            ],
          ),
        ) ??
        false;
    if (confirmed) {
      await ref.read(addressesControllerProvider.notifier).remove(address.id);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final addresses = ref.watch(addressesControllerProvider);

    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.myAddresses)),
      body: addresses.isEmpty
          ? const _EmptyAddresses()
          : ListView.separated(
              padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, 96),
              itemCount: addresses.length,
              separatorBuilder: (_, _) => const SizedBox(height: AppSpacing.md),
              itemBuilder: (context, i) => _AddressCard(address: addresses[i], onDelete: () => _confirmDelete(context, ref, addresses[i])),
            ),
      floatingActionButton: addresses.isEmpty
          ? null
          : FloatingActionButton.extended(
              onPressed: () => context.push(AppRoutes.addressForm),
              icon: const Icon(Icons.add_rounded),
              label: const Text(AppStrings.addressAddNew),
            ),
    );
  }
}

class _EmptyAddresses extends StatelessWidget {
  const _EmptyAddresses();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 84,
              height: 84,
              decoration: const BoxDecoration(color: AppColors.cream, shape: BoxShape.circle),
              child: const Icon(Icons.location_on_outlined, size: 38, color: AppColors.muted),
            ),
            const SizedBox(height: AppSpacing.lg),
            const Text(AppStrings.addressesEmptyTitle, style: AppTextStyles.title, textAlign: TextAlign.center),
            const SizedBox(height: 6),
            const Text(AppStrings.addressesEmptyBody, style: AppTextStyles.bodyMuted, textAlign: TextAlign.center),
            const SizedBox(height: AppSpacing.xl),
            FilledButton.icon(
              onPressed: () => context.push(AppRoutes.addressForm),
              icon: const Icon(Icons.add_rounded),
              label: const Text(AppStrings.addressAddNew),
            ),
          ],
        ),
      ),
    );
  }
}

class _AddressCard extends ConsumerWidget {
  const _AddressCard({required this.address, required this.onDelete});

  final SavedAddress address;
  final VoidCallback onDelete;

  IconData get _icon {
    if (address.label == AppStrings.addressLabelHome) return Icons.home_rounded;
    if (address.label == AppStrings.addressLabelWork) return Icons.work_rounded;
    return Icons.location_on_rounded;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: address.isDefault ? AppColors.green800 : AppColors.line, width: address.isDefault ? 1.4 : 1),
      ),
      child: Material(
        type: MaterialType.transparency,
        child: InkWell(
          borderRadius: BorderRadius.circular(AppRadius.md),
          onTap: () => context.push(AppRoutes.addressForm, extra: address),
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(radius: 20, backgroundColor: AppColors.green50, child: Icon(_icon, color: AppColors.green800, size: 20)),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Flexible(child: Text(address.label.isEmpty ? AppStrings.myAddresses : address.label, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w700))),
                          if (address.isDefault) ...[
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(color: AppColors.green50, borderRadius: BorderRadius.circular(AppRadius.pill)),
                              child: const Text(AppStrings.addressDefaultBadge, style: TextStyle(fontSize: 11, color: AppColors.green800, fontWeight: FontWeight.w700)),
                            ),
                          ],
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(address.formattedAddress, style: AppTextStyles.bodyMuted, maxLines: 2, overflow: TextOverflow.ellipsis),
                      if (address.detailsLine.isNotEmpty) Text(address.detailsLine, style: AppTextStyles.caption, maxLines: 1, overflow: TextOverflow.ellipsis),
                      if (address.hasLocation) ...[
                        const SizedBox(height: 4),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.place_rounded, size: 14, color: AppColors.green800),
                            const SizedBox(width: 3),
                            Text('الموقع على الخريطة محدَّد', style: AppTextStyles.caption.copyWith(color: AppColors.green800, fontWeight: FontWeight.w600)),
                          ],
                        ),
                      ],
                      if (address.recipientName.isNotEmpty || address.recipientPhone.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text([address.recipientName, address.recipientPhone].where((s) => s.isNotEmpty).join(' · '), style: AppTextStyles.caption),
                      ],
                      if (!address.isDefault) ...[
                        const SizedBox(height: 6),
                        InkWell(
                          onTap: () => ref.read(addressesControllerProvider.notifier).setDefault(address.id),
                          child: const Text(AppStrings.addressSetDefault, style: TextStyle(fontSize: 12.5, color: AppColors.green800, fontWeight: FontWeight.w700)),
                        ),
                      ],
                    ],
                  ),
                ),
                Column(
                  children: [
                    IconButton(
                      visualDensity: VisualDensity.compact,
                      icon: const Icon(Icons.edit_outlined, size: 20, color: AppColors.muted),
                      onPressed: () => context.push(AppRoutes.addressForm, extra: address),
                    ),
                    IconButton(
                      visualDensity: VisualDensity.compact,
                      icon: const Icon(Icons.delete_outline_rounded, size: 20, color: AppColors.danger),
                      onPressed: onDelete,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
