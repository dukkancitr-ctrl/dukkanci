// AI Management admin API — provider/key registry + per-feature config + test.
// Powers the "الذكاء الاصطناعي" admin tab. Admin-gated (same session token as the
// rest of the panel). All DB access uses the service-role key inside the gateway
// library, so the anon client can never read API keys. API keys are returned to
// the UI MASKED (last 4 chars only) and never in full.
const crypto = require("crypto");
const gw = require("../lib/ai-gateway");
const kb = require("../lib/knowledge");

const env = k => (process.env[k] || "").trim();

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

  return res.status(400).json({ error: "unknown action" });
};
