<!-- source: https://docs.rollbar.com/docs/telemetry-1.md -->

# .NET Telemetry

Capture extra events that preceded your payloads...

# What is the Telemetry?

The Rollbar.NET SDK provides a mechanism to collect (independently from its logger components) some additional runtime information "bread crumbs" in the form of Telemetry events and keeps them within the configurable fixed-depth Telemetry queue. It provides an API for capturing telemetry events within the queue so that whenever the Rollbar logger reports any data to Rollbar API the Telemetry events available in the Telemetry queue at the time of logging are automatically attached to the logger payload. This Telemetry data is intended to provide extra information about the events preceding the logging event that could be useful when analyzing the logging event itself.

Currently, Telemetry events are categorized by types. For example, network telemetry events, error telemetry events, manual telemetry events, etc.

The Telemetry functionality of the SDK can be configured either in code or via an application configuration file. It can be either enabled or disabled. It allows configuration of the Telemetry queue depth. It also allows the filtering of what telemetry types to be included (or not) into the collection. In addition, it allows you to specify if Telemetry data auto-capture (if possible) should be enabled or not (however, the auto-capture functionality yet to be finalized and implemented soon).

The Telemetry infrastructure is built around an application-wide service called `TelemetryCollector` that is implemented as a singleton. It provides API for configuring the Telemetry behavior, capturing Telemetry events as needed and “snapping” all the available captured telemetry events at any given time. The fixed depth `TelemetryQueue` is hosted internally by the `TelemetryCollector`.

# Configuration

## In Code

[block:code]
{
  "codes": [
    {
      "code": "/// <summary>\n/// Configures the rollbar telemetry.\n/// </summary>\nprivate static void ConfigureRollbarTelemetry()\n{\n  TelemetryConfig telemetryConfig = new TelemetryConfig(\n    telemetryEnabled: true,\n    telemetryQueueDepth: 3\n  );\n  TelemetryCollector.Instance.Config.Reconfigure(telemetryConfig);\n}\n",
      "language": "csharp"
    }
  ]
}
[/block]

## Via appsettings.json Application Configuration File

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/0010025-appsettings.json.png",
        "appsettings.json.png",
        525,
        851,
        "#23272a"
      ],
      "caption": ""
    }
  ]
}
[/block]

## Via app.config Application Configuration File

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/cb70f10-app.config.png",
        "app.config.png",
        890,
        539,
        "#232628"
      ]
    }
  ]
}
[/block]

# Capturing Telemetry Events Manually

[block:code]
{
  "codes": [
    {
      "code": "            TelemetryCollector.Instance.Capture(\n                new Telemetry(\n                    TelemetrySource.Client,\n                    TelemetryLevel.Info,\n                    new LogTelemetry(\"Something interesting happened.\")\n                    )\n                );\n\n            TelemetryCollector.Instance.Capture(\n                new Telemetry(\n                    TelemetrySource.Client,\n                    TelemetryLevel.Error,\n                    new ErrorTelemetry(new System.Exception(\"Worth mentioning!\"))\n                    )\n                );\n\n            TelemetryCollector.Instance.Capture(\n                new Telemetry(\n                    TelemetrySource.Client,\n                    TelemetryLevel.Error,\n                    new ManualTelemetry(new Dictionary<string, object>() { \n                { \"param1\", \"value1\" }, \n                { \"param2\", \"value2\" }, }\n              )\n                  )\n                );\n",
      "language": "csharp"
    }
  ]
}
[/block]