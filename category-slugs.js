// English slugs for the main store categories → /category/<slug>.
// Maps the clean store-level `category` values (not the 233 noisy per-product
// labels). Shared by the SPA (global) and the SSR/sitemap routes (require).
// When a new store category appears, add it here.
const CATEGORY_SLUGS = {
  restaurants: "مطاعم",
  sweets: "حلويات",
  supermarket: "سوبر ماركت",
  butcher: "ملحمة ومشاوي",
  juices: "عصائر"
};

// text -> slug
const CATEGORY_TEXT_TO_SLUG = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([slug, text]) => [text, slug])
);

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CATEGORY_SLUGS, CATEGORY_TEXT_TO_SLUG };
}
