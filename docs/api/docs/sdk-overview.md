<!-- source: https://docs.rollbar.com/docs/sdk-overview.md -->

# SDK Overview

The Big Picture

# Primary Motivation Behind v5 of the SDK

The primary motivation for making another major version of the SDK is the addition of Blazor Client-Side support.
With the recent introduction of Blazor, its development stack for the server-side worked fine with our SDK requiring no SDK changes to support the modern technology on the server-side. However, in-browser support of Blazor was not possible due to the current limitations of the Blazor implementation on the client side. As of now, Blazor client-side runtime environment does not allow the creation of background threads (at least not yet).
Pre-v5 SDK was fundamentally designed around its own internal payload processing infrastructure that tries to offload as much payload composition and processing on a dedicated background thread “running” the infrastructure.

# Overview of Main Changes in v5 as Compared to v4

So, to add Blazor client-side support to the SDK we had to make that dependency on the infrastructure optional. Hence, we had to make the infrastructure initialization an explicit and optional step within the v5 usage pattern.

To properly support both SDK usage scenarios (infrastructure-based vs. infrastructure-independent) we had to change the layout of what used to be known as `RollbarConfig` object in pre-v5 incarnations of the SDK. In v5, it was replaced by the `RollbarInfrastructureConfig` and `RollbarLoggerConfig` where each of the configuration objects is now designed in a more organized and structured manner. Each configuration is composed of what we call configuration options that are atomic custom typed configuration objects representing specific aspects/areas of the SDK configuration. For example, destination options, developer options, data security options, telemetry options, etc.

It is critical to understand that some of the options (i.e. corresponding SDK features) are only available within infrastructure-based usage scenarios. For example, today, offline store options or telemetry options are only available if the infrastructure is used.

So, a new abstraction of RollbarInfrastructure was introduced with v5 of the SDK. It is designed as a singleton-based application wide service. If a particular SDK usage scenario relies on the SDK the singleton must be initialized with a valid `RollbarInfrastructureConfig` object first - before any attempts to get access to any of the RollbarLogger instances. From there on, the `RollbarLocator` or/and `RollbarFactory` will provide you with proper logger reference to a proper `IRollbar` implementation depending on whether the infrastructure was initialized or not.

Past that point, all the usage patterns of the `IRollbar` implementations should look identical to the pre-v5 usage patterns.

Most (if not all) plug-in modules were not affected by these changes at all - from the client code/usage point of view.