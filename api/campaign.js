// WhatsApp marketing campaign management API for Dukkanci.
// Lets the admin create, build, start, pause, cancel, and track bulk campaigns
// that send an approved Meta template to customers extracted from orders.
//
// Actions (all require x-admin-token header):
//   GET  ?action=list              → list all campaigns
//   GET  ?action=status&id=<uuid>  → single campaign status
//   POST ?action=create            → create campaign (name, template_name, template_lang, template_params, audience_type, note)
//   POST ?action=build&id=<uuid>   → build recipient list from orders, saves to wa_campaign_recipients
//   POST ?action=start&id=<uuid>   → set status→sending
//   POST ?action=send-batch&id=<uuid> → send next batch of msgs, call repeatedly until done:true
//   POST ?action=pause&id=<uuid>   → pause
//   POST ?action=resume&id=<uuid>  → resume (sending again)
//   POST ?action=cancel&id=<uuid>  → cancel
//
// Supabase tables required — run scripts/campaign-schema.sql once:
//   wa_campaigns, wa_campaign_recipients, wa_optout

const crypto = require("crypto");

const GRAPH = "https://graph.facebook.com";
const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";

const env = k => (process.env[k] || "").trim();
const DAILY_CAP = 2000; // Meta tier limit received by user
const BATCH_SIZE = 8;   // messages per send-batch call

// ─── Auth ───────────────────────────────────────────────────────────────────

function adminSecret() { return env("ADMIN_SESSION_SECRET") || env("ADMIN_PASSWORD"); }

function verifyAdminToken(token) {
  const secret = adminSecret();
  if (!secret) return false;
  const parts = String(token || "").split(".");
  if (parts.length !== 2) return false;
  let payload;
  try { payload = Buffer.from(parts[0], "base64url").toString("utf8"); } catch (e) { return false; }
  const expect = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(parts[1]);
  const b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  const m = /^exp=(\d+)$/.exec(payload);
  return !!m && Date.now() < Number(m[1]);
}

function adminOk(req) {
  const tok = (req.headers && (req.headers["x-admin-token"] || req.headers["x-admin-key"])) || "";
  if (tok) return verifyAdminToken(tok);
  // also accept raw password in x-admin-key for simpler cron callers
  const pw = env("ADMIN_PASSWORD");
  const rawKey = (req.headers && req.headers["x-admin-key"]) || "";
  return pw && rawKey === pw;
}

// ─── Supabase helpers ────────────────────────────────────────────────────────

function sb() {
  const url = (env("SUPABASE_URL") || PUB_URL).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const key = env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_ANON_KEY") || "";
  return { url, key };
}

