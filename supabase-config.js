// ============================================================
//  إعدادات Supabase لدكانجي
//  القيم تأتي من متغيّرات Vercel البيئية عبر /api/config
//  (SUPABASE_URL و SUPABASE_ANON_KEY).
//  المفتاح anon عام وآمن للواجهة (محمي بسياسات RLS).
//  ⚠️ لا تضع service_role key أبداً في متغيّرات تُقرأ من الواجهة.
//
//  للتجربة محليًا فقط، يمكنك وضع القيم يدوياً هنا بدل تركها فارغة:
window.SUPABASE_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
window.SUPABASE_ANON_KEY = "sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc";
// رابط اشتراك Whop لإضافة متجر (زر "تجديد الاشتراك" في لوحة المتجر).
// يُمكن تجاوزه من متغيّر البيئة WHOP_CHECKOUT_URL عبر /api/config.
window.WHOP_CHECKOUT_URL = window.WHOP_CHECKOUT_URL || "https://whop.com/dukkanci/dukkanci-store-subscription/";
// ============================================================

window.__supabaseReady = (async () => {
  try {
    // اجلب الإعدادات العامة من متغيّرات Vercel البيئية: Supabase عند غيابها،
    // ورابط Whop دائماً (للسماح بتغييره دون تعديل الكود).
    const needSupabase = !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY;
    {
      const res = await fetch("/api/config", { headers: { Accept: "application/json" } }).catch(() => null);
      const ct = res && (res.headers.get("content-type") || "");
      if (res && res.ok && ct.includes("application/json")) {
        const cfg = await res.json();
        if (needSupabase && cfg.configured) {
          window.SUPABASE_URL = cfg.url;
          window.SUPABASE_ANON_KEY = cfg.anonKey;
        }
        if (cfg.whopCheckoutUrl) window.WHOP_CHECKOUT_URL = cfg.whopCheckoutUrl;
      }
    }
    if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY && window.supabase?.createClient) {
      window.SUPABASE_URL = window.SUPABASE_URL.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
      // Force fresh reads: the catalog changes when merchants edit products, so we must
      // never serve browser-cached REST responses (otherwise updates don't appear).
      window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
        global: { fetch: (input, init = {}) => fetch(input, { ...init, cache: "no-store" }) }
      });
      console.info("Supabase: connected");
      return true;
    }
    console.info("Supabase: not configured — using bundled data");
    return false;
  } catch (err) {
    console.info("Supabase: config unavailable — using bundled data");
    return false;
  }
})();
