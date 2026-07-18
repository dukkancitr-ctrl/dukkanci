/// Route path constants — also used for Android App Links deep-link
/// matching (see spec section 34): a store deep link
/// `https://www.dukkanci.com.tr/store/{slug}` maps to [storeDetail].
class AppRoutes {
  AppRoutes._();

  static const splash = '/splash';
  static const onboarding = '/onboarding';
  static const locationPicker = '/location';

  static const home = '/home';
  static const search = '/search';
  static const orders = '/orders';
  static const favorites = '/favorites';
  static const profile = '/profile';
  static const addresses = '/addresses';
  static const addressForm = '/addresses/form';

  /// A curated store listing: a real category key ("restaurants", "sweets"…)
  /// or a synthetic one ("offers", "popular", "all"). See CategoryScreen.
  static const category = '/category/:key';
  static String categoryPath(String key) => '/category/$key';

  static const storeDetail = '/store/:slugOrId';
  static const productDetail = '/store/:slugOrId/product/:productId';
  static const cart = '/cart';
  static const checkout = '/checkout';
  static const orderDetail = '/order/:orderId';
  static const support = '/support';

  static String storeDetailPath(String slugOrId) => '/store/$slugOrId';
  static String productDetailPath(String slugOrId, String productId) => '/store/$slugOrId/product/$productId';
  static String orderDetailPath(String orderId) => '/order/$orderId';
}
