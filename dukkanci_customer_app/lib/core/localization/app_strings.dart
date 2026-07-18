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

  // الصفحة الرئيسية
  static const homeSearchHint = 'ابحث عن متجر أو منتج...';
  static const seeAll = 'عرض الكل';
  static const setLocation = 'حدّد موقعك';
  static const heroWelcomeTitle = 'كل ما تحتاجه يوصلك';
  static const heroWelcomeBody = 'مطاعم وأسواق ومحلات منطقتك في تطبيق واحد';
  static const heroWelcomeCta = 'تصفّح المتاجر';
  static const orderNow = 'اطلب الآن';
  static const offerLabel = 'عرض';
  static const sectionCategories = 'تصفّح حسب القسم';
  static const railOffers = 'عروض وخصومات';
  static const railPopular = 'الأكثر رواجاً';
  static const allStores = 'كل المتاجر';

  // البحث
  static const searchRecentTitle = 'عمليات بحث سابقة';
  static const searchClearAll = 'مسح الكل';
  static const voiceSearchListening = 'جارٍ الاستماع... تحدّث الآن';
  static const voiceSearchUnavailable = 'البحث الصوتي غير متاح على هذا الجهاز';
  static const voiceSearchNoPermission = 'يحتاج البحث الصوتي إذن الوصول إلى الميكروفون';
  static const voiceSearchNoSpeechDetected = 'لم يُسمع أي كلام، حاول مرة أخرى';

  // شاشة البداية — «Dukkanci Marketplace» وسم علامة تجارية ثابت على هذه
  // الشاشة فقط (يطابق تصميم الشعار المُعتمَد)، وليس جزءاً من سطح الترجمة —
  // بقية التطبيق يبقى عربياً بالكامل بلا استثناء.
  static const splashBrandLatin = 'Dukkanci Marketplace';
  static const splashTagline = 'كل متاجر الحي في مكان واحد';

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
  static const storeMenuSearchHint = 'ابحث في القائمة...';
  static const productUnavailable = 'غير متوفر';
  static const featuredBadge = 'مميز';
  static const priceOnRequestLabel = 'السعر عند الطلب';
  static const viewCart = 'عرض السلة';
  static const perKm = '/كم';
  static const workingHours = 'ساعات العمل';
  static const storeUnavailable = 'هذا المتجر غير متاح';

  // تفاصيل المنتج
  static const productDetailsTitle = 'تفاصيل المنتج';
  static const requiredBadge = 'مطلوب';
  static const optionalBadge = 'اختياري';
  static const chooseOneOnly = 'اختر خياراً واحداً';
  static const addonsSectionTitle = 'إضافات';
  static const addonsSectionSubtitle = 'يمكنك إضافة أكثر من عنصر';
  static const freeLabel = 'مجاناً';
  static const productNoteLabel = 'ملاحظات على المنتج';
  static const productNoteHint = 'أخبرنا إن كان لديك طلب خاص (اختياري)';
  static const productUnavailableNotice = 'هذا المنتج غير متوفر حالياً';

  // السلة
  static const cartTitle = 'السلة';
  static const cartEmpty = 'سلتك فارغة';
  static const cartConflictTitle = 'تحتوي سلتك على منتجات من متجر آخر';
  static const cartConflictBody =
      'لبدء طلب جديد من هذا المتجر، يجب إفراغ السلة الحالية.';
  static const cartConflictKeep = 'إبقاء السلة الحالية';
  static const cartConflictClear = 'إفراغ السلة والبدء من المتجر الجديد';
  static const addToCart = 'أضف إلى السلة';
  static const cartAddMoreSubtitle = 'استكشف باقي القائمة';
  static const cartSubtotal = 'المجموع الفرعي';
  static const cartDeliveryNote = 'رسوم التوصيل تُحدَّد حسب عنوانك عند إتمام الطلب';
  static const cartTotal = 'الإجمالي';

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
  static const checkoutStepMenu = 'القائمة';
  static const checkoutStepCart = 'السلة';
  static const checkoutStepPayment = 'الدفع';
  static const addressDetailsLabel = 'تفاصيل إضافية (اختياري)';
  static const addressDetailsHint = 'الدور، رقم الشقة، معلم قريب...';
  static const leaveAtDoorLabel = 'اترك الطلب عند الباب';
  static const leaveAtDoorNote = 'سيُبلَّغ المندوب بعدم الحاجة لمقابلتك';
  static const checkoutDeliveryFeeNote = 'يتواصل معك المتجر عبر واتساب لتأكيد رسوم التوصيل';
  static const checkoutSubtotal = 'المجموع الفرعي';

  // OTP
  static const enterPhone = 'رقم الهاتف';
  static const sendOtp = 'إرسال رمز التحقق';
  static const enterOtp = 'أدخل رمز التحقق';
  static const resendOtp = 'إعادة إرسال الرمز';
  static const verify = 'تحقق';

  // حالات الطلب — القيم الحقيقية في قاعدة البيانات نصوص عربية جاهزة للعرض
  // مباشرة (انظر features/checkout/domain/order.dart::OrderStatus)، فلا حاجة
  // لدالة ترجمة هنا.

  // المفضلة
  static const favoritesEmpty = 'لم تُضِف أي متجر إلى المفضلة بعد';
  static const favoritesFilterAll = 'الكل';

  // حسابي
  static const profileGuestName = 'زائر';
  static const profileGuestBody = 'سجّل الدخول لحفظ عناوينك وطلباتك';
  static const profileLogin = 'دخول';
  static const myAddresses = 'عناويني';
  static const moreSection = 'المزيد';
  static const supportAndHelp = 'الدعم والمساعدة';
  static const termsAndConditions = 'الشروط والأحكام';
  static const privacyPolicy = 'سياسة الخصوصية';
  static const aboutApp = 'عن التطبيق';
  static const logout = 'تسجيل الخروج';
  static const deleteAccount = 'حذف الحساب';
  static const appVersionPrefix = 'الإصدار';

  // عناويني
  static const addressesEmptyTitle = 'لا توجد عناوين محفوظة';
  static const addressesEmptyBody = 'أضف عنواناً لتسريع عملية الطلب لاحقاً';
  static const addressAddNew = 'إضافة عنوان جديد';
  static const addressEdit = 'تعديل';
  static const addressDelete = 'حذف';
  static const addressSetDefault = 'تعيين كافتراضي';
  static const addressDefaultBadge = 'افتراضي';
  static const addressDeleteConfirmTitle = 'حذف هذا العنوان؟';
  static const addressDeleteConfirmBody = 'لن تتمكن من التراجع عن هذا الإجراء.';
  static const addressFormTitleAdd = 'عنوان جديد';
  static const addressFormTitleEdit = 'تعديل العنوان';
  static const addressLabelFieldTitle = 'اسم العنوان';
  static const addressLabelHome = 'المنزل';
  static const addressLabelWork = 'العمل';
  static const addressLabelOther = 'آخر';
  static const addressLabelCustomHint = 'اسم مخصص (اختياري)';
  static const addressTextLabel = 'العنوان بالتفصيل';
  static const recipientNameLabel = 'اسم المستلم';
  static const addressValidationError = 'يرجى إدخال العنوان بالتفصيل';
  static const useSavedAddress = 'استخدام عنوان محفوظ';
  static const savedAddressSheetTitle = 'اختر عنوان التوصيل';
  static const manageAddresses = 'إدارة العناوين';

  // طلباتي
  static const reorderCta = 'اطلب مرة أخرى';

  // الدعم والمساعدة
  static const supportSearchHint = 'ابحث عن مساعدة...';
  static const supportWhatsappTitle = 'تواصل عبر واتساب';
  static const supportWhatsappSubtitle = 'أسرع طريقة للحصول على مساعدة';
  static const supportIssueTypesTitle = 'نوع المشكلة';
}
