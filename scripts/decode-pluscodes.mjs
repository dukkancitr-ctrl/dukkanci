// Decode Google Plus Codes (Open Location Code, short form) to lat/lng.
const A = '23456789CFGHJMPQRVWX';
const SEP = '+', SEP_POS = 8;
const PAIR_RES = [20, 1, 0.05, 0.0025, 0.000125];
const GRID_ROWS = 5, GRID_COLS = 4;

function decode(code) {
  code = code.replace(SEP, '').replace(/0+$/, '').toUpperCase();
  let lat = -90, lng = -180;
  const n = Math.min(code.length, 10);
  for (let i = 0; i < n; i += 2) {
    const r = PAIR_RES[i / 2];
    lat += A.indexOf(code[i]) * r;
    lng += A.indexOf(code[i + 1]) * r;
  }
  let latRes = PAIR_RES[n / 2 - 1], lngRes = latRes;
  if (code.length > 10) {
    let latP = PAIR_RES[4], lngP = PAIR_RES[4];
    for (let i = 10; i < Math.min(code.length, 15); i++) {
      latP /= GRID_ROWS; lngP /= GRID_COLS;
      const d = A.indexOf(code[i]);
      lat += Math.floor(d / GRID_COLS) * latP;
      lng += (d % GRID_COLS) * lngP;
    }
    latRes = latP; lngRes = lngP;
  }
  return { lat: lat + latRes / 2, lng: lng + lngRes / 2 };
}

function encodePrefix(lat, lng, chars) {
  let aLat = lat + 90, aLng = lng + 180, out = '';
  for (let i = 0; i < 5 && out.length < chars + 2; i++) {
    const r = PAIR_RES[i];
    const ld = Math.floor(aLat / r); aLat -= ld * r;
    const gd = Math.floor(aLng / r); aLng -= gd * r;
    out += A[ld] + A[gd];
  }
  return out.slice(0, chars);
}

function recoverNearest(short, refLat, refLng) {
  const sep = short.indexOf(SEP);
  const pad = SEP_POS - sep;
  const prefix = encodePrefix(refLat, refLng, pad);
  const area = decode(prefix + short);
  const res = PAIR_RES[pad / 2 - 1];
  const half = res / 2;
  let { lat, lng } = area;
  if (refLat + half < lat) lat -= res; else if (refLat - half > lat) lat += res;
  if (refLng + half < lng) lng -= res; else if (refLng - half > lng) lng += res;
  return { lat, lng };
}

const branches = [
  { area_ar: "بيليك دوزو",  code: "2J8X+F3", ref: [41.003, 28.641] },
  { area_ar: "باشاك شهير",  code: "4R23+W8", ref: [41.093, 28.802] },
  { area_ar: "كاياشهير",    code: "4QF9+XR", ref: [41.109, 28.768] },
  { area_ar: "أفجلار",      code: "XPJF+R8", ref: [40.980, 28.717] },
  { area_ar: "فندق زاده",   code: "2W6R+W3", ref: [41.011, 28.940] },
  { area_ar: "فلوريا",      code: "XQ8W+QR", ref: [40.975, 28.787] },
  { area_ar: "الفاتح",      code: "2WCR+7W", ref: [41.019, 28.949] },
  { area_ar: "بهجة ليفلر",  code: "2RF6+98", ref: [41.001, 28.859] },
];

const out = [];
for (const b of branches) {
  const p = recoverNearest(b.code, b.ref[0], b.ref[1]);
  out.push({ area_ar: b.area_ar, code: b.code, lat: +p.lat.toFixed(6), lng: +p.lng.toFixed(6) });
  console.log(`${b.area_ar.padEnd(12)} ${b.code.padEnd(9)} ${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}`);
}
import fs from 'fs';
fs.writeFileSync('zaitoune-branches.json', JSON.stringify(out, null, 1));
