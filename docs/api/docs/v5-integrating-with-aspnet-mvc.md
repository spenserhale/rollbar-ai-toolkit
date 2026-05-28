<!-- source: https://docs.rollbar.com/docs/v5-integrating-with-aspnet-mvc.md -->

# Integrating with ASP.NET MVC

Creating an MVC error handler for the .NET SDK

# Working Sample

For the working sample, please look [here](https://github.com/rollbar/Rollbar.NET/blob/master/Samples/Sample.AspNet.Mvc.sln).

# Recommended Rollbar Modules/Packages

Whenever you are trying to integrate Rollbar.NET SDK into an existing ASP.NET MVC application, the most optimal way is to do it via our [Rollbar.Net.AspNet.Mvc module](https://www.nuget.org/packages/Rollbar.Net.AspNet.Mvc/). It will also bring in the required dependencies that are Rollbar core module/package and Rollbar.Net.AspNet module/package:

[block:code]
{
  "codes": [
    {
      "code": "dotnet add package Rollbar.Net.AspNet.Mvc",
      "language": "shell"
    }
  ]
}
[/block]

# Modify `Global.asax.cs`

[block:code]
{
  "codes": [
    {
      "code": "//...\nusing Rollbar;\nusing Rollbar.Net.AspNet;\n//..\n\npublic class MvcApplication : System.Web.HttpApplication\n{\n  protected void Application_Start()\n  {\n    ConfigureRollbarInfrastructure();\n    RollbarLocator.RollbarInstance.Info(\"Rollbar.NET is ready to roll!\");\n\n\n    AreaRegistration.RegisterAllAreas();\n    FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);\n    RouteConfig.RegisterRoutes(RouteTable.Routes);\n    BundleConfig.RegisterBundles(BundleTable.Bundles);\n  }\n\n  protected void Application_Error()\n  {\n    var exception = Server.GetLastError();\n    var httpContext = HttpContext.Current;\n    IRollbarPackage packagingStrategy = \n      new ExceptionPackage(\n      \texception, \n      \t\"EXCEPTION intercepted by MvcApplication.Application_Error()\"\n    );\n    \n    if (httpContext != null)\n    {\n      packagingStrategy = \n        new HttpContextPackageDecorator(packagingStrategy, httpContext);\n    }\n    \n    RollbarLocator.RollbarInstance.Critical(packagingStrategy);\n  }\n\n\n  /// <summary>\n  /// Configures the Rollbar infrastructure.\n  /// </summary>\n  private static void ConfigureRollbarInfrastructure()\n  {\n    // minimally required Rollbar configuration:\n    RollbarInfrastructureConfig rollbarInfrastructureConfig = \n      new RollbarInfrastructureConfig(\n        RollbarSamplesSettings.AccessToken, \n        RollbarSamplesSettings.Environment\n    );\n    // optionally, add data scrubbing options:\n    RollbarDataSecurityOptions dataSecurityOptions = \n      new RollbarDataSecurityOptions();\n    dataSecurityOptions.ScrubFields = new string[]\n    {\n      \"access_token\", // normally, you do not want scrub this specific field (it is operationally critical), but it just proves safety net built into the notifier... \n      \"username\",\n    };\n    rollbarInfrastructureConfig\n      .RollbarLoggerConfig\n      .RollbarDataSecurityOptions\n      .Reconfigure(dataSecurityOptions);\n\n    // initialize Rollbar infrastructure:\n    RollbarInfrastructure.Instance.Init(rollbarInfrastructureConfig);\n\n    // optionally, if you would like to monitor all Rollbar instances' internal events within your application:\n    RollbarInfrastructure.Instance.QueueController.InternalEvent += \n      OnRollbarInternalEvent;\n\n    // optionally, if you would like to monitor this Rollbar instance's internal events within your application:\n    RollbarLocator.RollbarInstance.InternalEvent += \n      OnRollbarInternalEvent;\n\n    // basic test:\n    RollbarLocator\n      .RollbarInstance\n      .Info($\"{typeof(MvcApplication).Namespace}: Rollbar is up and running!\");\n  }\n\n  /// <summary>\n  /// Called when rollbar internal event is detected.\n  /// </summary>\n  /// <param name=\"sender\">The sender.</param>\n  /// <param name=\"e\">The <see cref=\"RollbarEventArgs\"/> instance containing the event data.</param>\n  private static void OnRollbarInternalEvent(object sender, RollbarEventArgs e)\n  {\n    Console.WriteLine(e.TraceAsString());\n\n    RollbarApiErrorEventArgs apiErrorEvent = e as RollbarApiErrorEventArgs;\n    if (apiErrorEvent != null)\n    {\n      //TODO: handle/report Rollbar API communication error event...\n      return;\n    }\n    CommunicationEventArgs commEvent = e as CommunicationEventArgs;\n    if (commEvent != null)\n    {\n      //TODO: handle/report Rollbar API communication event...\n      return;\n    }\n    CommunicationErrorEventArgs commErrorEvent = e as CommunicationErrorEventArgs;\n    if (commErrorEvent != null)\n    {\n      //TODO: handle/report basic communication error while attempting to reach Rollbar API service... \n      return;\n    }\n    InternalErrorEventArgs internalErrorEvent = e as InternalErrorEventArgs;\n    if (internalErrorEvent != null)\n    {\n      //TODO: handle/report basic internal error while using the Rollbar Notifier... \n      return;\n    }\n  }\n\n}\n",
      "language": "csharp"
    }
  ]
}
[/block]

# Modify `App_Start\FilterConfig.cs`

[block:code]
{
  "codes": [
    {
      "code": "//...\nusing Rollbar.Net.AspNet.Mvc;\n//...\n\npublic class FilterConfig\n{\n  public static void RegisterGlobalFilters(GlobalFilterCollection filters)\n  {\n    filters.Add(new HandleErrorAttribute());\n    filters.Add(new RollbarExceptionFilter(\n      \"SOURCE: Sample.AspNet.MvcApp's RollbarExceptionFilter\"\n    ));\n  }\n}\n",
      "language": "csharp"
    }
  ]
}
[/block]