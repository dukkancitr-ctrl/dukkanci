import '../../../core/routing/app_routes.dart';
import '../../../core/utils/asset_url.dart';

/// نوع الإشعار كما يرسله الخادم في الحقل `kind`.
///
/// أي قيمة غير معروفة (بناء أحدث من الخادم يضيف نوعاً جديداً) تسقط على
/// [system] بدل رمي استثناء — التطبيق المنشور يجب ألا ينكسر بسبب صنف لم يكن
/// موجوداً وقت بنائه.
enum NotificationKind {
  order,
  promo,
  system;

  static NotificationKind fromRaw(Object? raw) {
    switch (raw is String ? raw.trim().toLowerCase() : '') {
      case 'order':
        return NotificationKind.order;
      case 'promo':
        return NotificationKind.promo;
      default:
        return NotificationKind.system;
    }
  }
}

/// عنصر واحد في صندوق إشعارات العميل
/// (`POST /api/notifications?action=inbox` → `items[]`).
///
/// **كل حقل يُقرأ دفاعياً.** لهذا المشروع سابقة حقيقية موثَّقة في README:
/// النماذج الأولى كُتبت على مخطط قاعدة بيانات **مُخمَّن**، فكان عمود `time`
/// النصي («45 - 75 دقيقة») يُقرأ بـ`as num?` ويُسقط الصفحة الرئيسية بالكامل
/// باستثناء لم يظهر في أي سجل. لذلك: لا `as` مباشرة على أي حقل هنا، ولا صف
/// واحد فاسد يُسقط القائمة كلها — [tryParse] تُعيد `null` فيُتخطّى الصف وحده.
class AppNotification {
  const AppNotification({
    required this.id,
    this.title = '',
    this.body = '',
    this.imageUrl,
    this.deepLink = '',
    this.kind = NotificationKind.system,
    this.readAt,
    this.createdAt,
  });

  final int id;
  final String title;
  final String body;
  final String? imageUrl;
  final String deepLink;
  final NotificationKind kind;
  final DateTime? readAt;
  final DateTime? createdAt;

  bool get isRead => readAt != null;

  /// عنصر بلا عنوان ولا نص لا شيء يعرضه — يُسقَط بدل رسم بطاقة فارغة
  /// (نفس قاعدة `hasContent` في `AppBanner`).
  bool get hasContent => title.trim().isNotEmpty || body.trim().isNotEmpty;

  AppNotification markedRead(DateTime at) => AppNotification(
        id: id,
        title: title,
        body: body,
        imageUrl: imageUrl,
        deepLink: deepLink,
        kind: kind,
        readAt: readAt ?? at,
        createdAt: createdAt,
      );

  /// تُعيد `null` — ولا ترمي أبداً — لأي صف غير صالح (بلا معرّف، أو بلا أي
  /// محتوى معروض). المستدعي يتخطّاه ويكمل بقية القائمة.
  static AppNotification? tryParse(Object? raw) {
    if (raw is! Map) return null;
    final map = Map<String, dynamic>.from(raw);
    final id = _asInt(map['id']);
    if (id == null) return null;
    final item = AppNotification(
      id: id,
      title: _asString(map['title']),
      body: _asString(map['body']),
      imageUrl: resolveAssetUrl(_asString(map['image_url'])),
      deepLink: _asString(map['deep_link']),
      kind: NotificationKind.fromRaw(map['kind']),
      readAt: _asDate(map['read_at']),
      createdAt: _asDate(map['created_at']),
    );
    return item.hasContent ? item : null;
  }

  static int? _asInt(Object? v) {
    if (v is int) return v;
    if (v is num) return v.toInt();
    if (v is String) return int.tryParse(v.trim());
    return null;
  }

  /// أي شيء غير نصّي (رقم، bool، كائن) يُحوَّل لنص بدل أن يرمي — الحقل معروض
  /// للمستخدم، فقيمة غريبة تُعرض كما هي أفضل من شاشة خطأ.
  static String _asString(Object? v) {
    if (v == null) return '';
    if (v is String) return v.trim();
    return '$v';
  }

  static DateTime? _asDate(Object? v) {
    if (v is String) {
      final s = v.trim();
      if (s.isEmpty) return null;
      return DateTime.tryParse(s)?.toLocal();
    }
    // احتياط لطابع زمني رقمي: القيم الأصغر من ~2001 بالمللي ثانية تُقرأ
    // كثوانٍ (الاصطلاح الشائع في Unix epoch) لا كمللي ثانية.
    if (v is num) {
      final n = v.toInt();
      if (n <= 0) return null;
      return DateTime.fromMillisecondsSinceEpoch(n < 100000000000 ? n * 1000 : n).toLocal();
    }
    return null;
  }
}

