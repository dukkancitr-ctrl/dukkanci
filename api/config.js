// Exposes the PUBLIC Supabase config to the frontend from Vercel env vars.
// Only the public values (project URL + anon key) are returned — never service_role.
// Falls back to the public project values (same anon/publishable key bundled in
// supabase-config.js and used by every other api/* route) so this endpoint reports
// configured:true even when SUPABASE_URL/ANON_KEY aren't set as Vercel env vars.
const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const PUB_KEY = "sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc";
module.exports = (request, response) => {
  // Same short public cache as api/maps-key.js / api/sitemap.js — this payload
  // only changes on redeploy (env-derived), so no-store was needlessly forcing
  // a fresh request on the critical startup path for every page load.
  response.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  const url = process.env.SUPABASE_URL || PUB_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || PUB_KEY;
  // Public Whop checkout link for the store subscription (used by the merchant
  // "renew" button). Falls back to the live Dukkanci product link.
  const whopCheckoutUrl = (process.env.WHOP_CHECKOUT_URL || "https://whop.com/dukkanci/dukkanci-store-subscription/").trim();
  // Public VAPID key for Web Push subscriptions (safe to expose — it is the
  // "application server key" the browser needs to subscribe). The matching
  // private key stays server-side in VAPID_PRIVATE_KEY (api/notify-order.js).
  const vapidPublicKey = (process.env.VAPID_PUBLIC_KEY || "").trim();
  return response.status(200).json({
    url,
    anonKey,
    whopCheckoutUrl,
    vapidPublicKey,
    configured: Boolean(url && anonKey)
  });
};
