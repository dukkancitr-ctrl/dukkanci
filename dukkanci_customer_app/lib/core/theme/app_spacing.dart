/// 4/8dp spacing rhythm — every margin/padding in the app should reference
/// one of these instead of an arbitrary number (ui-ux-pro-max: 8dp spacing
/// rhythm, section spacing hierarchy).
class AppSpacing {
  AppSpacing._();

  static const xs = 4.0;
  static const sm = 8.0;
  static const md = 12.0;
  static const lg = 16.0;
  static const xl = 24.0;
  static const xxl = 32.0;
  static const xxxl = 48.0;
}

/// Matches the website's --radius-sm/md/lg custom properties exactly so the
/// app and site read as the same product.
class AppRadius {
  AppRadius._();

  static const sm = 14.0;
  static const md = 22.0;
  static const lg = 34.0;
  static const pill = 999.0;
}

/// Motion tokens (ui-ux-pro-max: 150-300ms micro-interactions, spring/ease-out).
class AppMotion {
  AppMotion._();

  static const fast = Duration(milliseconds: 150);
  static const base = Duration(milliseconds: 220);
  static const slow = Duration(milliseconds: 320);
}
