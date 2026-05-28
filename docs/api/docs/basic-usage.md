<!-- source: https://docs.rollbar.com/docs/basic-usage.md -->

# Basic Usage

Use of the key API to get you rolling

# Basic Usage Scenario

* Configure Rollbar

[block:code]
{
  "codes": [
    {
      "code": "RollbarLocator.RollbarInstance\n    .Configure(new RollbarConfig(\"POST_SERVER_ITEM_ACCESS_TOKEN\"));\n",
      "language": "csharp",
      "name": ""
    }
  ]
}
[/block]

* Send errors (asynchronously) to Rollbar with

[block:code]
{
  "codes": [
    {
      "code": "RollbarLocator.RollbarInstance\n    .Error(exception);",
      "language": "csharp",
      "name": ""
    }
  ]
}
[/block]

* Send messages (synchronously) to Rollbar with

[block:code]
{
  "codes": [
    {
      "code": "RollbarLocator.RollbarInstance\n    .AsBlockingLogger(TimeSpan.FromSeconds(5))\n    .Info(message);",
      "language": "csharp",
      "name": ""
    }
  ]
}
[/block]

# Blocking vs Non-Blocking Logging

The SDK is designed to have as little impact on the hosting system or application as possible. It takes an async "fire and forget" approach to logging. Normally, you want to use fully asynchronous logging, since it has virtually no instrumentational overhead on your application execution performance at runtime (especially when running on a multi-core/multi-processor system).

The payloads can be packaged/queued/transmitted using either fully asynchronous logging, for example:

```csharp
RollbarLocator.RollbarInstance
    .Log(ErrorLevel.Error, "test message");
```

or fully-synchronously using an explicitly specified timeout:

```csharp
RollbarLocator.RollbarInstance
    .AsBlockingLogger(TimeSpan.FromSeconds(5))
    .Log(ErrorLevel.Error, "test message");
```

[block:callout]
{
  "type": "warning",
  "body": "In case of a timeout, all the blocking log methods throw `System.TimeoutException` instead of gracefully completing the call. Therefore you might want to make all the blocking log calls within a try-catch block while catching `System.TimeoutException` specifically to handle a timeout case.",
  "title": "Warning Note"
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "Useful Option: Asynchronous Logging with Synchronous Packaging",
  "body": "Sometimes you may want to package a payload synchronously but to queue and transmit it asynchronously. In this sort of scenario, you can use our packages and package-decorators concepts where you can flag either package or a decorator as \"must apply synchronously\" (during its construction).  One flag set like this will cause the whole resulting decorated package to be packaged synchronously even if it is logged using the asynchronous API."
}
[/block]

# How the legacy versions did it...

## v1.x.x

In v1.x.x versions of the SDK, the asynchronous logging calls were still performing some of their data processing functions (like packaging the data objects to log into a proper Rollbar Payload DTO instance) on the calling thread before asynchronously placing the payloads into a transmission queue. Hence, the duration of the logging method calls was proportional to the size and complexity of the data object to package and log.

## v2.x.x

In v2.x.x versions of the SDK, we moved the packaging of the data-to-log one level deeper and now it is handled in a context of a worker thread that is responsible for the packaging of a proper payload DTO and queuing it for transmission to the Rollbar API Server.
As a result, the logging method calls are extremely quick now (under 20 microseconds) regardless of the complexity and size of the data-to-log. All the methods now return a `Task` instance (instead of an `ILogger` instance as in v1.x.x) that could be either ignored in true "fire-and-forget" logging scenarios or could be waited (or awaited) to complete packaging and queuing of the payloads in some scenarios.

However, in some specific situations (such as while logging right before exiting an application), you may want to use a logger fully synchronously so that the application does not quit before the logging completes (including subsequent delivery of the corresponding payload to the Rollbar API).

That is why every instance of the Rollbar asynchronous logger (implementing `ILogger` interface) defines the `AsBlockingLogger(TimeSpan timeout)` method that returns a fully synchronous implementation of the `ILogger` interface. This approach allows for easier code refactoring when switching between asynchronous and synchronous uses of the logger.

Therefore, this call will perform the quickest possible asynchronous logging (true "fire-and-forget" logging):

```csharp
RollbarLocator.RollbarInstance
    .Log(ErrorLevel.Error, "test message");
```

while the following call will perform somewhat quick asynchronous logging (only having its payload packaging and queuing completed by the end of the call):

```csharp
RollbarLocator.RollbarInstance
    .Log(ErrorLevel.Error, "test message")
    .Wait();
```

while next call will perform fully blocking/synchronous logging with a timeout of 5 seconds (including the payload delivery to the Rollbar API either completed or failed due to the timeout by the end of the call):

```csharp
RollbarLocator.RollbarInstance
    .AsBlockingLogger(TimeSpan.FromSeconds(5))
    .Log(ErrorLevel.Error, "test message");
```