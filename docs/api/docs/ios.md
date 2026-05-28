<!-- source: https://docs.rollbar.com/docs/ios.md -->

# Legacy iOS SDK (Deprecated)

Objective-C library for crash reporting and logging for iOS and macOS

> ❗️ Roadmap Note
>
> We are recommending all our current users of the Rollbar-iOS to start making plans for upgrading from this SDK by moving to its new reincarnation that is our new [Rollbar-Apple SDK](https://docs.rollbar.com/docs/apple). All new feature development will be happening only within the new SDK while this SDK will be retiring soon.\
> All the new users that are looking into using Rollbar on any of the Apple platforms should start by using the new Rollbar-Apple SDK.

## GitHub repo

The SDK source code is available [here](https://github.com/rollbar/rollbar-ios).

## Installation

### With [Cocoapods](http://cocoapods.org/)

In your Podfile:

```
pod "Rollbar", "~> n.n.n"

where n.n.n is the desired pod version of the SDK to use.
```

Make sure to declare your platform as `ios` at the top of your Podfile. E.g:

```
platform :ios, '7.0'
```

Be sure to remember to `pod install` after changing your Podfile!

### With [Carthage](https://github.com/Carthage/Carthage)

[Carthage](https://github.com/Carthage/Carthage) is a decentralized dependency manager that builds your dependencies and provides you with binary frameworks. To integrate Rollbar into your Xcode project using Carthage, specify it in your Cartfile:

```
github "rollbar/rollbar-ios" ~> n.n.n

where n.n.n is the desired pod version of the SDK to use.
```

Note that you will also have to follow all of the necessary steps [here](https://github.com/Carthage/Carthage#quick-start).

### By linking to [pre-built release artifacts](https://github.com/rollbar/rollbar-ios/releases)

We’ve rebuilt and restructured our [GitHub release distribution](https://github.com/rollbar/rollbar-ios/releases) build scripts. You can pick the component that suits your needs the best. The release distribution file Rollbar.zip includes the following components amongst others:

* The SDK as a static library targeting iOS devices
* The SDK as a static library targeting iOS simulators
* The SDK as a static universal library targeting both iOS devices and simulators
* The SDK as a framework/kit targeting iOS devices
* The SDK as a framework/kit targeting iOS simulators
* The SDK as a framework/kit targeting both iOS devices and simulators
* The SDK as a static library targeting macOS hosts.
* The SDK as a framework/kit targeting macOS hosts

### Manual

1. Download the Rollbar framework.\
   Note that depending on the version of Xcode you use to build your app, you might have to download a different version of the framework if you have bitcode enabled. This is because of the way handles bitcode serialization. The latest release on the [releases page](https://github.com/rollbar/rollbar-ios/releases) should have a zip file for the most recent versions of Xcode.

2. Extract the Rollbar directory in the zip file to your Xcode project directory.

3. In Xcode, select *File* -> *Add Files to "\[your project name]"* and choose the Rollbar directory from step 2.

   Note: if step three doesn't work you can also extract the Rollbar directory anywhere, and drag the `.framework` files into XCode, allowing XCode to correctly configure the Frameworks.

4. Add the libc++ library to your link binary with libraries build phase

5. Ensure that `-ObjC` is in your "Other Linker Flags" setting. Note that the `-all_load` flag is not recommended but would also work for this purpose if you already have that set.

## Setup

In your Application delegate implementation file, add one (appropriate to your use case) of the following SDK import statements:

```objectivec
@import Rollbar;
```

```swift
import Rollbar
```

```objectivec
// This kind of SDK import is only applicable when using
// older releases of Rollbar-iOS SDK (older than v1.11.0):  
#import <Rollbar/Rollbar.h>
```

Then add the following to `application:didFinishLaunchingWithOptions:`:

```objectivec
[Rollbar initWithAccessToken:@"POST_CLIENT_ITEM_ACCESS_TOKEN"];
```

Replace `POST_CLIENT_ITEM_ACCESS_TOKEN` with a client scope access token from your project in Rollbar.

That's all you need to do to report crashes to Rollbar. To get symbolicated stack traces, follow the instructions in the "Symbolication" section below.

### Crash reporting

Crashes will be saved to disk when they occur, then reported to Rollbar the next time the app is launched.

Rollbar uses [KSCrash](https://github.com/kstenerud/KSCrash) to capture uncaught exceptions and fatal signals. Note that only one crash reporter can be active per app. If you initialize multiple crash reporters (i.e. Rollbar alongside other services), only the last one initialized will be active.

### Swift

Importing with Swift requires the additional step of adding the following lines to your Bridging-Header file:

```objectivec
@import SystemConfiguration;
@import Rollbar;
```

OR when using Rollbar-iOS SDK older than v1.11.0:

```objectivec
#import <SystemConfiguration/SystemConfiguration.h>
#import <Rollbar/Rollbar.h>
```

If you have no Bridging Header file, the easiest way to correctly configure it is to add an empty objective-c (`dummy.m` for instance) file. When you do so, XCode will prompt you to create a bridging header file, and will configure your build environment to automatically include those headers in all your Swift files. After creating the Bridging-Header file, you can delete the objective-c file.

Note: You do *not* need to import Rollbar if you're using Swift.

The initialization using Swift syntax:

```swift
func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
    let config: RollbarConfiguration = RollbarConfiguration()
    config.environment = "production"

    Rollbar.initWithAccessToken("POST_CLIENT_ITEM_ACCESS_TOKEN", configuration: config)

    return true
}
```

See the [these commits](https://github.com/Crisfole/SwiftWeather/compare/18580ce...e7d80e1) for a demo of how to integrate Rollbar into an existing Swift project.

### Bitcode

Bitcode is an intermediate representation of a compiled iOS/watchOS program.  Apps you upload to iTunes Connect that contain bitcode will be compiled and linked on the App Store. Including Bitcode will allow Apple to re-optimize your app binary in the future without the need to submit a new version of your app to the store.

Apple will generate new dSYMs for Bitcode enabled builds that have been released to the iTunes store or submitted to TestFlight. You'll need to download the new dSYMs from Xcode and then upload them to Rollbar so that crashes can be symbolicated.

dSYMs for Bitcode enabled apps can be downloaded from Xcode's Organizer. Select the desired Archive of your app and click the "Download dSYMs..." button. If you're unable to download your dSYM from Xcode's Organizer, you'll have to get it from iTunes Connect.

In iTunes Connect, select "My Apps" on the page header and "Activity" on the top navigation tab bar. Select the build you want to download the dSYMs for and click on "Download dSYM" under "Includes Symbols".

Finally, upload the dSYM to Rollbar via your project's dSYM settings page.

### Logging

***

**Log a message with the specified Rollbar level.**

```objectivec
+ (void)log:(RollbarLevel)level message:(NSString*)message;
```

*Example*

```objectivec
[Rollbar log:RollbarDebug message:@"Message"];
```

***

**Log a message and exception with the specified Rollbar level.**

```objectivec
+ (void)log:(RollbarLevel)level message:(NSString*)message exception:(NSException*)exception;
```

*Example*

```objectivec
@try {
	// Code that might generate error
} @catch (NSException *e) {
	[Rollbar log:RollbarDebug message:e.reason exception:nil];
    // Or
	[Rollbar log:RollbarDebug message:nil exception:e];
}
```

***

**Log a message, exception, and extra data with the specified Rollbar level.**

```objectivec
+ (void)log:(RollbarLevel)level message:(NSString*)message exception:(NSException*)exception data:(NSDictionary*)data;
```

*Example*

```objectivec
[Rollbar log:RollbarDebug message:@"Message" exception:nil data:@{@"extra_data": @"content"}];
```

***

**Log a message, exception, extra data, and context with the specified Rollbar level.**

```objectivec
+ (void)log:(RollbarLevel)level message:(NSString*)message exception:(NSException*)exception data:(NSDictionary*)data context:(NSString*)context;
```

*Example*

```objectivec
[Rollbar log:RollbarDebug message:@"Message" exception:nil data:@{@"extra_data": @"content"} context:@"Context"];
```

***

**Log a debug level message.**

```objectivec
+ (void)debug:(NSString*)message;
```

*Example*

```objectivec
[Rollbar debug:@"Message"];
```

***

**Log a debug level message with exception.**

```objectivec
+ (void)debug:(NSString*)message exception:(NSException*)exception;
```

*Example*

```objectivec
@try {
	// Code that might generate error
} @catch (NSException *e) {
	[Rollbar debug:e.reason exception:nil];
    // Or
	[Rollbar debug:nil exception:e];
}
```

***

**Log a debug level message with exception and extra data.**

```objectivec
+ (void)debug:(NSString*)message exception:(NSException*)exception data:(NSDictionary*)data;
```

*Example*

```objectivec
[Rollbar debug:@"Message" exception:nil data:@{@"extra_data": @"content"}];
```

***

**Log a debug level message with exception, extra data, and context.**

```objectivec
+ (void)debug:(NSString*)message exception:(NSException*)exception data:(NSDictionary*)data context:(NSString*)context;
```

*Example*

```objectivec
[Rollbar debug:@"Message" exception:nil data:@{@"extra_data": @"content"} context:@"Context"];
```

***

**Log an info level message.**

```objectivec
+ (void)info:(NSString*)message;
```

*Example*

```objectivec
[Rollbar info:@"Message"];
```

***

**Log an info level message with exception.**

```objectivec
+ (void)info:(NSString*)message exception:(NSException*)exception;
```

*Example*

```objectivec
[Rollbar info:@"Message" exception:nil];
```

***

**Log an info level message with exception and extra data.**

```objectivec
+ (void)info:(NSString*)message exception:(NSException*)exception data:(NSDictionary*)data;
```

*Example*

```objectivec
[Rollbar info:@"Message" exception:nil data:@{@"extra_data": @"content"}];
```

***

**Log an info level message with exception, extra data, and context.**

```objectivec
+ (void)info:(NSString*)message exception:(NSException*)exception data:(NSDictionary*)data context:(NSString*)context;
```

*Example*

```objectivec
[Rollbar info:@"Message" exception:nil data:@{@"extra_data": @"content"} context:@"Context"];
```

***

**Log a warning level message.**

```objectivec
+ (void)warning:(NSString*)message;
```

*Example*

```objectivec
[Rollbar warning:@"Message"];
```

***

**Log a warning level message with exception.**

```objectivec
+ (void)warning:(NSString*)message exception:(NSException*)exception;
```

*Example*

```objectivec
[Rollbar warning:@"Message" exception:nil];
```

***

**Log a warning level message with exception and extra data.**

```objectivec
+ (void)warning:(NSString*)message exception:(NSException*)exception data:(NSDictionary*)data;
```

*Example*

```objectivec
[Rollbar warning:@"Message" exception:nil data:@{@"extra_data": @"content"}];
```

***

**Log a warning level message with exception, extra data, and context.**

```objectivec
+ (void)warning:(NSString*)message exception:(NSException*)exception data:(NSDictionary*)data context:(NSString*)context;
```

*Example*

```objectivec
[Rollbar warning:@"Message" exception:nil data:@{@"extra_data": @"content"} context:@"Context"];
```

***

**Log a error level message.**

```objectivec
+ (void)error:(NSString*)message;
```

*Example*

```objectivec
[Rollbar error:@"Message"];
```

***

**Log a error level message with exception.**

```objectivec
+ (void)error:(NSString*)message exception:(NSException*)exception;
```

*Example*

```objectivec
[Rollbar error:@"Message" exception:nil];
```

***

**Log a error level message with exception and extra data.**

```objectivec
+ (void)error:(NSString*)message exception:(NSException*)exception data:(NSDictionary*)data;
```

*Example*

```objectivec
[Rollbar error:@"Message" exception:nil data:@{@"extra_data": @"content"}];
```

***

**Log a error level message with exception, extra data, and context.**

```objectivec
+ (void)error:(NSString*)message exception:(NSException*)exception data:(NSDictionary*)data context:(NSString*)context;
```

*Example*

```objectivec
[Rollbar error:@"Message" exception:nil data:@{@"extra_data": @"content"} context:@"Context"];
```

***

**Log a critical level message.**

```objectivec
+ (void)critical:(NSString*)message;
```

*Example*

```objectivec
[Rollbar critical:@"Message"];
```

***

**Log a critical level message with exception.**

```objectivec
+ (void)critical:(NSString*)message exception:(NSException*)exception;
```

*Example*

```objectivec
[Rollbar critical:@"Message" exception:nil];
```

***

**Log a critical level message with exception and extra data.**

```objectivec
+ (void)critical:(NSString*)message exception:(NSException*)exception data:(NSDictionary*)data;
```

*Example*

```objectivec
[Rollbar critical:@"Message" exception:nil data:@{@"extra_data": @"content"}];
```

***

**Log a critical level message with exception, extra data, and context.**

```objectivec
+ (void)critical:(NSString*)message exception:(NSException*)exception data:(NSDictionary*)data context:(NSString*)context;
```

*Example*

```objectivec
[Rollbar critical:@"Message" exception:nil data:@{@"extra_data": @"content"} context:@"Context"];
```

*Note: If message and exception both exist, it'll be combined into a single message with exception.callStackSymbols. If only exception exists, exception.callStackSymbols will be parsed.*

### Migration from older versions for rollbar-ios

Older versions of this library provided logging via methods such as:

```objectivec
// Logs at level "info".
// Variants at "debug", "info", "warning", "error", and "critical" all exist.
[Rollbar infoWithMessage:@"Test message"];

// Log a critical, with some additional key-value data
[Rollbar criticalWithMessage:@"Unexpected data from server" data:@{@"endpoint": endpoint,
                                                                    @"result": result}];

// Or log at a named level
[Rollbar logWithLevel:@"warning" message:@"Simple warning log message"];
```

This style is still supported but deprecated. It will be removed in a future release. We recommend\
upgrade your usage to the style described in the `Logging` section.

## Configuration

You can pass an optional `RollbarConfiguration` object to `initWithAccessToken:`:

```objectivec
RollbarConfiguration *config = [RollbarConfiguration configuration];
config.crashLevel = @"critical";
config.environment = @"production";

[Rollbar initWithAccessToken:@"POST_CLIENT_ITEM_ACCESS_TOKEN" configuration:config];
```

You can also configure the notifier after initialization by getting the active configuration object and modifying it:

```objectivec
RollbarConfiguration *config = [Rollbar currentConfiguration];
[config setCheckIgnore:^BOOL(NSDictionary *payload) {
	// Code to determine whether or not to ignore this payload
}];
[config setPersonId:@"123" username:@"username" email:@"test@test.com"];
```

### Developer Configuration settings

**transmit**\
Should the SDK actually perform HTTP requests to Rollbar API. This is useful if you are trying to run Rollbar in dry run mode for development or tests.\
If this is false then we do all of the report processing except make the post request at the end of the pipeline.\
Default: true

**logPayload**\
Log the payload body to the configured logPayloadFile (default: "rollbar.payloads").\
If this is true then we output the payload to standard out or a configured logger right before transmitting.\
Default: false

### Configuration reference

**CaptureIp specifies the level of IP information to gather about the client along with items.**

```objectivec
typedef NS_ENUM(NSUInteger, CaptureIpType) {
    CaptureIpFull,
    CaptureIpAnonymize,
    CaptureIpNone
};

- (void)setCaptureIpType:(CaptureIpType)captureIp;
```

*Example*

```objectivec
[Rollbar.currentConfiguration setCaptureIpType:CaptureIpAnonymize];
```

`CaptureIpFull` is the default behaviour which attempts to capture the IP address on the backend\
based on the IP address of the client used to POST the item. `CaptureIpAnonymize` will attempt to\
capture the IP address and semi-anonymize it by masking it the least significant bits.\
`CaptureIpNone` will turn off attempts to capture the IP address.

**Sets the maximum number of telemetry data entry to keep. Default is 10.**

```objectivec
- (void)setMaximumTelemetryData:(NSInteger)maximumTelemetryData;
```

*Example*

```objectivec
[Rollbar.currentConfiguration setMaximumTelemetryData:5];
```

***

**Sets the ID, username, and email of the current user.**

```objectivec
- (void)setPersonId:(NSString*)personId username:(NSString*)username email:(NSString*)email;
```

*Example*

```objectivec
[Rollbar.currentConfiguration setPersonId:@"user-id" username:@"user_name" email:@"user@email.com"];
```

***

**Sets the server information, including host, root, code branch, and code version.**

```objectivec
- (void)setServerHost:(NSString *)host root:(NSString*)root branch:(NSString*)branch codeVersion:(NSString*)codeVersion;
```

*Example*

```objectivec
[Rollbar.currentConfiguration setServerHost:@"host" root:@"root" branch:@"code-branch" codeVersion@"0.1"];
```

***

**Sets a payload modification function block. This will be called with the intended payload as the parameter. It can be used to modify the payload before sending it to the Rollbar server.**

```objectivec
- (void)setPayloadModificationBlock:(void (^)(NSMutableDictionary*))payloadModificationBlock;
```

*Example*

```objectivec
[Rollbar.currentConfiguration setPayloadModification:^(NSMutableDictionary *payload) {
	[payload setValue:@"new-value" forKeyPath:@"body.message.body"];
}];
```

***

**Sets a check ignore function block. This will be called with the intended payload as the parameter. It is used to determine whether or not it should send the payload to server. Return true to ignore (will not send) the payload and false to send.**

```objectivec
- (void)setCheckIgnoreBlock:(BOOL (^)(NSDictionary*))checkIgnoreBlock;
```

*Example*

```objectivec
[Rollbar.currentConfiguration setCheckIgnore:^BOOL(NSDictionary *payload) {
	// Return true to ignore payload, false to send.
}];
```

***

**Add a field with sensitive data to scrub from the payload. Field is in the format of a key path in the NSDictionary. (e.g. "body.message.body").**

```objectivec
- (void)addScrubField:(NSString *)field;
```

*Example*

```objectivec
[Rollbar.currentConfiguration addScrubField:@"body.user.phone"];
```

***

**Remove a field from the scrub list. Field is in the format of a key path in the NSDictionary. (e.g. "body.message.body").**

```objectivec
- (void)removeScrubField:(NSString *)field;
```

*Example*

```objectivec
[Rollbar.currentConfiguration removeScrubField:@"body.user.phone"];
```

***

**Set a request ID. This is used for linking client notifications with server calls.**

```objectivec
- (void)setRequestId:(NSString*)requestId;
```

*Example*

```objectivec
[Rollbar.currentConfiguration setRequestId:@"reques-8293489324723"];
```

***

**Determines if Rollbar should capture NSLog automatically as telemetry data. Number of entries to capture depends on "setMaximumTelemetryData".**

```objectivec
- (void)setCaptureLogAsTelemetryData:(BOOL)captureLog;
```

*Example*

```objectivec
[Rollbar.currentConfiguration setCaptureLogAsTelemetryData:true];
```

***

**Determines if Rollbar should capture connectivity change event automatically as telemetry data. Connectivity change event includes disconnecting from the Internet and reconnected to the Internet from an offline state. Number of entries to capture depends on "setMaximumTelemetryData".**

```objectivec
- (void)setCaptureConnectivityAsTelemetryData:(BOOL)captureConnectivity;
```

*Example*

```objectivec
[Rollbar.currentConfiguration setCaptureConnectivityAsTelemetryData:true];
```

## Telemetry

The following methods exist on the `Rollbar` class for working with telemetry data:

**Record view telemetry event with element.**

```objectivec
+ (void)recordViewEventForLevel:(RollbarLevel)level element:(NSString *)element;
```

*Example*

```objectivec
[Rollbar recordViewEventForLevel:RollbarDebug element:@"HomeView"];
```

***

**Record view telemetry event with element and extra data.**

```objectivec
+ (void)recordViewEventForLevel:(RollbarLevel)level element:(NSString *)element extraData:(NSDictionary *)extraData;
```

*Example*

```objectivec
[Rollbar recordViewEventForLevel:RollbarDebug element:@"HomeView" extraData:@{@"key":@"content"}];
```

***

**Record network telemetry event with method, url, and status code.**

```objectivec
+ (void)recordNetworkEventForLevel:(RollbarLevel)level method:(NSString *)method url:(NSString *)url statusCode:(NSString *)statusCode;
```

*Example*

```objectivec
[Rollbar recordNetworkEventForLevel:RollbarDebug method:@"GET" url:@"http://rollbar.com/test/api" statusCode:@"404"];
```

***

**Record network telemetry event with method, url, status code and extra data.**

```objectivec
+ (void)recordNetworkEventForLevel:(RollbarLevel)level method:(NSString *)method url:(NSString *)url statusCode:(NSString *)statusCode extraData:(NSDictionary *)extraData;
```

*Example*

```objectivec
[Rollbar recordNetworkEventForLevel:RollbarDebug method:@"GET" url:@"http://rollbar.com/test/api" statusCode:@"404" extraData:@{@"key":@"content"}];
```

***

**Record connectivity telemetry event with status.**

```objectivec
+ (void)recordConnectivityEventForLevel:(RollbarLevel)level status:(NSString *)status;
```

*Example*

```objectivec
[Rollbar recordConnectivityEventForLevel:RollbarDebug status:@"Disconnected"];
```

***

**Record connectivity telemetry event with status and extra data.**

```objectivec
+ (void)recordConnectivityEventForLevel:(RollbarLevel)level status:(NSString *)status extraData:(NSDictionary *)extraData;
```

*Example*

```objectivec
[Rollbar recordConnectivityEventForLevel:RollbarDebug status:@"Disconnected" extraData:@{@"key":@"content"}];
```

***

**Record error telemetry event with message.**

```objectivec
+ (void)recordErrorEventForLevel:(RollbarLevel)level message:(NSString *)message;
```

*Example*

```objectivec
[Rollbar recordErrorEventForLevel:RollbarError message:@"Message"];
```

***

**Record error telemetry event with exception.**

```objectivec
+ (void)recordErrorEventForLevel:(RollbarLevel)level exception:(NSException *)exception;
```

*Example*

```objectivec
@try {
	// Code with error
} @catch (NSException *e) {
	[Rollbar recordErrorEventForLevel:RollbarError exception:e];
}
```

***

**Record error telemetry event with message and extra data.**

```objectivec
+ (void)recordErrorEventForLevel:(RollbarLevel)level message:(NSString *)message extraData:(NSDictionary *)extraData;
```

*Example*

```objectivec
[Rollbar recordErrorEventForLevel:RollbarError message:@"Message" extraData:@{@"key":@"content"}];
```

***

**Record navigation telemetry event with from (origin) and to (destination).**

```objectivec
+ (void)recordNavigationEventForLevel:(RollbarLevel)level from:(NSString *)from to:(NSString *)to;
```

*Example*

```objectivec
[Rollbar recordNavigationEventForLevel:RollbarDebug from:@"HomeView" to:@"SettingView"];
```

***

**Record navigation telemetry event with from (origin), to (destination), and extra data.**

```objectivec
+ (void)recordNavigationEventForLevel:(RollbarLevel)level from:(NSString *)from to:(NSString *)to extraData:(NSDictionary *)extraData;
```

*Example*

```objectivec
[Rollbar recordNavigationEventForLevel:RollbarDebug from:@"HomeView" to:@"SettingView" extraData:@{@"key":@"content"}];
```

***

**Record manual telemetry event with data. Manual telemetry event is for user defined telemetry events.**

```objectivec
+ (void)recordManualEventForLevel:(RollbarLevel)level withData:(NSDictionary *)extraData;
```

*Example*

```objectivec
[Rollbar recordManualEventForLevel:RollbarDebug withData:@{@"key":@"content"}];
```

***

The `RollbarTelemetry` class also exists with an exposed shared instance for working with telemetry data at a finer level of detail.

***

**Set whether or not it should capture NSLog entries automatically.**

```objectivec
- (void)setCaptureLog:(BOOL)shouldCapture;
```

*Example*

```objectivec
[[RollbarTelemetry sharedInstance] setCaptureLog:true];
```

***

**Set the number of telemetry data entries to keep.**

```objectivec
- (void)setDataLimit:(NSInteger)dataLimit;
```

*Example*

```objectivec
[[RollbarTelemetry sharedInstance] setDataLimit:15];
```

***

**Record a telemetry event with the specified Rollbar level and telemetry data type.**

```objectivec
- (void)recordEventForLevel:(RollbarLevel)level type:(RollbarTelemetryType)type data:(NSDictionary *)data;
```

*Example*

```objectivec
[[RollbarTelemetry sharedInstance] recordEventForLevel:RollbarInfo type:RollbarTelemetry data:@{@"key": @"content"}];
```

***

**Record a view telemetry event with the specified Rollbar level, element, and data.**

```objectivec
- (void)recordViewEventForLevel:(RollbarLevel)level element:(NSString *)element extraData:(NSDictionary *)extraData;
```

*Example*

```objectivec
[[RollbarTelemetry sharedInstance] recordViewEventForLevel:RollbarInfo element:@"HomeView" extraData:@{@"key": @"content"}];
```

***

**Record a network telemetry event with the specified Rollbar level, method, url, status code, and data.**

```objectivec
- (void)recordNetworkEventForLevel:(RollbarLevel)level method:(NSString *)method url:(NSString *)url statusCode:(NSString *)statusCode extraData:(NSDictionary *)extraData;
```

*Example*

```objectivec
[[RollbarTelemetry sharedInstance] recordNetworkEventForLevel:RollbarInfo method:@"POST" url:@"http://rollbar.com/test/api" statusCode:@"404" extraData:nil];
```

***

**Record a connectivity telemetry event with the specified Rollbar level, status, and data.**

```objectivec
- (void)recordConnectivityEventForLevel:(RollbarLevel)level status:(NSString *)status extraData:(NSDictionary *)extraData;
```

*Example*

```objectivec
[[RollbarTelemetry sharedInstance] recordConnectivityEventForLevel:RollbarInfo status:@"Connected" extraData:nil];
```

***

**Record a error telemetry event with the specified Rollbar level, message, and data.**

```objectivec
- (void)recordErrorEventForLevel:(RollbarLevel)level message:(NSString *)message extraData:(NSDictionary *)extraData;
```

*Example*

```objectivec
[[RollbarTelemetry sharedInstance] recordErrorEventForLevel:RollbarError message:@"Error message" extraData:nil];
```

***

**Record a navigation telemetry event with the specified Rollbar level, from (origin), to (destination) and data.**

```objectivec
- (void)recordNavigationEventForLevel:(RollbarLevel)level from:(NSString *)from to:(NSString *)to extraData:(NSDictionary *)extraData;
```

*Example*

```objectivec
[[RollbarTelemetry sharedInstance] recordNavigationEventForLevel:RollbarInfo from:@"SettingView" to:@"HomeView" extraData:nil];
```

***

**Record a manual telemetry event with the specified Rollbar level and data**

```objectivec
- (void)recordManualEventForLevel:(RollbarLevel)level withData:(NSDictionary *)extraData;
```

*Example*

```objectivec
[[RollbarTelemetry sharedInstance] recordManualEventForLevel:RollbarInfo withData:@{@"custom_data":@"content"}];
```

***

**Record a log telemetry event with the specified Rollbar level and data.**

```objectivec
- (void)recordLogEventForLevel:(RollbarLevel)level message:(NSString *)message extraData:(NSDictionary *)extraData;
```

*Example*

```objectivec
[[RollbarTelemetry sharedInstance] recordLogEventForLevel:RollbarInfo message:@"Log message"extraData:nil];
```

***

**Get all telemetry data currently recorded. These are the data that will be sent along with each notification.**

```objectivec
- (NSArray *)getAllData;
```

*Example*

```objectivec
NSArray *allTelemetryData = [[RollbarTelemetry sharedInstance] getAllData];

// Print all telemetry data
for (id item in allTelemetryData) {
	NSLog(@"%@", item);
}
```

***

**Clear all the telemetry data recorded.**

```objectivec
- (void)clearAllData;
```

*Example*

```objectivec
[[RollbarTelemetry sharedInstance] clearAllData];
```

## Symbolication using .dSYM files

To automatically send .dSYM files to Rollbar whenever your app is built in release mode, add a new build phase to your target in Xcode:

1. Click on your project and then select "Build Phases"

2. In the top menu bar, click "Editor" and then "Add Build Phase", then "Add Run Script Build Phase"

3. Change the "Shell" to `/usr/bin/python`

4. Paste the contents of the [upload\_dsym.py](https://raw.githubusercontent.com/rollbar/rollbar-ios/master/upload_dsym.py) script into the box, using "Paste and Preserve Formatting" (Edit -> Paste and Preserve Formatting)

Note: make sure you replace `POST_SERVER_ITEM_ACCESS_TOKEN` with a server scope access token from your project in Rollbar.

### Symbol Map File Retention

The data retention process for iOS dSYM symbol files is that files which are unused for 90 days, as determined by not having any occurrences on their code\_version, will be automatically deleted.

## Enabling on-device symbolication (From KSCrash)

On-device symbolication requires basic symbols to be present in the final build. To enable this, go to your app's build settings and set Strip Style to Debugging Symbols. Doing so increases your final binary size by about 5%, but you get on-device symbolication.

## Developing and building the library

You can include the Rollbar project as a sub-project in your app, or link the Rollbar source files directly into your app.\
To develop the library by linking the source files directly in your app:

1. Fork this repo
2. git clone your fork
3. In Xcode, remove the Rollbar files from your project if they are currently there
4. Pull the KSCrash submodule:

```
git submodule init
git submodule update
```

5. In Xcode, add the Rollbar/ files:
   1. Right-click your project
   2. Click "Add Files to <project name>"
   3. Navigate to your rollbar-ios clone and select the Rollbar folder
   4. Click "Add"

You should now be able to build your app with your local clone of rollbar-ios.

To build the Rollbar framework distribution files, open the Rollbar project and make sure the Distribution scheme is active by selecting *Editor* -> *Scheme* -> *Distribution*. Building the project with this scheme selected will create a `Dist/` directory containing the Rollbar framework with the proper fat binary.

## Help / Support

If you run into any issues, please email us at `support@rollbar.com`.

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/rollbar-ios/issues/new).