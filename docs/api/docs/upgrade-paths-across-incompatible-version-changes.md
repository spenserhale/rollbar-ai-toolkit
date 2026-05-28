<!-- source: https://docs.rollbar.com/docs/upgrade-paths-across-incompatible-version-changes.md -->

# Upgrade paths across incompatible version changes

How-to recipes when upgrading the SDK from one major version to another

# Upgrading to 4.x.x from v3.x.x versions

The only area of the SDK APIs that changed between v3 and v4 is the one related to the file-based configuration of Rollbar infrastructure.

All the public types related to configuring the SDK based on either app.config or web.config files were moved to their own dedicated module/package `Rollbar.App.Config`. The types namespace changed from `Rollbar.NetFramework` to `Rollbar.App.Config`.

All the public types related to configuring the SDK based on appsettings.json file were moved to their own dedicated module/package `Rollbar.AppSettings.Json`. The types namespace changed from `Rollbar.NetCore` to `Rollbar.AppSettings.Json`.

Both new modules are optional alternatives. When either is needed, just reference a corresponding module/package from the application already hosting the Rollbar core module. Assuming you are already using the application config file in your application for other reasons than just configuring Rollbar, all the dependencies needed for accessing the file should be already established by your application codebase.

# Upgrading to v3.x.x from v2.x.x versions

Depending on how you were integrating the Notifier into your application prior to v3, you might have to perform some or all of the following changes when moving to v3 of our SDK:

* in addition to Rollbar assembly reference, add references to relevant .NET Specific Technology/Application Integration Modules (these modules are described in the next sections);
* if you did have to add one or more references to the .NET Specific Technology/Application Integration Modules, you will have to update namespaces of the types that were moved from Rollbar to these new modules;
* if you have any calls to `IAsyncLogger`'s methods where you are waiting on the returned Task object to complete, you will now have to wrap your data (originally passed into the logging method) into
  an `ObjectPackage` instance while setting its `MustApplySynchronously` flag and pass the wrapper instead of the original data into the same logging method.

All of these changes are very straightforward and the compiler will help you and guide you along the way as needed.
Most of it is just a "find-and-replace" with a few "compile-and-correct-the-build-issues".

With `IAsyncLogger` gone, there is only `ILogger`.
So, if you had some code relying on the `IAsyncLogger` where you used to wait on a Task like:

```csharp
RollbarLocator.RollbarInstance
    .Log(ErrorLevel.Error, "test message")
    .Wait();
```

now, the easiest fix is to rework it into:

```csharp
RollbarLocator.RollbarInstance
    .Log(ErrorLevel.Error, new ObjectPackage("test message", true));
```

to achieve the similar behavior of the logger.

# Upgrading to v2.x.x from v1.x.x versions

All Rollbar notifier instances of `IRollbar` (that used to be expanding `ILogger` in v1.x.x versions) now implement `IAsyncLogger` instead of `ILogger`. As a result of this change, the rollbar instances lost the support of fluent API, hence, they can not be cascaded like so:

```csharp
RollbarLocator.RollbarInstance.Log(ErrorLevel.Error, "error message")
                              .Log(ErrorLevel.Info, "info message")
                              .Log(ErrorLevel.Debug, "debug message");
```

and now have to be reworked as:

```csharp
RollbarLocator.RollbarInstance.Log(ErrorLevel.Error, "error message");
RollbarLocator.RollbarInstance.Log(ErrorLevel.Info, "info message");
RollbarLocator.RollbarInstance.Log(ErrorLevel.Debug, "debug message");
```

while instances of the blocking Rollbar logger are still capable of supporting the fluent/cascading calls.

We think that the convenience of the fluent APIs is less important than an ability to support completely "fire-and-forget" logging calls that could be waited upon if needed.

One more significant change in v2.x.x SDK API that should be fully backward compatible with the v1.x.x SDK API (hence, should not require any client code changes) but is important enough to be mentioned here:

You will notice that the `ILogger` interface was significantly simplified by getting rid of a large number of logging methods' overloads based on types of the data-to-log (an `Exception` vs a `String` vs an `Object` vs a `Data` DTO, etc). Now, we only have the overloads that take in an `Object` (a good enough reason for the backward compatibility of the latest API). The newly introduced `IAsyncLogger` interface defines the same set of methods as `ILogger` with the only difference between the equivalent method signatures - method return type: `IAsyncLogger`'s methods return `Task` while `ILogger`'s methods return `ILogger`.

# Upgrading to v1.0.0+ from earlier versions

In order to upgrade to v1.0.0+ from an earlier version, you should change your config from the old version

```csharp
Rollbar.Init(new RollbarConfig("POST_SERVER_ITEM_ACCESS_TOKEN"));
```

to

```csharp
const string postServerItemAccessToken = "POST_SERVER_ITEM_ACCESS_TOKEN";
RollbarLocator.RollbarInstance
	.Configure(new RollbarConfig(postServerItemAccessToken) { Environment = "proxyTest"} );
```

Additionally, anywhere in your code that you were sending error reports via

```csharp
Rollbar.Report(exception);
```

or

```csharp
Rollbar.Report(message);
```

will need to be replaced with either something like

```csharp
RollbarLocator.RollbarInstance
    .Error(new Exception("got it", exception));
```

or

```csharp
RollbarLocator.RollbarInstance
    .Info("Basic info log example.")
```