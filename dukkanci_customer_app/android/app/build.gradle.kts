plugins {
    id("com.android.application")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
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
        // com.google.android.geo.API_KEY meta-data. Set it via either an
        // environment variable at build time (MAPS_API_KEY=... flutter build
        // appbundle) or android/local.properties (mapsApiKey=...) for local
        // runs — never commit a real key to this file. Empty by default so a
        // fresh checkout still builds (Maps just won't render until it's set).
        val mapsApiKey = (project.findProperty("mapsApiKey") as String?)
            ?: System.getenv("MAPS_API_KEY")
            ?: ""
        manifestPlaceholders["MAPS_API_KEY"] = mapsApiKey
    }

    buildTypes {
        release {
            // TODO: Add your own signing config for the release build.
            // Signing with the debug keys for now, so `flutter run --release` works.
            signingConfig = signingConfigs.getByName("debug")
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
