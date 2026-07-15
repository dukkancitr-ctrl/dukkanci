import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/cache/local_cache.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';

/// Loads the minimum needed before showing UI, then routes to onboarding
/// (first launch) or straight to home. Never blocks forever on a dead
/// network — spec section 8: "لا تبقى الشاشة معلقة إذا فشل الإنترنت".
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key, required this.localCache});

  final LocalCache localCache;

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  bool _failed = false;

  @override
  void initState() {
    super.initState();
    _boot();
  }

  Future<void> _boot() async {
    try {
      // Give the splash a brief, deliberate minimum so the logo doesn't
      // flash for 40ms on a fast device — not a fixed network timeout.
      await Future.delayed(const Duration(milliseconds: 600));
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
      backgroundColor: AppColors.cream,
      body: Center(
        child: _failed
            ? Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.wifi_off_rounded, size: 40, color: AppColors.muted),
                  const SizedBox(height: 12),
                  const Text('تعذّر الاتصال بالخادم'),
                  const SizedBox(height: 16),
                  FilledButton(
                    onPressed: () {
                      setState(() => _failed = false);
                      _boot();
                    },
                    child: const Text('إعادة المحاولة'),
                  ),
                ],
              )
            : Image.asset('assets/images/logo.png', width: 160, errorBuilder: (_, _, _) => const FlutterLogo(size: 80)),
      ),
    );
  }
}
