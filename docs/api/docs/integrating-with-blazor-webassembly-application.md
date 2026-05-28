<!-- source: https://docs.rollbar.com/docs/integrating-with-blazor-webassembly-application.md -->

# Integrating with Blazor Webassembly application

Use Rollbar from within a Blazor Client

# Working Sample

For the working sample, please look [here](https://github.com/rollbar/Rollbar.NET/blob/master/Samples/Sample.Blazor.WebAssembly.sln).

# Recommended Rollbar Modules/Packages

Whenever you are trying to integrate Rollbar.NET SDK into an existing Blazor Webassembly based application, the most optimal way is to do it via our [Rollbar.NetPlatformExtensions module](https://www.nuget.org/packages/Rollbar.NetPlatformExtensions/). It will also bring in the required dependency that is Rollbar core module/package:

[block:code]
{
  "codes": [
    {
      "code": "dotnet add package Rollbar.NetPlatformExtensions",
      "language": "shell"
    }
  ]
}
[/block]

# Integrating Rollbar Within Blazor's Built-In Logging Infrastructure

Modify `Program.cs` file like so (all 3 steps):

[block:code]
{
  "codes": [
    {
      "code": "namespace Sample.Blazor.WebAssembly\n{\n    using System;\n    using System.Collections.Generic;\n    using System.Net.Http;\n    using System.Text;\n    using System.Threading.Tasks;\n\n    using Microsoft.AspNetCore.Components.WebAssembly.Hosting;\n    using Microsoft.Extensions.Configuration;\n    using Microsoft.Extensions.DependencyInjection;\n    using Microsoft.Extensions.Logging;\n\n    using Rollbar;\n    using Rollbar.NetPlatformExtensions;\n\n    using Samples;\n\n    public class Program\n    {\n        public static async Task Main(string[] args)\n        {\n          \t// STEP.1 - Create a valid Rollbar logger configuration:\n            RollbarLoggerConfig rollbarConfig = new RollbarLoggerConfig(\n                RollbarSamplesSettings.AccessToken, \n                RollbarSamplesSettings.Environment\n                );\n\n            var builder = WebAssemblyHostBuilder.CreateDefault(args);\n\n            builder.RootComponents.Add<App>(\"#app\");\n\n            builder.Services.AddScoped(sp => \n            \t\tnew HttpClient { \n                  BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) \n                });\n\n            builder.Services.AddLogging(configure =>\n                configure\n                // STEP.2 - Add desired logging filter:\n                .AddFilter(levelFilter => levelFilter >= LogLevel.Information)\n                // STEP.3 - Add properly configured Rollbar logger provider:\n                .AddProvider(new RollbarLoggerProvider(rollbarConfig))\n            );\n\n            await builder.Build().RunAsync();\n        }\n\n    }\n}",
      "language": "csharp"
    }
  ]
}
[/block]

At this point, assuming the provider was properly configured and a Rollbar Project with the specified Access Token was established on Rollbar.com, you should start seeing log items appearing on your Rollbar project's Items page after you rebuild and deploy your application with the changes above. Because any use of the built-in Blazor logging API will also take advantage of the newly added Rollbar logger provider.

If by any chance you still do not see the items coming to the Rollbar project, make sure the specified Access Token is correct and the Items page has proper view filters configured, like projects, environments, frameworks, date range, show-only, levels, status, owners, etc.

If that did not help, try changing the logging filter to:

[block:code]
{
  "codes": [
    {
      "code": "                // STEP.2 - Add desired logging filter:\n                .AddFilter(levelFilter => levelFilter >= LogLevel.Trace)\n",
      "language": "csharp"
    }
  ]
}
[/block]

# Using Rollbar Directly Anywhere Within the Application Code

As always you still have an option of calling Rollbar loggers directly/manually anywhere in your code, for example:

[block:code]
{
  "codes": [
    {
      "code": "RollbarLoggerConfig config =\n  new RollbarLoggerConfig(\n    RollbarSamplesSettings.AccessToken,\n    RollbarSamplesSettings.Environment\n);\n\nusing(IRollbar logger = RollbarFactory.CreateNew(config))\n{\n  logger.Info(\"Direct use of Rollbar: Hello from Blazor WASM!!!\");\n\n  var criticalObj = new InstanceType();\n\tcriticalObj.AutoProperty = -100;\n  \n  try\n  {\n    CallSomeTrouble();\n  }\n  catch(Exception ex)\n  {\n    string error = ex.Message;\n    var customData = new Dictionary<string, object>();\n    customData.Add(\"RollbarUsage\", \"Direct use of Rollbar\");\n    customData.Add(\"Error\", error);\n    customData.Add(\"CurrentCount\", currentCount);\n    \n    // capture state of some other critical object:\n    var state = RollbarAssistant.CaptureState(criticalObj, nameof(criticalObj));\n    customData.Add(\"capturedState\", state);\n\n    logger.Error(ex, customData);\n  }\n}\n",
      "language": "csharp"
    }
  ]
}
[/block]

Enjoy rolling your code quality bar up even higher!