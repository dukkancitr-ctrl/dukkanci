import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/app_config.dart';

/// Initializes the Supabase client the app reads catalog data from.
///
/// ARCHITECTURE NOTE (read this before "fixing" it to call a REST API):
/// the Dukkanci website does NOT have a clean versioned `/api/v1/stores`
/// backend — `app.js` (`loadCatalogFromSupabase()`) reads `stores` and
/// `products` directly from Supabase with the anon key, protected by RLS.
/// This app deliberately mirrors that same pattern instead of inventing an
/// API layer that doesn't exist server-side yet:
///   - Reads (stores, products, reviews, catalog) → straight from Supabase.
///   - Order creation → INSERT into `orders` directly (RLS allows anon
///     INSERT for approved stores, same as the website) AND a call to
///     POST {API_BASE_URL}/api/notify-order?action=... for the WhatsApp
///     notification side-channel — see ApiClient. Both writes are required:
///     CLAUDE.md documents a real 2026-07-02..07-10 incident where orders
///     reached WhatsApp but were never saved to `orders` because only one
///     of the two paths was wired up. Never remove either write.
///   - OTP checkout — also via the existing /api/notify-order actions.
///
/// If/when the team builds a real `/api/v1` backend, only this file and
/// ApiClient need to change — nothing above the repository layer does.
Future<void> initSupabase() async {
  await Supabase.initialize(
    url: AppConfig.supabaseUrl,
    anonKey: AppConfig.supabaseAnonKey,
  );
}

SupabaseClient get supabase => Supabase.instance.client;
