import 'package:flutter/material.dart';
import '../../../../core/localization/app_strings.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

/// The red benefits strip under the header (mirrors the website's trust-bar):
/// pay on delivery · no card needed · pay at the door. Horizontally scrollable
/// so it never overflows on a narrow phone, and no auto-motion.
class TrustBar extends StatelessWidget {
  const TrustBar({super.key});

  static const _items = <String>[
    AppStrings.trustPayOnDelivery,
    AppStrings.trustNoCard,
    AppStrings.trustPayAtDoor,
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: AppColors.green800,
      padding: const EdgeInsets.symmetric(vertical: 9, horizontal: AppSpacing.lg),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: [
            for (var i = 0; i < _items.length; i++) ...[
              if (i > 0) ...[
                const SizedBox(width: 14),
                Container(width: 1, height: 12, color: Colors.white.withValues(alpha: 0.35)),
                const SizedBox(width: 14),
              ],
              Text(
                _items[i],
                style: const TextStyle(fontFamily: 'IBMPlexSansArabic', fontSize: 12.5, fontWeight: FontWeight.w600, color: Colors.white),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
