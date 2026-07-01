// AI Management admin API — provider/key registry + per-feature config + test.
// Powers the "الذكاء الاصطناعي" admin tab. Admin-gated (same session token as the
// rest of the panel). All DB access uses the service-role key inside the gateway
// library, so the anon client can never read API keys. API keys are returned to
// the UI MASKED (last 4 chars only) and never in full.
const crypto = require("crypto");
const gw = require("../lib/ai-gateway");
const kb = require("../lib/knowledge");
const gi = require("../lib/google-indexing");

const env = k => (process.env[k] || "").trim();
const SITE = (env("NEXT_PUBLIC_SITE_URL") || "https://www.dukkanci.com.tr").replace(/\/+$/, "");

// ── Admin auth (mirrors api/notify-order.js so the same login token works) ──
function adminSecret() { return env("ADMIN_SESSION_SECRET") || env("ADMIN_PASSWORD"); }
function verifyAdminToken(token) {
  const secret = adminSecret();
  if (!secret) return false;
  const parts = String(token || "").split(".");
  if (parts.length !== 2) return false;
  let payload;
  try { payload = Buffer.from(parts[0], "base64url").toString("utf8"); } catch (e) { return false; }
  const expect = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(parts[1]), b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  const m = /^exp=(\d+)$/.exec(payload);
  return !!m && Date.now() < Number(m[1]);
}
function adminPasswordOk(req) {
  const expected = env("ADMIN_PASSWORD");
  if (!expected) return false;
  const got = (req.headers && req.headers["x-admin-key"]) || "";
  if (!got) return false;
  const a = Buffer.from(String(got)), b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function adminOk(req) {
  return verifyAdminToken(req.headers && req.headers["x-admin-token"]) || adminPasswordOk(req);
}

const FEATURES = ["whatsapp_autoreply", "image_enhancement", "synonym_generation", "embeddings"];

// Chunk → embed (batched) → bulk-insert chunks, then flip the document status.
// Returns the chunk count (0 on failure, with the document marked 'failed').
async function ingestDocument(documentId, text) {
  const chunks = kb.chunkText(text);
  const fail = async (error) => { await gw.sbWrite("PATCH", `knowledge_documents?id=eq.${documentId}`, { status: "failed", error }, "return=minimal"); return 0; };
  if (!chunks.length) return fail("لا يوجد نص قابل للفهرسة");
  const BATCH = 96; // stay under the embeddings input cap
  const rows = [];
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    const vectors = await gw.embed("embeddings", batch);
    if (!Array.isArray(vectors) || vectors.length !== batch.length) return fail("فشل توليد المتجهات (تحقّق من مفتاح embeddings)");
    batch.forEach((content, j) => rows.push({ document_id: documentId, content, embedding: "[" + vectors[j].join(",") + "]" }));
  }
  const ins = await gw.sbWrite("POST", "knowledge_chunks", rows, "return=minimal");
  if (!ins.ok) return fail("فشل تخزين المقاطع");
  await gw.sbWrite("PATCH", `knowledge_documents?id=eq.${documentId}`, { status: "ready", chunk_count: rows.length, error: null }, "return=minimal");
  return rows.length;
}

// ───────────────────────── Product synonyms (Phase 4) ──────────────────────
// Generates dialect alternate-names for product names via the AI gateway (feature
// "synonym_generation"), stores them in product_synonyms, and pushes indexed
// product URLs to Google. The heavy generation runs in small client-driven
// batches so it stays under the function timeout for the whole ~6.5k-name catalog.
const SYN_SYSTEM = [
  "أنت خبير باللهجات العربية وبأسماء منتجات البقالة والمطاعم في المطبخين العربي والتركي.",
  "لكل اسم منتج يصلك، استخرج الكلمات المرادفة والأسماء البديلة الشائعة التي قد يبحث بها زبون عربي عن المنتج نفسه باختلاف اللهجات.",
  "- غطِّ اللهجات: شامي، مصري، خليجي، مغاربي، عراقي، والفصحى، وأضِف الاسم التركي/اللاتيني الشائع إن كان المنتج يُعرف به في تركيا.",
  "- أعطِ مرادفات حقيقية يبحث بها الناس فقط (كلمات أو تسميات قصيرة، لا جُمَلاً ولا وصفاً)، ولا تُكرّر الاسم الأصلي حرفياً.",
  "- إن كان الاسم ماركة تجارية فأبقِها وأضِف تهجئات/نطقاً شائعاً فقط.",
  "- من 0 إلى 4 كلمات لكل لهجة، واترك القائمة فارغة إن لم يوجد مرادف مميّز لتلك اللهجة.",
  'أعِد JSON فقط بلا أي شرح، بالشكل: {"results":[{"name":"<الاسم كما وصلك حرفياً>","dialects":{"شامي":[],"مصري":[],"خليجي":[],"مغاربي":[],"عراقي":[],"فصحى":[],"تركي":[]}}]}'
].join("\n");