async function sbGet(path) {
  const { url, key } = sb();
  try {
    const r = await fetch(`${url}/rest/v1/${path}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
    if (!r.ok) return null;
    return await r.json().catch(() => null);
  } catch (e) { return null; }
}

async function sbWrite(method, path, body, prefer = "return=representation") {
  const { url, key } = sb();
  try {
    const r = await fetch(`${url}/rest/v1/${path}`, {
      method,
      headers: {
        apikey: key, Authorization: `Bearer ${key}`,
        "Content-Type": "application/json", Prefer: prefer
      },
      body: JSON.stringify(body)
    });
    return { ok: r.ok, status: r.status, rows: await r.json().catch(() => null) };
  } catch (e) { return { ok: false, error: e.message }; }
}

// ─── Phone helpers ───────────────────────────────────────────────────────────

// Normalize to E.164 digits (no +), Turkish default country code 90.
function toE164(raw, cc = "90") {
  let d = String(raw == null ? "" : raw).replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith(cc) && d.length >= cc.length + 9) return d;
  if (d.startsWith("0")) d = d.slice(1);
  if (d.length <= 11) d = cc + d;
  return d;
}

// ─── WhatsApp send ───────────────────────────────────────────────────────────

async function sendTemplateMsg(to, templateName, templateLang, params) {
  const token = env("WHATSAPP_TOKEN");
  const phoneId = env("WHATSAPP_PHONE_NUMBER_ID");
  const version = env("WHATSAPP_API_VERSION") || "v21.0";
  if (!token || !phoneId) return { ok: false, error: "whatsapp_not_configured" };

  const components = [];
  if (Array.isArray(params) && params.length > 0) {
    components.push({
      type: "body",
      parameters: params.map(p => ({ type: "text", text: String(p) }))
    });
  }

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: templateLang || "ar" },
      ...(components.length ? { components } : {})
    }
  };

  try {
    const r = await fetch(`${GRAPH}/${version}/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await r.json().catch(() => ({}));
    if (r.ok) return { ok: true, wamid: data?.messages?.[0]?.id };
    // Surface the specific Meta error code for debugging
    return { ok: false, status: r.status, error: data?.error?.message || JSON.stringify(data).slice(0, 200) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ─── Build recipients ────────────────────────────────────────────────────────

async function buildRecipients(campaignId, audienceType) {
  const cc = env("WHATSAPP_DEFAULT_COUNTRY_CODE") || "90";

  let phones = [];

  if (audienceType === "no_order_30d") {
    // Customers who haven't ordered in the last 30 days
    const cutoff = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
    const [allRows, recentRows] = await Promise.all([
      sbGet(`orders?select=customer_phone&not.customer_phone.is.null&limit=5000`),
      sbGet(`orders?select=customer_phone&created_at=gte.${encodeURIComponent(cutoff)}&not.customer_phone.is.null`)
    ]);
    const recent = new Set((recentRows || []).map(r => toE164(r.customer_phone, cc)).filter(Boolean));
    const seen = new Set();
    for (const r of (allRows || [])) {
      const p = toE164(r.customer_phone, cc);
      if (p && !seen.has(p) && !recent.has(p)) { seen.add(p); phones.push(p); }
    }
  } else {
    // all_customers: every unique customer phone that ever ordered
    const rows = await sbGet(`orders?select=customer_phone&not.customer_phone.is.null&order=created_at.desc&limit=5000`);
    const seen = new Set();
    for (const r of (rows || [])) {
      const p = toE164(r.customer_phone, cc);
      if (p && !seen.has(p)) { seen.add(p); phones.push(p); }
    }
  }

  // Remove opted-out phones
  const optouts = await sbGet(`wa_optout?select=phone`) || [];
  const optoutSet = new Set(optouts.map(o => String(o.phone)));
  phones = phones.filter(p => !optoutSet.has(p));

  // Delete any previous stale recipients for this campaign
  await sbWrite("DELETE", `wa_campaign_recipients?campaign_id=eq.${encodeURIComponent(campaignId)}`, undefined, "return=minimal");

  // Insert in chunks of 500 to stay under Supabase payload limits
  const CHUNK = 500;
  for (let i = 0; i < phones.length; i += CHUNK) {
    const rows = phones.slice(i, i + CHUNK).map(phone => ({
      campaign_id: campaignId, phone, status: "pending"
    }));
    await sbWrite("POST", "wa_campaign_recipients", rows, "return=minimal");
  }

  return phones.length;
}

// ─── Send batch ──────────────────────────────────────────────────────────────

async function sendBatch(campaignId) {
  const campaign = (await sbGet(`wa_campaigns?id=eq.${encodeURIComponent(campaignId)}&select=*`))?.[0];
  if (!campaign) return { ok: false, error: "campaign not found" };
  if (!["sending", "paused_daily_limit"].includes(campaign.status) && campaign.status !== "sending") {
    // Accept "sending" only; paused_daily_limit needs a fresh day
    if (campaign.status === "paused_daily_limit") {
      return { ok: false, error: "daily_limit_reached", detail: "حد الإرسال اليومي (2000) وصل. ستُستأنف الحملة غداً تلقائياً أو يمكنك استئنافها يدوياً." };
    }
    return { ok: false, error: `campaign status is "${campaign.status}", not sending` };
  }

  // Count today's sends across ALL campaigns (daily cap enforced per Meta tier)
  const todayStart = new Date(); todayStart.setUTCHours(0, 0, 0, 0);
  const sentTodayRows = await sbGet(`wa_campaign_recipients?sent_at=gte.${encodeURIComponent(todayStart.toISOString())}&status=eq.sent&select=id&limit=2001`);
  const sentToday = (sentTodayRows || []).length;

  if (sentToday >= DAILY_CAP) {
    await sbWrite("PATCH", `wa_campaigns?id=eq.${encodeURIComponent(campaignId)}`,
      { status: "paused_daily_limit" }, "return=minimal");
    return { ok: true, paused: true, reason: "daily_limit", sentToday };
  }

  const allowed = Math.min(BATCH_SIZE, DAILY_CAP - sentToday);

  // Fetch next pending recipients
  const pending = await sbGet(
    `wa_campaign_recipients?campaign_id=eq.${encodeURIComponent(campaignId)}&status=eq.pending&select=id,phone&limit=${allowed}&order=id.asc`
  );

  if (!pending || pending.length === 0) {
    // No more pending → campaign is done
    await sbWrite("PATCH", `wa_campaigns?id=eq.${encodeURIComponent(campaignId)}`,
      { status: "done", finished_at: new Date().toISOString() }, "return=minimal");
    return { ok: true, done: true, sent: 0 };
  }

  const params = Array.isArray(campaign.template_params) ? campaign.template_params : [];
  let sent = 0, failed = 0;

  // Send messages; natural API latency (~300ms each) gives sufficient pacing
  // without artificial sleep — at BATCH_SIZE=8 this is well under 10s
  for (const r of pending) {
    const result = await sendTemplateMsg(r.phone, campaign.template_name, campaign.template_lang || "ar", params);
    const update = result.ok
      ? { status: "sent", sent_at: new Date().toISOString() }
      : { status: "failed", error: String(result.error || "").slice(0, 300) };
    await sbWrite("PATCH", `wa_campaign_recipients?id=eq.${encodeURIComponent(r.id)}`, update, "return=minimal");
    if (result.ok) sent++; else failed++;
  }

  const newSent = (campaign.sent_count || 0) + sent;
  const newFailed = (campaign.failed_count || 0) + failed;
  const total = campaign.total_recipients || 0;
  const allDone = total > 0 && newSent + newFailed >= total;

  await sbWrite("PATCH", `wa_campaigns?id=eq.${encodeURIComponent(campaignId)}`, {
    sent_count: newSent,
    failed_count: newFailed,
    ...(allDone ? { status: "done", finished_at: new Date().toISOString() } : {})
  }, "return=minimal");

  return { ok: true, sent, failed, done: allDone, sentToday: sentToday + sent };
}

// ─── Main handler ────────────────────────────────────────────────────────────

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-key, x-admin-token");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (!adminOk(req)) return res.status(403).json({ error: "unauthorized" });

  const url = new URL(req.url || "/", "http://x");
  const q = url.searchParams;
  const action = q.get("action") || "";
  const id = q.get("id") || "";

  // ── GET endpoints ──
  if (req.method === "GET") {
    if (action === "list") {
      const rows = await sbGet("wa_campaigns?select=*&order=created_at.desc&limit=50");
      return res.json({ ok: true, campaigns: rows || [] });
    }
    if (action === "status") {
      if (!id) return res.status(400).json({ error: "id required" });
      const row = (await sbGet(`wa_campaigns?id=eq.${encodeURIComponent(id)}&select=*`))?.[0];
      if (!row) return res.status(404).json({ error: "not found" });
      return res.json({ ok: true, campaign: row });
    }
    return res.status(400).json({ error: "unknown action" });
  }

  // ── POST endpoints ──
  if (req.method === "POST") {
    // Parse body (Vercel bodyParser is enabled by default)
    let body = req.body || {};
    if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }

    const cid = id || body.id || "";

    if (action === "create") {
      const { name, template_name, template_lang, template_params, audience_type, note } = body;
      if (!name || !template_name) return res.status(400).json({ error: "name و template_name مطلوبان" });
      const row = {
        name,
        template_name,
        template_lang: template_lang || "ar",
        template_params: Array.isArray(template_params) ? template_params : [],
        audience_type: audience_type || "all_customers",
        status: "draft",
        sent_count: 0,
        failed_count: 0,
        total_recipients: 0,
        note: note || null
      };
      const r = await sbWrite("POST", "wa_campaigns", row);
      if (!r.ok) return res.status(500).json({ error: "فشل في إنشاء الحملة", detail: r.rows });
      const created = Array.isArray(r.rows) ? r.rows[0] : r.rows;
      return res.json({ ok: true, campaign: created });
    }

    if (!cid) return res.status(400).json({ error: "id required" });

    if (action === "build") {
      const camp = (await sbGet(`wa_campaigns?id=eq.${encodeURIComponent(cid)}&select=audience_type`))?.[0];
      if (!camp) return res.status(404).json({ error: "campaign not found" });
      const total = await buildRecipients(cid, camp.audience_type || "all_customers");
      await sbWrite("PATCH", `wa_campaigns?id=eq.${encodeURIComponent(cid)}`,
        { status: "ready", total_recipients: total }, "return=minimal");
      return res.json({ ok: true, total });
    }

    if (action === "start") {
      await sbWrite("PATCH", `wa_campaigns?id=eq.${encodeURIComponent(cid)}`,
        { status: "sending", started_at: new Date().toISOString() }, "return=minimal");
      return res.json({ ok: true });
    }

    if (action === "send-batch") {
      const result = await sendBatch(cid);
      return res.json(result);
    }

    if (action === "pause") {
      await sbWrite("PATCH", `wa_campaigns?id=eq.${encodeURIComponent(cid)}`,
        { status: "paused" }, "return=minimal");
      return res.json({ ok: true });
    }

    if (action === "resume") {
      await sbWrite("PATCH", `wa_campaigns?id=eq.${encodeURIComponent(cid)}`,
        { status: "sending" }, "return=minimal");
      return res.json({ ok: true });
    }

    if (action === "cancel") {
      await sbWrite("PATCH", `wa_campaigns?id=eq.${encodeURIComponent(cid)}`,
        { status: "canceled", finished_at: new Date().toISOString() }, "return=minimal");
      return res.json({ ok: true });
    }

    return res.status(400).json({ error: "unknown action" });
  }

  return res.status(405).json({ error: "method not allowed" });
};
