import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/home_shell.dart';
import '../../features/addresses/domain/saved_address.dart';
import '../../features/addresses/presentation/address_form_screen.dart';
import '../../features/addresses/presentation/addresses_screen.dart';
import '../../features/cart/presentation/cart_screen.dart';
import '../../features/category/presentation/category_screen.dart';
import '../../features/checkout/presentation/checkout_screen.dart';
import '../../features/favorites/presentation/favorites_screen.dart';
import '../../features/home/presentation/home_screen.dart';
import '../../features/location/presentation/location_picker_screen.dart';
import '../../features/notifications/presentation/notifications_screen.dart';
import '../../features/onboarding/presentation/onboarding_screen.dart';
import '../../features/orders/presentation/order_detail_screen.dart';
import '../../features/orders/presentation/orders_screen.dart';
import '../../features/products/presentation/product_screen.dart';
import '../../features/profile/presentation/profile_screen.dart';
import '../../features/search/presentation/search_screen.dart';
import '../../features/splash/presentation/splash_screen.dart';
import '../../features/stores/presentation/store_screen.dart';
import '../../features/support/presentation/support_screen.dart';
import '../cache/local_cache.dart';
import 'app_routes.dart';

/// Deep link handling (spec section 34): go_router matches
/// `https://www.dukkanci.com.tr/store/{slug}` to [AppRoutes.storeDetail]
/// once android/app/src/main/AndroidManifest.xml declares the matching
/// App Links intent-filter (see README "Deep links" section) and
/// .well-known/assetlinks.json is published on the website.
GoRouter buildRouter(LocalCache localCache) {
  final rootNavigatorKey = GlobalKey<NavigatorState>();

  return GoRouter(
    navigatorKey: rootNavigatorKey,
    initialLocation: AppRoutes.splash,
    routes: [
      GoRoute(
        path: AppRoutes.splash,
        builder: (context, state) => SplashScreen(localCache: localCache),
      ),
      GoRoute(
        path: AppRoutes.onboarding,
        builder: (context, state) => OnboardingScreen(localCache: localCache),
      ),
      GoRoute(
        path: AppRoutes.locationPicker,
        builder: (context, state) => const LocationPickerScreen(),
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) => HomeShell(navigationShell: navigationShell),
        branches: [
          StatefulShellBranch(routes: [GoRoute(path: AppRoutes.home, builder: (c, s) => const HomeScreen())]),
          StatefulShellBranch(routes: [GoRoute(path: AppRoutes.search, builder: (c, s) => const SearchScreen())]),
          StatefulShellBranch(routes: [GoRoute(path: AppRoutes.orders, builder: (c, s) => const OrdersScreen())]),
          StatefulShellBranch(routes: [GoRoute(path: AppRoutes.favorites, builder: (c, s) => const FavoritesScreen())]),
          StatefulShellBranch(routes: [GoRoute(path: AppRoutes.profile, builder: (c, s) => const ProfileScreen())]),
        ],
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: AppRoutes.storeDetail,
        builder: (context, state) => StoreScreen(slugOrId: state.pathParameters['slugOrId']!),
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: AppRoutes.productDetail,
        builder: (context, state) => ProductScreen(
          storeSlugOrId: state.pathParameters['slugOrId']!,
          productId: state.pathParameters['productId']!,
        ),
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: AppRoutes.category,
        builder: (context, state) => CategoryScreen(categoryKey: state.pathParameters['key']!),
      ),
      GoRoute(parentNavigatorKey: rootNavigatorKey, path: AppRoutes.cart, builder: (c, s) => const CartScreen()),
      GoRoute(parentNavigatorKey: rootNavigatorKey, path: AppRoutes.checkout, builder: (c, s) => const CheckoutScreen()),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: AppRoutes.orderDetail,
        builder: (context, state) => OrderDetailScreen(orderId: state.pathParameters['orderId']!),
      ),
      GoRoute(parentNavigatorKey: rootNavigatorKey, path: AppRoutes.support, builder: (c, s) => const SupportScreen()),
      GoRoute(parentNavigatorKey: rootNavigatorKey, path: AppRoutes.notifications, builder: (c, s) => const NotificationsScreen()),
      GoRoute(parentNavigatorKey: rootNavigatorKey, path: AppRoutes.addresses, builder: (c, s) => const AddressesScreen()),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: AppRoutes.addressForm,
        builder: (context, state) => AddressFormScreen(initial: state.extra as SavedAddress?),
      ),
    ],
  );
}
