<!-- source: https://docs.rollbar.com/docs/more-advanced-logger-usages.md -->

# More Advanced Logger Usages

You've got the power!

# Logging using different Rollbar levels for a payload

To send a caught exception to Rollbar, you must call `RollbarLocator.RollbarInstance.Log()`. You can set an item's level when you call this function. The level can be `'Debug'`, `'Info'`, `'Warning'`, `'Error'`, or `'Critical'`.

In addition, there are other convenience-methods for logging messages using different error levels that are named after the levels.

[block:code]
{
  "codes": [
    {
      "code": "RollbarLocator.RollbarInstance.Error(exception);",
      "language": "csharp"
    }
  ]
}
[/block]

# Logging using the Singleton-like Instance of the Logger (via the `RollbarLocator`)

1. Get a reference to the singleton-like instance of the Notifier by calling `RollbarLocator.RollbarInstance`.
2. Configure the instance (before any attempts to use it for logging) by calling its `Configure(…)` method while supplying valid configuration parameters.
3. Call any of the `ILogger`’s methods on the instance.

[block:code]
{
  "codes": [
    {
      "code": "const string postServerItemAccessToken = \"POST_SERVER_ITEM_ACCESS_TOKEN\";\n\nRollbarLocator.RollbarInstance\n  .Configure(new RollbarConfig(postServerItemAccessToken) { Environment = \"proxyTest\" })\n  ;\n\nRollbarLocator.RollbarInstance\n  .Info(\"Basic info log example.\");\nRollbarLocator.RollbarInstance\n  .Debug(\"First debug log.\");\nRollbarLocator.RollbarInstance\n  .Error(new NullReferenceException());\nRollbarLocator.RollbarInstance\n  .Error(new Exception(\"trying out the TraceChain\", new Exception(\"inner\")));",
      "language": "csharp"
    }
  ]
}
[/block]

# Logging using a Scoped Instance of the Logger

1. Get a reference to a newly created instance of the Notifier by calling the `RollbarFactory.CreateNew()` helper method.
2. Properly configure the instance (before any attempts to use it for logging) by calling its `Configure(…)` method while supplying valid configuration parameters.
3. Call any of the `ILogger`’s methods on the instance.
4. Dispose of the Notifier instance at the end of its scope by casting it to `IDisposable` and calling `Dispose()` on the cast.

Here the scoped instance of the Logger is disposed of with the help of the `using(…){…}` block:

[block:code]
{
  "codes": [
    {
      "code": "RollbarConfig loggerConfig = new RollbarConfig(RollbarUnitTestSettings.AccessToken)\n{\n  Environment = RollbarUnitTestSettings.Environment,\n};\n\nusing (var logger = RollbarFactory.CreateNew().Configure(loggerConfig))\n{\n  logger.Log(ErrorLevel.Error, \"test message\");\n  logger.Info(\"Basic info log example.\");\n  logger.Debug(\"First debug log.\");\n  logger.Error(new NullReferenceException());\n  logger.Error(\n    new Exception(\"trying out the TraceChain\", new Exception(\"inner\"))\n  );\n}",
      "language": "csharp"
    }
  ]
}
[/block]

# Using Packagers to compose more elaborate payloads

You can use our (or custom made) Packages and PackageDecorator types to bundle any extra information from any source as you wish. For example:

[block:code]
{
  "codes": [
    {
      "code": "// package in the some captured exception:\nIRollbarPackage rollbarPackage = \n  new ExceptionPackage(\n  \tsomeException, \n  \t$\"{nameof(RollbarMiddleware)} processed uncaught exception.\"\n\t);\n// decorate tha package with other useful info:\nrollbarPackage = \n  new HttpRequestPackageDecorator(rollbarPackage, context.Request, true);\nrollbarPackage = \n  new HttpResponsePackageDecorator(rollbarPackage, context.Response, true);\n// log/report the payload package:\nRollbarLocator.RollbarInstance.Critical(rollbarPackage);\n",
      "language": "csharp"
    }
  ]
}
[/block]

# Having even more control over a composed payload...

