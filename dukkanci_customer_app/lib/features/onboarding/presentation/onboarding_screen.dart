import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/cache/local_cache.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key, required this.localCache});

  final LocalCache localCache;

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _Slide {
  final IconData icon;
  final Color color;
  final String title;
  final String body;
  const _Slide(this.icon, this.color, this.title, this.body);
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _controller = PageController();
  int _index = 0;

  static const _slides = [
    _Slide(Icons.storefront_rounded, AppColors.green800, AppStrings.onboarding1Title, AppStrings.onboarding1Body),
    _Slide(Icons.shopping_bag_rounded, AppColors.orangeDark, AppStrings.onboarding2Title, AppStrings.onboarding2Body),
    _Slide(Icons.local_shipping_rounded, AppColors.blue, AppStrings.onboarding3Title, AppStrings.onboarding3Body),
  ];

  Future<void> _finish() async {
    await widget.localCache.setOnboardingSeen();
    if (mounted) context.go(AppRoutes.locationPicker);
  }

  @override
  Widget build(BuildContext context) {
    final isLast = _index == _slides.length - 1;
    return Scaffold(
      backgroundColor: AppColors.cream,
      body: SafeArea(
        child: Column(
          children: [
            Align(
              alignment: AlignmentDirectional.centerEnd,
              child: Padding(
                padding: const EdgeInsets.only(left: AppSpacing.lg, right: AppSpacing.lg, top: AppSpacing.sm),
                child: TextButton(onPressed: _finish, child: const Text(AppStrings.skip)),
              ),
            ),
            Expanded(
              child: PageView.builder(
                controller: _controller,
                itemCount: _slides.length,
                onPageChanged: (i) => setState(() => _index = i),
                itemBuilder: (context, i) {
                  final s = _slides[i];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xxl),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 140,
                          height: 140,
                          decoration: BoxDecoration(color: s.color.withValues(alpha: 0.1), shape: BoxShape.circle),
                          child: Icon(s.icon, size: 64, color: s.color),
                        ),
                        const SizedBox(height: AppSpacing.xxl),
                        Text(s.title, style: AppTextStyles.headline, textAlign: TextAlign.center),
                        const SizedBox(height: AppSpacing.md),
                        Text(s.body, style: AppTextStyles.bodyMuted, textAlign: TextAlign.center),
                      ],
                    ),
                  );
                },
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                _slides.length,
                (i) => AnimatedContainer(
                  duration: AppMotion.base,
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: i == _index ? 24 : 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: i == _index ? AppColors.green800 : AppColors.line,
                    borderRadius: BorderRadius.circular(AppRadius.pill),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(AppSpacing.xl),
              child: ElevatedButton(
                onPressed: isLast
                    ? _finish
                    : () => _controller.nextPage(duration: AppMotion.base, curve: Curves.easeOut),
                child: Text(isLast ? AppStrings.startNow : AppStrings.next),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
