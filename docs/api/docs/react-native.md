<!-- source: https://docs.rollbar.com/docs/react-native.md -->

# React Native

Rollbar SDK for React Native | Support Level: Supported

> 📘
>
> This page described the Beta version 1.0.0 SDK.
>
> For the version 0.9.3 SDK, see [Legacy v0.9.3 SDK](https://docs.rollbar.com/docs/legacy-v093-sdk).
>
> For migration to v1.0.0, see [Migrating to v1.0.0](https://docs.rollbar.com/docs/migrating-to-v100).

## Quick Start

Integrating this library with your React Native codebase requires the following steps:

Install packages from NPM

```
npm install rollbar rollbar-react-native
```

or

```
yarn add rollbar rollbar-react-native
```

## Cocoapods

Add the following to your Podfile.

Platform version must be at least 14.

```
platform :ios, '14.0'
```

Frameworks must be enabled.

```
use_frameworks!
```

And the pod must be added in the target block.

```
pod 'RollbarReactNative', path: '../node_modules/rollbar-react-native'
```

Then perform a `pod install`.

## Configuration

### Javascript

The Javascript client works the same for both web-only and native targets.

In `App.js`, instantiate a Rollbar Client:

```js
import { Client } from 'rollbar-react-native'

const rollbar = new Client({
  accessToken: "POST_CLIENT_ITEM_ACCESS_TOKEN",
  captureUncaught: true,
  captureUnhandledRejections: true
})

```

The Javascript API consists of the logging methods:

```js
rollbar.log(error|message, extra, callback)
rollbar.debug(error|message, extra, callback)
rollbar.info(error|message, extra, callback)
rollbar.warning(error|message, extra, callback)
rollbar.error(error|message, extra, callback)
rollbar.critical(error|message, extra, callback)
```

As well as two methods for adding the current user to payloads:

```js
rollbar.setPerson(id, name, email)
rollbar.clearPerson()
```

### Using the React SDK

Rollbar-react-native is compatible with @rollbar/react, using the same imports for web-only and native targets.

To install with npm:

```
npm install @rollbar/react rollbar rollbar-react-native
```

To install with yarn:

```shell
yarn add @rollbar/react rollbar rollbar-react-native
```

#### Configuration

```javascript
import React from 'react';
import { Provider, ErrorBoundary } from '@rollbar/react';
import { Client } from 'rollbar-react-native';

const rollbarNative = new Client({
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  environment: 'production',
  captureUncaught: true,
  captureUnhandledRejections: true,
  captureDeviceInfo: true
});

// Both web and native return the Rollbar.js interface here.
const rollbar = rollbarNative.rollbar;

export default function App() {
  return (
    <Provider instance={rollbar} >
      // ...
    </Provider>
  )
}
```

For more information about using the React SDK, see the [React SDK documentation](https://docs.rollbar.com/docs/react).

### Source Maps

Mapping production React Native JavaScript code to your source files is slightly more complicated than traditional JavaScript environments. This is due to the fact that iOS and Android generate different JavaScript bundles, and therefore different stack traces, which need separate source maps.

You can enable source maps to correctly identify the environment by using the `code_version` to signal which source map to use. Please note that `code_version` must be nested under the `client` and `javascript` keys in order to work for source mapping.

```js
new Configuration('POST_CLIENT_ITEM_ACCESS_TOKEN', {
  ...
  payload: {
    client: {
      javascript: {
        source_map_enabled: true,
        code_version: 'insert_code_version_here.ios',
      }
    }
  }
});
```

Be sure to specify the code version when you upload the sourcemap. For example, via curl:

```
curl https://api.rollbar.com/api/1/sourcemap \
  -F access_token=ACCESS_TOKEN_HERE \
  -F version=insert_code_version_here.ios \
  -F minified_url=http://reactnativehost/main.jsbundle \
  -F source_map=@sourcemap.ios.js \
  -F index.ios.js=@index.ios.js
```

Source maps use file names for mapping minified symbols to symbols contained in your original source code. Due to the nature of the JavaScript environment that your code runs in on a mobile device using React Native, these file names are a bit strange. Rollbar automatically rewrites these file names to be `http://reactnativehost/<regular file path>`. This allows you to use the `minified_url` with the fake protocol and host of `http://reactnativehost` to specify your minified JavaScript code.

Generating source maps for React Native is an under-documented part of the pipeline. Below are the commands you can use to generate conforming source maps for iOS and Android.

iOS:

```
react-native bundle --platform ios --entry-file index.ios.js --dev false --bundle-output \
ios/main.jsbundle --assets-dest ios --sourcemap-output sourcemap.ios.js --sourcemap-sources-root ./
```

Android:

```
react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output \
android/index.android.bundle --assets-dest android/app/src/main/res/ --sourcemap-output \
sourcemap.android.js --sourcemap-sources-root ./
```

Android Native Code Version:\
When using Android native source maps (e.g. Proguard), set the code version in AndroidManifest.xml.

```xml
<application>
  <!-- ... -->

  <meta-data android:name="com.rollbar.android.CODE_VERSION" android:value="1.0.0" />
</application>
```

### iOS

In `AppDelegate.m`, import `RollbarReactNative`

```objectivec
#import <RollbarReactNative/RollbarReactNative.h>
```

and initialize it

```objectivec
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
  NSDictionary *options = @{
    @"accessToken": @"POST_CLIENT_ITEM_ACCESS_TOKEN"
  };

  [RollbarReactNative initWithConfiguration:options];
}
```

The interface for `RollbarReactNative` in native iOS code is the same as <https://github.com/rollbar/rollbar-apple>, except Level should be passed as a string, not an enum.

```
[RollbarReactNative log:@"info" message:@"React Native log message"];

```

Crashes in native code will be reported automatically on the next app restart.

### Android

We require minSdkVersion of at least 19 be set in your app/build.gradle file.

In `MainApplication.java` you need to import `RollbarReactNative`

```java
import com.rollbar.RollbarReactNative;
```

and initialize it

```java
@Override
public void onCreate() {
  super.onCreate();
  RollbarReactNative.init(this, "POST_CLIENT_ITEM_ACCESS_TOKEN", "production");
  ...
}
```

The interface for `RollbarReactNative` in native Android code is the same as the rollbar-android part of <https://github.com/rollbar/rollbar-java>. Crashes in native code will be reported automatically on the next app restart.

## Help / Support

If you run into any issues, please email us at `support@rollbar.com`.

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/rollbar-react-native/issues/new).