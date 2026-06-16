// Sends WhatsApp order notifications through the PLATFORM number (Meta WhatsApp
// Cloud API). When a new order is placed it messages:
//   1) the STORE  — with the order details so they can prepare it, and
//   2) the CUSTOMER — confirming their order was received.
//
// Trigger options (both payload shapes are accepted):
//   - The web app POSTs the order here right after it is saved (default), or
//   - A Supabase "Database Webhook" on INSERT into public.orders ({ record }).
//
// Activation: set the WHATSAPP_* env vars (see WHATSAPP_SETUP.md). Until then
// the endpoint no-ops gracefully (200 skipped) so the site keeps working before
// the number is connected.
//
// Note: business-initiated WhatsApp messages outside the 24h customer-care
// window MUST use an approved template. Set WHATSAPP_TEMPLATE_* to send
// templates; otherwise it falls back to plain text (only delivered when the
// recipient has messaged the number in the last 24h — useful for testing).

const GRAPH = "https://graph.facebook.com";
const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const PUB_KEY = "sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc";

const env = k => (process.env[k] || "").trim();

function cfg() {
  return {
    token: env("WHATSAPP_TOKEN"),
    phoneId: env("WHATSAPP_PHONE_NUMBER_ID"),
    version: env("WHATSAPP_API_VERSION") || "v21.0",
    cc: env("WHATSAPP_DEFAULT_COUNTRY_CODE") || "90",
    lang: env("WHATSAPP_TEMPLATE_LANG") || "ar",
    tplStore: env("WHATSAPP_TEMPLATE_STORE"),
    tplCustomer: env("WHATSAPP_TEMPLATE_CUSTOMER"),
    secret: env("NOTIFY_SECRET")
  };
}

// Normalize a messy local/international number to E.164 digits (no +).
// Tuned for Turkish numbers: "+90 505 ...", "0505 ...", "505 ..." all work.
function toE164(raw, cc) {
  let d = String(raw == null ? "" : raw).replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith(cc) && d.length >= cc.length + 9) return d; // already has country code
  if (d.startsWith("0")) d = d.slice(1);                       // strip national trunk 0
  if (d.length <= 11) d = cc + d;                              // local -> prepend country code
  return d;
}

