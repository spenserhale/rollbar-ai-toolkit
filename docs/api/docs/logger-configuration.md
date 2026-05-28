<!-- source: https://docs.rollbar.com/docs/logger-configuration.md -->

# Logger Configuration

Configure its behavior as you wish.

# Overview

The `RollbarConfig` object allows you to configure a `RollbarLogger`.

An instance of the `RollbarConfig` could be created and tuned directly in code and then used to either initialize or reconfigure an instance of the `RollbarLogger`.

Alternatively, if your application is already using:

1. either `app.config` or `web.config` files
2. or an `appsettings.json` file
   you can add an optional Rollbar configuration section to either of the files.
   The SDK will auto-pickup the settings assuming a proper optional SDK package/module is referenced by the application. For alternative #1 above, reference the `Rollbar.App.Config` module. For alternative #2, reference the `Rollbar.AppSettings.Json` module.

For more flexibility when manually loading an SDK configuration from the supported application configuration files, take a look at the following types in modules:

## Rollbar module:

```
- `Rollbar.NetStandard.IRollbarConfigurationLoader`
- `Rollbar.NetStandard.RollbarConfigurationLoader`
```

## Rollbar.App.Config module:

```
- `Rollbar.App.Config.AppConfigUtility`
- `Rollbar.App.Config.RollbarConfigurationLoader`
```

## Rollbar.AppSettings.Json module:

```
- `Rollbar.AppSettings.Json.AppSettingsUtility`
- `Rollbar.AppSettings.Json.RollbarConfigurationLoader`
```

# Sample `web.config` or `app.config` Configuration

1. Add references to the Rollbar.App.Config SDK module (or add its Nuget package to the application project).
2. Add references to the Rollbar SDK module (or add its Nuget package to the application project).
3. Make sure the application references `System.Configuration.ConfigurationManager` Nuget package.
4. Update the web.config/app.config file of the application with the Rollbar relevant settings like so:

[block:code]
{
  "codes": [
    {
      "code": "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<configuration>\n  <configSections>\n    <section name=\"rollbar\" type=\"Rollbar.NetFramework.RollbarConfigSection, Rollbar\"/>\n    <section name=\"rollbarTelemetry\" type=\"Rollbar.NetFramework.RollbarTelemetryConfigSection, Rollbar\"/>\n  </configSections>\n\n  <rollbar\n    accessToken=\"17965fa5041749b6bf7095a190001ded\"\n    environment=\"unit-tests\"\n    enabled=\"true\"\n    scrubFields=\"ThePassword, Secret\"\n    scrubWhitelistFields=\"ThePassword\"\n    logLevel=\"Info\"\n    maxReportsPerMinute=\"160\"\n    reportingQueueDepth=\"120\"\n    personDataCollectionPolicies=\"Username, Email\"\n    ipAddressCollectionPolicy=\"CollectAnonymized\"\n    />\n\n  <rollbarTelemetry\n    telemetryEnabled=\"true\"\n    telemetryQueueDepth=\"100\"\n    telemetryAutoCollectionTypes=\"Network, Log, Error\"\n    telemetryAutoCollectionInterval=\"00:00:00.3000000\"\n    />\n\n</configuration>",
      "language": "xml"
    }
  ]
}
[/block]

# Sample `appsettings.json` Configuration

1. From the console application project, reference the Rollbar.AppSettings.Json SDK module (or its Nuget package).
2. Make sure your application project also references:

* Microsoft.Extensions.Configuration.Abstractions,
* Microsoft.Extensions.Configuration,
* Microsoft.Extensions.Configuration.Binder,
* Microsoft.Extensions.Configuration.Json,
* Microsoft.Extensions.Configuration.FileExtensions.

3. Add Rollbar SDK specific settings to the application appsettings.json file like so:

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"Logging\": {\n    \"IncludeScopes\": false,\n    \"Debug\": {\n      \"LogLevel\": {\n        \"Default\": \"Warning\"\n      }\n    },\n    \"Console\": {\n      \"LogLevel\": {\n        \"Default\": \"Warning\"\n      }\n    }\n  },\n\n  \"Rollbar\": {\n    \"AccessToken\": \"17965fa5041749b6bf7095a190001ded\",\n    \"Environment\": \"unit-tests\",\n    \"Enabled\": true,\n    \"MaxReportsPerMinute\": 160,\n    \"ReportingQueueDepth\": 120,\n    \"LogLevel\": \"Info\",\n    \"ScrubFields\": [\n      \"ThePassword\",\n      \"TheSecret\"\n    ],\n    \"Person\": {\n      \"UserName\": \"jbond\"\n\n    },\n    \"PersonDataCollectionPolicies\": \"Username, Email\",\n    \"IpAddressCollectionPolicy\": \"CollectAnonymized\"\n  },\n\n  \"RollbarTelemetry\": {\n    \"TelemetryEnabled\": true,\n    \"TelemetryQueueDepth\": 100,\n    \"TelemetryAutoCollectionTypes\": \"Network, Log, Error\",\n    \"TelemetryAutoCollectionInterval\": \"00:00:00.3000000\"\n  }\n\n}\n",
      "language": "json"
    }
  ]
}
[/block]

