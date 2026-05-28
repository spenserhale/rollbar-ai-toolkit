<!-- source: https://docs.rollbar.com/docs/xamarin.md -->

# Integrating with Xamarin

Xamarin error handling for the .NET SDK

Rollbar offers error monitoring integration for Xamarin applications through the [.NET](https://docs.rollbar.com/docs/dotnet) SDK. This guide will show you how to integrate Rollbar in your Xamarin app.

For a more in-depth tutorial on using a Xamarin app with Rollbar, including a working sample, please read our blog article [Monitoring Errors in Xamarin Apps](https://rollbar.com/blog/xamarin-error-monitoring).

# Quick Start

**Step 1.** Log into your Rollbar account [dashboard](https://rollbar.com)

**Step 2.** Create your project and select .NET from the list of SDKs. Save the server side access token that is generated for you. You’ll need this to configure Rollbar in the steps below.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/63877f0-rollbar-nuget-console.png",
        "rollbar-nuget-console.png",
        1366,
        276,
        "#bed2e0"
      ]
    }
  ]
}
[/block]

Alternatively, to install from the console, run the command below:

```C#
Install-Package Rollbar
```

**Step 3.** We've designed  [RollbarHelper.cs](https://github.com/rollbar/Rollbar.NET/blob/master/Samples/Sample.Xamarin.Forms/Sample.Xamarin.Forms/RollbarHelper.cs) to make it easier to wire up Xamarin apps. Copy the file and add it under `{root}/{appname}.Xamarin.Forms`. Next, find the `ConfigureRollbarSingleton()` method in `RollbarHelper` and update it with the access token you received in step 2.

```csharp
public static void ConfigureRollbarSingleton()
{
  const string rollbarAccessToken = "POST-SERVER-ACCESS-TOKEN";
  const string rollbarEnvironment = "production";
  // minimally required Rollbar configuration
  var config = new RollbarConfig(rollbarAccessToken) {
    Environment = rollbarEnvironment,
      ScrubFields = new string[]
      {
        "access_token",
        "Username",
      }
  };
  // minimally required Rollbar configuration:
  RollbarLocator.RollbarInstance.Configure(config);
}
```

**Step 4.** You may optionally add platform-specific exception handling to get greater detail. For Android, find `MainActivity` in the Android codebase and add the code snippet below in the `OnCreate()` method.

```csharp
protected override void OnCreate(Bundle bundle)
{
  // Rollbar notifier configuartion
  RollbarHelper.ConfigureRollbarSingleton();

  // Registers for global exception handling.
  RollbarHelper.RegisterForGlobalExceptionHandling();

  AndroidEnvironment.UnhandledExceptionRaiser += (sender, args) =>
  {
    var newExc = new ApplicationException("AndroidEnvironment_UnhandledExceptionRaiser", args.Exception);
    RollbarLocator.RollbarInstance.AsBlockingLogger(TimeSpan.FromSeconds(10)).Critical(newExc);
  };

  TabLayoutResource = Resource.Layout.Tabbar;
  ToolbarResource = Resource.Layout.Toolbar;
  base.OnCreate(bundle);
  global::Xamarin.Forms.Forms.Init(this, bundle);
  LoadApplication(new App());
}
```

For iOS, you can add code like this in your `AppDelegate.cs`.

```csharp
public override bool FinishedLaunching(UIApplication app, NSDictionary options)
{
  // Rollbar notifier configuartion
  RollbarHelper.ConfigureRollbarSingleton();

  // Registers for global exception handling.
  RollbarHelper.RegisterForGlobalExceptionHandling();

  // Rest of your code
  global::Xamarin.Forms.Forms.Init();
  LoadApplication(new App());
  return base.FinishedLaunching(app, options);
}
```

# Usage

In the Quick start section, we configured Rollbar to capture all unhandled exceptions. Additionally, we have several methods to log items manually or add extra metadata.

## Manual reporting

If you wish to report an error to Rollbar with a specific exception block, you may do so using the Rollbar error reporting methods. For example:

```C#f
try {
  string value = null;
  if (value.Length == 0) { // <-- Causes exception
    Console.WriteLine(value);
  }
} catch (Exception e1) {
  RollbarLocator.RollbarInstance.Error(new ApplicationException("Handled Exception inside...", e1));
}
```

## Logging a Specific Message

You can log your own messages anywhere in your app. For example, to log a debug message:

```c#
RollbarLocator.RollbarInstance.Debug("Here is some debug message");
```

## Adding Context Information

You can provide your own logic for retrieving user data with the person configuration option. For example;

```c#
Person person = new Person("007");
person.Email = "jbond@mi6.uk";
person.UserName = "JBOND";
RollbarLocator.RollbarInstance.Config.Person = person;
```

# Configuration

Setting up a `post_server_item access` token should be enough for basic configuration

```c#
const string rollbarAccessToken = "POST-SERVER-ACCESS-TOKEN";
const string rollbarEnvironment = "production";
var config = new RollbarConfig(rollbarAccessToken) // minimally required Rollbar configuration
{
  Environment = rollbarEnvironment,
};
RollbarLocator.RollbarInstance.Configure(config);
```

# Help/Support

If you run into any issues, please email us at <support@rollbar.com>
You can also find us in IRC: [#rollbar on chat.freenode.net](irc://chat.freenode.net/rollbar)
For bug reports, please open an issue on [Github](https://github.com/rollbar/Rollbar.NET/issues/new)