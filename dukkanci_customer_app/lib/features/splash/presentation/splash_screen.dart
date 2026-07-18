import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../../core/cache/local_cache.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';

/// Reference: a cream-background splash with an arched-doorway line-art
/// illustration behind the logo, "Dukkanci Marketplace" wordmark, and a
/// tagline — sent as a chat image with no corresponding file on disk (this
/// machine has no design-export tooling to pull it from). The illustration
/// is hand-recreated here as a [CustomPainter] (arch frame + two open-door
/// silhouettes) rather than an approximation via image generation, since a
/// generated image would NOT reliably reproduce the same shapes twice and
/// this needs to render identically every launch.
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
      if (!widget.localCache.onboardingSeen) {
        context.go(AppRoutes.onboarding);
        return;
      }
      // Returning customer with a location already chosen goes straight to
      // the feed — only ask for a location when we genuinely don't have one.
      context.go(widget.localCache.readLocation() != null ? AppRoutes.home : AppRoutes.locationPicker);
    } catch (_) {
      if (mounted) setState(() => _failed = true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark.copyWith(statusBarColor: Colors.transparent),
      child: Scaffold(
        backgroundColor: AppColors.cream,
        body: Center(
          child: _failed ? const _SplashError() : FadeTransition(opacity: _fade, child: const _SplashContent()),
        ),
      ),
    );
  }
}

class _SplashError extends StatelessWidget {
  const _SplashError();

  @override
  Widget build(BuildContext context) {
    final state = context.findAncestorStateOfType<_SplashScreenState>();
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(Icons.wifi_off_rounded, size: 40, color: AppColors.muted),
        const SizedBox(height: AppSpacing.md),
        const Text('تعذّر الاتصال بالخادم', style: AppTextStyles.body),
        const SizedBox(height: AppSpacing.lg),
        FilledButton(
          onPressed: () => state?._boot(),
          child: const Text('إعادة المحاولة'),
        ),
      ],
    );
  }
}

class _SplashContent extends StatelessWidget {
  const _SplashContent();

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: 300,
          height: 300,
          child: Stack(
            alignment: Alignment.center,
            children: [
              const CustomPaint(size: Size(300, 300), painter: _ArchDoorwayPainter()),
              // Soft warm glow behind the logo, matching the reference's
              // radial highlight at the doorway's center.
              Container(
                width: 210,
                height: 210,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [AppColors.orangeSoft.withValues(alpha: 0.55), AppColors.cream.withValues(alpha: 0)],
                  ),
                ),
              ),
              // logo.png is the FULL brand lockup (cart icon + "دكانجي" +
              // "Dukkanci Marketplace" already baked in, matching the
              // reference exactly) — shown at its natural aspect ratio, not
              // force-cropped into a square, so no separate Text widgets are
              // needed (an earlier version added its own "دكانجي"/"Dukkanci
              // Marketplace" Text on top of this image and it read as
              // duplicated/overlapping text once actually rendered).
              Image.asset(
                'assets/images/logo.png',
                width: 230,
                fit: BoxFit.contain,
                errorBuilder: (_, _, _) => const FlutterLogo(size: 100),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.lg),
        Text(AppStrings.splashTagline, style: AppTextStyles.body.copyWith(color: AppColors.muted)),
      ],
    );
  }
}

/// A hand-recreated arched-doorway line illustration: a double-outlined
/// arch frame with two open-door silhouettes flanking the sides. Stroke-only
/// (no fill) to match the reference's light, airy line-art style.
class _ArchDoorwayPainter extends CustomPainter {
  const _ArchDoorwayPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final paint = Paint()
      ..color = AppColors.archLine
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.4
      ..strokeCap = StrokeCap.round;

    void drawArchFrame(double inset) {
      final legX0 = w * 0.16 + inset;
      final legX1 = w * 0.84 - inset;
      final springY = h * 0.46;
      final peakY = h * 0.04 + inset * 0.6;
      final bottomY = h * 0.97;
      final path = Path()
        ..moveTo(legX0, bottomY)
        ..lineTo(legX0, springY)
        ..cubicTo(legX0, peakY, legX1, peakY, legX1, springY)
        ..lineTo(legX1, bottomY);
      canvas.drawPath(path, paint);
    }

    // Double-line frame effect: outer arch + a slightly smaller inner arch.
    drawArchFrame(0);
    drawArchFrame(10);

    final knobPaint = Paint()..color = AppColors.archLine;

    void drawDoor(bool onLeft) {
      final sign = onLeft ? 1.0 : -1.0;
      final x0 = onLeft ? w * 0.03 : w * 0.70;
      final x1 = onLeft ? w * 0.30 : w * 0.97;
      final yBottom = h * 0.92;
      final yArchSpring = h * 0.34;
      final yPeak = h * 0.09;
      final peakX = (x0 + x1) / 2 - 6 * sign;

      final door = Path()
        ..moveTo(x0, yBottom)
        ..lineTo(x0, yArchSpring)
        ..quadraticBezierTo(peakX, yPeak, x1, yArchSpring)
        ..lineTo(x1, yBottom);
      canvas.drawPath(door, paint);

      // Doorknob, near the door's inner (hinge-opposite) edge.
      final knobX = onLeft ? x1 - 9 : x0 + 9;
      final knobY = yArchSpring + (yBottom - yArchSpring) * 0.42;
      canvas.drawCircle(Offset(knobX, knobY), 3.2, knobPaint);
    }

    drawDoor(true);
    drawDoor(false);
  }

  @override
  bool shouldRepaint(covariant _ArchDoorwayPainter oldDelegate) => false;
}
