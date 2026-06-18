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
    tplStatus: env("WHATSAPP_TEMPLATE_STATUS") || "order_status_update",
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

// Canned auto-replies for the WhatsApp Manager commands + ice breakers. The
// customer taps a command (e.g. "/delivery") or an ice breaker, it arrives here
// as an inbound message, and we reply instantly with the matching info. Sent as
// free-form text — allowed because the customer just messaged (24h service
// window). Unrecognized messages get no auto-reply (the team answers from the inbox).
const SITE_URL = "https://www.dukkanci.com.tr";
const REPLY_ORDER = `🛒 لطلب من دكانجي:\n1) افتح الموقع: ${SITE_URL}\n2) اختر متجرك والمنتجات وأضِفها إلى السلة.\n3) أكمل الطلب واختر التوصيل أو الاستلام من المتجر.\nستصلك رسالة تأكيد فور إرسال الطلب، وتحديثات حالته أولاً بأول. 🌟`;
const REPLY_TRACK = `📦 لتتبّع طلبك:\n• افتح «طلباتي» في الموقع لمتابعة الحالة لحظياً.\n• أو أرسل لنا رقم طلبك (مثل DK-1234567) وسنوافيك بحالته.\nوتصلك تحديثات الحالة تلقائياً عبر واتساب عند كل مرحلة. 🚚`;
const REPLY_DELIVERY = `🚚 التوصيل في دكانجي:\n• يُحسب حسب المسافة بين المتجر وعنوانك، وتظهر الرسوم والوقت المتوقّع بدقّة عند إتمام الطلب.\n• نخدم أحياء إسطنبول، ويختلف النطاق حسب كل متجر.\n• يمكنك أيضاً الاستلام من المتجر مجاناً. 🏪`;
const REPLY_OFFERS = `🎁 لمشاهدة أحدث العروض والخصومات، افتح قسم «العروض» في الموقع:\n${SITE_URL}\nتتجدّد العروض باستمرار فتابعنا! ✨`;
const REPLY_STORES = `🏪 لتصفّح المتاجر والأقسام المتوفرة قرب عنوانك، افتح:\n${SITE_URL}\nمطاعم وبقالات ومتاجر متنوّعة بين يديك. 🛍️`;
const REPLY_SUPPORT = `💬 نحن هنا لمساعدتك! اكتب استفسارك في رسالة وسيردّ عليك فريق دعم دكانجي في أقرب وقت.\nويمكنك تصفّح الأسئلة الشائعة على: ${SITE_URL}`;
const REPLY_MERCHANT = `🤝 يسعدنا انضمامك كتاجر في دكانجي!\nأرسل لنا اسم متجرك ونوع نشاطه ومنطقته، وسيتواصل معك فريقنا لإتمام الإضافة وبدء استقبال الطلبات. 🚀`;
const REPLY_WELCOME = `أهلاً بك في دكانجي! 🛍️\nسوق الحي بين يديك — متاجر ومطاعم وبقالات حيّك في إسطنبول.\nكيف نساعدك؟ اكتب «/» لرؤية الخيارات السريعة، أو أخبرنا باستفسارك وسيردّ فريقنا. 🌟`;
const REPLY_AWAY = `شكراً لتواصلك مع دكانجي! 🌙\nفريقنا خارج أوقات العمل حالياً (نعمل يومياً ٩ صباحاً–١١ مساءً بتوقيت إسطنبول)، وسنردّ فور بدء الدوام.\nوللطلب في أي وقت، الموقع متاح على مدار الساعة: ${SITE_URL}`;

const COMMAND_REPLIES = {
  "/order": REPLY_ORDER, "/track": REPLY_TRACK, "/delivery": REPLY_DELIVERY,
  "/offers": REPLY_OFFERS, "/stores": REPLY_STORES, "/support": REPLY_SUPPORT, "/merchant": REPLY_MERCHANT
};
const ICEBREAKER_REPLIES = {
  "كيف أطلب من دكانجي؟": REPLY_ORDER,
  "ما هي مناطق التوصيل والرسوم؟": REPLY_DELIVERY,
  "أين وصل طلبي؟": REPLY_TRACK,
  "أريد إضافة متجري إلى دكانجي": REPLY_MERCHANT
};
function autoReplyFor(raw) {
  const text = String(raw == null ? "" : raw).trim();
  if (!text) return null;
  const first = text.split(/\s+/)[0].toLowerCase();          // "/delivery" from "/delivery من فضلك"
  if (first.charAt(0) === "/" && COMMAND_REPLIES[first]) return COMMAND_REPLIES[first];
  return ICEBREAKER_REPLIES[text.replace(/\s+/g, " ")] || null;
}
// Send a free-form auto-reply to the customer and log it to the inbox thread.
async function sendAutoReply(to, text) {
  const c = cfg();
  if (!c.token || !c.phoneId) return;
  const sent = await sendWhatsapp(c, to, { text });
  await sbWrite("POST", "whatsapp_messages", {
    wa_id: to, direction: "out", body: text, msg_type: "text",
    wam_id: sent.id || null, status: sent.ok ? "sent" : "failed",
    error: sent.ok ? null : JSON.stringify(sent.error || "").slice(0, 500)
  }, "return=minimal");
}

