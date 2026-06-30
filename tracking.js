// ============================================================
//  Dukkanci — Tracking & Consent layer (Phase 1)
//  ----------------------------------------------------------
//  مسؤوليات هذا الموديول:
//   • كوكيز first-party (dukkanci_uid, consent, UTM, cart_id…)
//   • بانر الموافقة (عربي) + لوحة التخصيص + إعادة الفتح من الـFooter
//   • Google Consent Mode (default denied → update عند الموافقة)
//   • التقاط مصدر الزيارة (UTM / fbclid / gclid / ttclid) — First & Last touch
//   • dataLayer موحّد + توليد event_id + التخزين الداخلي عبر /api/track
//
//  يُحمَّل قبل integrations.js. الأخير لا يحقن أي بكسل قبل الموافقة المناسبة
//  (يقرأ DUKKANCI_TRACKING.hasConsent(...)). كل المفاتيح السرّية تبقى في السيرفر.
//  ⚠️ لا نخزّن في الكوكيز أي بيانات شخصية (هاتف/إيميل/اسم/عنوان/توكنات).
// ============================================================
(function () {
  "use strict";

  var CONSENT_VERSION = "2026-01";
  var CURRENCY = "TRY";
  var API_ENDPOINT = "/api/track";

  // أسماء الكوكيز
  var C = {
    uid: "dukkanci_uid",
    consent: "dukkanci_consent",
    consentVer: "dukkanci_consent_version",
    firstSrc: "dukkanci_first_source",
    lastSrc: "dukkanci_last_source",
    campaign: "dukkanci_campaign",
    storeRef: "dukkanci_store_ref",
    affiliate: "dukkanci_affiliate_ref",
    cartId: "dukkanci_cart_id",
    lang: "dukkanci_lang",
    city: "dukkanci_city",
    fbc: "dukkanci_fbc"
  };

  // أحداث تشغيل المنصة: تُخزَّن دائماً (ضرورية) حتى دون موافقة تحليلات.
  // باقي الأحداث تحليلية → تُخزَّن فقط عند موافقة التحليلات (تُطبَّق في السيرفر).
  var NECESSARY_EVENTS = { purchase: 1, begin_checkout: 1, add_to_cart: 1, submit_phone: 1 };

  // اسم الحدث الداخلي/GA4 لكل اسم وارد (يقبل أسماء Meta القديمة من app.js).
  var GA4_NAME = {
    ViewContent: "view_item", AddToCart: "add_to_cart",
    InitiateCheckout: "begin_checkout", Purchase: "purchase",
    view_item: "view_item", add_to_cart: "add_to_cart",
    begin_checkout: "begin_checkout", purchase: "purchase",
    view_store: "view_store", view_home: "view_home", page_view: "page_view",
    search: "search", whatsapp_click: "whatsapp_click", submit_phone: "submit_phone",
    view_cart: "view_cart", remove_from_cart: "remove_from_cart",
    login: "login", sign_up: "sign_up", select_store_category: "select_store_category"
  };

  // اسم حدث Meta المطابق (لتمريره لطبقة البكسل في integrations.js). فقط ما يهم Meta.
  var META_NAME = {
    ViewContent: "ViewContent", view_item: "ViewContent",
    AddToCart: "AddToCart", add_to_cart: "AddToCart",
    InitiateCheckout: "InitiateCheckout", begin_checkout: "InitiateCheckout",
    Purchase: "Purchase", purchase: "Purchase",
    view_store: "ViewContent",
    whatsapp_click: "Contact", submit_phone: "Lead"
  };

  // ---------- أدوات الكوكيز (first-party, Secure, SameSite=Lax) ----------
  function cookieDomain() {
    try {
      var h = location.hostname || "";
      if (/dukkanci\.com\.tr$/i.test(h)) return "; domain=.dukkanci.com.tr";
    } catch (e) {}
    return ""; // localhost / preview: لا نضبط domain
  }
  function setCookie(name, value, days) {
    try {
      var exp = "";
      if (days) { var d = new Date(); d.setTime(d.getTime() + days * 864e5); exp = "; expires=" + d.toUTCString(); }
      var secure = location.protocol === "https:" ? "; Secure" : "";
      document.cookie = name + "=" + encodeURIComponent(value) + exp + "; path=/" + cookieDomain() + "; SameSite=Lax" + secure;
    } catch (e) {}
  }
  function getCookie(name) {
    try {
      var m = document.cookie.match("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)");
      return m ? decodeURIComponent(m[1]) : null;
    } catch (e) { return null; }
  }

  function uuid() {
    try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0, v = c === "x" ? r : (r & 0x3) | 0x8; return v.toString(16);
    });
  }

  function deviceType() {
    var ua = navigator.userAgent || "";
    if (/Tablet|iPad/i.test(ua)) return "tablet";
    if (/Mobi|Android|iPhone|iPod/i.test(ua)) return "mobile";
    return "desktop";
  }
  function pageLang() {
    return (document.documentElement.lang || "ar").slice(0, 2);
  }

  // ---------- معرّف الزائر المجهول ----------
  function ensureUid() {
    var u = getCookie(C.uid);
    if (!u) { try { u = localStorage.getItem(C.uid); } catch (e) {} }
    if (!u) u = uuid();
    setCookie(C.uid, u, 180);
    try { localStorage.setItem(C.uid, u); } catch (e) {}
    return u;
  }

  // ---------- حالة الموافقة ----------
  function defaultConsent() {
    return { version: CONSENT_VERSION, necessary: true, functional: false, analytics: false, marketing: false, timestamp: null, source: null };
  }
  function readConsent() {
    var raw = getCookie(C.consent);
    if (!raw) return null;
    try {
      var c = JSON.parse(raw);
      if (!c || c.version !== CONSENT_VERSION) return null; // نسخة قديمة → نعيد السؤال
      c.necessary = true;
      return c;
    } catch (e) { return null; }
  }
  function writeConsent(c) {
    c.version = CONSENT_VERSION; c.necessary = true;
    setCookie(C.consent, JSON.stringify(c), 180);
    setCookie(C.consentVer, CONSENT_VERSION, 180);
  }

  // ---------- Google Consent Mode + TikTok consent ----------
  function applyConsentMode(c) {
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: c.analytics ? "granted" : "denied",
        ad_storage: c.marketing ? "granted" : "denied",
        ad_user_data: c.marketing ? "granted" : "denied",
        ad_personalization: c.marketing ? "granted" : "denied"
      });
    }
    // TikTok pixel (fired by the GTM container): release its held events/cookies
    // and its deferred network script only when marketing is granted.
    try {
      if (c.marketing) {
        if (window.__dkReleaseTikTok) window.__dkReleaseTikTok();
        if (window.ttq && window.ttq.grantConsent) window.ttq.grantConsent();
      } else if (window.ttq && window.ttq.revokeConsent) {
        window.ttq.revokeConsent();
      }
    } catch (e) {}
  }

  // ---------- التقاط مصدر الزيارة (Attribution) ----------
  function captureAttribution() {
    var qs;
    try { qs = new URLSearchParams(location.search); } catch (e) { return; }
    var get = function (k) { var v = qs.get(k); return v ? String(v).slice(0, 200) : ""; };
    var camp = {
      utm_source: get("utm_source"), utm_medium: get("utm_medium"),
      utm_campaign: get("utm_campaign"), utm_content: get("utm_content"), utm_term: get("utm_term"),
      fbclid: get("fbclid"), gclid: get("gclid"), ttclid: get("ttclid"),
      landing_page: (location.pathname || "/").slice(0, 300),
      last_seen_at: new Date().toISOString()
    };
    var source = camp.utm_source || (camp.fbclid ? "facebook" : camp.gclid ? "google" : camp.ttclid ? "tiktok" : "");
    var hasCampaign = source || camp.utm_campaign || camp.fbclid || camp.gclid || camp.ttclid;

    // First touch (90 يوم) — يُكتب مرة واحدة
    if (!getCookie(C.firstSrc) && (hasCampaign || document.referrer)) {
      setCookie(C.firstSrc, source || referrerHost() || "direct", 90);
    }
    // Last touch (30 يوم) + كائن الحملة + store_ref/affiliate
    if (hasCampaign) {
      setCookie(C.lastSrc, source || "referral", 30);
      setCookie(C.campaign, JSON.stringify(camp), 30);
    } else if (!getCookie(C.lastSrc) && document.referrer) {
      setCookie(C.lastSrc, referrerHost() || "direct", 30);
    }
    var sref = get("store_ref"); if (sref) setCookie(C.storeRef, sref, 30);
    var aref = get("affiliate_ref") || get("aff"); if (aref) setCookie(C.affiliate, aref, 30);

    // fbclid → fbc (لاستخدام Conversions API لاحقاً)
    if (camp.fbclid && !getCookie(C.fbc)) {
      setCookie(C.fbc, "fb.1." + Date.now() + "." + camp.fbclid, 90);
    }
  }
  function referrerHost() {
    try { if (!document.referrer) return ""; var u = new URL(document.referrer); if (u.hostname === location.hostname) return ""; return u.hostname; } catch (e) { return ""; }
  }

  function getAttribution() {
    var camp = null; try { camp = JSON.parse(getCookie(C.campaign) || "null"); } catch (e) {}
    return {
      dukkanci_uid: T.uid,
      first_source: getCookie(C.firstSrc) || null,
      last_source: getCookie(C.lastSrc) || null,
      store_ref: getCookie(C.storeRef) || null,
      affiliate_ref: getCookie(C.affiliate) || null,
      campaign: camp,
      landing_page: camp && camp.landing_page || null
    };
  }
  function trafficSource() {
    var camp = null; try { camp = JSON.parse(getCookie(C.campaign) || "null"); } catch (e) {}
    return {
      first_source: getCookie(C.firstSrc) || null,
      last_source: getCookie(C.lastSrc) || null,
      utm_source: camp && camp.utm_source || null,
      utm_medium: camp && camp.utm_medium || null,
      utm_campaign: camp && camp.utm_campaign || null,
      utm_content: camp && camp.utm_content || null
    };
  }

  // ---------- cart_id ----------
  function cartId() {
    var id = getCookie(C.cartId);
    if (!id) { id = "cart_" + uuid().slice(0, 12); setCookie(C.cartId, id, 30); }
    return id;
  }
  function clearCartId() { setCookie(C.cartId, "", -1); }

  // ---------- إرسال الحدث للتخزين الداخلي ----------
  function sendToApi(ga4Name, eventId, d) {
    try {
      var body = {
        type: "event",
        event_id: eventId,
        event_name: ga4Name,
        dukkanci_uid: T.uid,
        customer_id: d.customer_id || null,
        store_id: d.store_id != null ? d.store_id : null,
        product_id: d.product_id != null ? d.product_id : null,
        cart_id: d.cart_id || null,
        order_id: d.orderId || d.order_id || null,
        value: d.value != null ? d.value : null,
        currency: CURRENCY,
        content_ids: d.ids || (d.product_id != null ? [d.product_id] : null),
        num_items: d.count != null ? d.count : null,
        // Ad-platform match signals (server forwards to CAPI / Events API; not stored in cookies)
        fbp: getCookie("_fbp") || null,
        fbc: getCookie("_fbc") || getCookie(C.fbc) || null,
        ttclid: (function () { try { return (JSON.parse(getCookie(C.campaign) || "null") || {}).ttclid || null; } catch (e) { return null; } })(),
        phone: d.phone || null,
        page_url: location.href.slice(0, 500),
        referrer: (document.referrer || "").slice(0, 300),
        language: pageLang(),
        device_type: deviceType(),
        traffic: trafficSource(),
        necessary: !!NECESSARY_EVENTS[ga4Name],
        consent: { analytics: !!T.consent.analytics, marketing: !!T.consent.marketing }
      };
      var json = JSON.stringify(body);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(API_ENDPOINT, new Blob([json], { type: "application/json" }));
      } else {
        fetch(API_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: json, keepalive: true }).catch(function () {});
      }
    } catch (e) {}
  }

  // ---------- dataLayer موحّد ----------
  function pushDataLayer(ga4Name, eventId, d) {
    window.dataLayer = window.dataLayer || [];
    var items = d.items;
    if (!items && d.ids) items = (d.ids || []).map(function (id) { return { item_id: String(id), price: d.value, quantity: 1 }; });
    window.dataLayer.push({
      event: ga4Name,
      event_id: eventId,
      dukkanci_uid: T.uid,
      store_id: d.store_id != null ? String(d.store_id) : undefined,
      store_slug: d.store_slug,
      store_name: d.store_name,
      currency: CURRENCY,
      value: d.value,
      transaction_id: d.orderId || d.order_id,
      search_term: d.search_term,
      items: items,
      content_ids: d.ids,
      traffic_source: trafficSource(),
      page_language: pageLang(),
      city: getCookie(C.city) || undefined
    });
  }

  // ---------- واجهة التتبع العامة ----------
  var lastViewKey = null;
  var lastPath = null;

  var T = {
    version: CONSENT_VERSION,
    uid: null,
    consent: defaultConsent(),

    hasConsent: function (cat) {
      if (cat === "necessary") return true;
      return !!(this.consent && this.consent[cat]);
    },

    // حدث عام: يولّد event_id، يدفع للـdataLayer، يخزّن داخلياً، ويمرّر للبكسل (مشروطاً بالموافقة داخل integrations).
    track: function (name, data) {
      data = data || {};
      var eventId = data.eventId || uuid();
      var ga4Name = GA4_NAME[name] || name;
      // attach cart_id لأحداث السلة تلقائياً
      if (!data.cart_id && (ga4Name === "add_to_cart" || ga4Name === "begin_checkout" || ga4Name === "view_cart" || ga4Name === "remove_from_cart" || ga4Name === "purchase")) {
        data.cart_id = cartId();
      }
      pushDataLayer(ga4Name, eventId, data);
      sendToApi(ga4Name, eventId, data);
      var metaName = META_NAME[name];
      if (metaName && window.DUKKANCI_INTEGRATIONS) {
        var dd = {}; for (var k in data) dd[k] = data[k]; dd.eventId = eventId;
        try { window.DUKKANCI_INTEGRATIONS.track(metaName, dd); } catch (e) {}
      }
      if (ga4Name === "purchase") clearCartId();
      return eventId;
    },

    // أحداث المشاهدة (view_store/view_item) — تتجاهل إعادة الرسم المتكررة لنفس العنصر.
    trackView: function (key, name, data) {
      if (lastViewKey === key) return;
      lastViewKey = key;
      return this.track(name, data);
    },

    pageView: function () {
      var path = location.pathname + location.search;
      if (lastPath === path) return;
      lastPath = path;
      var ga4Name = (location.pathname === "/" || location.pathname === "") ? "view_home" : "page_view";
      this.track(ga4Name, {});
    },

    getAttribution: getAttribution,
    getCartId: cartId,

    // فتح لوحة إعدادات الكوكيز يدوياً (من الـFooter)
    openConsent: function () { Banner.openSettings(); },

    // يُستدعى من البانر بعد حفظ الاختيار
    _applyConsent: function (c, source) {
      c.source = source || "cookie_banner";
      c.timestamp = new Date().toISOString();
      this.consent = c;
      writeConsent(c);
      applyConsentMode(c);
      // سجّل الموافقة في قاعدة البيانات
      try {
        var body = JSON.stringify({ type: "consent", dukkanci_uid: this.uid, consent_version: CONSENT_VERSION, necessary: true, functional: !!c.functional, analytics: !!c.analytics, marketing: !!c.marketing, source: c.source });
        if (navigator.sendBeacon) navigator.sendBeacon(API_ENDPOINT, new Blob([body], { type: "application/json" }));
        else fetch(API_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: body, keepalive: true }).catch(function () {});
      } catch (e) {}
      // أعد محاولة حقن البكسلات المسموح بها الآن
      try { if (window.DUKKANCI_INTEGRATIONS && window.DUKKANCI_INTEGRATIONS.applyConsent) window.DUKKANCI_INTEGRATIONS.applyConsent(); } catch (e) {}
    }
  };

  // ============================================================
  //  بانر الموافقة (عربي) — i18n.ar (بنية جاهزة لإضافة tr/en لاحقاً)
  // ============================================================
  var i18n = {
    ar: {
      title: "نحترم خصوصيتك 🍪",
      body: "نستخدم الكوكيز لتشغيل الموقع وتذكّر تفضيلاتك، ولقياس الأداء وتحسين التسويق. يمكنك قبول الكل أو رفض غير الضروري أو تخصيص اختيارك.",
      acceptAll: "قبول الكل",
      rejectAll: "رفض غير الضروري",
      customize: "تخصيص",
      save: "حفظ اختياري",
      privacy: "سياسة الخصوصية",
      cookies: "سياسة الكوكيز",
      settingsTitle: "إعدادات الكوكيز",
      catNecessary: "ضرورية",
      catNecessaryDesc: "لازمة لتشغيل الموقع والسلة والطلب — تعمل دائماً.",
      catFunctional: "وظيفية",
      catFunctionalDesc: "تحفظ اللغة والمدينة وتفضيلات العرض.",
      catAnalytics: "تحليلات",
      catAnalyticsDesc: "تساعدنا على فهم استخدام الموقع وتحسينه (Google Analytics).",
      catMarketing: "تسويق",
      catMarketingDesc: "لقياس الإعلانات وإعادة الاستهداف (Meta / Google / TikTok).",
      always: "تعمل دائماً"
    }
  };

  var Banner = {
    el: null,
    t: function (k) { return (i18n.ar && i18n.ar[k]) || k; },

    injectStyles: function () {
      if (document.getElementById("dk-consent-styles")) return;
      var css = document.createElement("style");
      css.id = "dk-consent-styles";
      css.textContent =
        "#dk-consent{position:fixed;inset:auto 0 0 0;z-index:99999;background:#fff;color:#1a1a1a;" +
        "box-shadow:0 -8px 30px rgba(0,0,0,.18);border-top:3px solid #e30613;direction:rtl;font-family:inherit;" +
        "padding:18px clamp(14px,4vw,40px);animation:dkUp .3s ease}" +
        "@keyframes dkUp{from{transform:translateY(100%)}to{transform:translateY(0)}}" +
        "#dk-consent .dk-wrap{max-width:1100px;margin:0 auto;display:flex;gap:18px;flex-wrap:wrap;align-items:center;justify-content:space-between}" +
        "#dk-consent h3{margin:0 0 6px;font-size:1.05rem;font-weight:700}" +
        "#dk-consent p{margin:0;font-size:.9rem;line-height:1.7;color:#444;max-width:640px}" +
        "#dk-consent a{color:#e30613;text-decoration:underline}" +
        "#dk-consent .dk-actions{display:flex;gap:10px;flex-wrap:wrap}" +
        "#dk-consent button{font:inherit;font-weight:700;border-radius:12px;padding:11px 18px;cursor:pointer;border:1px solid transparent}" +
        "#dk-consent .dk-accept{background:#e30613;color:#fff}" +
        "#dk-consent .dk-reject{background:#f3f3f3;color:#222}" +
        "#dk-consent .dk-custom{background:#fff;color:#222;border-color:#ddd}" +
        "#dk-consent .dk-panel{flex-basis:100%;margin-top:14px;border-top:1px solid #eee;padding-top:14px;display:none}" +
        "#dk-consent.dk-open .dk-panel{display:block}" +
        "#dk-consent .dk-row{display:flex;gap:12px;align-items:flex-start;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f3f3f3}" +
        "#dk-consent .dk-row small{display:block;color:#666;font-size:.82rem;margin-top:3px;max-width:560px}" +
        "#dk-consent .dk-row b{font-size:.95rem}" +
        "#dk-consent .dk-switch{position:relative;width:46px;height:26px;flex:0 0 auto}" +
        "#dk-consent .dk-switch input{opacity:0;width:0;height:0}" +
        "#dk-consent .dk-slider{position:absolute;inset:0;background:#ccc;border-radius:26px;transition:.2s;cursor:pointer}" +
        "#dk-consent .dk-slider:before{content:'';position:absolute;height:20px;width:20px;right:3px;top:3px;background:#fff;border-radius:50%;transition:.2s}" +
        "#dk-consent input:checked+.dk-slider{background:#2e7d32}" +
        "#dk-consent input:checked+.dk-slider:before{transform:translateX(-20px)}" +
        "#dk-consent input:disabled+.dk-slider{background:#9cc79e;cursor:not-allowed}" +
        "#dk-consent .dk-tag{font-size:.72rem;color:#2e7d32;font-weight:700}" +
        "@media(max-width:640px){#dk-consent .dk-actions{width:100%}#dk-consent .dk-actions button{flex:1}}";
      document.head.appendChild(css);
    },

    rowHtml: function (cat, on, locked) {
      var titleKey = "cat" + cat.charAt(0).toUpperCase() + cat.slice(1);
      return '<div class="dk-row"><div><b>' + this.t(titleKey) + '</b><small>' + this.t(titleKey + "Desc") + "</small></div>" +
        (locked
          ? '<span class="dk-tag">' + this.t("always") + "</span>"
          : '<label class="dk-switch"><input type="checkbox" data-cat="' + cat + '"' + (on ? " checked" : "") + '><span class="dk-slider"></span></label>') +
        "</div>";
    },

    render: function (existing) {
      this.injectStyles();
      var c = existing || defaultConsent();
      var wrap = document.createElement("div");
      wrap.id = "dk-consent";
      wrap.setAttribute("role", "dialog");
      wrap.setAttribute("aria-label", this.t("settingsTitle"));
      wrap.innerHTML =
        '<div class="dk-wrap">' +
          "<div><h3>" + this.t("title") + "</h3><p>" + this.t("body") +
            ' <a href="/privacy.html" target="_blank" rel="noopener">' + this.t("privacy") + "</a> · " +
            '<a href="/cookies.html" target="_blank" rel="noopener">' + this.t("cookies") + "</a></p></div>" +
          '<div class="dk-actions">' +
            '<button type="button" class="dk-custom" data-dk="toggle">' + this.t("customize") + "</button>" +
            '<button type="button" class="dk-reject" data-dk="reject">' + this.t("rejectAll") + "</button>" +
            '<button type="button" class="dk-accept" data-dk="accept">' + this.t("acceptAll") + "</button>" +
          "</div>" +
          '<div class="dk-panel">' +
            "<h3>" + this.t("settingsTitle") + "</h3>" +
            this.rowHtml("necessary", true, true) +
            this.rowHtml("functional", c.functional, false) +
            this.rowHtml("analytics", c.analytics, false) +
            this.rowHtml("marketing", c.marketing, false) +
            '<div class="dk-actions" style="margin-top:12px;justify-content:flex-end">' +
              '<button type="button" class="dk-accept" data-dk="save">' + this.t("save") + "</button>" +
            "</div>" +
          "</div>" +
        "</div>";
      (document.body || document.documentElement).appendChild(wrap);
      this.el = wrap;
      this.bind();
    },

    bind: function () {
      var self = this;
      this.el.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-dk]");
        if (!btn) return;
        var act = btn.getAttribute("data-dk");
        if (act === "toggle") { self.el.classList.toggle("dk-open"); return; }
        if (act === "accept") { self.commit({ functional: true, analytics: true, marketing: true }); return; }
        if (act === "reject") { self.commit({ functional: false, analytics: false, marketing: false }); return; }
        if (act === "save") {
          var c = { functional: false, analytics: false, marketing: false };
          self.el.querySelectorAll("input[data-cat]").forEach(function (inp) { c[inp.getAttribute("data-cat")] = inp.checked; });
          self.commit(c);
        }
      });
    },

    commit: function (c) {
      c.necessary = true;
      T._applyConsent(c, "cookie_banner");
      this.close();
    },

    close: function () { if (this.el) { this.el.remove(); this.el = null; } },

    openSettings: function () {
      if (this.el) { this.el.classList.add("dk-open"); this.el.scrollIntoView({ behavior: "smooth" }); return; }
      this.render(T.consent);
      this.el.classList.add("dk-open");
    }
  };

  // ---------- إعادة فتح الإعدادات من الـFooter (data-cookie-settings) ----------
  document.addEventListener("click", function (e) {
    var trg = e.target.closest("[data-cookie-settings]");
    if (trg) { e.preventDefault(); T.openConsent(); }
  });

  // ---------- التقاط نقرات واتساب (whatsapp_click → Contact) ----------
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href*="wa.me"], [data-action="whatsapp-store"]');
    if (!a) return;
    var sid = a.dataset ? (a.dataset.id || a.dataset.storeId) : null;
    try { T.track("whatsapp_click", { store_id: sid != null ? sid : undefined }); } catch (err) {}
  }, true);

  // ---------- ربط page_view بتنقّل الـSPA ----------
  window.addEventListener("popstate", function () { T.pageView(); });
  window.addEventListener("dukkanci:navigate", function () { T.pageView(); });

  // ============================================================
  //  Boot
  // ============================================================
  T.uid = ensureUid();
  captureAttribution();
  setCookie(C.lang, pageLang(), 180);

  var stored = readConsent();
  if (stored) {
    T.consent = stored;
    applyConsentMode(stored);
  } else {
    // أول زيارة (أو نسخة سياسة جديدة): اعرض البانر بعد جاهزية الـDOM.
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () { Banner.render(null); });
    } else {
      Banner.render(null);
    }
  }

  // أول page_view
  T.pageView();

  window.DUKKANCI_TRACKING = T;
})();
