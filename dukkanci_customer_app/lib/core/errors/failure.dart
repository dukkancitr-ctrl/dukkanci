/// Uniform error type surfaced to the UI layer. Repositories catch
/// Dio/Supabase/platform exceptions and translate them into one of these so
/// screens never need to know which transport failed.
class Failure {
  final String message;
  final String? code;

  const Failure(this.message, {this.code});

  factory Failure.network() =>
      const Failure('تعذّر الاتصال بالخادم، تحقّق من الإنترنت', code: 'NETWORK_ERROR');

  factory Failure.timeout() => const Failure('انتهت مهلة الاتصال، حاول مرة أخرى', code: 'TIMEOUT');

  factory Failure.unauthorized() =>
      const Failure('انتهت صلاحية الجلسة، الرجاء تسجيل الدخول من جديد', code: 'UNAUTHORIZED');

  factory Failure.unknown([String? detail]) =>
      Failure(detail ?? 'حدث خطأ ما، حاول مرة أخرى', code: 'UNKNOWN');

  /// Maps the backend error codes documented in the spec
  /// (STORE_CLOSED, PRICE_CHANGED, MINIMUM_ORDER_NOT_REACHED, ...) to Arabic
  /// copy. Extend this as more server-side codes are wired up.
  factory Failure.fromCode(String code, {String? fallbackMessage}) {
    const map = {
      'STORE_CLOSED': 'المتجر مغلق حالياً',
      'PRODUCT_OUT_OF_STOCK': 'المنتج غير متوفر حالياً',
      'PRICE_CHANGED': 'تغيّر سعر أحد المنتجات، راجع السلة قبل المتابعة',
      'MINIMUM_ORDER_NOT_REACHED': 'لم تصل بعد إلى الحد الأدنى للطلب',
      'ADDRESS_OUTSIDE_DELIVERY_ZONE': 'عذراً، عنوانك خارج نطاق التوصيل لهذا المتجر',
      'INVALID_COUPON': 'كود الخصم غير صالح',
      'OTP_EXPIRED': 'انتهت صلاحية رمز التحقق، اطلب رمزاً جديداً',
      'ORDER_ALREADY_CREATED': 'تم إنشاء هذا الطلب بالفعل',
      'PAYMENT_FAILED': 'تعذّر إتمام عملية الدفع',
    };
    return Failure(map[code] ?? fallbackMessage ?? 'حدث خطأ ما', code: code);
  }

  @override
  String toString() => 'Failure(code: $code, message: $message)';
}
