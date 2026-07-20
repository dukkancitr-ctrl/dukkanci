import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dukkanci_customer_app/app/app.dart';
import 'package:dukkanci_customer_app/core/cache/local_cache.dart';
import 'package:dukkanci_customer_app/features/cart/application/cart_controller.dart';
import 'package:dukkanci_customer_app/features/splash/presentation/splash_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  testWidgets('App boots to the splash screen', (tester) async {
    SharedPreferences.setMockInitialValues({});
    final prefs = await SharedPreferences.getInstance();
    final localCache = LocalCache(prefs);

    await tester.pumpWidget(
      ProviderScope(
        overrides: [localCacheProvider.overrideWithValue(localCache)],
        child: DukkanciApp(localCache: localCache),
      ),
    );
    await tester.pump();

    expect(find.byType(MaterialApp), findsOneWidget);
    // The test is named for the splash — assert it, rather than only proving
    // that *some* MaterialApp exists.
    expect(find.byType(SplashScreen), findsOneWidget);

    // SplashScreen holds a deliberate 700ms boot delay plus a fade
    // AnimationController. Ending the test with either still armed trips
    // flutter_test's `!timersPending` assertion, which is what used to make
    // this test fail. Let the boot timer elapse (it routes on to onboarding,
    // since mock prefs mean onboardingSeen == false) and settle the fade.
    await tester.pump(const Duration(milliseconds: 800));
    await tester.pumpAndSettle();

    expect(find.byType(SplashScreen), findsNothing);
  });
}
