// Exposes the PUBLIC Supabase config to the frontend from Vercel env vars.
// Only the public values (project URL + anon key) are returned — never service_role.
module.exports = (request, response) => {
  response.setHeader("Cache-Control", "no-store");
  const url = process.env.SUPABASE_URL || "";
  const anonKey = process.env.SUPABASE_ANON_KEY || "";
  return response.status(200).json({
    url,
    anonKey,
    configured: Boolean(url && anonKey)
  });
};
