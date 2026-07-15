import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import '../core/cache/local_cache.dart';
import '../core/routing/app_router.dart';
import '../core/theme/app_theme.dart';

/// Root widget — RTL is not a toggle, it is the only supported direction
/// (see docs/تطبيق-اندرويد-Flutter-متطلبات.md language amendment). Locale is
/// pinned to ar; there is deliberately no locale switcher anywhere in the app.
class DukkanciApp extends StatelessWidget {
  const DukkanciApp({super.key, required this.localCache});

  final LocalCache localCache;

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'دكانجي',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      locale: const Locale('ar'),
      supportedLocales: const [Locale('ar')],
      localizationsDelegates: GlobalMaterialLocalizations.delegates,
      routerConfig: buildRouter(localCache),
      builder: (context, child) => Directionality(textDirection: TextDirection.rtl, child: child!),
    );
  }
}
