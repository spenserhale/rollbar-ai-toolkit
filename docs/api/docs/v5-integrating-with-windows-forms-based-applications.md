<!-- source: https://docs.rollbar.com/docs/v5-integrating-with-windows-forms-based-applications.md -->

# Integrating with Windows Forms based Applications

# Working Sample

For the working sample, please look [here](https://github.com/rollbar/Rollbar.NET/blob/master/Samples/Sample.WindowsForms.sln).

# Recommended Rollbar Modules/Packages

Whenever you are trying to integrate Rollbar.NET SDK into an existing Windows Forms-based application, the most optimal way is to do it via our [`Rollbar` module](https://www.nuget.org/packages/Rollbar/). Optionally, you may want to also use other modules/packages of the SDK: `Rollbar.App.Config` and `Rollbar.OfflinePersistence`:

[block:code]
{
  "codes": [
    {
      "code": "dotnet add package Rollbar\n\n// optionally:\ndotnet add package Rollbar.App.Config\ndotnet add package Rollbar.OfflinePersistence",
      "language": "shell"
    }
  ]
}
[/block]

# Modify `Program.cs`:

[block:code]
{
  "codes": [
    {
      "code": "//...\nusing Rollbar;\nusing Rollbar.DTOs;\n//...\n\n[STAThread]\nstatic void Main()\n{\n  // Setup the Rollbar Notifier:\n  ConfigureRollbar();\n\n  // Let's log this:\n  RollbarLocator.RollbarInstance.Info(\n    \"WindowsFormsApp sample: Rollbar.NET is ready to roll...\"\n  );\n\n  // Add the event handler for handling UI thread exceptions to the event:\n  Application.ThreadException += Application_ThreadException;\n\n  // Set the unhandled exception mode to force all Windows Forms errors \n  // to go through our handler:\n  Application.SetUnhandledExceptionMode(UnhandledExceptionMode.CatchException);\n\n  // Add the event handler for handling non-UI thread exceptions to the event:\n  AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;\n\n  \n  Application.EnableVisualStyles();\n  Application.SetCompatibleTextRenderingDefault(false);\n  Application.Run(new Form1());\n}\n\nprivate static void CurrentDomain_UnhandledException(\n  object sender, \n  UnhandledExceptionEventArgs e\n)\n{\n  RollbarLocator\n    .RollbarInstance\n    .AsBlockingLogger(TimeSpan.FromSeconds(3))\n    .Critical(e.ExceptionObject);\n}\n\nprivate static void Application_ThreadException(\n  object sender, \n  System.Threading.ThreadExceptionEventArgs e\n)\n{\n  RollbarLocator\n    .RollbarInstance\n    .AsBlockingLogger(TimeSpan.FromSeconds(3))\n    .Critical(e.Exception);\n}\n\nprivate static void ConfigureRollbar()\n{\n  // create valid Rollbar configuration:\n  RollbarInfrastructureConfig rollbarInfrastructureConfig = \n    new RollbarInfrastructureConfig(\n      RollbarSamplesSettings.AccessToken,\n      RollbarSamplesSettings.Environment\n    );\n\n  // optionally;\n  RollbarDataSecurityOptions dataSecurityOptions = \n    new RollbarDataSecurityOptions();\n  dataSecurityOptions.ScrubFields = new string[]\n  {\n    \"access_token\", // normally, you do not want scrub this specific field (it is operationally critical), but it just proves safety net built into the notifier... \n    \"username\",\n  };\n  rollbarInfrastructureConfig\n    .RollbarLoggerConfig\n    .RollbarDataSecurityOptions\n    .Reconfigure(dataSecurityOptions);\n\n  // optionally;\n  RollbarPayloadAdditionOptions payloadAdditionOptions = \n    new RollbarPayloadAdditionOptions();\n  payloadAdditionOptions.Person = new Person(\"007\") \n  { \n    Email = \"jbond@mi6.uk\", \n    UserName = \"JBOND\" \n    };\n  rollbarInfrastructureConfig\n    .RollbarLoggerConfig\n    .RollbarPayloadAdditionOptions\n    .Reconfigure(payloadAdditionOptions);\n\n  RollbarInfrastructure.Instance.Init(rollbarInfrastructureConfig);\n\n  // optionally, monitor Rollbar internal events:\n  RollbarInfrastructure\n    .Instance\n    .QueueController\n    .InternalEvent += OnRollbarInternalEvent;\n}\n\nprivate static void OnRollbarInternalEvent(object sender, RollbarEventArgs e)\n{\n  Console.WriteLine(e.TraceAsString());\n\n  RollbarApiErrorEventArgs apiErrorEvent = e as RollbarApiErrorEventArgs;\n  if (apiErrorEvent != null)\n  {\n    //TODO: handle/report Rollbar API communication error event...\n    return;\n  }\n  CommunicationEventArgs commEvent = e as CommunicationEventArgs;\n  if (commEvent != null)\n  {\n    //TODO: handle/report Rollbar API communication event...\n    return;\n  }\n  CommunicationErrorEventArgs commErrorEvent = e as CommunicationErrorEventArgs;\n  if (commErrorEvent != null)\n  {\n    //TODO: handle/report basic communication error while attempting to reach Rollbar API service... \n    return;\n  }\n  InternalErrorEventArgs internalErrorEvent = e as InternalErrorEventArgs;\n  if (internalErrorEvent != null)\n  {\n    //TODO: handle/report basic internal error while using the Rollbar Notifier... \n    return;\n  }\n}\n",
      "language": "csharp"
    }
  ]
}
[/block]