/// نتيجة `action=inbox`: القائمة + عدّاد غير المقروء **كما يحسبه الخادم**.
///
/// [unread] ليس مشتقاً من [items] عمداً: القائمة محدودة بـ`limit` (٥٠
/// افتراضياً) بينما العدّاد يشمل كل ما لم يُقرأ، فاشتقاقه محلياً كان سيُظهر
/// رقماً أقل من الحقيقة على أي حساب تجاوز الحد.
class NotificationInbox {
  const NotificationInbox({this.items = const [], this.unread = 0});

  final List<AppNotification> items;
  final int unread;

  bool get isEmpty => items.isEmpty;

  /// تبني القائمة من حمولة الخادم متجاوزةً أي صف فاسد بصمت.
  static NotificationInbox fromResponse(Object? raw) {
    if (raw is! Map) return const NotificationInbox();
    final map = Map<String, dynamic>.from(raw);
    final rawItems = map['items'];
    final items = <AppNotification>[];
    if (rawItems is List) {
      for (final row in rawItems) {
        final parsed = AppNotification.tryParse(row);
        if (parsed != null) items.add(parsed);
      }
    }
    final unread = AppNotification._asInt(map['unread']);
    return NotificationInbox(
      items: items,
      // لو غاب العدّاد أو وصل بنوع غير متوقَّع، نشتقّه من المعروض فعلاً بدل
      // إظهار صفر كاذب فوق قائمة فيها إشعارات غير مقروءة.
      unread: unread ?? items.where((n) => !n.isRead).length,
    );
  }

  NotificationInbox copyWith({List<AppNotification>? items, int? unread}) =>
      NotificationInbox(items: items ?? this.items, unread: unread ?? this.unread);
}

/// تحوّل `deep_link` القادم من الخادم إلى مسار حقيقي داخل [AppRoutes].
///
/// تقبل ثلاثة أشكال: رابط الموقع الكامل
/// (`https://www.dukkanci.com.tr/store/x`)، ومخطط التطبيق الداخلي
/// (`dukkanci://store/x`)، ومساراً مجرداً (`/store/x`).
///
/// **تُعيد `null` لأي وجهة غير معروفة** — الشاشة عندها لا تفعل شيئاً بدل أن
/// ترمي استثناء أو تنقل المستخدم لصفحة خطأ: رابط من حملة أحدث من نسخة
/// التطبيق المثبَّتة يجب أن يكون بلا أثر، لا أن يُسقط الشاشة.
String? resolveNotificationRoute(String? deepLink) {
  var raw = (deepLink ?? '').trim();
  if (raw.isEmpty) return null;

  if (raw.contains('://')) {
    final uri = Uri.tryParse(raw);
    if (uri == null) return null;
    // في مخطط مخصَّص مثل `dukkanci://store/123` يقع الجزء الأول في `host`
    // لا في `path` — تجاهله يفقد اسم المسار بالكامل.
    raw = (uri.scheme == 'http' || uri.scheme == 'https') ? uri.path : '/${uri.host}${uri.path}';
  }

  raw = raw.split('?').first.split('#').first;
  final segments = raw.split('/').where((s) => s.isNotEmpty).toList();
  if (segments.isEmpty) return AppRoutes.home;

  switch (segments.first) {
    case 'store':
      if (segments.length == 2) return AppRoutes.storeDetailPath(segments[1]);
      if (segments.length == 4 && segments[2] == 'product') {
        return AppRoutes.productDetailPath(segments[1], segments[3]);
      }
      return null;
    case 'order':
      return segments.length == 2 ? AppRoutes.orderDetailPath(segments[1]) : null;
    case 'category':
      return segments.length == 2 ? AppRoutes.categoryPath(segments[1]) : null;
    // `/offers` صفحة حقيقية على الموقع، ويقابلها في التطبيق تصنيف اصطناعي
    // بنفس المفتاح (انظر CategoryScreen).
    case 'offers':
      return AppRoutes.categoryPath('offers');
    case 'home':
      return AppRoutes.home;
    case 'search':
      return AppRoutes.search;
    case 'orders':
      return AppRoutes.orders;
    case 'favorites':
      return AppRoutes.favorites;
    case 'profile':
      return AppRoutes.profile;
    case 'cart':
      return AppRoutes.cart;
    case 'support':
      return AppRoutes.support;
    case 'addresses':
      return AppRoutes.addresses;
    default:
      // وجهة غير معروفة (رابط منتج غير مرتبط بمتجر مثلاً — مسار المنتج في
      // التطبيق يحتاج المعرّفين معاً فلا يمكن حلّه) → لا شيء.
      return null;
  }
}
