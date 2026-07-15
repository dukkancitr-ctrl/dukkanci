/// Build-time environment configuration.
///
/// Values are injected via `--dart-define` at build/run time so the same
/// source tree produces dev / staging / prod builds without editing code:
///
///   flutter run --dart-define=ENV=dev
///   flutter build appbundle --dart-define-from-file=env/prod.json
///
/// See `env/dev.json`, `env/staging.json`, `env/prod.json` for the values
/// each environment actually needs (Supabase project, API base URL, Google
/// Maps key, etc). Never commit real secrets to those files if the repo is
/// public — this project's `env/*.json` are placeholders only.
enum AppEnvironment { dev, staging, prod }

class AppConfig {
  AppConfig._();

  static const _envName = String.fromEnvironment('ENV', defaultValue: 'dev');

  static AppEnvironment get environment {
    switch (_envName) {
      case 'prod':
        return AppEnvironment.prod;
      case 'staging':
        return AppEnvironment.staging;
      default:
        return AppEnvironment.dev;
    }
  }

  static bool get isProd => environment == AppEnvironment.prod;

  /// Dukkanci's live website + serverless API (Vercel). The Flutter app talks
  /// to the SAME backend the website uses today — there is no separate
  /// `/api/v1` yet (see README "Backend integration reality" section) — so
  /// this base URL points at the existing `/api/notify-order` action-style
  /// endpoint for writes (orders, OTP, notifications registration).
  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://www.dukkanci.com.tr',
  );

  /// Same Supabase project the website reads from directly
  /// (see supabase-config.js in the repo root). The anon/publishable key is
  /// safe to ship in a client — it is RLS-protected server-side, exactly as
  /// it is today embedded in the public website JS bundle.
  static const supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://tzcqnqzltrjemdnkzpzn.supabase.co',
  );

  static const supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc',
  );

  /// Android-specific Google Maps key — MUST be a separate key from the
  /// website's, restricted in Google Cloud Console to package name
  /// `com.dukkanci.app` + the app's SHA-1 signing fingerprints (debug AND
  /// release). The web Maps key cannot be reused because Android app
  /// restriction and HTTP-referrer restriction are mutually exclusive.
  /// Set via --dart-define=MAPS_API_KEY=... at build time; also copy the
  /// same value into android/app/src/main/AndroidManifest.xml's
  /// com.google.android.geo.API_KEY meta-data (see README).
  static const mapsApiKey = String.fromEnvironment('MAPS_API_KEY', defaultValue: '');

  static const minGoogleReviewsForFeatured = 50;
}
