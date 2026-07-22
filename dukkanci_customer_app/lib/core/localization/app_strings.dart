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
  static const searchHint = 'ابحث عن متجر أو منتج...';
  static const sectionProducts = 'المنتجات';
  static const searchStoresMatch = 'مطابق لبحثك';
  static const searchStoresInArea = 'ضمن منطقة التوصيل الحالية';
  static const searchProductsEmpty = 'لا توجد منتجات مطابقة';
  static const searchProductsEmptyHint = 'جرّب كلمة أخرى مثل اسم المنتج أو الصنف.';
  static const searchStoresEmpty = 'لا توجد متاجر مطابقة';
  static const searchProductsFailed = 'تعذّر تحميل المنتجات، تحقّق من الاتصال';
  // صيغ العدّ تطابق حرفياً ما يعرضه الموقع في نفس الحالة (result-summary).
  static String searchProductsCount(int count, {bool capped = false}) => '$count${capped ? '+' : ''} منتج';
  static String searchStoresCount(int count) => '$count متجر';
  static String searchResultsFor(String query) => 'نتائج البحث عن «$query»';
  static const voiceSearchListening = 'جارٍ الاستماع... تحدّث الآن';
  // Idle label for the mic button. Kept separate from the listening text
  // because the tooltip doubles as the screen-reader label: reusing
  // voiceSearchListening announced "جارٍ الاستماع" on a button that was not
  // in fact listening.
  static const voiceSearchStart = 'البحث الصوتي';
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
  // نموذج العنوان المهيكل (نفس حقول الموقع) + رابط خرائط Google
  static const addrSectionLocation = 'İl / İlçe / Mahalle';
  static const addrSectionRoad = 'Cadde / Sokak';
  static const addrSectionUnit = 'تفاصيل رقم الوحدة';
  static const addrSectionContact = 'معلومات التواصل';
  static const addrProvinceLabel = 'İl *';
  static const addrProvinceHint = 'İl seçin';
  static const addrDistrictLabel = 'İlçe *';
  static const addrDistrictHintDisabled = 'Önce İl seçin';
  static const addrDistrictHint = 'İlçe seçin';
  static const addrNeighborhoodLabel = 'Mahalle / Köy *';
  static const addrNeighborhoodHintDisabled = 'Önce İlçe seçin';
  static const addrNeighborhoodHint = 'Mahalle / Köy seçin';
  static const addrNeighborhoodManualOption = 'Listede yok — yazayım';
  static const addrNeighborhoodManualHint = 'Mahalle veya köy adını yazın';
  static const addrNeighborhoodManualNote = 'سيُراجَع هذا الاسم لاحقاً من فريق دكانجي لإضافته للقائمة الرسمية.';
  static const addrRoadNameHint = 'Cadde / Sokak Adı';
  static const addrSiteNameHint = 'Site Adı (اختياري)';
  static const addrBuildingNameHint = 'Bina / Apartman Adı (اختياري)';
  static const addrBlockHint = 'Blok (اختياري، مثال: B أو 4A)';
  static const addrExternalDoorHint = 'Dış Kapı No *';
  static const addrInternalDoorHint = 'İç Kapı No';
  static const addrNoInternalDoor = 'İç Kapı Numarası Yok';
  static const addrFloorHint = 'Kat';
  static const addrPostalCodeHint = 'Posta Kodu (اختياري)';
  static const addrNoteLabel = 'وصف إضافي للعنوان';
  static const addrNoteHint = 'Adres Tarifi — وصف إضافي يساعد المندوب على الوصول';
  static const addrMapHint = 'Lütfen konumu bina girişine yerleştirin';
  static const addrLocationReady = 'الموقع محدَّد على الخريطة';
  static const addrLocationMissing = 'يلزم تحديد الموقع على الخريطة لحساب التوصيل';
  // Validation — Turkish literals per the address spec (§14), the only
  // Turkish-language user-facing strings in an otherwise-Arabic app: they're
  // specific to this form, matching the spec's requested exact text.
  static const addrErrProvince = 'Lütfen il seçin.';
  static const addrErrDistrict = 'Lütfen ilçe seçin.';
  static const addrErrNeighborhood = 'Lütfen mahalle veya köy seçin.';
  static const addrErrRoad = 'Lütfen cadde veya sokak adını yazın.';
  static const addrErrExternalDoor = 'Lütfen dış kapı numarasını girin.';
  static const addrErrInternalDoor = 'Lütfen iç kapı numarasını girin veya numara olmadığını belirtin.';
  static const addrErrLocation = 'Lütfen bina girişini haritada işaretleyin.';

  // طلباتي
  static const reorderCta = 'اطلب مرة أخرى';

  // الدعم والمساعدة
  static const supportSearchHint = 'ابحث عن مساعدة...';
  static const supportWhatsappTitle = 'تواصل عبر واتساب';
  static const supportWhatsappSubtitle = 'أسرع طريقة للحصول على مساعدة';
  static const supportIssueTypesTitle = 'نوع المشكلة';

  // الإشعارات
  static const notificationsTitle = 'الإشعارات';
  static const notificationsEmptyTitle = 'لا توجد إشعارات بعد';
  static const notificationsEmptyBody = 'ستصلك هنا تحديثات طلباتك وأحدث العروض';
  static const notificationsMarkAllRead = 'تعليم الكل كمقروء';
  static const notificationsFailed = 'تعذّر تحميل الإشعارات، تحقّق من الاتصال';
  static const notificationsUnreadBadge = 'جديد';
  static const notificationsPrefTitle = 'تنبيهات الطلبات والعروض';
  static const notificationsPrefOn = 'مُفعَّلة — ستصلك تحديثات طلبك والعروض الجديدة';
  static const notificationsPrefOff = 'مُوقَفة — لن تصلك أي تنبيهات';

  /// وقت نسبي بالعربية بصيغ المفرد/المثنى/الجمع الصحيحة
  /// (دقيقة / دقيقتين / ٣-١٠ دقائق / ١١+ دقيقة) — العربية تميّز المثنى ولا
  /// تكتفي بمفرد وجمع كالإنجليزية، فصيغة «قبل 2 دقائق» تقرأ كترجمة آلية.
  ///
  /// الأرقام غربية عمداً، اتساقاً مع بقية التطبيق (الأسعار، عدّادات البحث،
  /// أرقام الطلبات) الذي لا يستخدم الأرقام الهندية في أي مكان.
  static String relativeTime(DateTime? at) {
    if (at == null) return '';
    final diff = DateTime.now().difference(at);
    // طابع زمني في المستقبل (انحراف ساعة الجهاز عن الخادم) يُعرض «الآن» بدل
    // «قبل -٣ دقائق».
    if (diff.isNegative || diff.inSeconds < 60) return 'الآن';
    if (diff.inMinutes < 60) {
      return _ago(diff.inMinutes, one: 'دقيقة', two: 'دقيقتين', few: 'دقائق', many: 'دقيقة');
    }
    if (diff.inHours < 24) {
      return _ago(diff.inHours, one: 'ساعة', two: 'ساعتين', few: 'ساعات', many: 'ساعة');
    }
    if (diff.inDays < 30) {
      return _ago(diff.inDays, one: 'يوم', two: 'يومين', few: 'أيام', many: 'يوماً');
    }
    final months = diff.inDays ~/ 30;
    if (months < 12) {
      return _ago(months, one: 'شهر', two: 'شهرين', few: 'أشهر', many: 'شهراً');
    }
    return _ago(diff.inDays ~/ 365, one: 'سنة', two: 'سنتين', few: 'سنوات', many: 'سنة');
  }

  static String _ago(int n, {required String one, required String two, required String few, required String many}) {
    if (n == 1) return 'قبل $one';
    if (n == 2) return 'قبل $two';
    if (n <= 10) return 'قبل $n $few';
    return 'قبل $n $many';
  }
}
