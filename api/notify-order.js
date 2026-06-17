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

// Write to Supabase (insert/upsert/patch). `prefer` tunes conflict handling;
// inbound messages upsert on wam_id so webhook retries don't duplicate rows.
async function sbWrite(method, path, body, prefer) {
  const { url, key } = sb();
  try {
    const r = await fetch(`${url}/rest/v1/${path}`, {
      method,
      headers: {
        apikey: key, Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: prefer || "return=representation"
      },
      body: JSON.stringify(body)
    });
    const rows = await r.json().catch(() => null);
    return { ok: r.ok, status: r.status, rows };
  } catch (e) { return { ok: false, error: e.message }; }
}

// Admin gate: the panel sends the password as `x-admin-key` (or ?key=). It must
// match ADMIN_PASSWORD. If ADMIN_PASSWORD is unset, the inbox endpoints are
// closed (403) rather than open — fail safe, never expose customer chats.
function adminOk(req) {
  const expected = env("ADMIN_PASSWORD");
  if (!expected) return false;
  const got = req.headers["x-admin-key"] || (req.query && req.query.key) || "";
  return String(got) === expected;
}

// Map a WhatsApp inbound message to a short text + type label (we store text;
// media becomes a labelled placeholder so the thread stays readable).
function describeMessage(m) {
  const t = m.type || "text";
  if (t === "text") return { type: "text", body: (m.text && m.text.body) || "" };
  if (t === "image") return { type: "image", body: (m.image && m.image.caption) || "[صورة]" };
  if (t === "audio") return { type: "audio", body: "[رسالة صوتية]" };
  if (t === "video") return { type: "video", body: (m.video && m.video.caption) || "[فيديو]" };
  if (t === "document") return { type: "document", body: (m.document && (m.document.filename || m.document.caption)) || "[ملف]" };
  if (t === "location") return { type: "location", body: "[موقع]" };
  if (t === "sticker") return { type: "sticker", body: "[ملصق]" };
  if (t === "button" || t === "interactive") return { type: t, body: (m.button && m.button.text) || "[رد تفاعلي]" };
  return { type: t, body: `[${t}]` };
}

