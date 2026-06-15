// Human-readable English slugs for store URLs: /store/<slug> instead of /store/<id>.
// Single source of truth shared by the SPA (app.js, as a global), the SSR route
// (api/store.js) and the sitemap (api/sitemap.js, via require). Numeric /store/<id>
// URLs keep working for backward compatibility. When adding a store, add its slug here.
const STORE_SLUGS = {
  5: "alheelal-butcher",
  6: "alsultan-sweets-fatih",
  7: "alsultan-sweets-basaksehir",
  8: "alsultan-sweets-yusufpasa",
  9: "alsultan-sweets-beylikduzu",
  10: "alsultan-sweets-bahcesehir",
  11: "alsultan-sweets-sultangazi",
  12: "zaitoune-sweets-bahcelievler",
  13: "ezzedine-sweets",
  14: "salloura-sweets",
  15: "nour-alsham-restaurant",
  16: "tihama-yemen-restaurant",
  17: "afgan-kebab-restaurant",
  18: "ayam-shamia-restaurant",
  19: "kadi-market-basaksehir",
  20: "yemen-chef-restaurant",
  21: "alwadi-restaurant",
  22: "kadi-market-esenyurt",
  23: "azal-restaurant",
  24: "abou-elzelouf-restaurant",
  25: "bitehaus-restaurant",
  26: "alagar-shawarma-kayasehir",
  27: "alagar-shawarma-esenyurt",
  28: "alagar-shawarma-beylikduzu",
  29: "alagar-shawarma-fatih",
  30: "alagar-shawarma-sirinevler",
  31: "alkhawali-restaurant",
  32: "adem-sef-restaurant",
  33: "bab-touma-restaurant",
  34: "orange-turkey",
  35: "zaitoune-sweets-beylikduzu",
  36: "zaitoune-sweets-basaksehir",
  37: "zaitoune-sweets-kayasehir",
  38: "zaitoune-sweets-avcilar",
  39: "zaitoune-sweets-findikzade",
  40: "zaitoune-sweets-florya",
  41: "zaitoune-sweets-fatih",
  42: "zaitoune-sweets-zeytinburnu"
};

// Reverse: slug -> id.
const STORE_SLUG_TO_ID = Object.fromEntries(
  Object.entries(STORE_SLUGS).map(([id, slug]) => [slug, Number(id)])
);

if (typeof module !== "undefined" && module.exports) {
  module.exports = { STORE_SLUGS, STORE_SLUG_TO_ID };
}
