import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dukkanci_customer_app/app/app.dart';
import 'package:dukkanci_customer_app/core/cache/local_cache.dart';
import 'package:dukkanci_customer_app/features/cart/application/cart_controller.dart';
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
  });
}
