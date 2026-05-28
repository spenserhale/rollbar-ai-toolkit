<!-- source: https://docs.rollbar.com/docs/v5-integrating-with-aspnet-core-2-and-newer.md -->

# Integrating with ASP.NET Core Application

# Working Sample

For the working sample, please look [here](https://github.com/rollbar/Rollbar.NET/blob/master/Samples/Sample.AspNetCore.WebApp.sln).

# Recommended Rollbar Modules/Packages

Whenever you are trying to integrate Rollbar.NET SDK into an existing ASP.NET Core Web App application, the most optimal way is to do it via our [Rollbar.NetCore.AspNet module](https://www.nuget.org/packages/Rollbar.NetCore.AspNet/). It will also bring in the required dependencies that are Rollbar core module/package and Rollbar.NetPlatformExtensions module/package:

[block:code]
{
  "codes": [
    {
      "code": "dotnet add package Rollbar.NetCore.AspNet",
      "language": "shell"
    }
  ]
}
[/block]

# Integrating Rollbar Within Asp.Net Core Built-In Logging Infrastructure and Using the Rollbar Middleware

Modify `Startup.cs` file like so (all 4 steps):

[block:code]
{
  "codes": [
    {
      "code": "//...\nusing Microsoft.AspNetCore.Http;\nusing Microsoft.Extensions.Logging;\n\nusing Rollbar;\nusing Rollbar.NetCore.AspNet;\n//...\n\npublic class Startup\n{\n\t//...\n  \n  public void ConfigureServices(IServiceCollection services)\n  {\n    // STEP.1 - enable Http Context Accessor:\n    services.AddHttpContextAccessor();\n\n    // STEP.2 - Setup Rollbar Infrastructure:\n    ConfigureRollbarInfrastructure();\n\n    // STEP.3 - Add Rollbar logger with properly configured log level filter:\n    services.AddRollbarLogger(loggerOptions =>\n    {\n    \tloggerOptions.Filter =\n      \t(loggerName, loglevel) => loglevel >= LogLevel.Trace;\n    });\n\n    services.AddRazorPages();\n  }\n\n  public void Configure(IApplicationBuilder app, IWebHostEnvironment env)\n  {\n    if(env.IsDevelopment())\n    {\n      app.UseDeveloperExceptionPage();\n    }\n    else\n    {\n      app.UseExceptionHandler(\"/Error\");\n      // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.\n      app.UseHsts();\n    }\n\n    // STEP.4 - Use Rollbar middleware:\n    app.UseRollbarMiddleware();\n    // Any other middleware component intended to be \"monitored\" by Rollbar middleware\n    // go below this line:\n\n    app.UseHttpsRedirection();\n    app.UseStaticFiles();\n\n    app.UseRouting();\n\n    app.UseAuthorization();\n\n    app.UseEndpoints(endpoints =>\n                     {\n                       endpoints.MapRazorPages();\n                     });\n  }\n  \n  \n  // STEP.2 - Setup Rollbar Infrastructure:\n  private void ConfigureRollbarInfrastructure()\n  {\n    RollbarInfrastructureConfig config = new RollbarInfrastructureConfig(\n      RollbarSamplesSettings.AccessToken,\n      RollbarSamplesSettings.Environment\n    );\n    RollbarDataSecurityOptions dataSecurityOptions = new RollbarDataSecurityOptions();\n    dataSecurityOptions.ScrubFields = new string[]\n    {\n      \"url\",\n      \"method\",\n    };\n    config.RollbarLoggerConfig.RollbarDataSecurityOptions.Reconfigure(dataSecurityOptions);\n\n    RollbarInfrastructure.Instance.Init(config);\n\n    // Optionally:\n    RollbarInfrastructure.Instance.QueueController.InternalEvent += OnRollbarInternalEvent;\n  }\n\n  // STEP.2 - Setup Rollbar Infrastructure:\n  private static void OnRollbarInternalEvent(object sender, RollbarEventArgs e)\n  {\n    Console.WriteLine(e.TraceAsString());\n\n    switch (e)\n    {\n      case RollbarApiErrorEventArgs apiErrorEvent:\n        //TODO: handle/report Rollbar API communication event...\n        return;\n      case CommunicationEventArgs commEvent:\n        //TODO: handle/report basic communication error while attempting to reach Rollbar API service... \n        return;\n      case CommunicationErrorEventArgs commErrorEvent:\n        //TODO: handle/report basic internal error while using the Rollbar Notifier... \n        return;\n      case InternalErrorEventArgs internalErrorEvent:\n        //TODO: handle/report Rollbar API communication error event...\n     return;\n    }\n\n  }  \n\n}",
      "language": "csharp"
    }
  ]
}
[/block]