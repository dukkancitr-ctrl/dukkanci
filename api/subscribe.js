// Footer newsletter subscribe: stores a visitor's WhatsApp number in wa_contacts
// (group «مشتركو الموقع», source "website_subscribe") so the admin «الحملات» bulk
// sender can reach opt-in subscribers with offers/news.
//
// wa_contacts is RLS deny-all, so the anon browser client cannot write directly —
// the INSERT goes through this endpoint using the service-role key (never exposed
// to the browser). The PK is `phone`, so a re-subscribe is a safe no-op via
// Prefer: resolution=ignore-duplicates.
const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const SUB_GROUP = "مشتركو الموقع";

// Turkish WhatsApp mobile → "90XXXXXXXXXX" (12 digits, no +), or null if invalid.
// Accepts 05XX…, 5XX…, +90 5XX…, 0090 5XX… etc. TR mobiles are 10 local digits
// starting with 5.
function normalizeTR(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("90")) d = d.slice(2);
  d = d.replace(/^0+/, "");
  if (d.length !== 10 || d[0] !== "5") return null;
  return "90" + d;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const supabaseUrl = (process.env.SUPABASE_URL || PUB_URL).trim();
  if (!serviceKey) return res.status(200).json({ ok: false, reason: "not_configured" }); // fail-open

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "bad body" });

  const phone = normalizeTR(body.phone);
  if (!phone) return res.status(400).json({ ok: false, error: "invalid_phone" });

  try {
    const r = await fetch(`${supabaseUrl}/rest/v1/wa_contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
        "Prefer": "resolution=ignore-duplicates"
      },
      body: JSON.stringify([{ phone, group_name: SUB_GROUP, source: "website_subscribe" }])
    });
    if (!r.ok && r.status !== 409) {
      const txt = await r.text().catch(() => "");
      return res.status(200).json({ ok: false, error: txt.slice(0, 200) });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(200).json({ ok: false, error: String(e && e.message || e) }); // fail-open
  }
};
