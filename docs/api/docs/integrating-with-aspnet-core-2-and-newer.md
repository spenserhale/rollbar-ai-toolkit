<!-- source: https://docs.rollbar.com/docs/integrating-with-aspnet-core-2-and-newer.md -->

# Integrating with ASP.NET Core 2 and Newer

# Overview

The SDK can be integrated into an ASP.NET Core 2 application on two levels:

1. Each ASP.NET Core controllers’ method implementation could be surrounded by a try-catch block where, within the `catch(…){…}` block, any caught exception is passed to a common exception handling routine which in turn reports the exception via the SDK.
2. A request processing pipeline of the application is extended with the Rollbar.NET middleware component that monitors all the inner middleware components of the pipeline for unhandled exceptions and reports them via the Rollbar.NET Notifier singleton instance and then rethrows the exceptions while wrapping them with a new Exception object.

You can check out a sample ASP.NET Core 2 based application that demonstrates proper use of the middleware component [here](https://github.com/rollbar/Rollbar.NET/blob/master/Samples/Sample.AspNetCore2.WebApi.sln).

First, the singleton component needs to be properly configured. There are two approaches to doing this. If both approaches are used, the second option always overrides the first option.

# Option 1 - Configure the Rollbar Logger via the app settings

Add at least the minimum required configuration parameters to the hosting application’s `appsettings.json` file. Any of the properties of the RollbarConfig class that has public setter can be set using this approach.

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"Logging\": {\n    \"IncludeScopes\": false,\n    \"Debug\": {\n      \"LogLevel\": {\n        \"Default\": \"Warning\"\n      }\n    },\n    \"Console\": {\n      \"LogLevel\": {\n        \"Default\": \"Warning\"\n      }\n    }\n  },\n\n  \"Rollbar\": {\n    \"AccessToken\": \"POST_SERVER_ITEM_ACCESS_TOKEN\",\n    \"Environment\": \"AspNetCoreMiddlewareTest\"\n  }\n}",
      "language": "json"
    }
  ]
}
[/block]

# Option 2 - Configure the Rollbar Logger in code

Within the `ConfigureServices(…)` method of `Startup.cs`, add proper Rollbar configuration and register the Rollbar logger with the application services:

[block:code]
{
  "codes": [
    {
      "code": "// This method gets called by the runtime. \n// Use this method to add services to the container.\npublic void ConfigureServices(IServiceCollection services)\n{\n  ConfigureRollbarSingleton();\n\n  //...\n}\n\n/// <summary>\n/// Configures the Rollbar singleton-like notifier.\n/// </summary>\nprivate void ConfigureRollbarSingleton()\n{\n  const string rollbarAccessToken = \"POST_SERVER_ITEM_ACCESS_TOKEN\";\n  const string rollbarEnvironment = \"RollbarNetSamples\";\n\n  RollbarLocator.RollbarInstance\n    // minimally required Rollbar configuration:\n    .Configure(new RollbarConfig(rollbarAccessToken) { Environment = rollbarEnvironment })\n    // optional step if you would like to monitor \n    // Rollbar internal events within your application:\n    .InternalEvent += OnRollbarInternalEvent\n    ;\n}",
      "language": "csharp"
    }
  ]
}
[/block]

# Activate the Rollbar

Next, add Rollbar logging service:

[block:code]
{
  "codes": [
    {
      "code": "// This method gets called by the runtime. \n// Use this method to add services to the container.\npublic void ConfigureServices(IServiceCollection services)\n{\n  //...\n\n  services.AddRollbarLogger(loggerOptions =>\n    {\n      loggerOptions.Filter = \n        (loggerName, loglevel) => loglevel >= LogLevel.Trace;\n     });\n\n  services.AddMvc();\n}",
      "language": "csharp"
    }
  ]
}
[/block]

Now, add the Rollbar middleware to the application pipeline. This is normally done by adding its usage within the `Configure(…)` method of `Startup.cs`.

[block:code]
{
  "codes": [
    {
      "code": "// This method gets called by the runtime. \n// Use this method to configure the HTTP request pipeline.\npublic void Configure(IApplicationBuilder app, IHostingEnvironment env)\n{\n  if (env.IsDevelopment())\n  {\n    app.UseDeveloperExceptionPage();\n  }\n\n  app.UseRollbarMiddleware();\n\n  // Any other middleware component intended to be \"monitored\" \n  // by Rollbar.NET middleware go below this line:\n  app.UseMvc();\n}",
      "language": "csharp"
    }
  ]
}
[/block]

That's it! Now every unhandled exception within the middleware pipeline under the Rollbar middleware component monitoring will be reported to Rollbar.