// ─────────────────────────────────────────────────────────────────────────────
// AI Gateway — the single entry point for every AI call in Dukkanci.
//
// Architectural principle (from the spec): features never know which provider
// answers them. A feature calls aiGateway.complete(feature, ...) and the gateway
// reads ai_feature_config to find the active provider, decrypts its key, picks
// the right adapter (OpenAI / Anthropic / Google), runs the call, logs usage,
// and returns a uniform result. Swapping providers is a row change, no code.
//
// It is a plain CommonJS LIBRARY (not an /api function) so it adds zero load to
// the Vercel function count and can be required from api/ai.js, api/notify-order.js,
// api/enhance-image.js, and any Supabase Edge Function.
//
// Backward compatibility: if a feature has no provider configured yet, the
// gateway falls back to the legacy OPENAI_API_KEY env var so existing behaviour
// (WhatsApp auto-reply, image enhancement) keeps working until the admin wires
// providers up in the panel.
// ─────────────────────────────────────────────────────────────────────────────
const crypto = require("crypto");

const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const PUB_KEY = "sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc";
const env = k => (process.env[k] || "").trim();

const DEFAULT_MODEL = {
  openai: "gpt-4o-mini",
  anthropic: "claude-haiku-4-5-20251001",
  google: "gemini-1.5-flash"
};
const DEFAULT_EMBED_MODEL = { openai: "text-embedding-3-small" };

// Rough blended price per 1M tokens (USD) for the est_cost column. "تقديرية" by
// design — for cost monitoring, not billing. Unknown models log cost null.
const PRICE_PER_1M = {
  "gpt-4o-mini": 0.4, "gpt-4o": 6, "gpt-4.1-mini": 0.5,
  "claude-haiku-4-5-20251001": 1.5, "claude-sonnet-4-6": 6,
  "gemini-1.5-flash": 0.25, "gemini-2.0-flash": 0.3,
  "text-embedding-3-small": 0.02, "text-embedding-3-large": 0.13
};

// ───────────────────────── Supabase REST (service-role) ─────────────────────
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
async function sbWrite(method, path, body, prefer) {
  const { url, key } = sb();
  try {
    const r = await fetch(`${url}/rest/v1/${path}`, {
      method,
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: prefer || "return=representation" },
      body: JSON.stringify(body)
    });
    const rows = await r.json().catch(() => null);
    return { ok: r.ok, status: r.status, rows };
  } catch (e) { return { ok: false, error: e.message }; }
}

// ───────────────────────── Key encryption (AES-256-GCM) ─────────────────────
// Keys are NEVER stored in plaintext. We derive a 32-byte key from a server
// secret. Prefer KEY_ENCRYPTION_SECRET; fall back to the existing admin pepper
// so the feature works without adding a new env var (re-set KEY_ENCRYPTION_SECRET
// only once, before adding providers, to avoid orphaning earlier ciphertext).
function keyBuf() {
  const s = env("KEY_ENCRYPTION_SECRET") || env("ADMIN_SESSION_SECRET") || env("ADMIN_PASSWORD");
  if (!s) return null;
  return crypto.scryptSync(s, "dukkanci-ai-v1", 32);
}
function encryptKey(plain) {
  const k = keyBuf();
  if (!k) throw new Error("no encryption secret (set KEY_ENCRYPTION_SECRET)");
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", k, iv);
  const enc = Buffer.concat([c.update(String(plain), "utf8"), c.final()]);
  const tag = c.getAuthTag();
  return iv.toString("hex") + ":" + tag.toString("hex") + ":" + enc.toString("hex");
}
function decryptKey(blob) {
  const k = keyBuf();
  if (!k) return null;
  const parts = String(blob || "").split(":");
  if (parts.length !== 3) return null;
  try {
    const d = crypto.createDecipheriv("aes-256-gcm", k, Buffer.from(parts[0], "hex"));
    d.setAuthTag(Buffer.from(parts[1], "hex"));
    return Buffer.concat([d.update(Buffer.from(parts[2], "hex")), d.final()]).toString("utf8");
  } catch (e) { return null; }
}
function maskKey(plain) {
  const s = String(plain || "");
  return s.length >= 4 ? s.slice(-4) : "";
}

// ───────────────────────── Provider resolution ─────────────────────────────
// Returns { provider_name, model, apiKey, settings, source } for a feature, or
// null when nothing usable is configured (caller may fall back to env).
async function resolveFeature(feature) {
  const rows = await sbGet(
    `ai_feature_config?feature_name=eq.${encodeURIComponent(feature)}&select=is_enabled,model_override,settings,provider:provider_id(provider_name,api_key_encrypted,default_model,is_active)`
  );
  const cfg = rows && rows[0];
  if (!cfg || cfg.is_enabled === false) return null;
  const p = cfg.provider;
  if (!p || p.is_active === false) return null;
  const apiKey = decryptKey(p.api_key_encrypted);
  if (!apiKey) return null;
  return {
    provider_name: p.provider_name,
    model: cfg.model_override || p.default_model || DEFAULT_MODEL[p.provider_name] || null,
    apiKey,
    settings: cfg.settings || {},
    source: "config"
  };
}

function envFallback(kind) {
  const apiKey = env("OPENAI_API_KEY");
  if (!apiKey) return null;
  return {
    provider_name: "openai",
    model: kind === "embed" ? (env("OPENAI_EMBED_MODEL") || DEFAULT_EMBED_MODEL.openai) : (env("OPENAI_MODEL") || DEFAULT_MODEL.openai),
    apiKey, settings: {}, source: "env"
  };
}