# Configurational Settings Reference

* **AccessToken**
  The access token for your project allows you access to the Rollbar API
* **Endpoint**
  The Rollbar API endpoint. Default: <https://api.rollbar.com/api/1/>
* **Environment**
  Environment name, e.g. `"production"` or `"development"`, defaults to `"production"`
* **Enabled**
  If set to false, errors will not be sent to Rollbar, defaults to `true`
* **LogLevel**
  The least significant error level from which to start sending the messages to Rollbar. Here is the complete list of the error levels from the least significant one to the most significant one: debug, info, warning, error, critical.
* **LocalPayloadStoreFileName**
  The name of the local payload store file. Default: RollbarPayloadsStore.db.
* **LocalPayloadStoreLocationPath**
  The local payload store location path. Default: varies depending on the hosting environment.
* **Transform**
  It allows you to specify a transformation function to modify the payload before it is sent to Rollbar. Use this function, for example, to add any value that is in [Request.cs](https://github.com/rollbar/Rollbar.NET/blob/master/Rollbar/DTOs/Request.cs), such as the user's IP address, query-string, and URL of the request.

[block:code]
{
  "codes": [
    {
      "code": "new RollbarConfig\n{\n    Transform = payload =>\n    {\n        payload.Data.Person = new Person\n        {\n            Id = 123,\n            UserName = \"rollbar\",\n            Email = \"user@rollbar.com\"\n        };\n        payload.Data.CodeVersion = \"2\";\n        payload.Data.Request = new Request()\n        {\n            Url = \"http://rollbar.com\",\n            UserIp = \"192.121.222.92\"\n        };\n    }\n}",
      "language": "csharp"
    }
  ]
}
[/block]

* **ProxyAddress**
  A URI string which will be used as the WebClient proxy passed to the WebProxy constructor.
* **ProxyUsername**
  A string specifying web proxy's username to use (if any).
* **ProxyPassword**
  A string specifying web proxy's password to use (if any).
* **PayloadPostTimeout**
  Specifies how long you are willing to wait before giving up while trying to POST a payload in poor network conditions. It is a small but useful optimization setting.
* **CheckIgnore**
  Function called before sending a payload to Rollbar. Return `true` to stop the error from being sent to Rollbar.
* **Truncate**
  Truncates the payload before sending it to Rollbar.
* **Server**
  An object with the following properties: `Host`, `Root`, `Branch`, and `CodeVersion`.
* **Person**
  You can set the current person data like this:

[block:code]
{
  "codes": [
    {
      "code": "private void SetRollbarReportingUser(string id, string email, string userName)\n{\n  Person person = new Person(id);\n  person.Email = email;\n  person.UserName = userName;\n  RollbarLocator.RollbarInstance.Config.Person = person;\n}",
      "language": "csharp"
    }
  ]
}
[/block]

and this person will be attached to all future Rollbar calls.

* **PersonDataCollectionPolicies**
  Allows to explicitly specify Person's data auto-collection policy flags. Supported values are None, Username, Email. Multiple policies can be combined (they are not mutually exclusive). Note: when combined, any other value takes priority over None even if None is explicitly mentioned. Default value is None.
* **IpAddressCollectionPolicy**
  Allows to explicitly specify User IP address auto-collection policy. Supported values are Collect, CollectAnonymized (a portion of the IP address is masked out), DoNotCollect. These values are mutually exclusive. Default value is Collect.
* **MaxReportsPerMinute**
  The maximum reports sent to Rollbar per minute, as an integer.
* **ReportingQueueDepth**
  The reporting queue depth, as an integer. The reporting queue depth can be used to limit error report bursts when connectivity to the Rollbar API server is poor.
* **ScrubFields**
  Array of field names to scrub out of `_POST` and `_SESSION`. Values will be replaced with asterisks. If overriding, make sure to list all fields you want to scrub, not just fields you want to add to the default. Param names are case-sensitive when comparing against the scrub list. Default: `{'passwd', 'password', 'secret', 'confirm_password', 'password_confirmation'}`

[block:code]
{
  "codes": [
    {
      "code": "var config = new RollbarConfig(rollbarAccessToken) // minimally required Rollbar configuration\n{\n  Environment = rollbarEnvironment,\n  ScrubFields = new string[]\n  { \n    \"password\",\n    \"username\",\n  }\n};",
      "language": "csharp"
    }
  ]
}
[/block]

* **ScrubWhitelistFields**
  The fields mentioned in this list are guaranteed to be excluded from the ScrubFields list in cases when the lists overlap.