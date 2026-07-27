import 'package:flutter/material.dart';
import 'app_colors.dart';

/// Explicit type scale (ui-ux-pro-max: text-styles-system, weight-hierarchy,
/// font-scale) — every screen should reach for one of these named styles
/// instead of ad-hoc `TextStyle(fontSize: 13)` scattered around, which is
/// exactly what made the first pass feel generic/inconsistent.
class AppTextStyles {
  AppTextStyles._();

  static const _font = 'IBMPlexSansArabic';
  // Distinctive display family for headings (pubspec family "AppDisplay",
  // currently Tajawal; swap the asset files to Alyamama with no code change).
  // Falls back to the body font if the family isn't bundled, so a heading
  // never renders blank.
  static const _display = 'AppDisplay';
  static const _displayFallback = [_font];

  static const display = TextStyle(fontFamily: _display, fontFamilyFallback: _displayFallback, fontSize: 30, fontWeight: FontWeight.w800, height: 1.2, color: AppColors.ink);
  static const headline = TextStyle(fontFamily: _display, fontFamilyFallback: _displayFallback, fontSize: 22, fontWeight: FontWeight.w800, height: 1.25, color: AppColors.ink);
  static const title = TextStyle(fontFamily: _display, fontFamilyFallback: _displayFallback, fontSize: 17, fontWeight: FontWeight.w700, height: 1.3, color: AppColors.ink);
  static const titleSmall = TextStyle(fontFamily: _font, fontSize: 15, fontWeight: FontWeight.w600, height: 1.3, color: AppColors.ink);
  static const body = TextStyle(fontFamily: _font, fontSize: 15, fontWeight: FontWeight.w400, height: 1.55, color: AppColors.ink);
  static const bodyMuted = TextStyle(fontFamily: _font, fontSize: 14, fontWeight: FontWeight.w400, height: 1.5, color: AppColors.muted);
  static const label = TextStyle(fontFamily: _font, fontSize: 13, fontWeight: FontWeight.w600, height: 1.3, color: AppColors.ink);
  static const caption = TextStyle(fontFamily: _font, fontSize: 12, fontWeight: FontWeight.w500, height: 1.3, color: AppColors.muted);
  static const price = TextStyle(fontFamily: _font, fontSize: 18, fontWeight: FontWeight.w700, height: 1.2, color: AppColors.green800, fontFeatures: [FontFeature.tabularFigures()]);
  static const priceLarge = TextStyle(fontFamily: _font, fontSize: 24, fontWeight: FontWeight.w700, height: 1.2, color: AppColors.green800, fontFeatures: [FontFeature.tabularFigures()]);
}
