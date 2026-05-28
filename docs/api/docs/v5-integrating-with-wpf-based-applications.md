<!-- source: https://docs.rollbar.com/docs/v5-integrating-with-wpf-based-applications.md -->

# Integrating with WPF based Applications

# Working Sample

For the working sample, please look [here](https://github.com/rollbar/Rollbar.NET/blob/master/Samples/Sample.WPF.sln).

# Recommended Rollbar Modules/Packages

Whenever you are trying to integrate Rollbar.NET SDK into an existing WPF-based application, the most optimal way is to do it via our [`Rollbar` module](https://www.nuget.org/packages/Rollbar/). Optionally, you may want to also use other modules/packages of the SDK: `Rollbar.App.Config` and `Rollbar.OfflinePersistence`:

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

# Modify `App.xaml.cs`

[block:code]
{
  "codes": [
    {
      "code": "namespace Sample\n{\n  \t//...\n    using Rollbar;\n    using Rollbar.DTOs;\n\n    /// <summary>\n    /// Interaction logic for App.xaml\n    /// </summary>\n    public partial class App \n      : Application\n    {\n        protected override void OnStartup(StartupEventArgs e)\n        {\n          // Setup the Rollbar:\n          ConfigureRollbar();\n          \n          // Let's log this:\n          RollbarLocator.RollbarInstance.Info(\n            \"WpfApp sample: Rollbar.NET is ready to roll...\"\n          );\n          \n          // Add the event handler for the application unhandled exceptions:\n          base.DispatcherUnhandledException += \n            App_DispatcherUnhandledException;\n\n          // Add the event handler for handling non-UI thread exceptions: \n          AppDomain.CurrentDomain.UnhandledException += \n            CurrentDomain_UnhandledException;\n\n          base.OnStartup(e);\n        }\n        \n        private void App_DispatcherUnhandledException(\n          object sender, \n          DispatcherUnhandledExceptionEventArgs e\n        )\n        {\n            ReportAsCriticalToRollbar(e.Exception);\n            e.Handled = true;\n        }\n\n        private void CurrentDomain_UnhandledException(\n          object sender, \n          UnhandledExceptionEventArgs e\n        )\n        {\n            ReportAsCriticalToRollbar(e.ExceptionObject);\n        }\n\n                private void ReportAsCriticalToRollbar(object data)\n        {\n            TimeSpan rollbarDeliveryTimeout = TimeSpan.FromSeconds(3);\n            RollbarLocator.RollbarInstance.AsBlockingLogger(rollbarDeliveryTimeout).Critical(data);\n        }\n\n        private static void ConfigureRollbar()\n        {\n          \t// create valid Rollbar configuration:\n            RollbarInfrastructureConfig rollbarInfrastructureConfig = \n              new RollbarInfrastructureConfig(\n                RollbarSamplesSettings.AccessToken,\n                RollbarSamplesSettings.Environment\n              );\n\t\t\t\n          \t// optionally:\n            RollbarDataSecurityOptions dataSecurityOptions = \n              new RollbarDataSecurityOptions();\n            dataSecurityOptions.ScrubFields = new string[]\n            {\n                \"access_token\", // normally, you do not want scrub this specific field (it is operationally critical), but it just proves safety net built into the notifier... \n                \"username\",\n            };\n            rollbarInfrastructureConfig\n              .RollbarLoggerConfig\n              .RollbarDataSecurityOptions\n              .Reconfigure(dataSecurityOptions);\n\n          \t// optionally:\n            RollbarPayloadAdditionOptions payloadAdditionOptions = \n              new RollbarPayloadAdditionOptions();\n            payloadAdditionOptions.Person = new Person(\"007\")\n            {\n                Email = \"jbond@mi6.uk\",\n                UserName = \"JBOND\"\n            };\n            rollbarInfrastructureConfig\n              .RollbarLoggerConfig\n              .RollbarPayloadAdditionOptions\n              .Reconfigure(payloadAdditionOptions);\n\n          \t// initialize Rollbar infrastructure:\n            RollbarInfrastructure\n              .Instance\n              .Init(rollbarInfrastructureConfig);\n\n            // optionally, monitor this Rollbar internal events:\n            RollbarInfrastructure\n              .Instance\n              .QueueController\n              .InternalEvent += OnRollbarInternalEvent;\n        }\n\n        private static void OnRollbarInternalEvent(\n          object sender, \n          RollbarEventArgs e\n        )\n        {\n            Console.WriteLine(e.TraceAsString());\n\n            RollbarApiErrorEventArgs apiErrorEvent = e as RollbarApiErrorEventArgs;\n            if (apiErrorEvent != null)\n            {\n                //TODO: handle/report Rollbar API communication error event...\n                return;\n            }\n            CommunicationEventArgs commEvent = e as CommunicationEventArgs;\n            if (commEvent != null)\n            {\n                //TODO: handle/report Rollbar API communication event...\n                return;\n            }\n            CommunicationErrorEventArgs commErrorEvent = e as CommunicationErrorEventArgs;\n            if (commErrorEvent != null)\n            {\n                //TODO: handle/report basic communication error while attempting to reach Rollbar API service... \n                return;\n            }\n            InternalErrorEventArgs internalErrorEvent = e as InternalErrorEventArgs;\n            if (internalErrorEvent != null)\n            {\n                //TODO: handle/report basic internal error while using the Rollbar Notifier... \n                return;\n            }\n        }\n\n    }\n}",
      "language": "csharp"
    }
  ]
}
[/block]