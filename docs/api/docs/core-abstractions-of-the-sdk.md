<!-- source: https://docs.rollbar.com/docs/core-abstractions-of-the-sdk.md -->

# SDK Core Abstractions

Application Domain Language of the SDK

# Rollbar Configuration

Here we describe core concepts and patterns used to configure the available SDK options.

## Key Configuration Related Interfaces

* `IRollbarInfrastructureConfig`
* `IRollbarLoggerConfig`
* `I...Options`

The Configs are composed of Options., i.e. have Options as their properties.
`IRollbarInfrastructureConfig` also includes the RollbarLoggerConfig property of `IRollbarLoggerConfig` type.
All of these interfaces (both the Configs and Options) are `IReconfigurable` and `ITracable`.
Most of the Options’ properties are Read-Only.
The primary way to modify either Config or Options objects exposed via the interfaces is by reconfiguring the objects based on provided similar prototype objects. Just call the `Reconfigure(prototype)` method on a Config or Options interface at hand.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/2860505-RollbarConfiguration.png",
        "RollbarConfiguration.png",
        1273,
        1710,
        "#f1f2f1"
      ]
    }
  ]
}
[/block]

## Key Configuration Related Classes

Every (primarily Read-Only) `I...Config` or `I...Options` has a Read-Write capable matching class implementing each interface (just remove `I` prefix from an interface name to get the corresponding implementing class name).

Normally, while using Configs and Options, you instantiate the needed class and either manually set all the desired properties on that instance or load it from an appropriate configuration file using proper `IRollbarConfigurationLoader` implementation (check out Rollbar.App.Config or/and RollbarAppSettings.Json modules).

Once the instance is properly configured/loaded as needed it can be used to reconfigure any existing configuration object exposed via the similar configuration interface by calling the `Reconfigure(prototype)` method on target configuration/options to be reconfigured based on the provided prototype configuration/options.

# Rollbar Infrastructure

The `RollbarInfrastructure` abstraction is an optional (but recommended when it is possible to use it) concept that implements most of the payload composition, processing and delivery functionality of the SDK run on a dedicated background thread, so it offloads most of the work done by the SDK from the client threads calling IRollbar and ILogger methods (i.e. the logging methods) of the SDK.

The main reason for this abstraction to be optional is that some runtime environments may not allow/support background thread creation/processing. For example, browser-side Blazor implementation as it stands today.

To take advantage of this infrastructure while logging to Rollbar, just initialize the `RollbarInfrastructure` singleton with a valid configuration object before any first use of either `RollbarLocator` or `RollbarFactory` classes. Usually, you would want to do it as early as possible within your application process’s startup/load/initialization.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/fb4aa56-RollbarInfrastrucure.png",
        "RollbarInfrastrucure.png",
        1273,
        1304,
        "#f0f1f3"
      ]
    }
  ]
}
[/block]

# Rollbar Loggers

Rollbar loggers are used to collect and send logged data/events to a Project Dashboard allocated on Rollbar.com.

## Key Interfaces

* `ILogger` - interface for async and synchronous event/data logging
* `IRollbar` - extends `ILogger` with Rollbar specific configuration and convenience methods, properties, and events.

## Key Classes

* `RollbarLocator` - a service-class/singleton providing application-wide access to the shared instance of `IRollbar` implementation;
* `RollbarFactory` - a utility class for creating disposable `IRollbar` implementation instances as needed (usually, short-lived ones within the C# `using` blocks).

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/e654220-RollbarLoggers.png",
        "RollbarLoggers.png",
        1279,
        582,
        "#f2f4f5"
      ]
    }
  ]
}
[/block]

# Rollbar Assistant

`RollbarAssistant` is a utility class providing convenient ways to capture arbitrary object’s property values into a key-value (i.e. PropertyName-PropertyValue) dictionary so that the dictionary can be attached as metadata for any SDK logging method.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/fdd5546-RollbarAssistant.png",
        "RollbarAssistant.png",
        1261,
        397,
        "#eaecf0"
      ]
    }
  ]
}
[/block]

# Rollbar Packages and Package Decorators

You can think of the Packages as an abstraction that allows to capture and bundle up either specific or arbitrary objects and turn them into Rollbar payloads that could be sent to Rollbar.com. They also allow for a higher level of encapsulation and reuse of the functionality required to turn any data into a Rollbar payload. A package can also declare whether the packaged data can be captured later by the Rollbar infrastructure in the background or must be captured synchronously at the time when the package is passed into the IRollbar logging method.

Each package can be decorated with an infinite amount of package decorators (that are packages on their own). Each decorator is meant to add arbitrary extra data to a wrapped/decorated package and to have that data appended to the same corresponding payload.

The decorators are applied in the same order they were added to/around the original package.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/2e723b8-RollbarPackages.png",
        "RollbarPackages.png",
        1289,
        1096,
        "#f6f7f8"
      ]
    }
  ]
}
[/block]

Currently, the core Rollbar module of the SDK defines the following packages:

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/164920d-Packages.png",
        "Packages.png",
        1269,
        1262,
        "#f3f4f7"
      ]
    }
  ]
}
[/block]

Other SDK modules may define additional packages, or you can create your own custom ones.

Here are some of the package decorators defined within the core Rollbar module:

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/3cb35a7-Decorators.png",
        "Decorators.png",
        1268,
        1422,
        "#f5f6f8"
      ]
    }
  ]
}
[/block]

Other SDK modules define a lot of other applicable decorators, and you can always create your own custom package decorators.

# Rollbar Internal Events

Being a developer tool, the SDK should not be bringing down an application that is hosting the SDK in case anything goes wrong for any reason inside the SDK. So, we are doing everything possible to safely intercept and handle all the SDK internal exceptions if any. Such exceptions are turned into what we call SDK Internal Events. We also report significant internal operation events of the SDK as similar Internal Events.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/3098791-RollbarEvents.png",
        "RollbarEvents.png",
        1275,
        1308,
        "#f3f4f7"
      ]
    }
  ]
}
[/block]

Every individual `IRollbar` instance offers a subscription to the Internal Event (via C# `InternalEvent` event).
Similarly, all the events from any `IRollbar` instance, as well as Infrastructure specific Internal Events, are reported as `InternalEvent` of the `RollbarInfrastructure.Instance.QueueController` singleton.

# Rollbar Exceptions

In cases when an internal error happens and we cannot gracefully recover from it, such an error will be reported as a `RollbarException`.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/8f91839-RollbarException.png",
        "RollbarException.png",
        1150,
        1409,
        "#f1f1f4"
      ]
    }
  ]
}
[/block]