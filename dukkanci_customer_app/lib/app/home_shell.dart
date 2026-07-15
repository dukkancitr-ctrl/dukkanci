import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../core/localization/app_strings.dart';
import '../core/routing/app_routes.dart';
import '../core/theme/app_colors.dart';
import '../features/cart/application/cart_controller.dart';

/// The persistent 5-tab bottom nav (spec section 6). Built with
/// StatefulShellRoute so each tab keeps its own scroll position / state when
/// switching, and a floating cart button appears app-wide whenever the cart
/// isn't empty (spec section 6: "يظهر زر السلة بشكل ثابت... عندما تحتوي
/// السلة على منتجات").
class HomeShell extends ConsumerWidget {
  const HomeShell({super.key, required this.navigationShell});

  final StatefulNavigationShell navigationShell;

  static const _tabs = [
    (AppRoutes.home, Icons.home_rounded, AppStrings.navHome),
    (AppRoutes.search, Icons.search_rounded, AppStrings.navSearch),
    (AppRoutes.orders, Icons.receipt_long_rounded, AppStrings.navOrders),
    (AppRoutes.favorites, Icons.favorite_rounded, AppStrings.navFavorites),
    (AppRoutes.profile, Icons.person_rounded, AppStrings.navProfile),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(cartControllerProvider);
    return Scaffold(
      body: navigationShell,
      floatingActionButton: cart.isEmpty
          ? null
          : FloatingActionButton.extended(
              onPressed: () => context.push(AppRoutes.cart),
              backgroundColor: AppColors.green800,
              icon: Badge.count(count: cart.itemCount, child: const Icon(Icons.shopping_cart_rounded, color: Colors.white)),
              label: Text('${cart.subtotal.toStringAsFixed(0)} ${AppStrings.currencySuffix}', style: const TextStyle(color: Colors.white)),
            ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: navigationShell.currentIndex,
        onTap: (i) => navigationShell.goBranch(i, initialLocation: i == navigationShell.currentIndex),
        items: [
          for (final t in _tabs) BottomNavigationBarItem(icon: Icon(t.$2), label: t.$3),
        ],
      ),
    );
  }
}
