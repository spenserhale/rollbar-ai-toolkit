<!-- source: https://docs.rollbar.com/docs/v5-integrating-with-aspnet-web-forms-based-applications.md -->

# Integrating with ASP.NET Web Forms based Applications

# Working Sample

For the working sample, please look [here](https://github.com/rollbar/Rollbar.NET/blob/master/Samples/Sample.WebForms.Site.sln).

# Recommended Rollbar Modules/Packages

Whenever you are trying to integrate Rollbar.NET SDK into an existing WebForms application, the most optimal way is to do it via our [Rollbar.Net.AspNet.Mvc module](https://www.nuget.org/packages/Rollbar.Net.AspNet.Mvc/). It will also bring in the required dependencies that are Rollbar core module/package and Rollbar.Net.AspNet module/package:

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
      "code": "//...\nusing Rollbar;\n//...\n\npublic class Global : HttpApplication\n{\n  void Application_Start(object sender, EventArgs e)\n  {\n    ConfigureRollbar();\n\n    // Code that runs on application startup\n    RouteConfig.RegisterRoutes(RouteTable.Routes);\n    BundleConfig.RegisterBundles(BundleTable.Bundles);\n  }\n\n  /// <summary>\n  /// Handles the Error event on the Application level.\n  /// </summary>\n  /// <param name=\"sender\">The source of the event.</param>\n  /// <param name=\"e\">The <see cref=\"EventArgs\"/> instance containing the event data.</param>\n  void Application_Error(object sender, EventArgs e)\n  {\n    Exception exception = Server.GetLastError();\n\n    // Let's report to Rollbar on the Application/Global Level: \n    var metaData = new Dictionary<string, object>();\n    metaData.Add(\"reportLevel\", \"GlobalLevel\");\n    RollbarLocator.RollbarInstance.Error(exception, metaData);\n\n    if (exception is HttpUnhandledException)\n    {\n      // Pass the error on to the error page. \n      Server.Transfer(\"ErrorPage.aspx?handler=Application_Error%20-%20Global.asax\", true);\n    }\n  }\n\n  /// <summary>\n  /// Handles the Error event on the Page level.\n  /// </summary>\n  /// <param name=\"sender\">The source of the event.</param>\n  /// <param name=\"e\">The <see cref=\"EventArgs\"/> instance containing the event data.</param>\n  private void Page_Error(object sender, EventArgs e)\n  {\n    // Get last error from the server.\n    Exception exception = Server.GetLastError();\n\n    // Let's report to Rollbar on the Page Level:\n    var metaData = new Dictionary<string, object>();\n    metaData.Add(\"reportLevel\", \"PageLevel\");\n    RollbarLocator.RollbarInstance.Error(exception, metaData);\n\n    // Handle specific exception.\n    if(exception is InvalidOperationException)\n    {\n      // Pass the error on to the error page.\n      Server.Transfer(\n        \"ErrorPage.aspx?handler=Page_Error%20-%20Default.aspx\",\n        true\n      );\n    }\n  }\n  \n  /// <summary>\n  /// Configures the Rollbar singleton-like notifier.\n  /// </summary>\n  private void ConfigureRollbar()\n  {\n    RollbarInfrastructureConfig rollbarInfrastructureConfig = new RollbarInfrastructureConfig(\n      RollbarSamplesSettings.AccessToken,\n      RollbarSamplesSettings.Environment\n    );\n    RollbarInfrastructure.Instance.Init(rollbarInfrastructureConfig);\n\n    // optionally, if you would like to monitor Rollbar internal events within your application:\n    RollbarInfrastructure.Instance.QueueController.InternalEvent += OnRollbarInternalEvent;\n  }\n\n  private static void OnRollbarInternalEvent(object sender, RollbarEventArgs e)\n  {\n    Console.WriteLine(e.TraceAsString());\n\n    RollbarApiErrorEventArgs apiErrorEvent = e as RollbarApiErrorEventArgs;\n    if (apiErrorEvent != null)\n    {\n      //TODO: handle/report Rollbar API communication error event...\n      return;\n    }\n    CommunicationEventArgs commEvent = e as CommunicationEventArgs;\n    if (commEvent != null)\n    {\n      //TODO: handle/report Rollbar API communication event...\n      return;\n    }\n    CommunicationErrorEventArgs commErrorEvent = e as CommunicationErrorEventArgs;\n    if (commErrorEvent != null)\n    {\n      //TODO: handle/report basic communication error while attempting to reach Rollbar API service... \n      return;\n    }\n    InternalErrorEventArgs internalErrorEvent = e as InternalErrorEventArgs;\n    if (internalErrorEvent != null)\n    {\n      //TODO: handle/report basic internal error while using the Rollbar Notifier... \n      return;\n    }\n  }\n\n}\n",
      "language": "csharp"
    }
  ]
}
[/block]