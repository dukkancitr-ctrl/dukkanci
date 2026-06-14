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
// ============================================================

window.__supabaseReady = (async () => {
  try {
    // إن لم تُضبط القيم يدوياً، اجلبها من متغيّرات Vercel البيئية
    if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
      const res = await fetch("/api/config", { headers: { Accept: "application/json" } });
      const ct = res.headers.get("content-type") || "";
      if (res.ok && ct.includes("application/json")) {
        const cfg = await res.json();
        if (cfg.configured) {
          window.SUPABASE_URL = cfg.url;
          window.SUPABASE_ANON_KEY = cfg.anonKey;
        }
      }
    }
    if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY && window.supabase?.createClient) {
      window.SUPABASE_URL = window.SUPABASE_URL.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
      window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
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
