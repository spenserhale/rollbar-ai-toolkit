<!-- source: https://docs.rollbar.com/docs/integrating-with-wpf-based-applications.md -->

# Integrating with WPF based Applications

It is optional to set the user for Rollbar, and this can be reset to a different user at any time. This example includes a default user being set with `MainWindow.xml` loads by calling the `SetRollbarReportingUser` function. Gist example code [here](https://gist.github.com/cdesch/e08275e85a3f27a7b1b481430e12f308).

In `App.cs`:

[block:code]
{
  "codes": [
    {
      "code": "namespace Sample\n{\n    /// <summary>\n    /// Interaction logic for App.xaml\n    /// </summary>\n    public partial class App \n      : Application\n    {\n        protected override void OnStartup(StartupEventArgs e)\n        {\n            base.OnStartup(e);\n            System.Diagnostics.Debug.WriteLine(\"App Start Up\");\n\n            //Initialize Rollbar\n            RollbarLocator.RollbarInstance.Configure(new RollbarConfig\n            {\n                AccessToken = \"POST_SERVER_ITEM_ACCESS_TOKEN\",\n                Environment = \"production\"          \n            });\n            // Setup Exception Handler\n            AppDomain.CurrentDomain.UnhandledException += (sender, args) =>\n            {\n                RollbarLocator.RollbarInstance.Error(\n                  args.ExceptionObject as System.Exception\n                );\n            };\n        }\n    }\n}",
      "language": "csharp"
    }
  ]
}
[/block]

In `MainWindow.cs`:

[block:code]
{
  "codes": [
    {
      "code": "namespace Sample\n{\n    /// <summary>\n    /// Interaction logic for MainWindow.xaml\n    /// </summary>\n    public partial class MainWindow \n      : Window\n    {\n        public MainWindow()\n        {\n            System.Diagnostics.Debug.Write(\"Starting MainWindow\");\n\n            InitializeComponent();\n\n            //Set Default User for RollbarReporting\n            //  -- Reset if user logs in \n            //     or wait to call SetRollbarReportingUser until user logs in. \n            SetRollbarReportingUser(\"id\", \"myEmail@example.com\", \"default\");\n        }\n\n        private void SetRollbarReportingUser(\n          string id, \n          string email, \n          string userName)\n        {\n            Person person = new Person(id);\n            person.Email = email;\n            person.UserName = userName;\n            RollbarLocator.RollbarInstance.Config.Person = person;\n        }\n    }\n}",
      "language": "csharp"
    }
  ]
}
[/block]