async function logUsage(feature, provider, model, units, ok) {
  try {
    const rate = PRICE_PER_1M[model];
    const est_cost = rate != null && units != null ? Number(((units / 1e6) * rate).toFixed(6)) : null;
    await sbWrite("POST", "ai_usage_log", { feature, provider, model, units: units != null ? Math.round(units) : null, est_cost, ok }, "return=minimal");
  } catch (e) { /* logging must never break a feature */ }
}

// ───────────────────────── Text adapters ───────────────────────────────────
// Each adapter takes ({ apiKey, model, system, messages, maxTokens, temperature,
// signal }) and returns { text, tokens }. messages = [{role:'user'|'assistant', content}].
async function callOpenAI({ apiKey, model, system, messages, maxTokens, temperature, signal }) {
  const msgs = [];
  if (system) msgs.push({ role: "system", content: system });
  for (const m of messages) msgs.push({ role: m.role === "assistant" ? "assistant" : "user", content: m.content });
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, max_tokens: maxTokens, temperature, messages: msgs }),
    signal
  });
  const data = await r.json().catch(() => null);
  if (!r.ok || !data) throw new Error((data && data.error && data.error.message) || `openai ${r.status}`);
  const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  return { text: text ? String(text).trim() : "", tokens: data.usage && data.usage.total_tokens };
}

async function callAnthropic({ apiKey, model, system, messages, maxTokens, temperature, signal }) {
  // Anthropic requires the first message to be a 'user' turn.
  let msgs = messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content) }));
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (!msgs.length) msgs = [{ role: "user", content: "" }];
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
    body: JSON.stringify({ model, max_tokens: maxTokens, temperature, system: system || undefined, messages: msgs }),
    signal
  });
  const data = await r.json().catch(() => null);
  if (!r.ok || !data) throw new Error((data && data.error && data.error.message) || `anthropic ${r.status}`);
  const text = Array.isArray(data.content) ? data.content.filter(b => b.type === "text").map(b => b.text).join("").trim() : "";
  const tokens = data.usage ? (Number(data.usage.input_tokens || 0) + Number(data.usage.output_tokens || 0)) : undefined;
  return { text, tokens };
}

async function callGoogle({ apiKey, model, system, messages, maxTokens, temperature, signal }) {
  const contents = messages.map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: String(m.content) }] }));
  const body = { contents, generationConfig: { maxOutputTokens: maxTokens, temperature } };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal
  });
  const data = await r.json().catch(() => null);
  if (!r.ok || !data) throw new Error((data && data.error && data.error.message) || `google ${r.status}`);
  const cand = data.candidates && data.candidates[0];
  const text = cand && cand.content && Array.isArray(cand.content.parts) ? cand.content.parts.map(p => p.text || "").join("").trim() : "";
  const tokens = data.usageMetadata ? Number(data.usageMetadata.totalTokenCount || 0) : undefined;
  return { text, tokens };
}

const TEXT_ADAPTERS = { openai: callOpenAI, anthropic: callAnthropic, google: callGoogle };

// ───────────────────────── Public API ──────────────────────────────────────
// complete(feature, { system, messages?, prompt?, maxTokens?, temperature?, timeoutMs? })
//   → reply string, or null on any failure (callers keep their existing fallback).
async function complete(feature, opts = {}) {
  const route = (await resolveFeature(feature)) || envFallback("text");
  if (!route) return null;
  const adapter = TEXT_ADAPTERS[route.provider_name];
  if (!adapter) return null;
  const messages = Array.isArray(opts.messages) && opts.messages.length
    ? opts.messages
    : [{ role: "user", content: String(opts.prompt == null ? "" : opts.prompt) }];
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs || 8000);
  try {
    const { text, tokens } = await adapter({
      apiKey: route.apiKey,
      model: route.model,
      system: opts.system || "",
      messages,
      maxTokens: opts.maxTokens || 500,
      temperature: opts.temperature == null ? 0.4 : opts.temperature,
      signal: ctrl.signal
    });
    await logUsage(feature, route.provider_name, route.model, tokens, true);
    return text || null;
  } catch (e) {
    await logUsage(feature, route.provider_name, route.model, null, false);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// embed(feature, input) — input string or string[]. Returns number[] (single) or
// number[][] (array), or null. Currently OpenAI embeddings; provider-agnostic shape.
async function embed(feature, input, opts = {}) {
  const route = (await resolveFeature(feature)) || envFallback("embed");
  if (!route || route.provider_name !== "openai") return null; // only OpenAI embeddings for now
  const model = route.model && /embedding/.test(route.model) ? route.model : (env("OPENAI_EMBED_MODEL") || DEFAULT_EMBED_MODEL.openai);
  const arr = Array.isArray(input) ? input : [input];
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs || 20000);
  try {
    const r = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: { Authorization: `Bearer ${route.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, input: arr }),
      signal: ctrl.signal
    });
    const data = await r.json().catch(() => null);
    if (!r.ok || !data || !Array.isArray(data.data)) throw new Error((data && data.error && data.error.message) || `openai ${r.status}`);
    await logUsage(feature, "openai", model, data.usage && data.usage.total_tokens, true);
    const vectors = data.data.sort((a, b) => a.index - b.index).map(d => d.embedding);
    return Array.isArray(input) ? vectors : vectors[0];
  } catch (e) {
    await logUsage(feature, "openai", model, null, false);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  complete, embed, resolveFeature,
  encryptKey, decryptKey, maskKey,
  sbGet, sbWrite,
  DEFAULT_MODEL, DEFAULT_EMBED_MODEL
};
