// Mirrors the client's slugify/autoStoreSlug in app.js — kept identical so a
// store's auto-generated URL is the same whether it's built server-side (SSR,
// sitemap) or client-side (SPA nav), even before an admin sets a real slug.
function slugify(str) {
  const base = String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "store";
}
function autoStoreSlug(name, id) {
  return `${slugify(name)}-${id}`;
}
// Resolution priority: admin-set DB slug > legacy static map (store-slugs.js) >
// auto-generated from the name > bare id (only reachable with no name at all).
function resolveStoreSlug(store, staticMap) {
  if (!store) return "";
  return store.slug || (staticMap && staticMap[store.id]) || (store.name ? autoStoreSlug(store.name, store.id) : store.id) || "";
}

module.exports = { slugify, autoStoreSlug, resolveStoreSlug };
