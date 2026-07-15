import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'app/app.dart';
import 'core/api/supabase_bootstrap.dart';
import 'core/cache/local_cache.dart';
import 'features/cart/application/cart_controller.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Same Supabase project the website reads from — see
  // core/api/supabase_bootstrap.dart for the full architecture rationale.
  await initSupabase();

  final prefs = await SharedPreferences.getInstance();
  final localCache = LocalCache(prefs);

  // Firebase (push notifications / crashlytics / analytics) is intentionally
  // NOT initialized here yet — it needs a real google-services.json from a
  // Firebase project the team creates and owns (spec section 19 / 30). See
  // README "Required manual setup" before wiring firebase_core.initializeApp().

  runApp(
    ProviderScope(
      overrides: [localCacheProvider.overrideWithValue(localCache)],
      child: DukkanciApp(localCache: localCache),
    ),
  );
}