// Dukkanci WhatsApp support hours (Istanbul = UTC+3, no DST): open 09:00–23:00.
function isOutsideHours() {
  const h = (new Date().getUTCHours() + 3) % 24;
  return h < 9 || h >= 23;
}
// For unrecognized messages (those needing a human), greet a new conversation or
// send an out-of-hours notice — once per new conversation (first message, or the
// first after a 12h gap) so we never spam. Needs DB access to detect "new"; if it
// is unavailable we skip rather than send blindly.
async function maybeGreetOrAway(wa_id, timestamp) {
  const ts = timestamp ? new Date(Number(timestamp) * 1000).toISOString() : new Date().toISOString();
  const recent = await sbGet(`whatsapp_messages?wa_id=eq.${encodeURIComponent(wa_id)}&direction=eq.in&created_at=lt.${encodeURIComponent(ts)}&select=created_at&order=created_at.desc&limit=1`);
  if (!Array.isArray(recent)) return;
  const previous = recent[0];
  const NEW_SESSION_MS = 12 * 60 * 60 * 1000;
  const isNew = !previous || (Date.now() - new Date(previous.created_at).getTime() > NEW_SESSION_MS);
  if (!isNew) return;
  await sendAutoReply(wa_id, isOutsideHours() ? REPLY_AWAY : REPLY_WELCOME);
}

// AI auto-reply (OpenAI / ChatGPT). Answers free-text customer questions about
// Dukkanci. Single Chat Completions call over raw fetch (no SDK dep — matches the
// rest of this file). Model defaults to gpt-4o-mini (cheap + fast, well-suited to
// a customer-service bot), overridable via OPENAI_MODEL. Returns the reply text,
// or null when the key is unset / the call fails — callers fall back to the
// static welcome/away message.
const AI_SYSTEM = `أنت «مساعد دكانجي»، مساعد خدمة عملاء لمنصّة دكانجي — سوق الحي الإلكتروني في إسطنبول يجمع متاجر ومطاعم وبقالات الحيّ للطلب مع التوصيل أو الاستلام.
أسلوبك: ردّ بإيجاز ووضوح وودّ (جملتان إلى ثلاث كحد أقصى)، وبنفس لغة العميل (عربية غالباً، وقد تكون تركية أو إنجليزية).
تساعد في: كيفية الطلب، التوصيل والاستلام ومناطقه ورسومه، تصفّح المتاجر والأقسام، العروض، وانضمام التجار، والأسئلة العامة عن المنصة.
إرشادات مهمة:
- للطلب وجّه العميل إلى الموقع https://www.dukkanci.com.tr ليختار المتجر والمنتجات ويكمل الطلب. رسوم التوصيل تُحسب حسب المسافة وتظهر بدقّة عند إتمام الطلب، والاستلام من المتجر مجاني.
- لا تعرف تفاصيل طلب معيّن أو حالته أو بيانات الحساب أو الدفع. إن سُئلت عن حالة طلب اطلب رقمه (مثل DK-1234567) وأخبر العميل أن الفريق سيتابع، أو وجّهه إلى «طلباتي» في الموقع.
- لا تختلق أسعاراً أو أرقاماً أو أوقاتاً أو وعوداً؛ إن لم تكن متأكداً قل ذلك ووجّه العميل للفريق.
- لا تطلب أبداً بيانات حساسة (أرقام بطاقات، كلمات مرور، رموز).
- للشكاوى أو الأمور المعقّدة التي تحتاج تدخّلاً بشرياً، اعتذر بلطف وأخبر العميل أن فريق دكانجي سيتواصل معه قريباً.
أجب مباشرةً بالرسالة النهائية فقط دون شرح طريقة تفكيرك.`;
async function aiReply(text, wa_id, timestamp) {
  const key = env("OPENAI_API_KEY");
  if (!key) return null;
  const model = env("OPENAI_MODEL") || "gpt-4o-mini";
  // OpenAI takes the system prompt as the first message. Add light conversation
  // context (prior messages, oldest→newest) when the DB is available.
  const messages = [{ role: "system", content: AI_SYSTEM }];
  try {
    const ts = timestamp ? new Date(Number(timestamp) * 1000).toISOString() : new Date().toISOString();
    const rows = await sbGet(`whatsapp_messages?wa_id=eq.${encodeURIComponent(wa_id)}&created_at=lt.${encodeURIComponent(ts)}&select=direction,body&order=created_at.desc&limit=8`);
    if (Array.isArray(rows)) {
      rows.reverse().forEach(r => {
        const content = String(r.body || "").slice(0, 1000);
        if (content) messages.push({ role: r.direction === "in" ? "user" : "assistant", content });
      });
    }
  } catch (e) { /* no history → stateless reply */ }
  messages.push({ role: "user", content: String(text == null ? "" : text).slice(0, 2000) });
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000); // keep the webhook within serverless limits
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, max_tokens: 500, temperature: 0.4, messages }),
      signal: ctrl.signal
    });
    const data = await r.json().catch(() => null);
    if (!r.ok || !data) return null;
    const msg = data.choices && data.choices[0] && data.choices[0].message;
    const out = msg && msg.content ? String(msg.content).trim() : "";
    return out || null;
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
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
        const ins = await sbWrite("POST", "whatsapp_messages?on_conflict=wam_id", {
          wa_id: m.from,
          contact_name: nameByWa[m.from] || null,
          direction: "in",
          body: d.body,
          msg_type: d.type,
          wam_id: m.id,
          created_at: m.timestamp ? new Date(Number(m.timestamp) * 1000).toISOString() : undefined
        }, "resolution=ignore-duplicates,return=representation");
        // Auto-reply to recognized commands / ice breakers. Skip only when the
        // insert succeeded but stored nothing (a duplicate webhook retry) so we
        // never reply twice; if storage is unavailable we still reply.
        const dup = ins && ins.ok && Array.isArray(ins.rows) && ins.rows.length === 0;
        if (!dup && d.type === "text" && m.from) {
          const reply = autoReplyFor(d.body);
          if (reply) {
            try { await sendAutoReply(m.from, reply); } catch (e) {}     // command / ice breaker → static
          } else {
            let ai = null;
            try { ai = await aiReply(d.body, m.from, m.timestamp); } catch (e) {}  // free text → AI
            if (ai) { try { await sendAutoReply(m.from, ai); } catch (e) {} }
            else { try { await maybeGreetOrAway(m.from, m.timestamp); } catch (e) {} }  // fallback
          }
        }
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

