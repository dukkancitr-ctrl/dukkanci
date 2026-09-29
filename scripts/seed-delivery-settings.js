#!/usr/bin/env node
"use strict";

// Mirrors per-store delivery pricing INTO the database (site_settings.deliverySettings)
// so the server and the mobile app can price delivery — see lib/delivery.js.
//
// Why: a store's per-km rate / fixed fee / max distance used to live only in the
// website's bundled <slug>-data.js files, invisible to everything but the website.
// The mobile app therefore priced delivery at 0 (orders DK-0661634416 and
// DK-0662089943, 2026-09-29). The website already overlays this key on top of the
// bundled values, so seeding the SAME values changes nothing on the website.
//
// Usage:
//   node scripts/seed-delivery-settings.js --from settings.json            (dry run)
//   node scripts/seed-delivery-settings.js --from settings.json --apply
//   ... --force   also overwrite stores that already have a cloud entry
//
// settings.json = { "<storeId>": { mode, fixedFee, ratePerKm, prepMinutes, maxRoundTripKm }, ... }
// Produce it from the live site console:
//   Object.fromEntries(stores.map(s => { const c = {...DEFAULT_DELIVERY_SETTINGS, ...(initialDeliverySettings[s.id]||{})};
//     return [s.id, {mode:c.mode, fixedFee:c.fixedFee, ratePerKm:c.ratePerKm, prepMinutes:c.prepMinutes, maxRoundTripKm:c.maxRoundTripKm}]; }))
//
// A NEW store must be seeded too (add it to the JSON, run with --apply): without a
// cloud entry the server prices it with the defaults (15 ل.ت/كم), which can differ
// from the rate in its bundled data file.

const fs = require("fs");
const path = require("path");
const { cleanSettings } = require("../lib/delivery");

const args = process.argv.slice(2);
const flag = n => args.includes(n);
const val = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };

function loadEnv() {
  const p = path.join(__dirname, "..", ".env");
  const out = {};
  if (!fs.existsSync(p)) return out;
  fs.readFileSync(p, "utf8").split(/\r?\n/).forEach(l => {
    if (!l || l.startsWith("#") || !l.includes("=")) return;
    const i = l.indexOf("=");
    out[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  });
  return out;
}

(async () => {
  const from = val("--from");
  if (!from) { console.error("--from <settings.json> is required"); process.exit(1); }
  const incoming = JSON.parse(fs.readFileSync(from, "utf8"));
  const env = { ...loadEnv(), ...process.env };
  const base = (env.SUPABASE_URL || "https://tzcqnqzltrjemdnkzpzn.supabase.co").replace(/\/+$/, "");
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) { console.error("SUPABASE_SERVICE_ROLE_KEY missing"); process.exit(1); }
  const H = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

  const r = await fetch(`${base}/rest/v1/site_settings?key=eq.deliverySettings&select=value`, { headers: H });
  const rows = await r.json();
  const current = (Array.isArray(rows) && rows[0] && rows[0].value && typeof rows[0].value === "object") ? rows[0].value : {};

  const next = { ...current };
  let added = 0, kept = 0, changed = 0;
  for (const [sid, raw] of Object.entries(incoming)) {
    const clean = cleanSettings(raw);
    if (!Object.keys(clean).length) continue;
    if (current[sid] && !flag("--force")) { kept++; continue; }
    if (current[sid]) changed++; else added++;
    next[sid] = { ...(current[sid] || {}), ...clean };
  }
  console.log(`stores in file: ${Object.keys(incoming).length} | added: ${added} | overwritten: ${changed} | kept existing: ${kept}`);
  if (!flag("--apply")) { console.log("dry run — nothing written (use --apply)"); return; }

  const w = await fetch(`${base}/rest/v1/site_settings?on_conflict=key`, {
    method: "POST",
    headers: { ...H, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ key: "deliverySettings", value: next, updated_at: new Date().toISOString() })
  });
  console.log("write status:", w.status, w.ok ? "OK" : await w.text());
})();