If you want more control over sending data to Rollbar, there is one interesting class to know about: `Rollbar.DTOs.Payload`. The class and the classes that compose the class cannot be constructed without all mandatory arguments, and mandatory fields cannot be set. Therefore, if you can construct a payload, then it is valid for the purposes of sending it to Rollbar. You can have read/write access to instance reference of this type within your own functions/actions defined as `CheckIgnore`, `Transform`, and `Truncate` delegates of a `RollbarConfig` instance.

If you would like to define your own filtering rules to disallow reports some specific payload instances, implement a `CheckIgnore` delegate and assign it to a proper `RollbarConfig` instance.

Similarly, you can implement your own `Transform` delegate to modify any payload to be sent. For example, by calculating your own fingerprint of an exception payload or adding extra custom attributes to any payload.

There are two other *particularly* interesting classes to worry about: `Rollbar.DTOs.Data` and `Rollbar.DTOs.Body`. `Rollbar.DTOs.Data` can be filled out as completely or incompletely as you want, except for the `Environment` (`"debug"`, `"production"`, `"test"`, etc) and `Body` fields. The `Body` is where the data you're actually posting to Rollbar lives. All the other fields on `Rollbar.DTOs.Data` answer contextual questions about the bug, such as "who saw this error?" (`RollbarPerson`), "what HTTP request data can you give me about the error (if it happened during an HTTP Request)?" (`Rollbar.DTOs.Request`), and "how severe was the error?" (`Level`). Anything you see in the [Rollbar API docs](https://rollbar.com/docs/api/items_post/) can be found in `Rollbar.NET`.

`Rollbar.DTOs.Body` can be constructed one of 5 ways:

1. With a class extending from `Exception`, which will automatically produce a  `Rollbar.DTOs.Trace` object, assigning it to the `Trace` field of the `Rollbar.DTOs.Body`.
2. With a class extending from `AggregateException`, which will automatically produce an array of `Rollbar.DTOs.Trace` objects for each inner exception, assigning it to the `TraceChain` field of `Rollbar.DTOs.Body`.
3. With an actual array of `Exception` objects, which will automatically produce an array of `Rollbar.DTOs.Trace` objects for each exception, assigning it to the `TraceChain` field of `RollbarBody`.
4. With a `Rollbar.DTOs.Message` object, which consists of a string and any additional keys you wish to send along. It will be assigned to the `Message` field of `Rollbar.DTOs.Body`.
5. With a string, which should be formatted like an iOS crash report. This library has no way to verify if you've done this correctly, but if you pass in a string it will be wrapped in a dictionary and assigned to the `"raw"` key and assigned to the `CrashReport` field of `Rollbar.DTOs.Body`

None of the fields on `Rollbar.DTOs.Body` are updatable, and all null fields in
`Rollbar.NET` are left out of the final JSON payload.

# Capturing State of Critical Objects

We introduced `RollbarAssistant` utility class to make it easier to capture a state of critical objects at runtime. The state is captured as a dictionary where a key is a data field name (prefixed with provided object instance name/ID) and value is the corresponding field value at the time of capture. The `CaptureState(...)` method captures the public and private data fields of an object. The method has two overloads: one for capturing a state of an instance of a non-static class and another for capturing a state of a static class.

Here is an example of the most common usage pattern:

[block:code]
{
  "codes": [
    {
      "code": "try\n{\n  ///...\n}\ncatch (System.Exception ex)\n{\n  // capture state of this instance:\n  var state = RollbarAssistant.CaptureState(this, \"Self\"); \n  // also, capture state of some other critical object:\n  state = \n    new Dictionary<string, object>(\n    \tstate.Concat(RollbarAssistant.CaptureState(criticalObj, \n                                                 nameof(criticalObj)))\n  \t);\n  // also, capture current state of a static type:\n  state = \n    new Dictionary<string, object>(\n    \tstate.Concat(RollbarAssistant.CaptureState(typeof(StaticType)))\n  \t);\n\n  // report the captured states along with the caught exception:\n  RollbarLocator.RollbarInstance\n    .AsBlockingLogger(TimeSpan.FromSeconds(3))\n    .Error(ex, state);\n}",
      "language": "csharp"
    }
  ]
}
[/block]