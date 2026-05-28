<!-- source: https://docs.rollbar.com/docs/overview.md -->

# SDK Overview

Components that constitute the SDK

Starting with v3 we split the Rollbar.NET Notifier SDK into more components or modules.

These components can be logically grouped into the following categories:

* Core Modules
* .NET Specific Technology/Application Integration Modules
* Third-party Logging Libraries/Frameworks' Integration Plug-ins

Core Modules implement the very basic stand-alone core functionality of the Rollbar.NET Notifier.
They have the least possible amount of dependencies and only rely on functionality provided by most basic .NET implementation types that are common across all of the supported .NET Standard implementations. So, if you only care about using core SDK concepts like:
`IRollbar`, `ILogger`, `IRollbarConfig`, `RollbarFactory`, `RollbarLocator`, `IRollbarPackage`, `Rollbar.DTOs`, `RollbarQueueController`, `ITelemetryCollector`, `ITelemetryConfig`, some basic Rollbar utility classes and you are planning to implement all the integration of these classes into your application on your own - use the Core Modules only.

If you care about functionality that we implemented to simplify integration of the Notifier core functionality into a specific .NET application technology/framework, like .NET Framework ASP.NET or .NET Core ASP.NET etc. - you may want to pull in some of the .NET Specific Technology/Application Integration Modules.

If you want to have the Notifier integrated as a simple plug-in expected by a commonly used third-party logging library/framework, like Serilog, log4net, etc. (because you are already relying on one of these) - look for proper plug-in among the Third-party Logging Libraries/Frameworks' Integration Plug-ins.

Here are examples of currently available modules in each category:

* Core Modules:
  1. Rollbar.
  2. Rollbar.OfflinePersistence,
  3. Rollbar.Deploys.

* .NET Specific Technology/Application Integration Modules:
  1. Rollbar.NetPlatformExtensions,
  2. Rollbar.Net.AspNet,
  3. Rollbar.Net.AspNet.Mvc,
  4. Rollbar.Net.AspNet.WebApi,
  5. Rollbar.NetCore.AspNet,
  6. Rollbar.App.Config,
  7. Rollbar.AppSettings.Json.

* Third-party Logging Libraries/Frameworks' Integration Plug-ins:
  1. Rollbar.PlugIns.Log4net,
  2. Rollbar.PlugIns.MSEnterpriseLibrary,
  3. Rollbar.PlugIns.NLog,
  4. Rollbar.PlugIns.Serilog.

Each of the modules is available via NuGet as a stand-alone package.

We are using unified versioning of the modules to follow common SDK versioning schema across all of the SDK components/modules.

# Core Modules

The most fundamental API of the Notifier is `ILogger`. It defines a collection of convenience methods for sending different kinds of data payloads using different logging levels flags.
Internally, any implementation of the `ILogger` that we have performs these three distinct steps when any of its logging methods is called:

1. enqueue the data object(s) to log for future transmission to the Rollbar API;
2. package/snap-shot the incoming/enqueued data object(s) into proper Rollbar data structure while applying some rules specified as part of relevant `RollbarConfig` instance;
3. transmit the enqueued items to the Rollbar API according to relevant `RollbarConfig` settings.

To minimize the impact of logging on the calling thread, ideally, it would be nice to perform all the steps on an auxiliary background thread(s).

However, in cases when highly mutable data is about to be logged it is essential to have step 2 performed on the calling thread before returning from the logging method.
In v2 we introduced `IAsynLogger` to help handle such cases. Its methods were a complete copy of `ILogger`'s methods with one main difference - they all used to return a Task so that the client code could wait for it to complete steps 1 and 2 before proceeding further if that is what needed in a specific case.
While it was a nice flexible and easy to use solution from an API point of view, the tasks did not perform well (as we learned it the hard way) under an EXTREMELY high AND sustained rate of a load.
So, in v3, we went away from the Tasks and removed `IAsynLogger` altogether. We are now back to having only `ILogger` and we have a substitute for the eliminated Tasks in the form of `IRollbarPackage`.
Think of the `IRollbarPackage` as a basis for implementing arbitrary data packaging strategies with an explicit flag (named as `MustApplySynchronously`) that signifies the need to apply the packaging (steps 1 and 2) on the calling thread before returning from a logging method. We also provide with abstract base classes like `RollbarPackageBase` and `RollbarPackageDecoratorBase` for implementing custom packaging strategies and their decorators.
We used these abstractions to implement our own collection of packagers and their decorators. All of them are available to the SDK users as well.
In addition to helping us in getting away from the Task usage, these new abstractions allow for very flexible and powerful ways to bundle a lot of specific types of data into a single payload as needed while encapsulating and reusing the packaging rules of any custom type.\
In v3, you can either throw into a logging method a data object to log (exactly the way it was in v2) or you can wrap in an `ObjectPackage` while setting the `MustApplySynchronously` flag if you want the logger to behave the way IAsyncLogger used to when you had to block-wait on its Task to complete.

