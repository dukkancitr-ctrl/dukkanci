// Seeds tr_provinces / tr_districts / tr_neighborhoods from data/tr-locations/*.json.
// Run this ONCE, after applying migrations/20260722_turkish_address_system.sql
// manually in the Supabase SQL editor (this script only does INSERT, it cannot
// create tables — no DDL path is available from this environment).
//
// Usage: node scripts/seed-tr-locations.mjs
//
// Safe to re-run: uses upsert (on conflict id do nothing) in batches, so a
// half-finished run can just be re-run without duplicating rows.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envText = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
const env = {};
envText.split(/\r?\n/).forEach((line) => {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
});

const SUPABASE_URL = 'https://tzcqnqzltrjemdnkzpzn.supabase.co';
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY missing from .env');
  process.exit(1);
}

const DATA_DIR = path.join(__dirname, '..', 'data', 'tr-locations');

async function upsertBatch(table, rows, batchSize) {
  let inserted = 0;
  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=id`, {
      method: 'POST',
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify(chunk)
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`${table} batch ${i}-${i + chunk.length} FAILED`, res.status, body.slice(0, 500));
      process.exit(1);
    }
    inserted += chunk.length;
    process.stdout.write(`\r${table}: ${inserted}/${rows.length}`);
  }
  console.log(`\n${table}: done (${inserted} rows)`);
}

async function verifyTablesExist() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/tr_provinces?select=id&limit=1`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
  });
  if (!res.ok) {
    console.error(
      'tr_provinces is not reachable (HTTP', res.status, '). Did you run ' +
      'migrations/20260722_turkish_address_system.sql in the Supabase SQL editor first?'
    );
    process.exit(1);
  }
}

async function main() {
  await verifyTablesExist();

  const provinces = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'tr_provinces.json'), 'utf8'));
  const districts = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'tr_districts.json'), 'utf8'));
  const neighborhoods = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'tr_neighborhoods.json'), 'utf8'));

  console.log(`Loaded: ${provinces.length} provinces, ${districts.length} districts, ${neighborhoods.length} neighborhoods`);

  await upsertBatch('tr_provinces', provinces, 500);
  await upsertBatch('tr_districts', districts, 500);
  await upsertBatch('tr_neighborhoods', neighborhoods, 1000);

  // Sanity check counts back from the DB.
  const countRes = await fetch(`${SUPABASE_URL}/rest/v1/tr_neighborhoods?select=id`, {
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      Prefer: 'count=exact',
      Range: '0-0'
    }
  });
  const range = countRes.headers.get('content-range');
  console.log('tr_neighborhoods total row count in DB (content-range):', range);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
