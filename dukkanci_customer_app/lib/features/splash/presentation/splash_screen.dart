import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/cache/local_cache.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';

/// Loads the minimum needed before showing UI, then routes to onboarding
/// (first launch) or straight to home. Never blocks forever on a dead
/// network — spec section 8: "لا تبقى الشاشة معلقة إذا فشل الإنترنت".
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key, required this.localCache});

  final LocalCache localCache;

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  bool _failed = false;
  late final AnimationController _fade = AnimationController(vsync: this, duration: AppMotion.slow)..forward();

  @override
  void initState() {
    super.initState();
    _boot();
  }

  @override
  void dispose() {
    _fade.dispose();
    super.dispose();
  }

  Future<void> _boot() async {
    try {
      // Give the splash a brief, deliberate minimum so the logo doesn't
      // flash for 40ms on a fast device — not a fixed network timeout.
      await Future.delayed(const Duration(milliseconds: 700));
      if (!mounted) return;
      final seenOnboarding = widget.localCache.onboardingSeen;
      context.go(seenOnboarding ? AppRoutes.locationPicker : AppRoutes.onboarding);
    } catch (_) {
      if (mounted) setState(() => _failed = true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.green800,
      body: Center(
        child: _failed
            ? Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.wifi_off_rounded, size: 40, color: Colors.white70),
                  const SizedBox(height: AppSpacing.md),
                  const Text('تعذّر الاتصال بالخادم', style: TextStyle(color: Colors.white)),
                  const SizedBox(height: AppSpacing.lg),
                  FilledButton(
                    style: FilledButton.styleFrom(backgroundColor: Colors.white, foregroundColor: AppColors.green800),
                    onPressed: () {
                      setState(() => _failed = false);
                      _boot();
                    },
                    child: const Text('إعادة المحاولة'),
                  ),
                ],
              )
            : FadeTransition(
                opacity: _fade,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(AppRadius.lg),
                      child: Image.asset(
                        'assets/images/logo.png',
                        width: 140,
                        height: 140,
                        fit: BoxFit.cover,
                        errorBuilder: (_, _, _) => const FlutterLogo(size: 100),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xl),
                    Text('دكانجي', style: AppTextStyles.headline.copyWith(color: Colors.white, fontSize: 26)),
                  ],
                ),
              ),
      ),
    );
  }
}