// Persist inbound messages + delivery-status updates from a Meta webhook event.
async function ingestWebhook(body) {
  const entries = Array.isArray(body.entry) ? body.entry : [];
  for (const entry of entries) {
    const changes = Array.isArray(entry.changes) ? entry.changes : [];
    for (const ch of changes) {
      const v = (ch && ch.value) || {};
      const nameByWa = {};
      for (const c of (v.contacts || [])) if (c && c.wa_id) nameByWa[c.wa_id] = c.profile && c.profile.name;
      // Inbound customer messages.
      for (const m of (v.messages || [])) {
        const d = describeMessage(m);
        await sbWrite("POST", "whatsapp_messages?on_conflict=wam_id", {
          wa_id: m.from,
          contact_name: nameByWa[m.from] || null,
          direction: "in",
          body: d.body,
          msg_type: d.type,
          wam_id: m.id,
          created_at: m.timestamp ? new Date(Number(m.timestamp) * 1000).toISOString() : undefined
        }, "resolution=ignore-duplicates,return=minimal");
      }
      // Delivery/read statuses for messages we sent.
      for (const s of (v.statuses || [])) {
        if (!s || !s.id) continue;
        await sbWrite("PATCH", `whatsapp_messages?wam_id=eq.${encodeURIComponent(s.id)}`,
          { status: s.status }, "return=minimal");
      }
    }
  }
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

  // This endpoint doubles as the Meta WhatsApp webhook AND the admin inbox API
  // (Hobby plan caps us at 12 serverless functions, so they share one file).
  // GET = Meta verification handshake, OR an admin read action (?action=...).
  // Parse the query from req.url with Node's querystring (keeps dotted
  // "hub.mode" keys flat — req.query may nest them).
  if (req.method === "GET") {
    let q = {};
    try { q = require("url").parse(req.url || "", true).query || {}; } catch (e) { q = req.query || {}; }

    // Admin inbox reads.
    if (q.action === "threads" || q.action === "thread") {
      if (!adminOk({ headers: req.headers, query: q })) return res.status(403).json({ error: "unauthorized" });

      if (q.action === "threads") {
        const rows = await sbGet("whatsapp_messages?select=wa_id,contact_name,direction,body,msg_type,read_at,created_at&order=created_at.desc&limit=600") || [];
        const byWa = new Map();
        for (const m of rows) {
          let t = byWa.get(m.wa_id);
          if (!t) { t = { wa_id: m.wa_id, name: null, last_body: m.body, last_dir: m.direction, last_at: m.created_at, unread: 0, last_in_at: null }; byWa.set(m.wa_id, t); }
          if (!t.name && m.contact_name) t.name = m.contact_name;
          if (m.direction === "in") {
            if (!t.last_in_at) t.last_in_at = m.created_at; // rows are desc → first is latest inbound
            if (!m.read_at) t.unread += 1;
          }
        }
        const threads = [...byWa.values()].sort((a, b) => (a.last_at < b.last_at ? 1 : -1));
        return res.status(200).json({ threads });
      }

      // Single conversation: history ascending, then mark its inbound messages read.
      const wa = String(q.wa || "").replace(/\D/g, "");
      if (!wa) return res.status(400).json({ error: "wa required" });
      const msgs = await sbGet(`whatsapp_messages?wa_id=eq.${encodeURIComponent(wa)}&select=id,direction,body,msg_type,status,created_at&order=created_at.asc&limit=500`) || [];
      const lastIn = [...msgs].reverse().find(m => m.direction === "in");
      const canFreeform = !!lastIn && (Date.now() - new Date(lastIn.created_at).getTime() < 24 * 60 * 60 * 1000);
      await sbWrite("PATCH", `whatsapp_messages?wa_id=eq.${encodeURIComponent(wa)}&direction=eq.in&read_at=is.null`,
        { read_at: new Date().toISOString() }, "return=minimal");
      return res.status(200).json({ wa_id: wa, messages: msgs, canFreeform });
    }

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
  let pq = {};
  try { pq = require("url").parse(req.url || "", true).query || {}; } catch (e) { pq = req.query || {}; }

  // POST from Meta = delivery statuses / inbound messages. Store + ack.
  if (body && (body.object === "whatsapp_business_account" || Array.isArray(body.entry))) {
    try { await ingestWebhook(body); } catch (e) { try { console.error("[whatsapp-webhook] ingest", e.message); } catch (_) {} }
    return res.status(200).json({ received: true });
  }

  // Admin inbox writes (password-gated).
  if (pq.action === "login" || pq.action === "reply" || pq.action === "mark-read") {
    if (!adminOk({ headers: req.headers, query: pq })) return res.status(403).json({ error: "unauthorized" });

    if (pq.action === "login") return res.status(200).json({ ok: true });

    if (pq.action === "mark-read") {
      const wa = String(body.wa || pq.wa || "").replace(/\D/g, "");
      if (!wa) return res.status(400).json({ error: "wa required" });
      await sbWrite("PATCH", `whatsapp_messages?wa_id=eq.${encodeURIComponent(wa)}&direction=eq.in&read_at=is.null`,
        { read_at: new Date().toISOString() }, "return=minimal");
      return res.status(200).json({ ok: true });
    }

    // Reply: free-form text to a customer (only delivered inside the 24h window).
    if (!c.token || !c.phoneId) return res.status(200).json({ skipped: true, reason: "whatsapp not configured" });
    const to = toE164(body.to || "", c.cc);
    const text = String(body.text || "").trim();
    if (!to || !text) return res.status(400).json({ error: "to and text required" });
    const sent = await sendWhatsapp(c, to, { text });
    await sbWrite("POST", "whatsapp_messages", {
      wa_id: to, direction: "out", body: text, msg_type: "text",
      wam_id: sent.id || null, status: sent.ok ? "sent" : "failed",
      error: sent.ok ? null : JSON.stringify(sent.error || "").slice(0, 500)
    }, "return=minimal");
    if (!sent.ok) return res.status(502).json({ error: "send failed", detail: sent.error });
    return res.status(200).json({ ok: true, id: sent.id });
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
