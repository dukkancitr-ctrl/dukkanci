/// Centralized Arabic copy for the whole app.
///
/// The app ships Arabic-only (see docs/تطبيق-اندرويد-Flutter-متطلبات.md,
/// "تعديل متطلبات اللغة") so there is no .arb / gen-l10n machinery and no
/// language switcher — but strings still live here, never inline in widgets,
/// so copy can be reviewed/edited in one place without touching UI code.
class AppStrings {
  AppStrings._();

  // عام
  static const appName = 'دكانجي';
  static const retry = 'إعادة المحاولة';
  static const cancel = 'إلغاء';
  static const confirm = 'تأكيد';
  static const save = 'حفظ';
  static const skip = 'تخطي';
  static const next = 'التالي';
  static const back = 'رجوع';
  static const loading = 'جارٍ التحميل...';
  static const noResults = 'لا توجد نتائج';
  static const somethingWentWrong = 'حدث خطأ ما، حاول مرة أخرى';
  static const noInternet = 'لا يوجد اتصال بالإنترنت';
  static const currencySuffix = '₺';

  // Onboarding
  static const onboarding1Title = 'كل متاجر منطقتك في مكان واحد';
  static const onboarding1Body = 'اكتشف المطاعم والسوبرماركت والملاحم والحلويات القريبة منك.';
  static const onboarding2Title = 'اختر ما تحتاجه بسهولة';
  static const onboarding2Body = 'تصفح المنتجات والأسعار والعروض وأضف طلبك إلى السلة.';
  static const onboarding3Title = 'اطلب وتابع طلبك';
  static const onboarding3Body = 'أكمل طلبك وتابع حالته حتى وصوله إليك.';
  static const startNow = 'ابدأ الآن';

  // تحديد الموقع
  static const useCurrentLocation = 'استخدام موقعي الحالي';
  static const chooseAreaManually = 'اختيار المنطقة يدوياً';
  static const locationPermissionDenied = 'تم رفض إذن الموقع — يمكنك اختيار منطقتك يدوياً';

  // شريط التنقل السفلي
  static const navHome = 'الرئيسية';
  static const navSearch = 'البحث';
  static const navOrders = 'طلباتي';
  static const navFavorites = 'المفضلة';
  static const navProfile = 'حسابي';

  // المتجر
  static const storeClosedNow = 'مغلق الآن';
  static const storeOpenNow = 'مفتوح الآن';
  static const minOrder = 'الحد الأدنى للطلب';
  static const deliveryFee = 'رسوم التوصيل';
  static const deliveryTime = 'وقت التوصيل المتوقع';

  // السلة
  static const cartTitle = 'سلتي';
  static const cartEmpty = 'سلتك فارغة';
  static const cartConflictTitle = 'تحتوي سلتك على منتجات من متجر آخر';
  static const cartConflictBody =
      'لبدء طلب جديد من هذا المتجر، يجب إفراغ السلة الحالية.';
  static const cartConflictKeep = 'إبقاء السلة الحالية';
  static const cartConflictClear = 'إفراغ السلة والبدء من المتجر الجديد';
  static const addToCart = 'أضف إلى السلة';

  // الدفع وتأكيد الطلب
  static const checkoutTitle = 'إتمام الطلب';
  static const deliveryAddress = 'عنوان التوصيل';
  static const paymentMethod = 'طريقة الدفع';
  static const paymentCash = 'الدفع نقداً عند الاستلام';
  static const paymentCardOnDelivery = 'الدفع بالبطاقة عند الاستلام';
  static const paymentBankTransfer = 'تحويل بنكي';
  static const orderNotes = 'ملاحظات الطلب';
  static const placeOrder = 'تأكيد الطلب';
  static const placingOrder = 'جارٍ إرسال الطلب...';
  static const orderPlacedTitle = 'تم إرسال طلبك بنجاح';

  // OTP
  static const enterPhone = 'رقم الهاتف';
  static const sendOtp = 'إرسال رمز التحقق';
  static const enterOtp = 'أدخل رمز التحقق';
  static const resendOtp = 'إعادة إرسال الرمز';
  static const verify = 'تحقق';

  // حالات الطلب — القيم الحقيقية في قاعدة البيانات نصوص عربية جاهزة للعرض
  // مباشرة (انظر features/checkout/domain/order.dart::OrderStatus)، فلا حاجة
  // لدالة ترجمة هنا.
}
