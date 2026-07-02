// Human-readable English slugs for store URLs: /store/<slug> instead of /store/<id>.
// Single source of truth shared by the SPA (app.js, as a global), the SSR route
// (api/store.js) and the sitemap (api/sitemap.js, via require). Numeric /store/<id>
// URLs keep working for backward compatibility.
//
// RULE (mandatory for every new store): a store MUST never be exposed by its numeric
// id. Before a store goes live, add a clean Latin slug here keyed by its id. The site
// canonical, sitemap and in-app links all read this map, so a missing entry leaks an
// ugly /store/<number> URL. Conventions, matching the entries below:
//   • Latin letters, lowercase, words joined by "-"; no Arabic, spaces or punctuation.
//   • Restaurants end in "-restaurant"; markets "-market"; sweets "-sweets"; butchers
//     "-butcher". Multi-branch brands: "<brand>-<type>-<area>" (e.g. anas-chicken-taksim).
//   • Base the slug on the store's real Latin/brand name (from the menu/source), not a
//     transliteration of the Arabic — e.g. "anas-chicken", not "mataam-anas".
//   • Keep slugs unique and stable; once published, never rename (it breaks live links).
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
  42: "zaitoune-sweets-zeytinburnu",
  44: "anas-chicken-aksaray",
  45: "anas-chicken-taksim",
  46: "anas-chicken-kayasehir",
  47: "mandy-meydan-restaurant",
  48: "alfursan-restaurant",
  49: "hallab-1881-restaurant",
  50: "safa-alsham-market",
  51: "rody-restaurant",
  52: "krep-chef-restaurant",
  53: "beyt-alsham-restaurant",
  54: "mandi-shebam-restaurant",
  55: "saruja-restaurant",
  56: "pasa-pizzeria-restaurant",
  57: "badeel-treats-sweets",
  58: "biryani-palace-restaurant",
  59: "bhaleeb-sweets",
  60: "yumy-yumy-restaurant",
  62: "bludan-fatih-restaurant",
  61: "bludan-kayasehir-restaurant",
  64: "saj-falafel-restaurant",
  68: "albaraa-kunafesi-sweets",
  72: "hadramout-yemen-restaurant",
  71: "meat-moot-ortakoy-restaurant",
  69: "baraka-restaurant",
  73: "sham-grill-restaurant",
  77: "hawa-mahal-restaurant",
  70: "mandi-alyemen-restaurant",
  66: "filistin-kunefesi-kayasehir",
  75: "wingi-chicken-bahcesehir",
  76: "wingi-chicken-kayasehir",
  74: "albaraka-bagcilar-restaurant",
  63: "istanbul-chicken-restaurant",
  78: "reyhan-kuruyemis",
  79: "butun-nahl-honey",
  82: "8dec-coffee",
  81: "alahdab-market",
  65: "ruman-restaurant",
  80: "golden-mix-coffee",
  67: "bab-alyemen-restaurant"
};

// Reverse: slug -> id.
const STORE_SLUG_TO_ID = Object.fromEntries(
  Object.entries(STORE_SLUGS).map(([id, slug]) => [slug, Number(id)])
);

if (typeof module !== "undefined" && module.exports) {
  module.exports = { STORE_SLUGS, STORE_SLUG_TO_ID };
}