const synNorm = s => String(s == null ? "" : s).toLowerCase().replace(/\s+/g, " ").trim();

// Pull the first {...} JSON object out of a model reply (tolerates ``` fences / prose).
function extractJson(raw) {
  if (raw == null) return null;
  let s = String(raw).trim().replace(/^```(?:json)?/i, "").replace(/```\s*$/i, "").trim();
  const a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a === -1 || b === -1 || b < a) return null;
  try { return JSON.parse(s.slice(a, b + 1)); } catch (e) { return null; }
}

// Turn one model result into { synonyms:[flat, deduped], dialects:{key:[...]} }.
function buildEntry(entry, originalName) {
  const dialects = {}, flat = [], seen = new Set();
  const orig = synNorm(originalName);
  const d = (entry && entry.dialects && typeof entry.dialects === "object" && !Array.isArray(entry.dialects)) ? entry.dialects : {};
  for (const key of Object.keys(d)) {
    const arr = Array.isArray(d[key]) ? d[key] : [];
    const clean = [];
    for (let term of arr) {
      term = String(term == null ? "" : term).replace(/\s+/g, " ").trim();
      if (!term || term.length > 60) continue;
      const n = synNorm(term);
      if (n === orig || seen.has(n)) continue;
      seen.add(n); clean.push(term); flat.push(term);
    }
    if (clean.length) dialects[key] = clean;
  }
  return { synonyms: flat.slice(0, 24), dialects };
}

