// قسم "استهداف فيسبوك" — أداة داخلية لإدارة استهداف إعلانات فيسبوك حسب
// القرب الجغرافي من المجمعات السكنية (تبدأ بإسنيورت، قابلة للتوسع لمناطق
// إسطنبول الأخرى). قاعدة بيانات مستقلة تماماً عن جداول المتاجر/المنتجات/
// العملاء — fbads_regions / fbads_compounds / fbads_targets (اسم المحل
// وموقعه فقط) / fbads_target_distances / fbads_settings. RLS مفعّل بلا أي
// صلاحيات anon — كل القراءة والكتابة تمر فقط من هنا بمفتاح service-role،
// خلف بوابة كلمة مرور الإدارة (نفس نموذج api/catalog-review.js).
//
//   GET    ?action=regions
//   POST   ?action=region          { slug, name }
//   DELETE ?action=region&id=
//   GET    ?action=compounds&region=<slug>
//   POST   ?action=compound        { regionSlug, name, area?, mapsUrl, note?, sourceUrl? }
//   PATCH  ?action=compound&id=    { name?, area?, mapsUrl?, note? }  (يعيد تصفير الإحداثيات إذا تغيّر الرابط)
//   DELETE ?action=compound&id=
//   GET    ?action=settings
//   POST   ?action=settings        { ratePerKm }
//   POST   ?action=compute-target  { name, input, regionSlug }
//   GET    ?action=targets
//   GET    ?action=target&id=
//   DELETE ?action=target&id=

const crypto = require("crypto");

const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const env = k => (process.env[k] || "").trim();

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
  const tok = (req.headers["x-admin-token"] || req.headers["x-admin-key"] || "");
  if (tok && verifyAdminToken(tok)) return true;
  const pw = env("ADMIN_PASSWORD");
  if (!pw) return false;
  const got = req.headers["x-admin-key"] || "";
  const a = Buffer.from(got);
  const b = Buffer.from(pw);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function sb() {
  const url = (env("SUPABASE_URL") || PUB_URL).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const key = env("SUPABASE_SERVICE_ROLE_KEY") || "";
  return { url, key };
}
async function sbFetch(path, opts = {}) {
  const { url, key } = sb();
  return fetch(`${url}/rest/v1/${path}`, {
    ...opts,
    headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "return=representation", "Content-Type": "application/json", ...(opts.headers || {}) }
  });
}

// ─── Location resolution (ported from the Streamlit prototype's resolve_location) ───

function haversineKm(lat1, lon1, lat2, lon2) {
  const r = 6371.0088;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(a));
}

function parseLatLngFromText(text) {
  if (!text) return null;
  let decoded;
  try { decoded = decodeURIComponent(text); } catch { decoded = text; }
  const patterns = [
    /@(-?\d{1,3}\.\d+),\s*(-?\d{1,3}\.\d+)/,
    /!3d(-?\d{1,3}\.\d+)!4d(-?\d{1,3}\.\d+)/,
    /(?:query|q|ll|destination|origin)=(-?\d{1,3}\.\d+)%2C(-?\d{1,3}\.\d+)/,
    /(?:query|q|ll|destination|origin)=(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/,
    /^\s*(-?\d{1,3}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)\s*$/
  ];
  for (const pat of patterns) {
    const m = pat.exec(decoded);
    if (m) {
      const lat = Number(m[1]), lng = Number(m[2]);
      if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
    }
  }
  return null;
}

async function expandShortUrl(url) {
  if (!url || !/(maps\.app\.goo\.gl|goo\.gl\/maps|g\.co\/kgs)/.test(url)) return url;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { redirect: "follow", signal: controller.signal, headers: { "User-Agent": "Mozilla/5.0" } });
    clearTimeout(timeout);
    return res.url || url;
  } catch { return url; }
}

function extractAddressQueryFromMapsUrl(text, expanded) {
  if (!text) return "";
  if (!/google\.[^/]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/.test(text)) return text.trim();
  let decoded;
  try { decoded = decodeURIComponent(expanded); } catch { decoded = expanded; }
  try {
    const parsed = new URL(decoded);
    for (const key of ["query", "q", "destination", "origin"]) {
      const v = parsed.searchParams.get(key);
      if (v) return v.replace(/\+/g, " ").trim();
    }
  } catch { /* not a parseable absolute URL */ }
  const m = /\/place\/([^/@?]+)/.exec(decoded);
  if (m) return decodeURIComponent(m[1]).replace(/\+/g, " ").trim();
  return decoded.trim();
}

