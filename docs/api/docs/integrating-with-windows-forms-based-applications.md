<!-- source: https://docs.rollbar.com/docs/integrating-with-windows-forms-based-applications.md -->

# Integrating with Windows Forms based Applications

To use inside a Windows Forms Application, do the following inside your main method:

[block:code]
{
  "codes": [
    {
      "code": "[STAThread]\nstatic void Main()\n{\n    RollbarLocator.RollbarInstance.Configure(new RollbarConfig\n    {\n        AccessToken = \"POST_SERVER_ITEM_ACCESS_TOKEN\",\n        Environment = \"production\"\n    });\n    Application.EnableVisualStyles();\n    Application.SetCompatibleTextRenderingDefault(false);\n\n    Application.ThreadException += (sender, args) =>\n    {\n        RollbarLocator.RollbarInstance.Error(args.Exception);\n    };\n\n    AppDomain.CurrentDomain.UnhandledException += (sender, args) =>\n    {\n        RollbarLocator.RollbarInstance.Error(\n          args.ExceptionObject as System.Exception\n        );\n    };\n    \n    TaskScheduler.UnobservedTaskException += (sender, args) =>\n    {\n        RollbarLocator.RollbarInstance.Error(args.Exception);\n    };\n\n    Application.Run(new Form1());\n}",
      "language": "csharp"
    }
  ]
}
[/block]