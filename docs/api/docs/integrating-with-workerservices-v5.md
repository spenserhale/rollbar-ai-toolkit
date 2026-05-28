<!-- source: https://docs.rollbar.com/docs/integrating-with-workerservices-v5.md -->

# Integrating with WorkerService

Use Rollbar from within a WorkerService application

For the working sample, please look [here](https://github.com/rollbar/Rollbar.NET/blob/master/Samples/Sample.NetCore.WorkerService.sln).

Whenever you are trying to integrate Rollbar.NET SDK into an existing WorkerService application, the most optimal way is to do it via our [Rollbar.NetPlatformExtensions module](https://www.nuget.org/packages/Rollbar.NetPlatformExtensions/). It will also bring in the required dependency that is Rollbar core module/package. In this example, we also use optional Rollbar.AppSettings.Json module:

[block:code]
{
  "codes": [
    {
      "code": "dotnet add package Rollbar.NetPlatformExtensions\ndotnet add package Rollbar.AppSettings.Json",
      "language": "shell"
    }
  ]
}
[/block]

Then, configure the Rollbar Notifier within your WorkerService's `appsettings.json` file, for example:

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"Logging\": {\n    \"LogLevel\": {\n      \"Default\": \"Information\",\n      \"Microsoft\": \"Warning\",\n      \"Microsoft.Hosting.Lifetime\": \"Information\"\n    }\n  },\n\n  \"Rollbar\": {\n    \"AccessToken\": \"17965fa5041749b6bf7095a190001ded\",\n    \"Environment\": \"RollbarNetSamples\",\n    \"Enabled\": true,\n    \"MaxReportsPerMinute\": 160,\n    \"ReportingQueueDepth\": 120,\n    \"LogLevel\": \"Info\",\n    \"ScrubFields\": [\n      \"ThePassword\",\n      \"TheSecret\"\n    ],\n    \"Person\": {\n      \"UserName\": \"jbond\",\n      \"id\": \"007\"\n    },\n    \"PersonDataCollectionPolicies\": \"Username, Email\",\n    \"IpAddressCollectionPolicy\": \"CollectAnonymized\"\n  },\n\n  \"RollbarTelemetry\": {\n    \"TelemetryEnabled\": true,\n    \"TelemetryQueueDepth\": 100,\n    \"TelemetryAutoCollectionTypes\": \"Network, Log, Error\",\n    \"TelemetryAutoCollectionInterval\": \"00:00:00.3000000\"\n  }\n  \n}",
      "language": "json"
    }
  ]
}
[/block]

Now, modify your `Program.cs`'s `CreateHostBuilder(...)` methods by adding the RollbarLoggerProvider to its logging configuration, for example, like this:

[block:code]
{
  "codes": [
    {
      "code": "using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Threading.Tasks;\nusing Microsoft.Extensions.DependencyInjection;\nusing Microsoft.Extensions.Hosting;\nusing Microsoft.Extensions.Logging;\n\nusing Rollbar;\nusing Rollbar.AppSettings.Json;\nusing Rollbar.NetPlatformExtensions;\n\nnamespace Sample.NetCore.WorkerService\n{\n  public class Program\n  {\n    public static void Main(string[] args)\n    {\n      CreateHostBuilder(args).Build().Run();\n    }\n    \n    public static IHostBuilder CreateHostBuilder(string[] args) =>\n      Host.CreateDefaultBuilder(args)\n      .ConfigureLogging((logging) => {\n        \n        // STEP.1 -  seed Rollbar infrastructure configuration:\n        RollbarInfrastructureConfig rollbarInfrastructureConfig = \n          new RollbarInfrastructureConfig();\n        \n        // STEP.2 - reconfigure the seed from the appsettings.json file:\n        if(!AppSettingsUtility.LoadAppSettings(rollbarInfrastructureConfig))\n        {\n          throw new ApplicationException(\"Couldn't load Rollbar configuration!\");\n        }\n        \n        // STEP.3 - init the Rollbar infrastructure with the loaded configuration:\n        RollbarInfrastructure.Instance.Init(rollbarInfrastructureConfig);\n        \n        // STEP.4 - add a well-configured RollbarLoggerProvider:\n        logging.ClearProviders();\n        logging.AddProvider(\n          new RollbarLoggerProvider(\n            rollbarInfrastructureConfig.RollbarLoggerConfig\n          ));\n      })\n      .ConfigureServices((hostContext,services) =>\n      {\n        services.AddHostedService<Worker>();\n      });\n    }\n}",
      "language": "csharp"
    }
  ]
}
[/block]

Recompile your application. From now on, anytime your codebase makes calls to an ILogger instance, the logged data will be forwarded to your Rollbar project dashboard, for example:

[block:code]
{
  "codes": [
    {
      "code": "using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Threading;\nusing System.Threading.Tasks;\nusing Microsoft.Extensions.Hosting;\nusing Microsoft.Extensions.Logging;\n\nnamespace Sample.NetCore.WorkerService\n{\n    public class Worker:BackgroundService\n    {\n        private readonly ILogger<Worker> _logger;\n\n        public Worker(ILogger<Worker> logger)\n        {\n            _logger = logger;\n        }\n\n        protected override async Task ExecuteAsync(\n          CancellationToken stoppingToken\n        \t)\n        {\n            while(!stoppingToken.IsCancellationRequested)\n            {\n                _logger.LogInformation(\n                  \"Worker running at: {time}\",\n                  DateTimeOffset.Now\n                  );\n              \n                await Task.Delay(1000,stoppingToken);\n            }\n        }\n    }\n}",
      "language": "csharp"
    }
  ]
}
[/block]