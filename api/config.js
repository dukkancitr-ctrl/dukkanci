// Exposes the PUBLIC Supabase config to the frontend from Vercel env vars.
// Only the public values (project URL + anon key) are returned — never service_role.
module.exports = (request, response) => {
  response.setHeader("Cache-Control", "no-store");
  const url = process.env.SUPABASE_URL || "";
  const anonKey = process.env.SUPABASE_ANON_KEY || "";
  // Public Whop checkout link for the store subscription (used by the merchant
  // "renew" button). Falls back to the live Dukkanci product link.
  const whopCheckoutUrl = (process.env.WHOP_CHECKOUT_URL || "https://whop.com/dukkanci/dukkanci-store-subscription/").trim();
  return response.status(200).json({
    url,
    anonKey,
    whopCheckoutUrl,
    configured: Boolean(url && anonKey)
  });
};