function sb() {
  return {
    url: (env("SUPABASE_URL") || PUB_URL).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, ""),
    key: env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_ANON_KEY") || PUB_KEY
  };
}
async function sbGet(path) {
  const { url, key } = sb();
  try {
    const r = await fetch(`${url}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!r.ok) return null;
    const rows = await r.json().catch(() => null);
    return Array.isArray(rows) ? rows : null;
  } catch (e) { return null; }
}

// Accept both the web-app payload (flat order) and a Supabase webhook ({ record }).
function normalizeOrder(body) {
  const rec = body && body.record ? body.record : null;
  if (rec) {
    const dd = (rec.delivery_details && typeof rec.delivery_details === "object") ? rec.delivery_details : {};
    return {
      id: rec.id, storeId: rec.store_id, customer: rec.customer || "",
      customerPhone: dd.phone || "", total: Number(rec.total) || 0,
      fulfillment: dd.fulfillment || "delivery", address: dd.address || "",
      payment: dd.payment || "", lineItems: Array.isArray(dd.lineItems) ? dd.lineItems : []
    };
  }
  const o = body || {};
  return {
    id: o.id, storeId: o.storeId, customer: o.customer || "",
    customerPhone: o.customerPhone || "", total: Number(o.total) || 0,
    fulfillment: o.fulfillment || "delivery", address: o.address || "",
    payment: o.payment || "", lineItems: Array.isArray(o.lineItems) ? o.lineItems : []
  };
}

async function sendWhatsapp(c, to, { template, params, text }) {
  let payload;
  if (template) {
    const components = (params && params.length)
      ? [{ type: "body", parameters: params.map(t => ({ type: "text", text: String(t == null ? "" : t).slice(0, 1024) })) }]
      : [];
    payload = {
      messaging_product: "whatsapp", to, type: "template",
      template: { name: template, language: { code: c.lang }, ...(components.length ? { components } : {}) }
    };
  } else {
    payload = { messaging_product: "whatsapp", to, type: "text", text: { body: text, preview_url: false } };
  }
  try {
    const r = await fetch(`${GRAPH}/${c.version}/${c.phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${c.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, id: data?.messages?.[0]?.id, error: r.ok ? undefined : data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

const money = n => `${Number(n || 0).toLocaleString("ar")} ل.ت`;
// Single line — WhatsApp template parameters reject newlines, tabs, and 4+ spaces.
const itemsLine = items => (items || []).map(i => `${i.name} ×${i.qty || 1}`).join(" • ");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const c = cfg();

  // This endpoint doubles as the Meta WhatsApp webhook (Hobby plan caps us at 12
  // serverless functions, so webhook + notify share one file).
  // GET = verification handshake. Parse the query from req.url with Node's
  // querystring (keeps the dotted "hub.mode" keys flat — req.query may nest them).
  if (req.method === "GET") {
    let q = {};
    try { q = require("url").parse(req.url || "", true).query || {}; } catch (e) { q = req.query || {}; }
    const expected = (process.env.WHATSAPP_VERIFY_TOKEN || "").trim();
    if (q["hub.mode"] === "subscribe" && expected && q["hub.verify_token"] === expected) {
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(String(q["hub.challenge"] == null ? "" : q["hub.challenge"]));
    }
    return res.status(403).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});

  // POST from Meta = delivery statuses / inbound messages. Log and ack.
  if (body && (body.object === "whatsapp_business_account" || Array.isArray(body.entry))) {
    try { console.log("[whatsapp-webhook]", JSON.stringify(body).slice(0, 2000)); } catch (e) {}
    return res.status(200).json({ received: true });
  }

  // Otherwise this is an order-notification request.
  // Optional shared secret (used when the trigger is a Supabase DB webhook).
  if (c.secret) {
    const got = req.headers["x-notify-secret"] || (req.query && req.query.secret);
    if (got !== c.secret) return res.status(401).json({ error: "unauthorized" });
  }
  if (!c.token || !c.phoneId) {
    return res.status(200).json({ skipped: true, reason: "whatsapp not configured" });
  }
  const order = normalizeOrder(body);
  if (!order.id || !order.storeId) return res.status(400).json({ error: "order id/storeId required" });

  // Authoritative store contact + name from the DB — never trust the client for
  // WHERE messages go.
  const rows = await sbGet(`stores?id=eq.${encodeURIComponent(order.storeId)}&select=name,phone,whatsapp&limit=1`);
  const store = rows && rows[0];
  const storeName = (store && store.name) || "متجرك";
  const storeTo = toE164(store && (store.whatsapp || store.phone), c.cc);
  const custTo = toE164(order.customerPhone, c.cc);
  const fulfillmentAr = order.fulfillment === "pickup" ? "استلام من المتجر" : "توصيل";
  const results = {};

  // 1) Notify the STORE.
  if (storeTo) {
    const text = `🛒 طلب جديد على دكانجي\n\nرقم الطلب: ${order.id}\nالزبون: ${order.customer}\nهاتف الزبون: ${order.customerPhone}\nالإجمالي: ${money(order.total)}\nالاستلام: ${fulfillmentAr}`
      + (order.address ? `\nالعنوان: ${order.address}` : "")
      + (order.payment ? `\nالدفع: ${order.payment}` : "")
      + `\n\nالمنتجات:\n${itemsLine(order.lineItems) || "-"}\n\nافتح لوحة دكانجي لإدارة الطلب.`;
    const params = [String(order.id), order.customer, order.customerPhone, money(order.total), fulfillmentAr, itemsLine(order.lineItems) || "-"];
    results.store = await sendWhatsapp(c, storeTo, { template: c.tplStore, params, text });
  } else {
    results.store = { skipped: true, reason: "store has no whatsapp/phone" };
  }

  // 2) Acknowledge to the CUSTOMER.
  if (custTo) {
    const text = `✅ تم استلام طلبك على دكانجي\n\nرقم الطلب: ${order.id}\nالمتجر: ${storeName}\nالإجمالي: ${money(order.total)}\n\nسنعلمك فور تأكيد المتجر لطلبك. شكراً لاستخدامك دكانجي 🛍️`;
    const params = [String(order.id), storeName, money(order.total)];
    results.customer = await sendWhatsapp(c, custTo, { template: c.tplCustomer, params, text });
  } else {
    results.customer = { skipped: true, reason: "no customer phone" };
  }

  return res.status(200).json({ ok: true, order: order.id, results });
};
