// Supabase "Send SMS" Auth Hook → deliver the login OTP over WhatsApp using the
// platform's existing Meta WhatsApp Cloud API (the same number used for order
// notifications). This lets merchants/customers log in with a WhatsApp code
// WITHOUT Twilio — Supabase generates the OTP and calls this endpoint to send it.
//
// SETUP (see the notes returned to you in chat):
//   1) Deploy this file (it becomes https://<your-domain>/api/auth-sms).
//   2) Supabase → Authentication → Auth Hooks → Add "Send SMS message" hook →
//      type HTTPS, URL = https://www.dukkanci.com.tr/api/auth-sms. Supabase shows
//      a signing secret like "v1,whsec_..." — copy it.
//   3) Vercel env: SEND_SMS_HOOK_SECRET = that secret (the whole "v1,whsec_..."),
//      and a Meta authentication template name in WHATSAPP_TEMPLATE_OTP.
//   4) Supabase → Providers → enable the Phone provider (the hook overrides the
//      Twilio sending path).
//   5) Meta WhatsApp Manager: create + get approved an AUTHENTICATION template
//      (category "Authentication") whose body contains the {{1}} code and a
//      copy-code button; put its name in WHATSAPP_TEMPLATE_OTP.

const crypto = require("crypto");

// We need the exact raw bytes to verify the Standard Webhooks signature.
module.exports.config = { api: { bodyParser: false } };

const env = k => (process.env[k] || "").trim();

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", c => { data += c; if (data.length > 100_000) req.destroy(); });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

// Verify a Supabase/Standard-Webhooks signature.
// secret looks like "v1,whsec_<base64>"; signed content is "<id>.<ts>.<body>".
function verifyHookSignature(rawBody, headers, secretRaw) {
  if (!secretRaw) return false;
  const secret = secretRaw.replace(/^v1,?/, "").replace(/^whsec_/, "");
  let key;
  try { key = Buffer.from(secret, "base64"); } catch (e) { return false; }
  const id = headers["webhook-id"];
  const ts = headers["webhook-timestamp"];
  const sigHeader = headers["webhook-signature"];
  if (!id || !ts || !sigHeader) return false;
  const expected = crypto.createHmac("sha256", key).update(`${id}.${ts}.${rawBody}`).digest("base64");
  // The header is a space-separated list of "v1,<sig>" entries — match any.
  return String(sigHeader).split(" ").some(part => {
    const sig = part.split(",")[1] || part;
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
}

function toE164(raw) {
  let d = String(raw == null ? "" : raw).replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  return d;
}

async function sendOtpWhatsapp(to, otp) {
  const token = env("WHATSAPP_TOKEN");
  const phoneId = env("WHATSAPP_PHONE_NUMBER_ID");
  const version = env("WHATSAPP_API_VERSION") || "v21.0";
  const template = env("WHATSAPP_TEMPLATE_OTP") || "login_otp";
  const lang = env("WHATSAPP_TEMPLATE_LANG") || "ar";
  if (!token || !phoneId) return { ok: false, error: "whatsapp not configured" };

  // Meta AUTHENTICATION template: the code goes in the body param AND the
  // copy-code/URL button param. Adjust to match your approved template.
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: template,
      language: { code: lang },
      components: [
        { type: "body", parameters: [{ type: "text", text: String(otp) }] },
        { type: "button", sub_type: "url", index: "0", parameters: [{ type: "text", text: String(otp) }] }
      ]
    }
  };
  try {
    const r = await fetch(`https://graph.facebook.com/${version}/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, id: data?.messages?.[0]?.id, error: r.ok ? undefined : data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const rawBody = await readRawBody(req);

  // SECURITY: only Supabase (holder of the hook secret) may trigger sends.
  if (!verifyHookSignature(rawBody, req.headers, env("SEND_SMS_HOOK_SECRET"))) {
    return res.status(401).json({ error: "invalid signature" });
  }

  let body;
  try { body = JSON.parse(rawBody || "{}"); } catch (e) { return res.status(400).json({ error: "bad json" }); }

  const phone = toE164(body?.user?.phone);
  const otp = body?.sms?.otp;
  if (!phone || !otp) return res.status(400).json({ error: "missing phone or otp" });

  const sent = await sendOtpWhatsapp(phone, otp);
  if (!sent.ok) {
    // Returning an error tells Supabase the send failed (it will surface to the user).
    return res.status(502).json({ error: { http_code: 502, message: "otp send failed" } });
  }
  return res.status(200).json({});
};
