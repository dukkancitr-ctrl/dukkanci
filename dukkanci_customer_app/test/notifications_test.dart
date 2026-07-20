import 'package:flutter_test/flutter_test.dart';
import 'package:dukkanci_customer_app/core/localization/app_strings.dart';
import 'package:dukkanci_customer_app/features/notifications/domain/app_notification.dart';

/// اختبارات نقية (بلا شبكة ولا جهاز) للجزء الأخطر في طبقة الإشعارات:
/// تفسير حمولة الخادم، وتحويل `deep_link` إلى مسار، وصياغة الوقت النسبي.
///
/// السبب أن هذا تحديداً ما ينكسر في الإنتاج: للمشروع سابقة موثَّقة في README
/// لنموذج كُتب على مخطط **مُخمَّن** فأسقط الصفحة الرئيسية بالكامل عند أول
/// عمود نصّي وصل حيث كان يُتوقَّع رقم. الفحص الثابت لا يكشف ذلك أبداً.
void main() {
  group('AppNotification.tryParse — قراءة دفاعية', () {
    test('يقرأ صفاً سليماً بكل حقوله', () {
      final n = AppNotification.tryParse({
        'id': 12,
        'title': 'تم قبول طلبك',
        'body': 'المتجر بدأ بتجهيز طلبك',
        'image_url': '/assets/photos/x.jpg',
        'deep_link': '/order/DK-123',
        'kind': 'order',
        'read_at': null,
        'created_at': '2026-07-20T10:00:00Z',
      });

      expect(n, isNotNull);
      expect(n!.id, 12);
      expect(n.title, 'تم قبول طلبك');
      expect(n.kind, NotificationKind.order);
      expect(n.isRead, isFalse);
      // المسار النسبي يُحوَّل لرابط مطلق — بلا ذلك تفشل الصورة بصمت في تطبيق
      // جوال لا أصل له (نفس درس resolveAssetUrl).
      expect(n.imageUrl, 'https://www.dukkanci.com.tr/assets/photos/x.jpg');
    });

    test('لا يرمي على أنواع خاطئة: id نصّي، وحقول رقمية/منطقية مكان النص', () {
      final n = AppNotification.tryParse({
        'id': '7',
        'title': 99,
        'body': true,
        'kind': 'kind-غير-معروف',
        'created_at': 'ليس تاريخاً',
      });

      expect(n, isNotNull);
      expect(n!.id, 7);
      expect(n.title, '99');
      expect(n.body, 'true');
      // نوع غير معروف من بناء أحدث للخادم يسقط على system بدل أن يرمي.
      expect(n.kind, NotificationKind.system);
      expect(n.createdAt, isNull);
    });

    test('يُسقط الصفوف غير الصالحة بدل رمي استثناء', () {
      expect(AppNotification.tryParse(null), isNull);
      expect(AppNotification.tryParse('نص لا كائن'), isNull);
      expect(AppNotification.tryParse({'title': 'بلا معرّف'}), isNull);
      // بلا عنوان ولا نص = بطاقة فارغة، تُسقَط.
      expect(AppNotification.tryParse({'id': 3, 'title': '', 'body': ''}), isNull);
    });

    test('read_at يجعل الإشعار مقروءاً', () {
      final n = AppNotification.tryParse({
        'id': 1,
        'title': 'x',
        'read_at': '2026-07-20T10:00:00Z',
      });
      expect(n!.isRead, isTrue);
    });
  });

  group('NotificationInbox.fromResponse', () {
    test('صف واحد فاسد لا يُسقط بقية القائمة', () {
      final inbox = NotificationInbox.fromResponse({
        'ok': true,
        'items': [
          {'id': 1, 'title': 'أول'},
          'صف فاسد تماماً',
          {'no_id': true, 'title': 'بلا معرّف'},
          {'id': 2, 'title': 'ثانٍ'},
        ],
        'unread': 2,
      });

      expect(inbox.items.length, 2);
      expect(inbox.items.map((n) => n.id), [1, 2]);
      expect(inbox.unread, 2);
    });

    test('حمولة فارغة أو بشكل غير متوقَّع تُعيد صندوقاً فارغاً بلا رمي', () {
      expect(NotificationInbox.fromResponse(null).isEmpty, isTrue);
      expect(NotificationInbox.fromResponse('nope').isEmpty, isTrue);
      expect(NotificationInbox.fromResponse({'items': 'ليست قائمة'}).isEmpty, isTrue);
    });

    test('غياب unread يُشتقّ من المعروض بدل إظهار صفر كاذب', () {
      final inbox = NotificationInbox.fromResponse({
        'items': [
          {'id': 1, 'title': 'أ'},
          {'id': 2, 'title': 'ب', 'read_at': '2026-07-20T10:00:00Z'},
        ],
      });
      expect(inbox.unread, 1);
    });
  });

  group('resolveNotificationRoute', () {
    test('يحلّ المسارات المعروفة بالأشكال الثلاثة (مسار/رابط موقع/مخطط داخلي)', () {
      expect(resolveNotificationRoute('/store/pasa-pizzeria'), '/store/pasa-pizzeria');
      expect(resolveNotificationRoute('https://www.dukkanci.com.tr/store/pasa-pizzeria'), '/store/pasa-pizzeria');
      // في المخطط المخصَّص يقع أول جزء في host لا في path — تجاهله كان
      // سيُنتج مساراً ناقصاً.
      expect(resolveNotificationRoute('dukkanci://store/pasa-pizzeria'), '/store/pasa-pizzeria');
    });

    test('يحلّ الطلب والمنتج والتصنيف', () {
      expect(resolveNotificationRoute('/order/DK-4172774138'), '/order/DK-4172774138');
      expect(resolveNotificationRoute('/store/56/product/1910001'), '/store/56/product/1910001');
      expect(resolveNotificationRoute('/category/restaurants'), '/category/restaurants');
      // /offers صفحة حقيقية على الموقع، ويقابلها تصنيف اصطناعي في التطبيق.
      expect(resolveNotificationRoute('/offers'), '/category/offers');
    });

    test('يتجاهل معاملات الاستعلام والشرطة الأخيرة', () {
      expect(resolveNotificationRoute('/store/x?utm_source=wa'), '/store/x');
      expect(resolveNotificationRoute('/store/x#top'), '/store/x');
    });

    test('يُعيد null لأي وجهة غير معروفة بدل الرمي أو النقل لشاشة خطأ', () {
      expect(resolveNotificationRoute(null), isNull);
      expect(resolveNotificationRoute(''), isNull);
      expect(resolveNotificationRoute('/شيء-غير-موجود'), isNull);
      // مسار منتج بلا متجر لا يمكن حلّه: مسار المنتج في التطبيق يحتاج
      // المعرّفين معاً.
      expect(resolveNotificationRoute('/product/1910001'), isNull);
      expect(resolveNotificationRoute('/store'), isNull);
    });
  });

  group('AppStrings.relativeTime — صيغ المفرد/المثنى/الجمع العربية', () {
    String ago(Duration d) => AppStrings.relativeTime(DateTime.now().subtract(d));

    test('أقل من دقيقة = الآن', () {
      expect(ago(const Duration(seconds: 5)), 'الآن');
    });

    test('الدقائق: مفرد ومثنى وجمع قلة وجمع كثرة', () {
      expect(ago(const Duration(minutes: 1)), 'قبل دقيقة');
      expect(ago(const Duration(minutes: 2)), 'قبل دقيقتين');
      expect(ago(const Duration(minutes: 5)), 'قبل 5 دقائق');
      // من ١١ فصاعداً يعود التمييز مفرداً — «قبل 15 دقائق» خطأ نحوي شائع في
      // الترجمات الآلية.
      expect(ago(const Duration(minutes: 15)), 'قبل 15 دقيقة');
    });

    test('الساعات والأيام والشهور والسنوات', () {
      expect(ago(const Duration(hours: 1)), 'قبل ساعة');
      expect(ago(const Duration(hours: 2)), 'قبل ساعتين');
      expect(ago(const Duration(hours: 4)), 'قبل 4 ساعات');
      expect(ago(const Duration(days: 1)), 'قبل يوم');
      expect(ago(const Duration(days: 2)), 'قبل يومين');
      expect(ago(const Duration(days: 12)), 'قبل 12 يوماً');
      expect(ago(const Duration(days: 60)), 'قبل شهرين');
      expect(ago(const Duration(days: 400)), 'قبل سنة');
    });

    test('طابع زمني في المستقبل (انحراف ساعة الجهاز) يُعرض «الآن» لا رقماً سالباً', () {
      expect(AppStrings.relativeTime(DateTime.now().add(const Duration(hours: 3))), 'الآن');
    });

    test('null يُعيد نصاً فارغاً', () {
      expect(AppStrings.relativeTime(null), '');
    });
  });
}
