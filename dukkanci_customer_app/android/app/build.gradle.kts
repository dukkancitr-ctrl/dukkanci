import java.util.Properties
import java.io.FileInputStream

plugins {
    id("com.android.application")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

val keystoreProperties = Properties()
val keystorePropertiesFile = rootProject.file("key.properties")
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(FileInputStream(keystorePropertiesFile))
}

android {
    namespace = "com.dukkanci.app"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    defaultConfig {
        // Final app id — must never change after first Play Store publish.
        // Matches the existing Capacitor (v1) app id; this Flutter build is v2,
        // developed in parallel while v1 keeps shipping (see dukkanci_customer_app/README.md).
        applicationId = "com.dukkanci.app"
        // You can update the following values to match your application needs.
        // For more information, see: https://flutter.dev/to/review-gradle-config.
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName

        // Android Maps SDK key referenced by AndroidManifest.xml's
        // com.google.android.geo.API_KEY meta-data. Override via either an
        // environment variable at build time (MAPS_API_KEY=... flutter build
        // appbundle) or android/local.properties (mapsApiKey=...) for local
        // runs. Falls back to the "Android Production" key in the dukkanci
        // Google Cloud project (Geocoding + Maps SDK for Android + Places),
        // restricted to this app's package + the debug and release signing
        // certificates' SHA-1 fingerprints — confirmed live via `adb logcat`
        // that the previous fallback (the website's browser-restricted key)
        // fails with "Authorization failure" on Android, hence the swap.
        val mapsApiKey = (project.findProperty("mapsApiKey") as String?)
            ?: System.getenv("MAPS_API_KEY")
            ?: "AIzaSyBEZJcm_BQAVMH3k21HXwGxycLIN3QE7U0"
        manifestPlaceholders["MAPS_API_KEY"] = mapsApiKey
    }

    signingConfigs {
        create("release") {
            if (keystorePropertiesFile.exists()) {
                keyAlias = keystoreProperties["keyAlias"] as String
                keyPassword = keystoreProperties["keyPassword"] as String
                storeFile = keystoreProperties["storeFile"]?.let { file(it) }
                storePassword = keystoreProperties["storePassword"] as String
            }
        }
    }

    buildTypes {
        release {
            // Real upload key when android/key.properties exists (CI/local release
            // builds); falls back to the debug key only if it's genuinely missing,
            // so `flutter run --release` still works on a fresh checkout.
            signingConfig = if (keystorePropertiesFile.exists()) {
                signingConfigs.getByName("release")
            } else {
                signingConfigs.getByName("debug")
            }
        }
    }
}

kotlin {
    compilerOptions {
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17
    }
}

flutter {
    source = "../.."
}
