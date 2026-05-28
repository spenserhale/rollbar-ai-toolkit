<!-- source: https://docs.rollbar.com/docs/rollbar-cordova.md -->

# Cordova

Rollbar SDK for Cordova | Support Level: Not Supported

Add [Rollbar-cordova](https://github.com/rollbar/rollbar-cordova) to your Cordova projects to automatically capture and report errors in your applications.

As of April 2024, Rollbar will not be actively updating this repository and plans to archive it. We encourage our community to fork this repo if you wish to continue its development. While Rollbar will no longer be engaging in active development, we remain committed to reviewing and merging pull requests, particularly those about security updates. If an actively maintained fork emerges, please let us know, and we will gladly link to it from our documentation.

## Quick Start

1. Add the plugin to your app.

```
cordova plugin add rollbar-cordova
```

2. Add your Rollbar client token to the Android and iOS environments.

Add this meta-data element inside the `<application>` element in AndroidManifest.xml:

```
<meta-data android:name="com.rollbar.android.ACCESS_TOKEN" android:value="YOUR_CLIENT_TOKEN" />
```

Add this `preference` element inside the `<widget>` element in ./config.xml:

```
<preference name="RollbarClientToken" value="YOUR_CLIENT_TOKEN" />
```

3. Initialize Rollbar.js in index.js:

```
        window.Rollbar = new rollbar({
            accessToken: "YOUR_CLIENT_TOKEN",
            captureUncaught: true,
            captureUnhandledRejections: true,
        })
```

4. Build

```
cordova build ios
```

or

```
cordova build android
```

And you are ready to use Rollbar.

## Content Security Policy

Rollbar-cordova works without making network requests in the Javascript environment, by allowing the native Android and iOS environments to handle all network requests. You will not need to modify your Content Security Policy (CSP) for Rollbar to work correctly.

## Usage

Rollbar-cordova provides the full capabilities of each of the supported environments. See the Usage section for each of the SDKs to explore the different ways you can use Rollbar.

* [Android SDK](https://docs.rollbar.com/docs/android)
* [iOS SDK](https://docs.rollbar.com/docs/ios)
* [Rollbar.js SDK](https://docs.rollbar.com/docs/javascript)