import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/press_scale.dart';
import '../../domain/home_category.dart';

/// The horizontal "browse by section" shortcut row (reference: the circular
/// category tiles). Icon-on-tint tiles instead of photos so the row never
/// depends on an external image that might 404 — clean, reliable, on-brand.
class CategoryStrip extends StatelessWidget {
  const CategoryStrip({super.key, required this.categories, required this.onTap});

  final List<HomeCategory> categories;
  final void Function(HomeCategory) onTap;

  // Warm brand-family gradient pairs, cycled by index so the section row reads
  // as vibrant tiles instead of one flat red icon on a pink swatch repeated.
  static const _tileGradients = <List<Color>>[
    [Color(0xFFE30613), Color(0xFFBF0813)],
    [Color(0xFFF2A23A), Color(0xFFCF7B19)],
    [Color(0xFFE0708A), Color(0xFFC0294B)],
    [Color(0xFF5AA06A), Color(0xFF2E7D32)],
    [Color(0xFF6F9BD1), Color(0xFF477DA5)],
  ];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 96,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
        itemCount: categories.length,
        separatorBuilder: (_, _) => const SizedBox(width: AppSpacing.md),
        itemBuilder: (context, i) {
          final c = categories[i];
          return PressScale(
            onTap: () => onTap(c),
            child: SizedBox(
              width: 68,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topRight,
                        end: Alignment.bottomLeft,
                        colors: _tileGradients[i % _tileGradients.length],
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: AppShadow.soft,
                    ),
                    child: Icon(c.icon, color: Colors.white, size: 28),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    c.label,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                    style: AppTextStyles.caption.copyWith(color: AppColors.ink, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
