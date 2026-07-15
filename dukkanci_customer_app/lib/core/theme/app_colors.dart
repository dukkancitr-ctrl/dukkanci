import 'package:flutter/material.dart';

/// Dukkanci brand palette — copied 1:1 from the website's `:root` CSS custom
/// properties (styles.css) so the app and site look like the same product.
/// Keep these two in sync if the brand palette changes on the website.
class AppColors {
  AppColors._();

  static const brandRed = Color(0xFFFF0000);
  static const green950 = Color(0xFF2C080B);
  static const green900 = Color(0xFF470B10);
  static const green800 = Color(0xFFE30613); // primary action color
  static const green700 = Color(0xFFBF0813);
  static const green100 = Color(0xFFFFE1E3);
  static const green50 = Color(0xFFFFF3F3);

  static const orange = Color(0xFFF2A23A);
  static const orangeDark = Color(0xFFCF7B19);
  static const orangeSoft = Color(0xFFFFF3DF);
  static const yellow = Color(0xFFF5C65B);

  static const cream = Color(0xFFFFF9F5);
  static const creamDark = Color(0xFFF7EEE8);
  static const ink = Color(0xFF231F20);
  static const muted = Color(0xFF756D6E);
  static const line = Color(0xFFEBE4E2);
  static const white = Color(0xFFFFFFFF);
  static const red = Color(0xFFC62833);
  static const blue = Color(0xFF477DA5);

  static const success = Color(0xFF2E7D32);
  static const warning = orange;
  static const danger = red;
}
