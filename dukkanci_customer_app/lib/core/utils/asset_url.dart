/// Store/product image columns in Supabase are a mix of paths relative to
/// the website's own origin (e.g. "/assets/photos/wekala/cover.jpg" — most
/// legacy stores) and full absolute URLs (Supabase Storage uploads via the
/// admin panel, e.g. "https://www.dukkanci.com.tr/media/campaign-images/...").
/// The website resolves the relative ones for free because it IS that
/// origin; a mobile app has no such origin, so every relative path must be
/// prefixed explicitly or the image silently fails to load (found on first
/// device test: most, but not all, store covers were blank).
String? resolveAssetUrl(String? path) {
  if (path == null || path.isEmpty) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const siteOrigin = 'https://www.dukkanci.com.tr';
  return path.startsWith('/') ? '$siteOrigin$path' : '$siteOrigin/$path';
}