Also, in some scenarios, a Notifier client may want to make sure that the data was actually transmitted to the Rollbar API before it can proceed further (like exiting the application/process).
That is why we still support `ILogger AsBlockingLogger(TimeSpan timeout)` method on the `ILogger`. It makes sure all of the 3 internal processing steps are performed before its logging methods return or it times out with an exception.

## Rollbar

`IAsyncLogger` is gone.

All the Asp.Net Core middleware related classes were moved to the new Rollbar.NetCore.AspNet module.
All the .NET Framework's HttpRequest and HttpContext capture functionality was moved to Rollbar.Net.AspNet module.

New abstractions:

* `IRollbarPackage`
* `RollbarPackageBase`
* `RollbarPackageDecoratorBase`

New useful types:

* `ObjectPackage`
* `ExceptionPackage`
* `MessagePackage`
* `DataPackage`
* `BodyPackage`
* `PersonPackageDecorator`
* `CustomKeyValuePackageDecorator`
* `ConfigAttributesPackageDecorator`
* `HttpRequestMessagePackageDecorator`

## Rollbar.OfflinePersistence

This is an optional module that does not really have any public API and can be used just by referencing the module/package by the SDK-hosting application project. Internally, it enables a Sqlite database storage to have payloads stored locally in case of any connectivity problem while reaching Rollbar.com until the connectivity is restored.
`IRollbarConfig` defines some settings that can be updated to modify the default storage location and the name of the database file.

## Rollbar.Deploys

Namespace: `Rollbar.Deploys`

Key abstractions:

* `IDeployment`
* `IDeploymentDetails`
* `IRollbarDeploysManager`
* `DeploymentFactory`
* `IRollbarDeploysManagerFactory`

# .NET Specific Technology/Application Integration Modules

## Rollbar.NetPlatformExtensions

New useful types:

* `RollbarLogger` as a `Microsoft.Extensions.Logging.ILogger`
* `RollbarLoggerProvider` as a `Microsoft.Extensions.Logging.ILoggerProvider`
* `RollbarLoggerFactory` as a `Microsoft.Extensions.Logging.ILoggerFactory`
* and more...

## Rollbar.Net.AspNet

New useful types:

* `HttpContextPackageDecorator`
* `HttpRequestPackageDecorator`
* `RollbarHttpModule`

## Rollbar.Net.AspNet.Mvc

New useful types:

* `ExceptionContextPackageDecorator`
* `RollbarExceptionFilter`

## Rollbar.Net.AspNet.WebApi

New useful types:

* `RollbarExceptionFilterAttribute`

## Rollbar.NetCore.AspNet

All the Rollbar middleware for Asp.Net Core is implemented in this module:
Rollbar middleware, logger factory, logger provider, etc.

New useful types:

* `HttpRequestPackageDecorator`
* `RollbarHttpContextPackageDecorator`

## Rollbar.App.Config

This is an optional module that does not really have any public API and can be used just by referencing the module/package by the SDK-hosting application project. Internally, it enables the initialization of a default `RollbarConfig` instance based on the provided either `app.config` or `web.config` application configuration file having an appropriate Rollbar configuration section defined.

## Rollbar.AppSetting.Json

This is an optional module that does not really have any public API and can be used just by referencing the module/package by the SDK-hosting application project. Internally, it enables the initialization of a default `RollbarConfig` instance based on the provided `appsettings.json` application configuration file having an appropriate Rollbar configuration section defined.

# Third-party Logging Libraries/Frameworks' Integration Plug-ins

## Rollbar.PlugIns.Log4Net

Implements Rollbar.NET Notifier as a log4net Appender.

## Rollbar.PlugIns.MSEnterpriseLibrary

Implements Rollbar.NET Notifier as an IExceptionHandler.

## Rollbar.PlugIns.NLog

Implements Rollbar.NET Notifier as a nlog Target.

## Rollbar.PlugIns.Serilog

Implements Rollbar.NET Notifier as a Serilog Sink.

# Core SDK Interfaces

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/dfbbbf2-Core_SDK_Interfaces.png",
        "Core_SDK_Interfaces.png",
        1051,
        1617,
        "#f5f6f6"
      ],
      "caption": ""
    }
  ]
}
[/block]

# Core SDK Types

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/26cd612-Core_SDK_Types.png",
        "Core_SDK_Types.png",
        1747,
        1640,
        "#f3f4f5"
      ]
    }
  ]
}
[/block]

# Core SDK Packagers and Decorators

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/54cf28f-Core_SDK_Packaging_Strategies.png",
        "Core_SDK_Packaging_Strategies.png",
        1603,
        2211,
        "#f5f6f7"
      ]
    }
  ]
}
[/block]

# Core SDK Deployments Management

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/101ed3a-Rollbar.Deploys.jpg",
        "Rollbar.Deploys.jpg",
        1870,
        613,
        "#f7f8f8"
      ],
      "caption": ""
    }
  ]
}
[/block]