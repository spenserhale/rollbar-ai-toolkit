<!-- source: https://docs.rollbar.com/docs/sdk-modules.md -->

# SDK Modules

SDK Packaging Strategy

Rollbar.NET Notifier SDK consists of multiple modules/packages.

# Major Types of the SDK Modules

These components can be logically grouped into the following categories:

* Core Modules
* .NET Specific Technology/Application Integration Modules
* Third-party Logging Libraries/Frameworks' Integration Plug-ins

Core Modules implement the fundamentally basic stand-alone core functionality of the Rollbar.NET Notifier.\
They have the least possible number of dependencies and only rely on functionality provided by most basic .NET implementation types that are common across all the supported .NET Standard implementations. So, if you only care about using core SDK concepts like:\
`IRollbar`, `ILogger`, `IRollbarInfrastructure`, `IRollbarInfrastrucureConfig`, `IRollbarLoggerConfig`, `RollbarFactory`, `RollbarLocator`, `IRollbarPackage`, `Rollbar.DTOs`, `IRollbarQueueController`, `IRollbarTelemetryCollector`, `IRollbarConnectivityMonitor`, some commonly used Rollbar utility classes and you are planning to implement all the integration of these classes into your application on your own - use the Core Modules only.

If you care about functionality that we implemented to simplify integration of the Notifier core functionality into a specific .NET application technology/framework, like .NET Framework ASP.NET or .NET Core ASP.NET, Blazor, etc. - you may want to pull in some of the .NET Specific Technology/Application Integration Modules.

If you want to have the Notifier integrated as a simple plug-in expected by a commonly used third-party logging library/framework, like Serilog, log4net, etc. (because you are already relying on one of these) - look for a proper plug-in among the Third-party Logging Libraries/Frameworks' Integration Plug-ins.

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

We are using unified versioning of the modules to follow the common SDK versioning schema across all the SDK components/modules.

# Core Modules

## Rollbar

Key abstractions:

* `IRollbar`
* `ILogger`
* `IRollbarInfrastructure`
* `IRollbarQueueController`
* `IRollbarTelemetryCollector`
* `IRollbarConnectivityMonitor`
* `IRollbarInfrastructureConfig`
* `IRollbarLoggerConfig`
* `I...Options`
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

This is module uses a Sqlite database storage to have payloads stored locally in case of any connectivity problem while reaching Rollbar.com until the connectivity is restored, for example to capture a mobile app crash. To use it, use infrastructure configuration with `RollbarOfflineStoreOptions.EnableLocalPayloadStore` set to true.

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

All the Rollbar middleware for Asp.Net Core is implemented in this module:\
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

Sample GitHub Repo using .NET 4.8.x with Log4Net\
<https://github.com/RollbarCustomerEng/log4netdemo>

## Rollbar.PlugIns.MSEnterpriseLibrary

Implements Rollbar.NET Notifier as an IExceptionHandler.

## Rollbar.PlugIns.NLog

Implements Rollbar.NET Notifier as a nlog Target.

## Rollbar.PlugIns.Serilog

Implements Rollbar.NET Notifier as a Serilog Sink.