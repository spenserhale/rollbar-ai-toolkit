<!-- source: https://docs.rollbar.com/docs/migrating-to-v100.md -->

# Migrating to v1.0.0

To migrate to the v1.0.0 release of the React Native SDK, changes are required in the Javascript and iOS configurations. The Android configuration remains the same.

## Javascript

To install, Rollbar.js is now a peer dependency and must be installed along with rollbar-react-native.

```
npm install rollbar rollbar-react-native
```

or

```
yarn add rollbar rollbar-react-native
```

### Configuration

The access token is now included in the configuration object, which is now a plain javascript object.

```
import { Client } from 'rollbar-react-native'

const rollbar = new Client({
  accessToken: "POST_CLIENT_ITEM_ACCESS_TOKEN",
  captureUncaught: true,
  captureUnhandledRejections: true
})
```

The configuration object accepts any Rollbar.js config options.

## iOS Native (Cocoapods)

New requirements for the Podfile.

Platform version must be at least 14.

```
platform :ios, '14.0'
```

Frameworks must be enabled.

```
use_frameworks!
```

### Configuration

The access token is now included in the configuration object, and the configuration method is renamed.

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
  NSDictionary *options = @{
    @"accessToken": @"POST_CLIENT_ITEM_ACCESS_TOKEN"
  };

  [RollbarReactNative initWithConfiguration:options];
}
```

### Usage

The interface for `RollbarReactNative` in native iOS code is the same as <https://github.com/rollbar/rollbar-apple>, except Level should be passed as a string, not an enum.

```
[RollbarReactNative log:@"info" message:@"React Native log message"];

```