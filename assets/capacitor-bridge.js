/**
 * جسر التطبيق الأصلي (Capacitor) — دكانجي
 * لا يفعل شيئاً في المتصفح العادي أو داخل PWA. يعمل فقط عندما يشغّل الموقع
 * داخل تطبيق Android/iOS المبني بواسطة Capacitor (يوجد window.Capacitor.isNativePlatform()).
 */
(function () {
  "use strict";

  var Capacitor = window.Capacitor;
  if (!Capacitor || typeof Capacitor.isNativePlatform !== "function" || !Capacitor.isNativePlatform()) {
    return;
  }

  var Plugins = Capacitor.Plugins || {};
  var App = Plugins.App;
  var StatusBar = Plugins.StatusBar;
  var SplashScreen = Plugins.SplashScreen;
  var PushNotifications = Plugins.PushNotifications;

  // لون شريط الحالة يطابق هوية دكانجي
  if (StatusBar) {
    try {
      StatusBar.setBackgroundColor({ color: "#fff9f5" });
      StatusBar.setStyle({ style: "DARK" }); // أيقونات داكنة تناسب الخلفية الفاتحة
    } catch (e) {}
  }

  // إخفاء شاشة البداية بعد اكتمال تحميل الواجهة
  if (SplashScreen) {
    window.addEventListener("load", function () {
      setTimeout(function () {
        try { SplashScreen.hide(); } catch (e) {}
      }, 250);
    });
  }

  // زر الرجوع في Android: يرجع خطوة داخل التطبيق، ويغلق التطبيق فقط من الشاشة الرئيسية
  if (App) {
    App.addListener("backButton", function () {
      var hash = window.location.hash || "";
      var atRoot = hash === "" || hash === "#" || hash === "#home";
      if (!atRoot && window.history.length > 1) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });
  }

  // تسجيل جهاز الإشعارات (الجزء الخاص بالخادم/الشهادات غير مفعّل بعد — راجع دليل التطبيق)
  if (PushNotifications && PushNotifications.requestPermissions) {
    PushNotifications.requestPermissions()
      .then(function (res) {
        if (res && res.receive === "granted") {
          PushNotifications.register();
        }
      })
      .catch(function () {});
  }
})();
