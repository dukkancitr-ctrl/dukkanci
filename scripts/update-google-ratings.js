#!/usr/bin/env node
/**
 * update-google-ratings.js — تحديث حقول تقييمات Google لكل المتاجر المعتمدة:
 *   google_place_id / google_rating / google_reviews_count /
 *   google_maps_url / google_rating_updated_at
 * وهي الحقول التي يقرؤها قسم «دليل دكانجي» (/dalil).
 *
 * المصدر: Google Places API الرسمي بنفس مفتاح الخرائط الحي للمشروع
 * (GOOGLE_MAPS_API_KEY) — لا يوجد أي scraping.
 *
 * الاستخدام (من جذر المشروع):
 *   node scripts/update-google-ratings.js              # تحديث كل المتاجر المعتمدة
 *   node scripts/update-google-ratings.js --dry-run    # عرض ما سيُكتب دون أي كتابة
 *   node scripts/update-google-ratings.js --only=5,84  # متاجر محددة فقط
 *
 * المتطلبات في .env (أو بيئة التشغيل):
 *   SUPABASE_SERVICE_ROLE_KEY  — إلزامي للكتابة (RLS يمنع anon من UPDATE).
 *   GOOGLE_MAPS_API_KEY        — اختياري؛ إن غاب يُجلب تلقائياً من
 *                                https://www.dukkanci.com.tr/api/maps-key (المفتاح الحي).
 *
 * منطق السلامة (الأهم):
 *  - متجر لديه google_place_id محفوظ → تحديث مباشر عبر Place Details (آمن ورخيص).
 *  - متجر بلا place_id → بحث Nearby بالاسم حول إحداثياته المدقّقة (نصف قطر 400م)،
 *    ثم Find Place كاحتياط. أي نتيجة تبعد أكثر من ~450م عن إحداثيات المتجر تُرفض:
 *    ترك الحقول فارغة أفضل من عرض تقييم متجر خاطئ في الدليل.
 *  - متجر بلا إحداثيات يُتخطى (يُدرج في التقرير النهائي لمعالجته يدوياً).
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SUPABASE_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const PLACES = "https://maps.googleapis.com/maps/api/place";

// نفس مُحمِّل .env المستخدم في server.js (لا تبعيات خارجية).
(function loadDotenv() {
  try {
    const envPath = path.join(ROOT, ".env");
    if (!fs.existsSync(envPath)) return;
    for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
      if (!line || /^\s*#/.test(line)) continue;
      const eq = line.indexOf("=");
      if (eq < 1) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
      if (key && !(key in process.env)) process.env[key] = val;
    }
  } catch (e) { /* dev convenience only */ }
})();

const DRY_RUN = process.argv.includes("--dry-run");
const onlyArg = process.argv.find(a => a.startsWith("--only="));
const ONLY = onlyArg ? new Set(onlyArg.slice(7).split(",").map(Number).filter(Boolean)) : null;
const MAX_MATCH_KM = 0.45;

const sleep = ms => new Promise(r => setTimeout(r, ms));

