<!-- source: https://docs.rollbar.com/docs/flutter.md -->

# Flutter

Rollbar SDK for Flutter | Support Level: Not Supported

As of April 2024, Rollbar will not be actively updating this repository and plans to archive it. We encourage our community to fork this repo if you wish to continue its development. While Rollbar will no longer be engaging in active development, we remain committed to reviewing and merging pull requests, particularly those about security updates. If an actively maintained fork emerges, please let us know, and we will gladly link to it from our documentation.

<br />

# Quick Start

Integrating this library with your Flutter codebase requires the following steps:

1. Add the package to your `pubspec.yaml` file:

```yaml
dependencies:
  rollbar_flutter: ^1.5.0
```

2. Run `flutter pub get`

To configure rollbar-flutter to handle all uncaught errors in your application:

```dart
import 'package:flutter/material.dart';

// Import Rollbar package
import 'package:rollbar_flutter/rollbar.dart' show Rollbar, RollbarFlutter;
import 'package:rollbar_flutter/rollbar.dart' as rollbar;

// Configure Rollbar SDK
Future<void> main() async {
  const config = rollbar.Config(
      accessToken: '<ClientAccessToken>',
      environment: 'development',
      codeVersion: '1.0.0',
      handleUncaughtErrors: true,
      includePlatformLogs: true,
  );

  // Run app with Rollbar
  await RollbarFlutter.run(config, () {
    runApp(const MainApp());
  });
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  static throwException() {
      throw Exception('Example error!');
  }

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: Scaffold(
        body: Center(
          child: ElevatedButton(
            onPressed: throwException,
            child: Text('Throw an exception'),
          ),
        ),
      ),
    );
  }
}

```

# Requirements

* Dart SDK >= 2.7.0
* Flutter >= 1.20.0
* A Rollbar account

# Platform support

`rollbar-flutter` currently support Android and iOS.

## Android

### Platform-specific occurrence information

When `handleUncaughtErrors` is set to `true`, there will be a separate  [`rollbar-android`](https://docs.rollbar.com/docs/android) notifier that will handle uncaught exceptions on the Android platform side.

Android runtime exceptions are thrown from a `MethodChannel` invocation will not be caught by `rollbar-android` though, since Flutter and re-thrown catch those on the Dart side. They will be caught and reported by the rollbar Dart notifier.

By default, the Dart exception will include the Java or Kotlin stack trace as a String in the exception message, missing important information from the Android runtime. To get `rollbar-android` to process the exception and add its information to the occurrence, all you need to do is replace the `io.flutter.plugin.common.MethodChannel` instance in your Android code, with `com.rollbar.flutter.RollbarMethodChannel`, eg.:

```java
public class MainActivity extends FlutterActivity implements MethodChannel.MethodCallHandler {
    private static final String CHANNEL = "com.example.flutter/activity";

    @Override
    public void configureFlutterEngine(@NonNull FlutterEngine flutterEngine) {
        super.configureFlutterEngine(flutterEngine);
        new RollbarMethodChannel(
                flutterEngine.getDartExecutor().getBinaryMessenger(),
                CHANNEL).setMethodCallHandler(this);
    }
}
```

No other code changes are necessary.

## iOS

When `handleUncaughtErrors` is set to `true`, there will be a separate  [`rollbar-apple`](https://docs.rollbar.com/docs/apple) notifier initialized, which will report crashes to Rollbar.

### Platform logs

Platform log collection (via [Logcat](https://developer.android.com/studio/debug/am-logcat) on Android, and [NSLog](https://developer.apple.com/documentation/foundation/1395275-nslog/) on iOS) can be enabled by setting `includePlatformLogs` to `true` in the configuration.

Note this will increase the size of the payload significantly, since log information can get very large.

## Symbolication / Deobfuscation

If you use obfuscating the Dart code in your Flutter application, reported stack traces will not be very useful in most cases.

Rollbar provides a way for you to upload the symbols file generated during the obfuscation process so that stack traces can be symbolicated as they are reported.

Here is an example cURL command to upload a symbols file:

```
curl 'https://api.rollbar.com/api/1/fluttersymbols' \
  -F access_token=POST_SERVER_ITEM_ACCESS_TOKEN \
  -F version=1.0.0 \
  -F flutter_symbols=@path/to/symbols/file
```

Where `version` matches the `codeVersion` set in your `rollbar-flutter` configuration, corresponding to the version the symbols file was generated for.

After uploading, any future reported errors for the specified version will automatically be symbolicated using the symbols file.

Flutter symbols can also be managed through the project settings page.

## Symbol Map Files

The data retention process for Flutter symbol files is that files which are unused for 90 days, as determined by not having any occurrences on their code\_version, will be automatically deleted.

# Help / Support

If you run into any issues, please email us at `support@rollbar.com`.\
For bug reports, please [open an issue on GitHub](https://github.com/rollbar/rollbar-flutter/issues/new).