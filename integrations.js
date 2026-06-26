// ============================================================
//  Dukkanci — Integrations layer (pixels, GTM, GA4) for the hash-routing SPA.
//  Settings come from Supabase table `integration_settings` (editable in the
//  merchant dashboard), with a localStorage fallback so it works offline too.
//  Scripts are injected ONLY when the matching id is enabled AND non-empty.
// ============================================================
(function () {
  const KEYS = [
    "meta_pixel_id", "meta_capi_token", "meta_test_event_code",
    "tiktok_pixel_id", "snapchat_pixel_id", "pinterest_tag_id",
    "google_tag_manager_id", "ga4_measurement_id",
    "google_ads_conversion_id", "google_ads_conversion_label"
  ];
  const LS_KEY = "dukkanci-integrations";
  const CURRENCY = "TRY";
  const injected = {};
  const I = {
    settings: {},
    enabled(key) { const s = this.settings[key]; return s && s.is_enabled && s.setting_value; },
    val(key) { const s = this.settings[key]; return s ? s.setting_value : ""; },
  };

  function localSettings() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; }
  }

  // Remember when the integration_settings table isn't provisioned in this project,
  // so we don't re-issue a request that 404s in the console on every page load.
  const ABSENT_FLAG = "dukkanci-int-settings-absent";
  function tableLooksAbsent(error) {
    if (!error) return false;
    const code = error.code || "";
    return code === "PGRST205" || code === "PGRST202" || code === "42P01" ||
      /does not exist|could not find the table|not found/i.test(error.message || "");
  }

  I.load = async function () {
    // try Supabase first (global), fall back to localStorage (per-device)
    try {
      await (window.__supabaseReady || Promise.resolve());
      if (window.supabaseClient && localStorage.getItem(ABSENT_FLAG) !== "1") {
        const { data, error } = await window.supabaseClient.from("integration_settings").select("*");
        if (!error && data) {
          this.settings = {};
          data.forEach(r => { this.settings[r.setting_key] = { setting_value: r.setting_value || "", is_enabled: !!r.is_enabled }; });
          return this.settings;
        }
        // Table absent (not provisioned here): stop querying it on future loads.
        if (tableLooksAbsent(error)) { try { localStorage.setItem(ABSENT_FLAG, "1"); } catch (e) {} }
      }
    } catch (e) { /* table may not exist yet — fall through */ }
    this.settings = localSettings();
    return this.settings;
  };

  I.save = async function (map, adminPassword) {
    // map: { key: { setting_value, is_enabled } }
    this.settings = map;
    localStorage.setItem(LS_KEY, JSON.stringify(map));
    const rows = Object.keys(map).map(k => ({ setting_key: k, setting_value: map[k].setting_value || "", is_enabled: !!map[k].is_enabled }));
    // use service-role API endpoint (anon key cannot write due to RLS)
    const pwd = adminPassword || (typeof state !== "undefined" && state.adminKey) || "";
    try {
      await fetch("/api/save-integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": pwd },
        body: JSON.stringify({ rows })
      });
    } catch (e) { /* offline — localStorage fallback above is enough */ }
    this.inject();
  };

  I.inject = function () {
    // Meta Pixel
    if (this.enabled("meta_pixel_id") && !injected.meta) {
      injected.meta = true;
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", this.val("meta_pixel_id"));
      window.fbq("track", "PageView");
    }
    // TikTok Pixel
    if (this.enabled("tiktok_pixel_id") && !injected.tiktok) {
      injected.tiktok = true;
      !function (w, d, t) { w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || []; ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"]; ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat([].slice.call(arguments, 0))) } }; for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]); ttq.load = function (e) { var r = "https://analytics.tiktok.com/i18n/pixel/events.js"; ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r; ttq._t = ttq._t || {}; ttq._t[e] = +new Date; var o = d.createElement("script"); o.async = !0; o.src = r + "?sdkid=" + e; var a = d.getElementsByTagName("script")[0]; a.parentNode.insertBefore(o, a) }; ttq.load(this.val("tiktok_pixel_id")); ttq.page(); }(window, document, "ttq");
    }
    // Google Tag Manager
    if (this.enabled("google_tag_manager_id") && !injected.gtm) {
      injected.gtm = true;
      (function (w, d, s, l, i) { w[l] = w[l] || []; w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" }); var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != "dataLayer" ? "&l=" + l : ""; j.async = true; j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl; f.parentNode.insertBefore(j, f); })(window, document, "script", "dataLayer", this.val("google_tag_manager_id"));
    }
    // GA4 (only if not already handled via GTM)
    if (this.enabled("ga4_measurement_id") && !injected.ga4) {
      injected.ga4 = true;
      const id = this.val("ga4_measurement_id");
      const s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + id; document.head.appendChild(s);
      window.dataLayer = window.dataLayer || []; window.gtag = window.gtag || function () { dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", id);
    }
  };

  // SPA-aware PageView on every route change (History API)
  I.pageView = function () {
    const path = location.pathname + location.search;
    if (window.fbq) window.fbq("track", "PageView");
    if (window.ttq) window.ttq.page();
    if (window.gtag) window.gtag("event", "page_view", { page_location: location.href, page_path: path });
    if (window.dataLayer) window.dataLayer.push({ event: "spa_pageview", page_path: path });
  };

  // Commerce events, called from app.js at the right moments
  I.track = function (name, d) {
    d = d || {};
    if (window.fbq) {
      const fb = { content_ids: d.ids, content_type: "product", value: d.value, currency: CURRENCY, num_items: d.count };
      if (name === "Purchase") window.fbq("track", "Purchase", fb, { eventID: "order_" + d.orderId });
      else window.fbq("track", name, fb);
    }
    if (window.ttq) window.ttq.track(name === "Purchase" ? "CompletePayment" : name, { content_id: (d.ids || [])[0], value: d.value, currency: CURRENCY });
    if (window.gtag) {
      const map = { ViewContent: "view_item", AddToCart: "add_to_cart", InitiateCheckout: "begin_checkout", Purchase: "purchase" };
      window.gtag("event", map[name] || name, { value: d.value, currency: CURRENCY, transaction_id: d.orderId });
    }
    // Google Ads conversion on purchase
    if (name === "Purchase" && window.gtag && this.enabled("google_ads_conversion_id") && this.val("google_ads_conversion_label")) {
      window.gtag("event", "conversion", { send_to: this.val("google_ads_conversion_id") + "/" + this.val("google_ads_conversion_label"), value: d.value, currency: CURRENCY, transaction_id: d.orderId });
    }
  };

  I.SETTING_KEYS = KEYS;
  window.DUKKANCI_INTEGRATIONS = I;
  window.addEventListener("popstate", () => I.pageView());
  window.addEventListener("dukkanci:navigate", () => I.pageView());
  // boot
  I.load().then(() => { I.inject(); });
})();