function haversineKm(a, b) {
  const rad = v => (v * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

async function getMapsKey() {
  if (process.env.GOOGLE_MAPS_API_KEY) return process.env.GOOGLE_MAPS_API_KEY;
  const r = await fetch("https://www.dukkanci.com.tr/api/maps-key", {
    headers: { Referer: "https://www.dukkanci.com.tr/" }
  });
  if (!r.ok) throw new Error(`maps-key endpoint: HTTP ${r.status}`);
  const j = await r.json();
  if (!j.key) throw new Error("maps-key endpoint returned no key");
  return j.key;
}

async function placesJson(url) {
  const r = await fetch(url);
  const j = await r.json();
  if (j.status && !["OK", "ZERO_RESULTS"].includes(j.status)) {
    throw new Error(`Places API: ${j.status}${j.error_message ? ` — ${j.error_message}` : ""}`);
  }
  return j;
}

// بحث عن المكان بالاسم حول إحداثيات المتجر. يجرّب الاسم الكامل ثم الاسم بلا
// البادئة العامة ("مطعم/حلويات/ملحمة...") ثم Find Place — مع رفض أي نتيجة بعيدة.
async function findPlace(KEY, store) {
  const loc = `${store.lat},${store.lng}`;
  const strippedName = String(store.name).replace(/^(مطعم|مطاعم|حلويات|حلواني|ملحمة|ملاحم|كنافة|سوبر ماركت|ماركت|شركة)\s+/u, "");
  const keywords = [store.name, strippedName].filter((v, i, arr) => v && arr.indexOf(v) === i);

  for (const kw of keywords) {
    const j = await placesJson(`${PLACES}/nearbysearch/json?location=${loc}&radius=400&keyword=${encodeURIComponent(kw)}&language=ar&key=${KEY}`);
    const hit = (j.results || []).find(p => p.geometry && p.geometry.location
      && haversineKm({ lat: store.lat, lng: store.lng }, p.geometry.location) <= MAX_MATCH_KM);
    if (hit) return hit.place_id;
    await sleep(120);
  }
  const j = await placesJson(`${PLACES}/findplacefromtext/json?input=${encodeURIComponent(store.name)}&inputtype=textquery&locationbias=circle:400@${loc}&fields=place_id,geometry&language=ar&key=${KEY}`);
  const cand = (j.candidates || []).find(p => p.geometry && p.geometry.location
    && haversineKm({ lat: store.lat, lng: store.lng }, p.geometry.location) <= MAX_MATCH_KM);
  return cand ? cand.place_id : null;
}

async function placeDetails(KEY, placeId) {
  const j = await placesJson(`${PLACES}/details/json?place_id=${encodeURIComponent(placeId)}&fields=place_id,name,rating,user_ratings_total,url,geometry&language=ar&key=${KEY}`);
  return j.result || null;
}

async function main() {
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SERVICE_KEY && !DRY_RUN) {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY غير موجود في .env — الكتابة مستحيلة (استخدم --dry-run للمعاينة).");
    process.exit(1);
  }
  const KEY = await getMapsKey();
  const authKey = SERVICE_KEY || "";

  const listRes = await fetch(
    `${SUPABASE_URL}/rest/v1/stores?select=id,name,lat,lng,google_place_id&or=(approval_status.is.null,approval_status.eq.approved)&order=id`,
    { headers: { apikey: authKey, Authorization: `Bearer ${authKey}` } }
  );
  if (!listRes.ok) throw new Error(`stores fetch: HTTP ${listRes.status}`);
  let storesList = await listRes.json();
  if (ONLY) storesList = storesList.filter(s => ONLY.has(s.id));

  const report = [];
  for (const store of storesList) {
    const row = { id: store.id, name: store.name, status: "", rating: "", count: "", place: "" };
    try {
      let placeId = store.google_place_id || null;
      if (!placeId) {
        if (store.lat == null || store.lng == null) {
          row.status = "⏭ بلا إحداثيات — تخطٍّ (أضف lat/lng أو google_place_id يدوياً)";
          report.push(row);
          continue;
        }
        placeId = await findPlace(KEY, store);
        await sleep(120);
      }
      if (!placeId) {
        row.status = "⏭ لا تطابق موثوق ≤450م — لم يُكتب شيء";
        report.push(row);
        continue;
      }
      const det = await placeDetails(KEY, placeId);
      if (!det) {
        row.status = "⏭ Place Details فارغ";
        report.push(row);
        continue;
      }
      if (store.lat != null && det.geometry && det.geometry.location) {
        const km = haversineKm({ lat: store.lat, lng: store.lng }, det.geometry.location);
        if (km > MAX_MATCH_KM + 0.1) {
          row.status = `⏭ المكان يبعد ${km.toFixed(2)}كم — رُفض`;
          report.push(row);
          continue;
        }
      }
      const patch = {
        google_place_id: det.place_id || placeId,
        google_rating: det.rating != null ? det.rating : null,
        google_reviews_count: det.user_ratings_total != null ? det.user_ratings_total : null,
        google_maps_url: det.url || null,
        google_rating_updated_at: new Date().toISOString()
      };
      row.place = det.name || "";
      row.rating = patch.google_rating != null ? String(patch.google_rating) : "—";
      row.count = patch.google_reviews_count != null ? String(patch.google_reviews_count) : "—";
      if (DRY_RUN) {
        row.status = "🔍 dry-run";
      } else {
        const up = await fetch(`${SUPABASE_URL}/rest/v1/stores?id=eq.${store.id}`, {
          method: "PATCH",
          headers: { apikey: authKey, Authorization: `Bearer ${authKey}`, "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify(patch)
        });
        row.status = up.ok ? "✅ حُدِّث" : `❌ كتابة فشلت HTTP ${up.status}`;
      }
    } catch (e) {
      row.status = `❌ ${e.message}`;
    }
    report.push(row);
    await sleep(150);
  }

  const ok = report.filter(r => r.status.startsWith("✅")).length;
  const skipped = report.filter(r => r.status.startsWith("⏭")).length;
  const failed = report.filter(r => r.status.startsWith("❌")).length;
  console.log("\n=== تقرير تحديث تقييمات Google ===");
  for (const r of report) {
    console.log(`#${String(r.id).padEnd(4)} ${r.status}  ${r.rating !== "" ? `★${r.rating} (${r.count})` : ""}  ${r.name}${r.place && r.place !== r.name ? `  ⇐ ${r.place}` : ""}`);
  }
  console.log(`\nالمجموع: ${report.length} — ✅ ${ok} · ⏭ ${skipped} · ❌ ${failed}${DRY_RUN ? " (dry-run: لم يُكتب شيء)" : ""}`);
  if (failed) process.exitCode = 1;
}

main().catch(e => { console.error("❌", e.message); process.exit(1); });
