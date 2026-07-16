import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';

/// Open/closed status must never rely on color alone (ui-ux-pro-max:
/// color-not-only) — always paired with a dot + explicit Arabic text.
class OpenClosedBadge extends StatelessWidget {
  const OpenClosedBadge({super.key, required this.open});

  final bool open;

  @override
  Widget build(BuildContext context) {
    final color = open ? AppColors.success : AppColors.danger;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(AppRadius.pill),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(width: 6, height: 6, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
          const SizedBox(width: 5),
          Text(
            open ? 'مفتوح الآن' : 'مغلق الآن',
            style: TextStyle(fontFamily: 'IBMPlexSansArabic', fontSize: 11, fontWeight: FontWeight.w700, color: color),
          ),
        ],
      ),
    );
  }
}

/// A compact rating pill (star + number + review count) reused on cards and
/// the store header — one visual language for "rating" everywhere.
class RatingPill extends StatelessWidget {
  const RatingPill({super.key, required this.rating, this.reviews = 0, this.compact = false});

  final double rating;
  final int reviews;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    if (rating <= 0) return const SizedBox.shrink();
    return Container(
      padding: EdgeInsets.symmetric(horizontal: compact ? 6 : AppSpacing.sm, vertical: 3),
      decoration: BoxDecoration(
        color: AppColors.orangeSoft,
        borderRadius: BorderRadius.circular(AppRadius.pill),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.star_rounded, size: 14, color: AppColors.orangeDark),
          const SizedBox(width: 3),
          Text(
            rating.toStringAsFixed(1),
            style: const TextStyle(fontFamily: 'IBMPlexSansArabic', fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.orangeDark),
          ),
          if (reviews > 0 && !compact) ...[
            const SizedBox(width: 2),
            Text('($reviews)', style: const TextStyle(fontFamily: 'IBMPlexSansArabic', fontSize: 11, color: AppColors.orangeDark)),
          ],
        ],
      ),
    );
  }
}
