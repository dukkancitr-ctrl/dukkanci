// One-off: submit every store, category and product URL to the Indexing API
// (via the deployed /api/notify-google endpoint, which holds the credentials).
// Usage: NEXT_PUBLIC_SITE_URL=https://www.dukkanci.com.tr node scripts/submit-all-urls.mjs
// NOTE: the Indexing API daily quota is ~200 URLs; this throttles and logs, and
// will report quota errors rather than silently dropping. Sitemaps remain the
// primary signal for the full 5500+ product catalogue.
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { STORE_SLUGS } = require("../store-slugs.js");
const { CATEGORY_SLUGS } = require("../category-slugs.js");

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.dukkanci.com.tr").replace(/\/+$/, "");
const SB_URL = (process.env.SUPABASE_URL || "https://tzcqnqzltrjemdnkzpzn.supabase.co").replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
const SB_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc";
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchProductSlugs() {
  let all = [], off = 0;
  for (;;) {
    const r = await fetch(`${SB_URL}/rest/v1/products?select=slug&slug=not.is.null&available=eq.true&order=id&limit=1000&offset=${off}`,
      { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } });
    if (!r.ok) break;
    const rows = await r.json();
    all = all.concat(rows.map(p => p.slug));
    if (rows.length < 1000) break;
    off += 1000;
  }
  return all;
}

(async () => {
  const urls = [
    ...Object.values(STORE_SLUGS).map(s => `${SITE}/store/${s}`),
    ...Object.keys(CATEGORY_SLUGS).map(s => `${SITE}/category/${s}`),
    ...(await fetchProductSlugs()).map(s => `${SITE}/product/${s}`)
  ];
  console.log(`Submitting ${urls.length} URLs to ${SITE}/api/notify-google …`);
  let ok = 0, skipped = 0, failed = 0;
  for (const url of urls) {
    try {
      const r = await fetch(`${SITE}/api/notify-google`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url })
      });
      const data = await r.json().catch(() => ({}));
      if (data.skipped) { skipped++; if (skipped === 1) console.warn("  credentials not configured on server — nothing submitted."); }
      else if (r.ok) ok++;
      else { failed++; console.warn(`  ${r.status} ${url}: ${JSON.stringify(data).slice(0, 120)}`); if (failed >= 5) { console.error("  too many failures (quota?). Stopping."); break; } }
    } catch (e) { failed++; console.warn(`  err ${url}: ${e.message}`); }
    await sleep(300);
  }
  console.log(`Done. ok=${ok} skipped=${skipped} failed=${failed}`);
})().catch(e => { console.error(e); process.exit(1); });
