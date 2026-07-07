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
    loaded: false,
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
          this.loaded = true;
          return this.settings;
        }
        // Table absent (not provisioned here): stop querying it on future loads.
        if (tableLooksAbsent(error)) { try { localStorage.setItem(ABSENT_FLAG, "1"); } catch (e) {} }
      }
    } catch (e) { /* table may not exist yet — fall through */ }
    this.settings = localSettings();
    this.loaded = true;
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

  // Run one injection block in isolation: a throw in one pixel (e.g. a bad id)
  // must NOT abort the rest — otherwise a single broken provider silently kills
  // all the others, including GA4.
  function safe(label, fn) {
    try { fn(); } catch (e) { try { console.warn("[integrations] " + label + " failed:", e); } catch (_) {} }
  }

  // Consent gate: no analytics/marketing script may run before the visitor opts in.
  // Before tracking.js is ready (or if it's absent), default to DENY everything.
  function consentOK(cat) {
    const t = window.DUKKANCI_TRACKING;
    if (!t) return false;
    return t.hasConsent(cat);
  }

  I.inject = function () {
    const self = this;
    safe("meta", () => self._injectMeta());
    safe("tiktok", () => self._injectTiktok());
    safe("gtm", () => self._injectGtm());
    safe("ga4", () => self._injectGa4());
  };

  // Re-run injection after the visitor changes consent (idempotent via `injected`).
  I.applyConsent = function () { this.inject(); };

  I._injectMeta = function () {
    // Meta Pixel — marketing consent required
    if (this.enabled("meta_pixel_id") && !injected.meta && consentOK("marketing")) {
      injected.meta = true;
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", this.val("meta_pixel_id"));
      window.fbq("track", "PageView");
    }
  };

  I._injectTiktok = function () {
    // TikTok Pixel — marketing consent required
    if (this.enabled("tiktok_pixel_id") && !injected.tiktok && consentOK("marketing")) {
      injected.tiktok = true;
      // The GTM container already fires a TikTok pixel; don't double-load it.
      if (window.ttq && window.ttq._i && Object.keys(window.ttq._i).length) return;
      // NOTE: read the id HERE (where `this` === I); inside the IIFE below `this`
      // is `window`, so `this.val(...)` there throws and aborts the whole inject().
      const ttId = this.val("tiktok_pixel_id");
      !function (w, d, t) { w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || []; ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"]; ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat([].slice.call(arguments, 0))) } }; for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]); ttq.load = function (e) { var r = "https://analytics.tiktok.com/i18n/pixel/events.js"; ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r; ttq._t = ttq._t || {}; ttq._t[e] = +new Date; var o = d.createElement("script"); o.async = !0; o.src = r + "?sdkid=" + e; var a = d.getElementsByTagName("script")[0]; a.parentNode.insertBefore(o, a) }; ttq.load(ttId); ttq.page(); }(window, document, "ttq");
    }
  };

  I._injectGtm = function () {
    // Google Tag Manager — skip if this container is already on the page
    // (index.html hardcodes the GTM snippet; injecting it again double-loads
    // the container and double-fires every tag inside it).
    if (this.enabled("google_tag_manager_id") && !injected.gtm) {
      injected.gtm = true;
      const gid = this.val("google_tag_manager_id");
      const already = (window.google_tag_manager && window.google_tag_manager[gid]) ||
        document.querySelector('script[src*="googletagmanager.com/gtm.js?id=' + gid + '"]');
      if (!already) {
        (function (w, d, s, l, i) { w[l] = w[l] || []; w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" }); var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != "dataLayer" ? "&l=" + l : ""; j.async = true; j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl; f.parentNode.insertBefore(j, f); })(window, document, "script", "dataLayer", gid);
      }
    }
  };

  I._injectGa4 = function () {
    // GA4 — load gtag.js directly. (The GTM container does NOT carry a GA4 tag,
    // so this is the only thing that sends hits to the GA4 property.)
    // Analytics consent required.
    if (this.enabled("ga4_measurement_id") && !injected.ga4 && consentOK("analytics")) {
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
    if (consentOK("marketing") && window.fbq) window.fbq("track", "PageView");
    if (consentOK("marketing") && window.ttq) window.ttq.page();
    if (consentOK("analytics") && window.gtag) window.gtag("event", "page_view", { page_location: location.href, page_path: path });
    if (window.dataLayer) window.dataLayer.push({ event: "spa_pageview", page_path: path });
  };

  // Commerce events, called from tracking.js with a shared eventId (for browser↔server dedup).
  I.track = function (name, d) {
    d = d || {};
    const eventId = d.eventId || (name === "Purchase" ? "order_" + d.orderId : undefined);
    if (consentOK("marketing") && window.fbq) {
      const fb = { content_ids: d.ids, content_type: "product", value: d.value, currency: CURRENCY, num_items: d.count };
      if (eventId) window.fbq("track", name, fb, { eventID: eventId });
      else window.fbq("track", name, fb);
    }
    if (consentOK("marketing") && window.ttq) window.ttq.track(name === "Purchase" ? "CompletePayment" : name, { content_id: (d.ids || [])[0], value: d.value, currency: CURRENCY }, eventId ? { event_id: eventId } : undefined);
    if (consentOK("analytics") && window.gtag) {
      const map = { ViewContent: "view_item", AddToCart: "add_to_cart", InitiateCheckout: "begin_checkout", Purchase: "purchase" };
      window.gtag("event", map[name] || name, { value: d.value, currency: CURRENCY, transaction_id: d.orderId });
    }
    // Google Ads conversion on purchase — marketing consent required
    if (name === "Purchase" && consentOK("marketing") && window.gtag && this.enabled("google_ads_conversion_id") && this.val("google_ads_conversion_label")) {
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
