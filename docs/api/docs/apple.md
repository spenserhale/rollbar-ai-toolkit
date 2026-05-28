<!-- source: https://docs.rollbar.com/docs/apple.md -->

# Apple

Rollbar SDK for Apple platforms | Support Level: Supported

The Rollbar Apple SDK equips your applications with the ability to automatically detect crashes and exceptions, sending auto-diagnosed reports directly to Rollbar. This allows you to leverage the full power of the Rollbar platform for thorough analysis and swift resolution of your application issues.

> 👍
>
> **Compatible with all Apple platforms including iOS, iPadOS, watchOS, macOS, and tvOS.**

## How does the Rollbar Apple SDK differ from the Rollbar iOS SDK?

The Rollbar Apple SDK represents the latest major release of our SDK for Apple platforms, replacing the now-deprecated [Rollbar iOS SDK](https://docs.rollbar.com/docs/ios). This new SDK has been built from the ground up with a modern approach, expanded capabilities and features, and full support for all Apple platforms. We have renamed the SDK to Rollbar Apple to more accurately reflect the wide range of Apple platforms we now support.

While the [Rollbar iOS SDK](https://docs.rollbar.com/docs/ios) has been deprecated, we will continue to make it available for as long as necessary to facilitate a smooth transition to the Rollbar Apple SDK at a time that works best for our customers.

## How can I obtain the SDK?

The Rollbar Apple SDK is available as an open-source project on [GitHub](https://github.com/rollbar/rollbar-apple). We also provide releases on [GitHub](https://github.com/rollbar/rollbar-apple/releases/) and through Cocoapods and Carthage. The SDK can be integrated using any of the three prominent package distribution managers:

* **Swift Package Manager (SPM)**
* Cocoapods
* Carthage

> 👍 Use Swift Package Manager when possible!
>
> **Our recommended approach for integrating the Rollbar Apple SDK is through SPM.** This is the official package manager for Apple platforms and offers a straightforward integration process with the Xcode IDE. We believe that SPM provides the best balance of convenience and compatibility for our users.

## SDK Modules/Packages Overview

The **RollbarNotifier** package is the cornerstone of the Rollbar Apple SDK, encompassing a wide range of configurable options and capabilities. With it, you can effortlessly capture, package, and transmit exceptions, errors, log messages, telemetry, and custom data to your preconfigured Rollbar Project on rollbar.com.

The **RollbarAUL** package facilitates seamless integration of the **RollbarNotifier** with Apple Unified Logging (AUL), enabling the capture of AUL entries as corresponding Rollbar Telemetry log events.

The **RollbarDeploys** package is essential for tracking and managing your application releases and deployments. Use it, for instance, with your CI Release pipeline to report your deployments to your Rollbar Project, allowing Rollbar to correlate incoming payloads with specific deployment instances.

The **RollbarCommon** package contains shared types used by all the other packages and potentially helpful public utility classes.

> 📘
>
> The **Rollbar Apple SDK** can be obtained through various package managers, such as **Swift Package Manager (SPM)**, **Cocoapods**, and **Carthage**. Depending on the package manager, you can access the SDK either as a single package under the name `RollbarApple` or as separate packages, such as `RollbarCommon`, `RollbarNotifier`, `RollbarDeploys`, and more.
>
> It's worth noting that some package distribution systems may also have packages associated with the previous version of this SDK, which was called **Rollbar iOS** and published under the `Rollbar` package name, its latest version being `1.12.14`.
>
> To avoid confusion, all releases of the **Rollbar Apple SDK** are versioned starting from `2.0.0`, with `3.x.x` being the latest major release. Please keep this in mind when selecting the appropriate package for your project.

## Installation

### Using the [Swift Package Manager](https://github.com/apple/swift-package-manager)

**This is the recommended way of integrating the Rollbar Apple SDK.**

1. With your Xcode project open, go to **File -> Add Packages**.
2. Enter <https://github.com/rollbar/rollbar-apple> on the **Search or Enter Package URL** text field at the top right corner.
3. Wait for the Rollbar Apple SDK `rollbar-apple` package to appear.
4. Hit **Add Package**.
5. Xcode will automatically verify and fetch the Rollbar Apple SDK package.
6. Select `RollbarNotifier`.
7. Hit **Add Package**, again.
8. The Rollbar Apple SDK will be automatically added, and it'll be ready for usage in your application.

### Configuration and Testing

> 🚧
>
> Always initialize the **Rollbar Apple SDK** as soon as possible in your application lifecycle!

#### SwiftUI

In your application's `App` [conformer's initializer](https://developer.apple.com/documentation/swiftui/app/main\(\)):

```swift Swift
import RollbarNotifier

@main
struct MyApp: App {
	init() {
		let config = RollbarConfig.mutableConfig(withAccessToken: "[ACCESSTOKEN]")
		Rollbar.initWithConfiguration(config)
		Rollbar.infoMessage("Rollbar is up and running! Enjoy your remote error and log monitoring...")
  }
}
```

> 🚧
>
> Once you've confirmed that a test message was sent to your Rollbar project, remove the call to `Rollbar.infoMessage`.

#### Application Delegate

If your preferred method of initialization is through a `UIApplicationDelegate`:

```swift Swift
import RollbarNotifier

...

@main
struct MyApp: App {
  @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
  ...
}

class AppDelegate: NSObject, UIApplicationDelegate {
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil
  ) -> Bool {
		let config = RollbarConfig.mutableConfig(withAccessToken: "[ACCESSTOKEN]")
		Rollbar.initWithConfiguration(config)
		Rollbar.infoMessage("Rollbar is up and running! Enjoy your remote error and log monitoring...")
    ...
    return true
  }
}
```
```objectivec Objective-C
#import "AppDelegate.h"

@import RollbarNotifier;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    RollbarMutableConfig *config = [RollbarConfig mutableConfigWithAccessToken:@"[ACCESSTOKEN]"];
		[Rollbar initWithConfiguration:config];
    [Rollbar infoMessage:@"Rollbar is up and running! Enjoy your remote error and log monitoring..."];
		...
    return YES;
}

@end
```

> 🚧
>
> Once you've confirmed that a test message was sent to your **Rollbar project**, remove the call to `Rollbar.infoMessage`.

## Other Installation Methods

### Straight from our [GitHub repository](https://github.com/rollbar/rollbar-apple)

Here are a few options:

* Download or clone the SDK source code directly from the [GitHub repository](https://github.com/rollbar/rollbar-apple).
* Download a source code snapshot of a specific release from the [Releases page](https://github.com/rollbar/rollbar-apple/releases).
* Integrate the [GitHub repository](https://github.com/rollbar/rollbar-apple) as a `git submodule` of your project's git repository.

### Using [Carthage](https://github.com/Carthage/Carthage)

In your `Cartfile`, specify:

```shell Cartfile
github "rollbar/rollbar-apple" ~> 3.3.3
```

### Using [Cocoapods](https://cocoapods.org/)

```ruby Podfile
platform :ios, '14.0'
use_frameworks!

target 'YourApp' do
  pod 'RollbarNotifier','~> 3.3.3'
end
```

You do not have to worry about explicitly including other internal dependencies of the modules, like the`RollbarCommon` pod. The SDK module podspecs already specify these as needed.