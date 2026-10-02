import 'package:flutter/material.dart';
import '../localization/app_strings.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../utils/nearby_stores.dart';

/// Distance from the customer to a store, drawn over a card photo. Text + icon
/// on a solid dark pill so it stays legible over any image (never colour alone).
class DistanceBadge extends StatelessWidget {
  const DistanceBadge({super.key, required this.km});

  final double km;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 3),
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.62),
        borderRadius: BorderRadius.circular(AppRadius.pill),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.near_me_rounded, size: 12, color: Colors.white),
          const SizedBox(width: 3),
          Text(
            AppStrings.deliveryDistanceKm(formatDistanceKm(km)),
            style: const TextStyle(fontFamily: 'IBMPlexSansArabic', fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.white),
          ),
        ],
      ),
    );
  }
}
