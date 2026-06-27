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

// params: array of body text params
// buttonUrlSuffix: string suffix for a dynamic URL button {{1}}
// headerImageUrl: URL of image for dynamic image header
async function sendTemplateMsg(to, templateName, templateLang, params, buttonUrlSuffix, headerImageUrl) {
  const token = env("WHATSAPP_TOKEN");
  const phoneId = env("WHATSAPP_PHONE_NUMBER_ID");
  const version = env("WHATSAPP_API_VERSION") || "v21.0";
  if (!token || !phoneId) return { ok: false, error: "whatsapp_not_configured" };

  const components = [];
  if (headerImageUrl) {
    components.push({
      type: "header",
      parameters: [{ type: "image", image: { link: headerImageUrl } }]
    });
  }
  if (Array.isArray(params) && params.length > 0) {
    components.push({
      type: "body",
      parameters: params.map(p => ({ type: "text", text: String(p) }))
    });
  }
  if (buttonUrlSuffix !== undefined && buttonUrlSuffix !== null) {
    components.push({
      type: "button",
      sub_type: "url",
      index: "0",
      parameters: [{ type: "text", text: String(buttonUrlSuffix) }]
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

// ─── Contacts upload ─────────────────────────────────────────────────────────

// Parse a raw text blob into a clean list of E.164 phones.
// Accepts: one number per line, CSV, spaces, mixed formats, optional names.
function parsePhoneList(raw, cc = "90") {
  const seen = new Set();
  const phones = [];
  // Split on newlines, commas, semicolons
  const tokens = String(raw || "").split(/[\n\r,;]+/);
  for (const tok of tokens) {
    // Strip everything except digits and leading +
    const cleaned = tok.replace(/[^\d+]/g, "");
    const p = toE164(cleaned, cc);
    if (p && p.length >= 10 && !seen.has(p)) { seen.add(p); phones.push(p); }
  }
  return phones;
}

async function upsertContacts(phones, groupName) {
  const CHUNK = 500;
  let inserted = 0;
  for (let i = 0; i < phones.length; i += CHUNK) {
    const rows = phones.slice(i, i + CHUNK).map(phone => ({
      phone, group_name: groupName || "default", source: "manual"
    }));
    // ON CONFLICT (phone): update group_name so re-uploading a number to a new group moves it
    const r = await sbWrite("POST", "wa_contacts", rows,
      "resolution=merge-duplicates,return=minimal");
    if (r.ok) inserted += rows.length;
  }
  return inserted;
}

// Return each group_name with its contact count
async function getContactGroups() {
  const rows = await sbGet("wa_contacts?select=group_name&limit=10000") || [];
  const counts = {};
  for (const r of rows) { const g = r.group_name || "default"; counts[g] = (counts[g] || 0) + 1; }
  return Object.entries(counts).map(([group_name, count]) => ({ group_name, count }))
    .sort((a, b) => b.count - a.count);
}

// ─── Build recipients ────────────────────────────────────────────────────────

async function buildRecipients(campaignId, audienceType, campaign) {
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
  } else if (audienceType === "wa_contacts") {
    // Uploaded contacts — optionally filtered to a specific group
    const groupFilter = campaign?.contact_group;
    const path = groupFilter
      ? `wa_contacts?select=phone&group_name=eq.${encodeURIComponent(groupFilter)}&limit=10000`
      : `wa_contacts?select=phone&limit=10000`;
    const rows = await sbGet(path);
    const seen = new Set();
    for (const r of (rows || [])) {
      const p = toE164(r.phone, cc);
      if (p && !seen.has(p)) { seen.add(p); phones.push(p); }
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
  if (campaign.status === "paused_daily_limit") {
    return { ok: false, error: "daily_limit_reached", detail: "حد الإرسال اليومي (2000) وصل." };
  }
  if (campaign.status !== "sending") {
    return { ok: false, error: `campaign_not_sending`, status: campaign.status };
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
    const result = await sendTemplateMsg(r.phone, campaign.template_name, campaign.template_lang || "ar", params, campaign.button_url_param ?? undefined, campaign.header_image_url || null);
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
    if (action === "contacts-count") {
      const rows = await sbGet("wa_contacts?select=id&limit=1&count=exact") || [];
      // Supabase returns count in Content-Range header; fall back to row count
      return res.json({ ok: true, count: Array.isArray(rows) ? rows.length : 0 });
    }
    if (action === "contacts-list") {
      const rows = await sbGet("wa_contacts?select=phone,group_name,created_at&order=created_at.desc&limit=20");
      const total = await sbGet("wa_contacts?select=id&limit=10000");
      return res.json({ ok: true, contacts: rows || [], total: (total || []).length });
    }
    if (action === "contacts-groups") {
      const groups = await getContactGroups();
      return res.json({ ok: true, groups });
    }
    if (action === "template-inspect") {
      const { template_name } = req.query;
      if (!template_name) return res.status(400).json({ error: "template_name required" });
      const token = env("WHATSAPP_TOKEN");
      const wabaId = env("WHATSAPP_WABA_ID") || "1365756035460473";
      const version = env("WHATSAPP_API_VERSION") || "v21.0";
      const r = await fetch(`https://graph.facebook.com/${version}/${wabaId}/message_templates?name=${encodeURIComponent(template_name)}&fields=name,status,language,components`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await r.json();
      return res.json({ ok: r.ok, data });
    }
    // Fetch failed recipients with their error messages for debugging
    if (action === "errors") {
      if (!id) return res.status(400).json({ error: "id required" });
      const rows = await sbGet(
        `wa_campaign_recipients?campaign_id=eq.${encodeURIComponent(id)}&status=eq.failed&select=phone,error,sent_at&limit=50&order=id.asc`
      );
      return res.json({ ok: true, errors: rows || [] });
    }
    if (action === "images-list") {
      const { url, key } = sb();
      const r = await fetch(`${url}/storage/v1/object/list/campaign-images`, {
        method: "POST",
        headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 100, offset: 0, sortBy: { column: "created_at", order: "desc" } })
      });
      const files = await r.json().catch(() => []);
      const images = Array.isArray(files) ? files.map(f => ({
        name: f.name,
        url: `/media/campaign-images/${f.name}`,
        size: f.metadata?.size,
        created_at: f.created_at
      })) : [];
      return res.json({ ok: true, images });
    }
    return res.status(400).json({ error: "unknown action" });
  }

  // ── Image upload (POST /api/campaign?action=image-upload) ──
  if (req.method === "POST" && action === "image-upload") {
    const { url, key } = sb();
    const filename = q.get("filename") || `img_${Date.now()}.jpg`;
    const contentType = (req.headers["content-type"] || "image/jpeg").split(";")[0].trim();

    // Vercel may buffer the body into req.body (Buffer) or leave it as a stream
    let buffer;
    if (req.body && (Buffer.isBuffer(req.body) || typeof req.body === "string")) {
      buffer = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body, "binary");
    } else if (req.body && typeof req.body === "object" && !Array.isArray(req.body)) {
      // Vercel parsed binary as object — unlikely but guard
      buffer = Buffer.from(JSON.stringify(req.body));
    } else {
      const chunks = [];
      for await (const chunk of req) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      buffer = Buffer.concat(chunks);
    }

    if (!buffer || buffer.length === 0) return res.status(400).json({ error: "empty file" });

    const r = await fetch(`${url}/storage/v1/object/campaign-images/${encodeURIComponent(filename)}`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": contentType, "x-upsert": "true" },
      body: buffer
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(r.status).json({ error: data.message || data.error || "upload failed", detail: data });
    const publicUrl = `/media/campaign-images/${encodeURIComponent(filename)}`;
    return res.json({ ok: true, url: publicUrl, name: filename });
  }

  // ── POST endpoints ──
  if (req.method === "POST") {
    // Parse body (Vercel bodyParser is enabled by default)
    let body = req.body || {};
    if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }

    const cid = id || body.id || "";

    if (action === "update-params") {
      if (!cid) return res.status(400).json({ error: "id required" });
      const { template_params, button_url_param, keep_params } = body;
      const { header_image_url } = body;
      const patch = { status: "ready", sent_count: 0, failed_count: 0 };
      if (!keep_params) {
        patch.template_params = Array.isArray(template_params) ? template_params : [];
        if (button_url_param !== undefined) patch.button_url_param = button_url_param;
        if (header_image_url !== undefined) patch.header_image_url = header_image_url;
      }
      // Reset failed → pending first, then count actual pending to fix total_recipients
      await sbWrite("PATCH", `wa_campaign_recipients?campaign_id=eq.${encodeURIComponent(cid)}&status=eq.failed`,
        { status: "pending", error: null, sent_at: null }, "return=minimal");
      const allPending = await sbGet(`wa_campaign_recipients?campaign_id=eq.${encodeURIComponent(cid)}&status=eq.pending&select=id&limit=10000`);
      patch.total_recipients = (allPending || []).length;
      await sbWrite("PATCH", `wa_campaigns?id=eq.${encodeURIComponent(cid)}`, patch, "return=minimal");
      return res.json({ ok: true });
    }

    if (action === "create") {
      const { name, template_name, template_lang, template_params, audience_type, contact_group, note, button_url_param: bup, header_image_url: hiu } = body;
      if (!name || !template_name) return res.status(400).json({ error: "name و template_name مطلوبان" });
      const row = {
        name,
        template_name,
        template_lang: template_lang || "ar",
        template_params: Array.isArray(template_params) ? template_params : [],
        audience_type: audience_type || "all_customers",
        contact_group: (audience_type === "wa_contacts" && contact_group) ? contact_group : null,
        status: "draft",
        sent_count: 0,
        failed_count: 0,
        total_recipients: 0,
        note: note || null,
        ...(bup ? { button_url_param: bup } : {}),
        ...(hiu ? { header_image_url: hiu } : {})
      };
      const r = await sbWrite("POST", "wa_campaigns", row);
      if (!r.ok) return res.status(500).json({ error: "فشل في إنشاء الحملة", detail: r.rows });
      const created = Array.isArray(r.rows) ? r.rows[0] : r.rows;
      return res.json({ ok: true, campaign: created });
    }

    // Upload contacts (no campaign id needed)
    if (action === "upload-contacts") {
      const { phones: rawPhones, text: rawText, group_name } = body;
      const cc = env("WHATSAPP_DEFAULT_COUNTRY_CODE") || "90";
      let phones = [];
      if (Array.isArray(rawPhones)) {
        phones = rawPhones.map(p => toE164(String(p), cc)).filter(Boolean);
        const seen = new Set(); phones = phones.filter(p => { if (seen.has(p)) return false; seen.add(p); return true; });
      } else if (rawText) {
        phones = parsePhoneList(rawText, cc);
      }
      if (!phones.length) return res.status(400).json({ error: "لا أرقام صالحة في القائمة" });
      await upsertContacts(phones, group_name || "default");
      // Return fresh total
      const total = await sbGet("wa_contacts?select=id&limit=10000");
      return res.json({ ok: true, added: phones.length, total: (total || []).length });
    }

    // Clear all contacts
    if (action === "contacts-clear") {
      await sbWrite("DELETE", "wa_contacts?id=not.is.null", undefined, "return=minimal");
      return res.json({ ok: true });
    }

    // Delete a specific group
    if (action === "contacts-clear-group") {
      const { group_name } = body;
      if (!group_name) return res.status(400).json({ error: "group_name required" });
      await sbWrite("DELETE", `wa_contacts?group_name=eq.${encodeURIComponent(group_name)}`, undefined, "return=minimal");
      return res.json({ ok: true });
    }

    if (!cid) return res.status(400).json({ error: "id required" });

    if (action === "build") {
      const camp = (await sbGet(`wa_campaigns?id=eq.${encodeURIComponent(cid)}&select=*`))?.[0];
      if (!camp) return res.status(404).json({ error: "campaign not found" });
      const total = await buildRecipients(cid, camp.audience_type || "all_customers", camp);
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