async function synStats() {
  const r = await gw.sbWrite("POST", "rpc/product_synonyms_stats", {}, "return=representation");
  let s = r.ok ? r.rows : null;
  if (Array.isArray(s)) s = s[0];
  return (s && typeof s === "object") ? s : { total: 0, done: 0, pending: 0, failed: 0, indexed: 0, distinct_names: 0 };
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  let q = {};
  try { q = require("url").parse(req.url || "", true).query || {}; } catch (e) { q = req.query || {}; }
  const action = q.action || "";

  if (!adminOk(req)) return res.status(403).json({ error: "unauthorized" });

  // ── Reads (GET) ──────────────────────────────────────────────────────────
  if (req.method === "GET") {
    if (action === "overview") {
      const providers = (await gw.sbGet("ai_providers?select=id,provider_name,label,service_type,key_hint,default_model,is_active,created_at&order=created_at.asc")) || [];
      const features = (await gw.sbGet("ai_feature_config?select=feature_name,provider_id,model_override,is_enabled,settings")) || [];
      // Usage totals for the last 30 days, grouped per feature.
      const since = new Date(Date.now() - 30 * 864e5).toISOString();
      const usageRows = (await gw.sbGet(`ai_usage_log?created_at=gte.${encodeURIComponent(since)}&select=feature,units,est_cost,ok&limit=10000`)) || [];
      const usage = {};
      for (const u of usageRows) {
        const f = u.feature || "?";
        if (!usage[f]) usage[f] = { calls: 0, tokens: 0, cost: 0, errors: 0 };
        usage[f].calls += 1;
        usage[f].tokens += Number(u.units || 0);
        usage[f].cost += Number(u.est_cost || 0);
        if (u.ok === false) usage[f].errors += 1;
      }
      const hasEnc = !!(env("KEY_ENCRYPTION_SECRET") || env("ADMIN_SESSION_SECRET") || env("ADMIN_PASSWORD"));
      return res.status(200).json({ providers, features, usage, hasEncryptionSecret: hasEnc });
    }
    // Knowledge base: list documents + totals.
    if (action === "kb-list") {
      const docs = (await gw.sbGet("knowledge_documents?select=id,file_name,source_type,scope,store_id,status,error,chunk_count,created_at&order=created_at.desc&limit=500")) || [];
      const totalChunks = docs.reduce((s, d) => s + (d.chunk_count || 0), 0);
      return res.status(200).json({ documents: docs, totalDocuments: docs.length, totalChunks });
    }
    // Synonyms: stats + a preview/search page of rows.
    if (action === "syn-overview") {
      const stats = await synStats();
      const qterm = String(q.q || "").trim();
      const sel = "select=product_id,name,synonyms,dialects,status,indexed_at";
      const path = qterm
        ? `product_synonyms?${sel}&name=ilike.*${encodeURIComponent(qterm)}*&order=status.asc,updated_at.desc&limit=30`
        : `product_synonyms?${sel}&order=updated_at.desc&limit=24`;
      const rows = (await gw.sbGet(path)) || [];
      return res.status(200).json({ stats, rows, indexingConfigured: gi.isConfigured() });
    }
    return res.status(400).json({ error: "unknown action" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = (req.body && typeof req.body === "object") ? req.body : {};

  // ── Save / update a provider (encrypts the key) ────────────────────────────
  if (action === "save-provider") {
    const provider_name = String(body.provider_name || "").trim().toLowerCase();
    if (!["openai", "anthropic", "google", "replicate"].includes(provider_name)) {
      return res.status(400).json({ error: "invalid provider_name" });
    }
    const row = {
      provider_name,
      label: (body.label || "").trim() || null,
      service_type: ["text", "image", "embedding", "both"].includes(body.service_type) ? body.service_type : "text",
      default_model: (body.default_model || "").trim() || null,
      is_active: body.is_active !== false,
      updated_at: new Date().toISOString()
    };
    // Encrypt the key only when a new one is supplied (editing without re-typing
    // the key keeps the stored one).
    const rawKey = String(body.api_key || "").trim();
    if (rawKey) {
      try { row.api_key_encrypted = gw.encryptKey(rawKey); }
      catch (e) { return res.status(503).json({ error: "encryption unavailable: " + e.message }); }
      row.key_hint = gw.maskKey(rawKey);
    }

    if (body.id) {
      if (!row.api_key_encrypted) { delete row.api_key_encrypted; delete row.key_hint; }
      const r = await gw.sbWrite("PATCH", `ai_providers?id=eq.${encodeURIComponent(body.id)}`, row, "return=minimal");
      if (!r.ok) return res.status(502).json({ error: "save failed", detail: r.rows || r.error });
      return res.status(200).json({ ok: true });
    }
    if (!row.api_key_encrypted) return res.status(400).json({ error: "api_key required" });
    const r = await gw.sbWrite("POST", "ai_providers", row, "return=minimal");
    if (!r.ok) return res.status(502).json({ error: "save failed", detail: r.rows || r.error });
    return res.status(200).json({ ok: true });
  }

  // ── Delete a provider ──────────────────────────────────────────────────────
  if (action === "delete-provider") {
    if (!body.id) return res.status(400).json({ error: "id required" });
    const r = await gw.sbWrite("DELETE", `ai_providers?id=eq.${encodeURIComponent(body.id)}`, {}, "return=minimal");
    if (!r.ok) return res.status(502).json({ error: "delete failed", detail: r.rows || r.error });
    return res.status(200).json({ ok: true });
  }

  // ── Bind a feature to a provider / model, toggle on-off ────────────────────
  if (action === "set-feature") {
    const feature_name = String(body.feature_name || "").trim();
    if (!FEATURES.includes(feature_name)) return res.status(400).json({ error: "invalid feature_name" });
    const row = {
      feature_name,
      provider_id: body.provider_id || null,
      model_override: (body.model_override || "").trim() || null,
      is_enabled: body.is_enabled !== false,
      updated_at: new Date().toISOString()
    };
    const r = await gw.sbWrite("POST", "ai_feature_config?on_conflict=feature_name", row, "resolution=merge-duplicates,return=minimal");
    if (!r.ok) return res.status(502).json({ error: "save failed", detail: r.rows || r.error });
    return res.status(200).json({ ok: true });
  }

  // ── Test a feature end-to-end through the gateway ──────────────────────────
  if (action === "test") {
    const feature = String(body.feature || "whatsapp_autoreply");
    const text = String(body.text || "مرحبا").slice(0, 500);
    const reply = await gw.complete(feature, {
      system: "أنت مساعد اختبار. ردّ بإيجاز بنفس لغة الرسالة.",
      messages: [{ role: "user", content: text }],
      maxTokens: 300,
      timeoutMs: 15000
    });
    if (reply == null) return res.status(200).json({ ok: false, reply: null, note: "no reply — provider not configured or call failed" });
    return res.status(200).json({ ok: true, reply });
  }

  // ── Knowledge base: add text directly ──────────────────────────────────────
  if (action === "kb-add-text") {
    const text = String(body.text || "").trim();
    if (!text) return res.status(400).json({ error: "text required" });
    const scope = body.scope === "store" ? "store" : "platform";
    const store_id = scope === "store" ? (Number(body.store_id) || null) : null;
    if (scope === "store" && !store_id) return res.status(400).json({ error: "store_id required for store scope" });
    const doc = { file_name: (body.title || "معرفة نصية").slice(0, 200), source_type: "text", scope, store_id, status: "processing" };
    const created = await gw.sbWrite("POST", "knowledge_documents", doc, "return=representation");
    const id = created.ok && created.rows && created.rows[0] && created.rows[0].id;
    if (!id) return res.status(502).json({ error: "create failed", detail: created.rows || created.error });
    const count = await ingestDocument(id, text);
    if (!count) return res.status(502).json({ error: "ingest failed (تحقّق من مفتاح embeddings)", id });
    return res.status(200).json({ ok: true, id, chunks: count });
  }

  // ── Knowledge base: upload a file (txt / docx) ─────────────────────────────
  if (action === "kb-upload") {
    const fileName = String(body.file_name || "").slice(0, 200);
    const dataB64 = String(body.data_base64 || "");
    if (!fileName || !dataB64) return res.status(400).json({ error: "file_name and data_base64 required" });
    let buf;
    try { buf = Buffer.from(dataB64.replace(/^data:[^;]+;base64,/, ""), "base64"); } catch (e) { return res.status(400).json({ error: "bad base64" }); }
    // Vercel caps request bodies ~4.5MB; base64 inflates ~33%, so keep files ≤3MB.
    if (buf.length > 3 * 1024 * 1024) return res.status(413).json({ error: "الملف أكبر من 3MB — قسّمه أو الصق النص" });
    const scope = body.scope === "store" ? "store" : "platform";
    const store_id = scope === "store" ? (Number(body.store_id) || null) : null;
    if (scope === "store" && !store_id) return res.status(400).json({ error: "store_id required for store scope" });
    let text;
    try { text = kb.extractText(buf, fileName, body.mime); }
    catch (e) { return res.status(400).json({ error: "استخراج النص فشل: " + e.message }); }
    if (!String(text || "").trim()) return res.status(400).json({ error: "الملف لا يحتوي نصاً قابلاً للقراءة" });
    // Best-effort: keep the original file in private Storage.
    let storage_path = null;
    try {
      const { url, key } = gw.sb();
      const path = `${Date.now()}_${fileName.replace(/[^\w.\-]+/g, "_")}`;
      const up = await fetch(`${url}/storage/v1/object/knowledge/${encodeURIComponent(path)}`, {
        method: "POST", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": body.mime || "application/octet-stream", "x-upsert": "true" }, body: buf
      });
      if (up.ok) storage_path = `knowledge/${path}`;
    } catch (e) { /* storage is optional */ }
    const doc = { file_name: fileName, storage_path, source_type: "file", scope, store_id, status: "processing" };
    const created = await gw.sbWrite("POST", "knowledge_documents", doc, "return=representation");
    const id = created.ok && created.rows && created.rows[0] && created.rows[0].id;
    if (!id) return res.status(502).json({ error: "create failed", detail: created.rows || created.error });
    const count = await ingestDocument(id, text);
    if (!count) return res.status(502).json({ error: "ingest failed (تحقّق من مفتاح embeddings)", id });
    return res.status(200).json({ ok: true, id, chunks: count, chars: text.length });
  }

  // ── Knowledge base: delete a document (chunks cascade) ─────────────────────
  if (action === "kb-delete") {
    if (!body.id) return res.status(400).json({ error: "id required" });
    const rows = await gw.sbGet(`knowledge_documents?id=eq.${encodeURIComponent(body.id)}&select=storage_path`);
    const sp = rows && rows[0] && rows[0].storage_path;
    const del = await gw.sbWrite("DELETE", `knowledge_documents?id=eq.${encodeURIComponent(body.id)}`, {}, "return=minimal");
    if (!del.ok) return res.status(502).json({ error: "delete failed", detail: del.rows || del.error });
    if (sp) { try { const { url, key } = gw.sb(); await fetch(`${url}/storage/v1/object/${sp.split("/").map(encodeURIComponent).join("/")}`, { method: "DELETE", headers: { apikey: key, Authorization: `Bearer ${key}` } }); } catch (e) {} }
    return res.status(200).json({ ok: true });
  }

  // ── Knowledge base: test retrieval (+ grounded answer) ─────────────────────
  if (action === "kb-test") {
    const query = String(body.query || "").trim();
    if (!query) return res.status(400).json({ error: "query required" });
    const store_id = body.store_id ? (Number(body.store_id) || null) : null;
    const vec = await gw.embed("embeddings", query);
    if (!vec) return res.status(200).json({ ok: false, note: "embeddings provider not configured" });
    const r = await gw.sbWrite("POST", "rpc/match_knowledge", { query_embedding: "[" + vec.join(",") + "]", match_count: 5, p_store_id: store_id }, "return=representation");
    const chunks = (r.ok && Array.isArray(r.rows)) ? r.rows : [];
    let answer = null;
    if (chunks.length) {
      const context = chunks.map((c, i) => `[${i + 1}] ${c.content}`).join("\n\n");
      answer = await gw.complete("whatsapp_autoreply", {
        system: "أجب بالعربية اعتماداً فقط على المقاطع التالية من قاعدة المعرفة. إن لم تجد الإجابة فيها فاعتذر بوضوح ولا تختلق:\n\n" + context,
        messages: [{ role: "user", content: query }], maxTokens: 400, timeoutMs: 15000
      });
    }
    return res.status(200).json({ ok: true, chunks: chunks.map(c => ({ content: String(c.content).slice(0, 300), similarity: c.similarity })), answer });
  }

  // ── Synonyms: (re)sync the base name list from the live catalog ─────────────
  if (action === "syn-sync") {
    const r = await gw.sbWrite("POST", "rpc/sync_product_synonyms", {}, "return=representation");
    if (!r.ok) return res.status(502).json({ error: "sync failed", detail: r.rows || r.error });
    let stats = r.rows; if (Array.isArray(stats)) stats = stats[0];
    return res.status(200).json({ ok: true, stats: stats || (await synStats()) });
  }

  // ── Synonyms: generate one batch of pending names via the AI gateway ───────
  if (action === "syn-generate") {
    const limit = Math.min(Math.max(Number(body.limit) || 20, 1), 40);
    // Pull a pool of pending rows and dedupe to distinct names (many products
    // share a name → generate once, apply to all).
    const pool = (await gw.sbGet(`product_synonyms?select=name&status=eq.pending&limit=${limit * 8}`)) || [];
    const names = [], seen = new Set();
    for (const row of pool) {
      const nm = String(row.name || "").trim();
      if (!nm) continue;
      const n = synNorm(nm);
      if (seen.has(n)) continue;
      seen.add(n); names.push(nm);
      if (names.length >= limit) break;
    }
    if (!names.length) return res.status(200).json({ ok: true, processed: 0, failed: 0, done: true, stats: await synStats() });

    const raw = await gw.complete("synonym_generation", {
      system: SYN_SYSTEM,
      messages: [{ role: "user", content: JSON.stringify(names) }],
      maxTokens: 6000, temperature: 0.3, timeoutMs: 50000
    });
    if (raw == null) {
      return res.status(200).json({ ok: false, error: "provider", done: false, note: "تعذّر الاتصال بمزوّد الذكاء الاصطناعي — تأكّد أن ميزة «توليد المترادفات» مربوطة بمزوّد ومفتاحه صالح." });
    }
    const parsed = extractJson(raw);
    const results = parsed && Array.isArray(parsed.results) ? parsed.results : (Array.isArray(parsed) ? parsed : []);
    const byName = new Map();
    for (const r of results) if (r && r.name != null) byName.set(synNorm(r.name), r);

    let processed = 0, failed = 0;
    for (const name of names) {
      const nowIso = new Date().toISOString();
      const entry = byName.get(synNorm(name));
      const filter = `product_synonyms?name=eq.${encodeURIComponent(name)}&status=eq.pending`;
      if (entry) {
        const built = buildEntry(entry, name);
        const pr = await gw.sbWrite("PATCH", filter, { synonyms: built.synonyms, dialects: built.dialects, status: "done", indexed_at: null, updated_at: nowIso }, "return=minimal");
        if (pr.ok) processed++; else failed++;
      } else {
        await gw.sbWrite("PATCH", filter, { status: "failed", updated_at: nowIso }, "return=minimal");
        failed++;
      }
    }
    const stats = await synStats();
    const remainingPending = Math.max(0, Number(stats.pending || 0) - Number(stats.failed || 0));
    return res.status(200).json({ ok: true, processed, failed, done: remainingPending === 0, stats });
  }

  // ── Synonyms: reset failed rows back to pending (for a retry pass) ──────────
  if (action === "syn-retry-failed") {
    const r = await gw.sbWrite("PATCH", "product_synonyms?status=eq.failed", { status: "pending", updated_at: new Date().toISOString() }, "return=minimal");
    return res.status(200).json({ ok: r.ok, stats: await synStats() });
  }

  // ── Synonyms: manual edit/override for one product name ────────────────────
  if (action === "syn-save") {
    const name = String(body.name || "").trim();
    if (!name) return res.status(400).json({ error: "name required" });
    const synonyms = Array.isArray(body.synonyms) ? body.synonyms.map(s => String(s == null ? "" : s).trim()).filter(Boolean).slice(0, 40) : [];
    const dialects = (body.dialects && typeof body.dialects === "object" && !Array.isArray(body.dialects)) ? body.dialects : {};
    const patch = { synonyms, dialects, status: "done", indexed_at: null, updated_at: new Date().toISOString() };
    const r = await gw.sbWrite("PATCH", `product_synonyms?name=eq.${encodeURIComponent(name)}`, patch, "return=minimal");
    if (!r.ok) return res.status(502).json({ error: "save failed", detail: r.rows || r.error });
    return res.status(200).json({ ok: true });
  }

  // ── Synonyms: push a batch of indexed product URLs to Google's Indexing API ─
  if (action === "syn-index") {
    if (!gi.isConfigured()) {
      return res.status(200).json({ ok: true, configured: false, pushed: 0, note: "لم تُضبط بيانات حساب خدمة Google (GOOGLE_INDEXING_CLIENT_EMAIL / GOOGLE_INDEXING_PRIVATE_KEY). المترادفات تظهر لجوجل تلقائياً داخل صفحات المنتجات وخريطة الموقع؛ هذا الزر يُسرّع إعادة الفهرسة فقط." });
    }
    const limit = Math.min(Math.max(Number(body.limit) || 20, 1), 50);
    const rows = (await gw.sbGet(`product_synonyms?select=product_id,products!inner(slug,available)&status=eq.done&indexed_at=is.null&products.available=eq.true&products.slug=not.is.null&order=updated_at.asc&limit=${limit}`)) || [];
    if (!rows.length) return res.status(200).json({ ok: true, configured: true, pushed: 0, stats: await synStats() });
    const okIds = [];
    for (const row of rows) {
      const slug = row.products && row.products.slug;
      if (!slug) continue;
      const r = await gi.publishUrl(`${SITE}/product/${slug}`, "URL_UPDATED");
      if (r && r.ok) okIds.push(row.product_id);
    }
    if (okIds.length) {
      await gw.sbWrite("PATCH", `product_synonyms?product_id=in.(${okIds.join(",")})`, { indexed_at: new Date().toISOString() }, "return=minimal");
    }
    return res.status(200).json({ ok: true, configured: true, pushed: okIds.length, stats: await synStats() });
  }

  return res.status(400).json({ error: "unknown action" });
};
