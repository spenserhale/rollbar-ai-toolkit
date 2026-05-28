<!-- source: https://docs.rollbar.com/docs/v5-integrating-with-xamarin.md -->

# Integrating with Xamarin Forms Application

Xamarin Forms error handling for the .NET SDK

# Working Sample

For the working sample, please look [here](https://github.com/rollbar/Rollbar.NET/blob/master/Samples/Sample.Xamarin.Forms.sln).

# Recommended Rollbar Modules/Packages

Whenever you are trying to integrate Rollbar.NET SDK into an existing Xamarin-based application, the most optimal way is to do it via our [`Rollbar` module](https://www.nuget.org/packages/Rollbar/). Optionally, you may want to also use other modules/packages of the SDK: `Rollbar.App.Config` or `Rollbar.AppSettings.Json` and `Rollbar.OfflinePersistence`:

[block:code]
{
  "codes": [
    {
      "code": "dotnet add package Rollbar\n\n// optionally:\ndotnet add package Rollbar.App.Config\ndotnet add package Rollbar.AppSettings.Json\ndotnet add package Rollbar.OfflinePersistence",
      "language": "shell"
    }
  ]
}
[/block]

# Modify your Xamarin Forms Shared Project

Add `RollbarHelper.cs` using the following boilerplate code for its content:

[block:code]
{
  "codes": [
    {
      "code": "namespace Sample.Xamarin.Forms\n{\n  using System;\n  using System.Threading.Tasks;\n\n  using Rollbar;\n  using Rollbar.DTOs;\n  \n  using Samples;\n\n  /// <summary>\n  /// Class RollbarHelper.\n  /// A utility class aiding in Rollbar SDK usage.\n  /// </summary>\n  public static class RollbarHelper\n  {\n    public static readonly TimeSpan RollbarTimeout = TimeSpan.FromSeconds(10);\n\n    /// <summary>\n    /// Registers for global exception handling.\n    /// </summary>\n    public static void RegisterForGlobalExceptionHandling()\n    {\n      AppDomain.CurrentDomain.UnhandledException += (sender, args) =>\n      {\n        var newExc = new System.Exception(\n          \"CurrentDomainOnUnhandledException\", \n          args.ExceptionObject as System.Exception\n        );\n       \n        // report the exception to Rollbar:\n        RollbarLocator\n          .RollbarInstance\n          .AsBlockingLogger(RollbarTimeout)\n          .Critical(newExc);\n      };\n\n      TaskScheduler.UnobservedTaskException += (sender, args) =>\n      {\n        var newExc = new ApplicationException(\n          \"TaskSchedulerOnUnobservedTaskException\", \n          args.Exception\n        );\n        \n\t      // report the exception to Rollbar:\n        RollbarLocator\n          .RollbarInstance\n          .AsBlockingLogger(RollbarTimeout)\n          .Critical(newExc);\n      };\n    }\n\n    /// <summary>\n    /// Configures the Rollbar singleton-like infrastructure.\n    /// </summary>\n    public static void ConfigureRollbar()\n    {\n      // create valid Rolbar configuration:\n      RollbarInfrastructureConfig rollbarInfrastructureConfig = \n        new RollbarInfrastructureConfig(\n          RollbarSamplesSettings.AccessToken,\n          RollbarSamplesSettings.Environment\n        );\n\n      // optionally:\n      RollbarDataSecurityOptions dataSecurityOptions = \n        new RollbarDataSecurityOptions();\n      dataSecurityOptions.ScrubFields = new string[]\n      {\n        \"access_token\", // normally, you do not want scrub this specific field (it is operationally critical), but it just proves safety net built into the notifier... \n        \"username\",\n      };\n      rollbarInfrastructureConfig\n        .RollbarLoggerConfig\n        .RollbarDataSecurityOptions\n        .Reconfigure(dataSecurityOptions);\n\n      // optionally:\n      RollbarPayloadAdditionOptions payloadAdditionOptions = \n        new RollbarPayloadAdditionOptions();\n      payloadAdditionOptions.Person = new Person(\"007\")\n      {\n        Email = \"jbond@mi6.uk\",\n        UserName = \"JBOND\"\n      };\n      rollbarInfrastructureConfig\n        .RollbarLoggerConfig\n        .RollbarPayloadAdditionOptions\n        .Reconfigure(payloadAdditionOptions);\n\n      RollbarInfrastructure.Instance.Init(rollbarInfrastructureConfig);\n\n      // optionally, to monitor Rollbar internal events:\n      RollbarInfrastructure\n        .Instance\n        .QueueController\n        .InternalEvent += OnRollbarInternalEvent;\n    }\n\n    /// <summary>\n    /// Called when rollbar internal event is detected.\n    /// </summary>\n    /// <param name=\"sender\">The sender.</param>\n    /// <param name=\"e\">The <see cref=\"RollbarEventArgs\" /> instance containing the event data.</param>\n    private static void OnRollbarInternalEvent(\n      object sender, \n      RollbarEventArgs e\n    )\n    {\n      Console.WriteLine(e.TraceAsString());\n\n      RollbarApiErrorEventArgs apiErrorEvent = e as RollbarApiErrorEventArgs;\n      if (apiErrorEvent != null)\n      {\n        //TODO: handle/report Rollbar API communication error event...\n        return;\n      }\n      CommunicationEventArgs commEvent = e as CommunicationEventArgs;\n      if (commEvent != null)\n      {\n        //TODO: handle/report Rollbar API communication event...\n        return;\n      }\n      CommunicationErrorEventArgs commErrorEvent = e as CommunicationErrorEventArgs;\n      if (commErrorEvent != null)\n      {\n        //TODO: handle/report basic communication error while attempting to reach Rollbar API service... \n        return;\n      }\n      InternalErrorEventArgs internalErrorEvent = e as InternalErrorEventArgs;\n      if (internalErrorEvent != null)\n      {\n        //TODO: handle/report basic internal error while using the Rollbar Notifier... \n        return;\n      }\n    }\n\n  }\n}\n",
      "language": "csharp"
    }
  ]
}
[/block]

# Modify your Xamarin Forms UWP Project

Update your `App.xaml.cs` like so:

[block:code]
{
  "codes": [
    {
      "code": "namespace Sample.Xamarin.Forms.UWP\n{\n  \n  using System;\n\n  using Windows.ApplicationModel;\n  using Windows.ApplicationModel.Activation;\n  using Windows.UI.Xaml;\n  using Windows.UI.Xaml.Controls;\n  using Windows.UI.Xaml.Navigation;\n\n  using Rollbar;\n  using xf = Xamarin.Forms;\n\n  /// <summary>\n  /// Provides application-specific behavior to supplement the default Application class.\n  /// </summary>\n  sealed partial class App : Application\n  {\n    /// <summary>\n    /// Initializes the singleton application object.  This is the first line of authored code\n    /// executed, and as such is the logical equivalent of main() or WinMain().\n    /// </summary>\n    public App()\n    {\n      // configure Rollbar:\n      RollbarHelper.ConfigureRollbar();\n\n      // basic senity check:\n      RollbarLocator.RollbarInstance\n        .Info(\"Xamarin.Forms sample: Hello world! Xamarin is here...\");\n\n      // subscribe to all known unhandled exception events application-wide:\n      RollbarHelper.RegisterForGlobalExceptionHandling();\n      this.UnhandledException += App_UnhandledException;\n\n      this.InitializeComponent();\n      this.Suspending += OnSuspending;\n    }\n\n    private void App_UnhandledException(\n      object sender, \n      Windows.UI.Xaml.UnhandledExceptionEventArgs e\n    )\n    {\n      // report the exception to Rollbar:\n      RollbarLocator\n        .RollbarInstance\n        .AsBlockingLogger(RollbarHelper.RollbarTimeout)\n        .Critical(e.Exception);\n    }\n\n  }\n}\n",
      "language": "csharp"
    }
  ]
}
[/block]

# Modify your Xamarin Forms Android Project

Update your `MainActivity.cs` like so:

[block:code]
{
  "codes": [
    {
      "code": "namespace Sample.Xamarin.Forms.Droid\n{\n  //...\n  using Rollbar;\n  //...\n\n  [Activity(\n    Label = \"Sample.Xamarin.Forms\", \n    Icon = \"@drawable/icon\", \n    Theme = \"@style/MainTheme\", \n    MainLauncher = true, \n    ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation\n  )]\n  public class MainActivity \n    : global::Xamarin.Forms.Platform.Android.FormsAppCompatActivity\n  {\n      protected override void OnCreate(Bundle bundle)\n      {\n        // configure Rollbar:\n        RollbarHelper.ConfigureRollbar();\n\n        // basic senity check:\n        RollbarLocator.RollbarInstance\n          .Info(\"Xamarin.Forms sample: Hello world! Xamarin is here @MainActivity.OnCreate(...) ...\");\n\n        //subscribe to all known unhandled exception events application-wide\n        RollbarHelper.RegisterForGlobalExceptionHandling();\n        AndroidEnvironment.UnhandledExceptionRaiser += \n          AndroidEnvironment_UnhandledExceptionRaiser;\n\n        TabLayoutResource = Resource.Layout.Tabbar;\n        ToolbarResource = Resource.Layout.Toolbar;\n\n        base.OnCreate(bundle);\n\n        global::Xamarin.Forms.Forms.Init(this, bundle);\n        LoadApplication(new App());\n      }\n\n      private void AndroidEnvironment_UnhandledExceptionRaiser(object sender, RaiseThrowableEventArgs e)\n      {\n        var newExc = \n          new System.Exception(\"UnhandledExceptionRaiser\", e.Exception);\n        \n\t      // report the exception to Rollbar:\n        RollbarLocator\n          .RollbarInstance\n          .AsBlockingLogger(RollbarHelper.RollbarTimeout)\n          .Critical(newExc);\n      }\n  }\n}\n",
      "language": "csharp"
    }
  ]
}
[/block]

# Modify your Xamarin Forms iOS Project

Update your `AppDelegate.cs` like so:

[block:code]
{
  "codes": [
    {
      "code": "namespace Sample.Xamarin.Forms.iOS\n{\n  using System;\n  using System.Collections.Generic;\n  using System.Linq;\n  using System.Threading.Tasks;\n  \n  using Foundation;\n  using UIKit;\n\n  using Rollbar;\n\n  // The UIApplicationDelegate for the application. This class is responsible for launching the \n  // User Interface of the application, as well as listening (and optionally responding) to \n  // application events from iOS.\n  [Register(\"AppDelegate\")]\n  public partial class AppDelegate : global::Xamarin.Forms.Platform.iOS.FormsApplicationDelegate\n  {\n    //\n    // This method is invoked when the application has loaded and is ready to run. In this \n    // method you should instantiate the window, load the UI into it and then make the window\n    // visible.\n    //\n    // You have 17 seconds to return from this method, or iOS will terminate your application.\n    //\n    public override bool FinishedLaunching(UIApplication app, NSDictionary options)\n    {\n      // configure Rollbar:\n      RollbarHelper.ConfigureRollbar();\n      \n      //subscribe to all known unhandled exception events application-wide:\n      RollbarHelper.RegisterForGlobalExceptionHandling();\n\n      global::Xamarin.Forms.Forms.Init();\n      LoadApplication(new App());\n\n      return base.FinishedLaunching(app, options);\n    }\n\n    /// <summary>\n    /// Informs the app that the activity of the <paramref name=\"userActivityType\" /> type could not be continued, and specifies a <paramref name=\"error\" /> as the reason for the failure.\n    /// </summary>\n    /// <param name=\"application\">To be added.</param>\n    /// <param name=\"userActivityType\">To be added.</param>\n    /// <param name=\"error\">To be added.</param>\n    /// <remarks>To be added.</remarks>\n    public override void DidFailToContinueUserActivitiy(\n      UIApplication application, \n      string userActivityType, \n      NSError error\n    )\n    {\n      // collect data about the NSError:\n      IDictionary<string, object> custom = new Dictionary<string, object>();\n      custom[\"NSError.Description\"] = error.Description;\n      custom[\"NSError.DebugDescription\"] = error.DebugDescription;\n      custom[\"NSError.Code\"] = error.Code;\n      custom[\"NSError.Domain\"] = error.Domain;\n      custom[\"NSError.LocalizedDescription\"] = error.LocalizedDescription;\n      custom[\"NSError.LocalizedFailureReason\"] = error.LocalizedFailureReason;\n      custom[\"NSError.LocalizedRecoveryOptions\"] = error.LocalizedRecoveryOptions;\n      custom[\"NSError.LocalizedRecoverySuggestion\"] = error.LocalizedRecoverySuggestion;\n\n      // capture the user activity type:\n      string message = \"NSError during user activity type: \" + userActivityType;\n\n      // report the error to Rollbar:\n      RollbarLocator\n        .RollbarInstance\n        .AsBlockingLogger(RollbarHelper.RollbarTimeout)\n        .Error(message, custom);\n\n      base.DidFailToContinueUserActivitiy(application, userActivityType, error);\n    }\n\n  }\n}\n",
      "language": "csharp"
    }
  ]
}
[/block]