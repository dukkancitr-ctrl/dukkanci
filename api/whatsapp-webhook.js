// WhatsApp Cloud API webhook — used while CONNECTING the platform number in
// Meta (App Dashboard > WhatsApp > Configuration > Webhook).
//   - GET  : verification handshake. Echoes hub.challenge when hub.verify_token
//            matches WHATSAPP_VERIFY_TOKEN.
//   - POST : delivery statuses (sent/delivered/read/failed) and inbound messages.
//            Currently logged; extend here to e.g. flip an order's status when a
//            customer replies. Always 200 so Meta doesn't disable the webhook.
//
// Set WHATSAPP_VERIFY_TOKEN to any random string and paste the SAME value into
// Meta's webhook screen. Callback URL: https://<your-domain>/api/whatsapp-webhook
module.exports = async (req, res) => {
  if (req.method === "GET") {
    const q = req.query || {};
    const mode = q["hub.mode"];
    const token = q["hub.verify_token"];
    const challenge = q["hub.challenge"];
    const expected = (process.env.WHATSAPP_VERIFY_TOKEN || "").trim();
    if (mode === "subscribe" && expected && token === expected) {
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(String(challenge == null ? "" : challenge));
    }
    return res.status(403).end();
  }

  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      // Statuses & inbound messages land here. Keep it lightweight for now.
      console.log("[whatsapp-webhook]", JSON.stringify(body).slice(0, 2000));
    } catch (e) { /* ignore malformed payloads */ }
    return res.status(200).json({ received: true });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).end();
};