async function geocodeWithGoogle(query, apiKey) {
  if (!apiKey) return { lat: null, lng: null, address: "لا يوجد GOOGLE_MAPS_API_KEY" };
  try {
    const params = new URLSearchParams({ address: query, key: apiKey, language: "ar", region: "tr" });
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`);
    const payload = await res.json();
    if (payload.status === "OK" && payload.results?.length) {
      const r = payload.results[0];
      return { lat: r.geometry.location.lat, lng: r.geometry.location.lng, address: r.formatted_address || query };
    }
    return { lat: null, lng: null, address: `فشل Geocoding: ${payload.status || "UNKNOWN"}` };
  } catch (e) {
    return { lat: null, lng: null, address: `خطأ Geocoding: ${e.message}` };
  }
}

async function resolveLocation(rawInput, apiKey) {
  const raw = String(rawInput || "").trim();
  if (!raw) return { lat: null, lng: null, address: "فارغ" };

  let coords = parseLatLngFromText(raw);
  if (coords) return { lat: coords.lat, lng: coords.lng, address: `${coords.lat},${coords.lng}` };

  const expanded = await expandShortUrl(raw);
  coords = parseLatLngFromText(expanded);
  if (coords) return { lat: coords.lat, lng: coords.lng, address: `${coords.lat},${coords.lng}` };

  const query = extractAddressQueryFromMapsUrl(raw, expanded) || raw;
  coords = parseLatLngFromText(query);
  if (coords) return { lat: coords.lat, lng: coords.lng, address: `${coords.lat},${coords.lng}` };

  return geocodeWithGoogle(query, apiKey);
}

// ─── Driving distance via Google Routes API, with a haversine-based estimate
// fallback (same policy as api/delivery-quote.js's fallbackQuote: ×1.28 to
// approximate real road distance over straight-line distance). ───

async function computeRouteMatrix(origin, destinations, apiKey) {
  if (!apiKey || !destinations.length) return destinations.map(() => null);
  const results = new Array(destinations.length).fill(null);
  const batchSize = 50;
  for (let start = 0; start < destinations.length; start += batchSize) {
    const batch = destinations.slice(start, start + batchSize);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch("https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "originIndex,destinationIndex,distanceMeters,duration,status,condition"
        },
        body: JSON.stringify({
          origins: [{ waypoint: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } } }],
          destinations: batch.map(d => ({ waypoint: { location: { latLng: { latitude: d.lat, longitude: d.lng } } } } )),
          travelMode: "DRIVE",
          routingPreference: "TRAFFIC_UNAWARE",
          units: "METRIC",
          languageCode: "ar"
        })
      });
      clearTimeout(timeout);
      if (!res.ok) continue;
      const items = await res.json();
      if (Array.isArray(items)) {
        for (const item of items) {
          const idx = start + Number(item.destinationIndex || 0);
          if (item.condition === "ROUTE_EXISTS" && item.distanceMeters != null) {
            const seconds = Number.parseFloat(item.duration) || 0;
            results[idx] = { distanceKm: item.distanceMeters / 1000, minutes: Math.max(1, Math.ceil(seconds / 60)) };
          }
        }
      }
    } catch { /* leave this batch as null → haversine fallback below */ }
  }
  return results;
}

function estimateFromHaversine(directKm) {
  const km = Math.max(0.3, directKm * 1.28);
  return { distanceKm: km, minutes: Math.max(3, Math.ceil(km / 28 * 60)) };
}

// ─── DB helpers ───

async function getRegionBySlug(slug) {
  const r = await sbFetch(`fbads_regions?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`);
  const rows = await r.json().catch(() => []);
  return rows[0] || null;
}

async function getSettings() {
  const r = await sbFetch(`fbads_settings?id=eq.1&select=*&limit=1`);
  const rows = await r.json().catch(() => []);
  return rows[0] || { id: 1, rate_per_km: 20 };
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!adminOk(req)) return res.status(403).json({ error: "unauthorized" });

  const q = new URL(req.url, "http://internal").searchParams;
  const action = q.get("action");
  const apiKey = env("GOOGLE_MAPS_API_KEY");

  try {
    // ── Regions ──
    if (req.method === "GET" && action === "regions") {
      const r = await sbFetch(`fbads_regions?select=*&order=sort_order.asc`);
      return res.status(200).json({ ok: true, items: await r.json().catch(() => []) });
    }
    if (req.method === "POST" && action === "region") {
      const { slug, name } = req.body || {};
      if (!slug || !name) return res.status(400).json({ error: "slug و name مطلوبان" });
      const r = await sbFetch(`fbads_regions`, { method: "POST", body: JSON.stringify({ slug: String(slug).trim(), name: String(name).trim() }) });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      return res.status(200).json({ ok: true, item: (await r.json())[0] });
    }
    if (req.method === "DELETE" && action === "region") {
      const id = Number(q.get("id"));
      if (!id) return res.status(400).json({ error: "id مطلوب" });
      const r = await sbFetch(`fbads_regions?id=eq.${id}`, { method: "DELETE" });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      return res.status(200).json({ ok: true });
    }

    // ── Compounds ──
    if (req.method === "GET" && action === "compounds") {
      const slug = q.get("region") || "esenyurt";
      const region = await getRegionBySlug(slug);
      if (!region) return res.status(200).json({ ok: true, items: [] });
      const r = await sbFetch(`fbads_compounds?region_id=eq.${region.id}&select=*&order=name.asc`);
      return res.status(200).json({ ok: true, items: await r.json().catch(() => []) });
    }
    if (req.method === "POST" && action === "compound") {
      const { regionSlug, name, area, mapsUrl, note, sourceUrl } = req.body || {};
      if (!regionSlug || !name || !mapsUrl) return res.status(400).json({ error: "regionSlug و name و mapsUrl مطلوبة" });
      const region = await getRegionBySlug(regionSlug);
      if (!region) return res.status(404).json({ error: "منطقة غير موجودة" });
      const r = await sbFetch(`fbads_compounds`, {
        method: "POST",
        body: JSON.stringify({ region_id: region.id, name: String(name).trim(), area: area || "", maps_url: String(mapsUrl).trim(), note: note || "", source_url: sourceUrl || "" })
      });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      return res.status(200).json({ ok: true, item: (await r.json())[0] });
    }
    if (req.method === "PATCH" && action === "compound") {
      const id = Number(q.get("id"));
      if (!id) return res.status(400).json({ error: "id مطلوب" });
      const { name, area, mapsUrl, note } = req.body || {};
      const patch = {};
      if (name != null) patch.name = String(name).trim();
      if (area != null) patch.area = area;
      if (note != null) patch.note = note;
      if (mapsUrl != null) { patch.maps_url = String(mapsUrl).trim(); patch.lat = null; patch.lng = null; patch.geocoded_at = null; }
      const r = await sbFetch(`fbads_compounds?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(patch) });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      return res.status(200).json({ ok: true });
    }
    if (req.method === "DELETE" && action === "compound") {
      const id = Number(q.get("id"));
      if (!id) return res.status(400).json({ error: "id مطلوب" });
      const r = await sbFetch(`fbads_compounds?id=eq.${id}`, { method: "DELETE" });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      return res.status(200).json({ ok: true });
    }

    // ── Settings (سعر الكيلومتر) ──
    if (req.method === "GET" && action === "settings") {
      return res.status(200).json({ ok: true, item: await getSettings() });
    }
    if (req.method === "POST" && action === "settings") {
      const rate = Number(req.body?.ratePerKm);
      if (!Number.isFinite(rate) || rate <= 0) return res.status(400).json({ error: "ratePerKm غير صالح" });
      const r = await sbFetch(`fbads_settings?id=eq.1`, { method: "PATCH", body: JSON.stringify({ rate_per_km: rate, updated_at: new Date().toISOString() }) });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      return res.status(200).json({ ok: true });
    }

    // ── Compute a target store's distance panel ──
    if (req.method === "POST" && action === "compute-target") {
      const { name, input, regionSlug } = req.body || {};
      if (!String(name || "").trim() || !String(input || "").trim()) {
        return res.status(400).json({ error: "اسم المحل ورابط الموقع مطلوبان" });
      }
      const slug = regionSlug || "esenyurt";
      const region = await getRegionBySlug(slug);
      if (!region) return res.status(404).json({ error: "منطقة غير موجودة" });

      const targetLoc = await resolveLocation(input, apiKey);
      if (targetLoc.lat == null) {
        return res.status(422).json({ error: `تعذّر تحديد موقع المحل: ${targetLoc.address}` });
      }

      // Ensure every compound in this region has coordinates (geocode + cache once).
      const compoundsRes = await sbFetch(`fbads_compounds?region_id=eq.${region.id}&select=*&order=name.asc`);
      const compounds = await compoundsRes.json().catch(() => []);
      for (const c of compounds) {
        if (c.lat == null || c.lng == null) {
          const loc = await resolveLocation(c.maps_url, apiKey);
          if (loc.lat != null) {
            c.lat = loc.lat; c.lng = loc.lng;
            await sbFetch(`fbads_compounds?id=eq.${c.id}`, { method: "PATCH", body: JSON.stringify({ lat: loc.lat, lng: loc.lng, geocoded_at: new Date().toISOString() }) });
          }
        }
      }
      const located = compounds.filter(c => c.lat != null && c.lng != null);

      // Upsert the target (name + location only — kept deliberately minimal).
      const existingRes = await sbFetch(`fbads_targets?name=eq.${encodeURIComponent(name.trim())}&input_url=eq.${encodeURIComponent(input.trim())}&select=id&limit=1`);
      const existing = (await existingRes.json().catch(() => []))[0];
      let targetId;
      const targetBody = { name: name.trim(), input_url: input.trim(), lat: targetLoc.lat, lng: targetLoc.lng, resolved_address: targetLoc.address, region_id: region.id, updated_at: new Date().toISOString() };
      if (existing) {
        targetId = existing.id;
        await sbFetch(`fbads_targets?id=eq.${targetId}`, { method: "PATCH", body: JSON.stringify(targetBody) });
      } else {
        const created = await sbFetch(`fbads_targets`, { method: "POST", body: JSON.stringify(targetBody) });
        targetId = (await created.json())[0].id;
      }

      const routeResults = await computeRouteMatrix({ lat: targetLoc.lat, lng: targetLoc.lng }, located.map(c => ({ lat: c.lat, lng: c.lng })), apiKey);
      const settings = await getSettings();
      const rows = located.map((c, i) => {
        const directKm = haversineKm(targetLoc.lat, targetLoc.lng, c.lat, c.lng);
        const route = routeResults[i] || estimateFromHaversine(directKm);
        const provider = routeResults[i] ? "google" : "estimate";
        const drivingKm = route.distanceKm;
        return {
          target_id: targetId,
          compound_id: c.id,
          direct_km: Math.round(directKm * 100) / 100,
          driving_km: Math.round(drivingKm * 100) / 100,
          driving_minutes: route.minutes,
          provider,
          estimated_cost: Math.round(drivingKm * settings.rate_per_km)
        };
      });
      if (rows.length) {
        await sbFetch(`fbads_target_distances?on_conflict=target_id,compound_id`, {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=representation" },
          body: JSON.stringify(rows)
        });
      }

      return res.status(200).json({ ok: true, targetId });
    }

    // ── Saved targets ──
    if (req.method === "GET" && action === "targets") {
      const r = await sbFetch(`fbads_targets?select=*&order=updated_at.desc&limit=200`);
      return res.status(200).json({ ok: true, items: await r.json().catch(() => []) });
    }
    if (req.method === "GET" && action === "target") {
      const id = Number(q.get("id"));
      if (!id) return res.status(400).json({ error: "id مطلوب" });
      const targetRes = await sbFetch(`fbads_targets?id=eq.${id}&select=*&limit=1`);
      const target = (await targetRes.json().catch(() => []))[0];
      if (!target) return res.status(404).json({ error: "غير موجود" });
      const distRes = await sbFetch(`fbads_target_distances?target_id=eq.${id}&select=*,fbads_compounds(id,name,area,maps_url,lat,lng,note)&order=driving_km.asc`);
      const distances = await distRes.json().catch(() => []);
      return res.status(200).json({ ok: true, target, distances });
    }
    if (req.method === "DELETE" && action === "target") {
      const id = Number(q.get("id"));
      if (!id) return res.status(400).json({ error: "id مطلوب" });
      const r = await sbFetch(`fbads_targets?id=eq.${id}`, { method: "DELETE" });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: "unknown action" });
  } catch (e) {
    return res.status(500).json({ error: e.message || "server error" });
  }
};
