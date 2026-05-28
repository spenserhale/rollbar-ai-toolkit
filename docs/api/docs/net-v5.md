<!-- source: https://docs.rollbar.com/docs/net-v5.md -->

# .NET and .NET Core

Rollbar SDK for .NET & .NET Core | Support Level: Supported

# Introduction

A .NET Rollbar Client/Notifier that can be used in any application built on the following .NET versions: .NET Core 2.0+ (including .NET 7.0), .NET Standard 2.0+, .NET Full Framework 4.5+, Mono, Xamarin, and, in general, any implementation of the .NET Standard 2.0+.

It simplifies building data payloads based on exception data, tracing data, informational messages and telemetry data and sends the payloads to the Rollbar API for remote monitoring and analysis of the hosting application's behavior.

If configured to do so, the Notifier [can cache the payloads locally](https://docs.rollbar.com/docs/sdk-modules#rollbarofflinepersistence) in case the Internet connectivity is not available or the Rollbar API server is not reachable. Once the connectivity is restored the stored payloads are forwarded to the Rollbar API server while obeying the configured rate limits.

The Core component of the SDK also contains a client and all the expected data types needed to communicate with Rollbar Deployments API that allows your product deployments registration with Rollbar.

# Install

The SDK can be integrated into your codebase either as code, for example, as a git submodule referencing our [GitHub repo](https://github.com/rollbar/Rollbar.NET) OR as prebuilt assemblies available either [here](https://github.com/rollbar/Rollbar.NET/releases) or via [Nuget](https://www.nuget.org/profiles/Rollbar).

To install the SDK core component, use Nuget Package Manager:

```shell
Install-Package Rollbar
Install-Package Rollbar.NetCore.AspNet
```

OR use the following .Net Core CLI command:

```shell
dotnet add package Rollbar
dotnet add package Rollbar.NetCore.AspNet
```

> 📘 Installing alternative SDK components
>
> Other extension components of the SDK could be installed in a similar way. Just replace `Rollbar` in the command above with the desired component's NuGet package name (that does correspond to the name of the component). The available extension components are listed within the next section (SDK Overview) and [available on Nuget](https://www.nuget.org/profiles/Rollbar).

> 📘 Using Rollbar.NET within Strongly Named (or Signed) Host Applications
>
> The SDK assemblies are not strongly named (or signed). Hence, you may get either build-time warnings or run-time assembly loading errors, depending on the exact type of the signed hosting application and its signing-related settings.
>
> These signing-related issues can be easily resolved by using StrongNamer (<https://github.com/dsplaisted/strongnamer>) which is available as a NuGet package.
>
> Just add StrongNamer package as a NuGet dependency to every project of your solution that also references any of the SDK components and the issues will be solved.

# SDK Demo Samples

For more complete examples of integrating the SDK within different types of .NET applications, please, see our [collection of working Sample Projects](https://github.com/rollbar/Rollbar.NET/tree/master/Samples).

# Help / Support

If you run into any issues, please email us at <support@rollbar.com>

For bug reports or new feature requests, please [open an issue on GitHub](https://github.com/rollbar/Rollbar.NET/issues/new/choose).