// Default customer-facing line for each order status, used when the merchant
// leaves the note blank. Mirrors the statuses in app.js's order manager.
function statusMessage(status) {
  const m = {
    "تم القبول": "تم قبول طلبك وسيبدأ تجهيزه قريباً.",
    "قيد التجهيز": "يجري تجهيز طلبك الآن.",
    "جاهز للاستلام": "طلبك جاهز للاستلام من المتجر.",
    "خرج للتوصيل": "طلبك في الطريق إليك الآن.",
    "مكتمل": "تم إكمال طلبك. شكراً لاستخدامك دكانجي!",
    "تم التوصيل": "تم توصيل طلبك. شكراً لاستخدامك دكانجي!",
    "تم الاستلام": "تم تسليم طلبك. شكراً لاستخدامك دكانجي!",
    "مرفوضة": "نعتذر، تعذّر على المتجر قبول طلبك حالياً. للاستفسار تواصل معنا.",
    "ملغى": "تم إلغاء طلبك. لأي استفسار تواصل معنا."
  };
  return m[status] || ("حالة طلبك الآن: " + status + ".");
}

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

  // Customer order-status notification: the merchant advanced the order, so tell
  // the customer the new status. Business-initiated → uses the approved
  // `order_status_update` template. The merchant client sends the order id,
  // customer phone, store name, the new status, and an optional note.
  if (pq.action === "status") {
    if (!c.token || !c.phoneId) return res.status(200).json({ skipped: true, reason: "whatsapp not configured" });
    const id = String(body.id || "").trim();
    const status = String(body.status || "").trim();
    if (!id || !status) return res.status(400).json({ error: "id and status required" });
    const custTo = toE164(body.customerPhone || "", c.cc);
    if (!custTo) return res.status(200).json({ skipped: true, reason: "no customer phone" });
    const storeName = String(body.storeName || "المتجر").trim();
    const note = String(body.note || "").replace(/\s+/g, " ").trim();
    const line = note || statusMessage(status);
    const params = [id, storeName, status, line];
    const sent = await sendWhatsapp(c, custTo, { template: c.tplStatus, params, text: `تحديث طلبك ${id} من ${storeName}: ${status}. ${line}` });
    if (!sent.ok) return res.status(502).json({ error: "send failed", detail: sent.error });
    return res.status(200).json({ ok: true, id: sent.id });
  }

  // Admin: save editable site content (e.g. the subscription plan) into the
  // public site_settings table. Admin-gated; writes with the service-role key
  // (bypasses RLS — the table is public-read only, no public write).
  if (pq.action === "save-settings") {
    if (!adminOk({ headers: req.headers, query: pq })) return res.status(403).json({ error: "unauthorized" });
    const key = String(body.key || "").trim();
    if (!key) return res.status(400).json({ error: "key required" });
    const r = await sbWrite("POST", "site_settings?on_conflict=key", { key, value: body.value, updated_at: new Date().toISOString() }, "resolution=merge-duplicates,return=minimal");
    if (!r.ok) return res.status(502).json({ error: "save failed", detail: r.rows || r.error });
    return res.status(200).json({ ok: true });
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
