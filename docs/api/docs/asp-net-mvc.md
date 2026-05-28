<!-- source: https://docs.rollbar.com/docs/asp-net-mvc.md -->

# Integrating with ASP.NET MVC

Creating an MVC error handler for the .NET SDK

# Overview

This plugin integrates Rollbar into your ASP.NET MVC app using the [.NET SDK](https://docs.rollbar.com/docs/dotnet). This guide will show you how to add a global exception handler to catch all uncaught errors in your MVC app and how to send custom items to Rollbar.

For an in-depth tutorial with a sample application, see our blog [Error monitoring in ASP.NET MVC](https://rollbar.com/blog/error-monitoring-in-asp-net-mvc/).

# Installation

1. Log into your [Rollbar account dashboard](https://rollbar.com). Go to Settings → Project Access Tokens and then copy the token.
2. Install the Rollbar .NET SDK using NuGet Package Manager. You can use the UI in Visual Studio under Tools->NuGet Package Manager and then click Package Manager Console or Manage NuGet Package for Solution.

Alternatively, to install from the console, run the command below:

[block:code]
{
  "codes": [
    {
      "code": "Install-Package Rollbar",
      "language": "shell"
    }
  ]
}
[/block]

3. Create an exception filter to handle exceptions.

[block:code]
{
  "codes": [
    {
      "code": "namespace Rollbar.App_Start\n{\n  public class RollbarExceptionFilter : IExceptionFilter\n  {\n    public void OnException(ExceptionContext filterContext)\n    {\n      if (filterContext.ExceptionHandled)\n      {\n        return;\n      }\n      \n      RollbarLocator.RollbarInstance.Error(filterContext.Exception);\n    }\n  }\n}",
      "language": "csharp"
    }
  ]
}
[/block]

4. To handle exceptions globally, we'll set up a `FilterConfig` to add our custom filter to the `GlobalFilterCollection`. You can find the FilterConfig.cs file inside the App\_Start folder.

[block:code]
{
  "codes": [
    {
      "code": "namespace Rollbar\n{\n  public class FilterConfig\n  {\n    public static void RegisterGlobalFilters(GlobalFilterCollection filters)\n    {\n      filters.Add(new RollbarExceptionFilter());\n    }\n  }\n}",
      "language": "csharp"
    }
  ]
}
[/block]

5. Register it in the `GlobalFilters` in the `Application_Start` method and then configure the Rollbar SDK with the access token you received from step 1. You can find the `Application_Start` method in the file Global.asax, which is in the root application directory.

[block:code]
{
  "codes": [
    {
      "code": "protected void Application_Start()\n{\n  FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);\n  const string postServerItemAccessToken = \"Your Post Server Access Token\";\n  RollbarLocator.RollbarInstance.\n  Configure(new RollbarConfig(postServerItemAccessToken){\n    \tEnvironment = \"production\"\n  \t}\n  );\n}",
      "language": "csharp"
    }
  ]
}
[/block]

# Usage

In the installation section, we created a global error handler to log errors in Rollbar. Additionally, we offer several methods to log errors, warnings, debug messages and more.

## Logging a Specific Message

You can log your own messages anywhere in your app. For example, to log a `debug` message:

[block:code]
{
  "codes": [
    {
      "code": "RollbarLocator.RollbarInstance\n  .Info(\"Basic info log example.\")\n  .Debug(\"First debug log.\") \n  .Error(new NullReferenceException())\n  .Error(new Exception(\"outer\", new NullReferenceException(\"inner\")))",
      "language": "csharp"
    }
  ]
}
[/block]

## Adding Context Information

You can pass user information as additional context like this:

[block:code]
{
  "codes": [
    {
      "code": "Person person = new Person(\"123\");\nperson.Email = \"john@doe.com\";\nperson.UserName = \"John Doe\";\nRollbarLocator.RollbarInstance.Config.Person = person;\n\nRollbarLocator.RollbarInstance.Error(e);\n",
      "language": "csharp"
    }
  ]
}
[/block]

## Exception Logging

You can also report errors to Rollbar inside a try-catch block. For example, to send any type of `Exception` add the following code:

[block:code]
{
  "codes": [
    {
      "code": "try \n{\n   string test = null;\n   test.toString();\n} \ncatch(Exception e) \n{\n  RollbarLocator.RollbarInstance.error(e);\n}",
      "language": "csharp"
    }
  ]
}
[/block]

# Configuration

Configuring your access token when you initialize your app enough for basic configuration.

[block:code]
{
  "codes": [
    {
      "code": "const string postServerItemAccessToken = \"Your Post Server Access Token\";\nRollbarLocator.RollbarInstance.\n  Configure(new RollbarConfig(postServerItemAccessToken){\n    Environment = \"production\"\n  }\n);",
      "language": "csharp"
    }
  ]
}
[/block]

# Related projects

This project is a wrapper for our [.NET SDK](https://docs.rollbar.com/docs/dotnet)

# Help / Support

If you run into any issues, please email us at <support@rollbar.com>

For bug reports, please open an issue on [Github](https://github.com/rollbar/Rollbar.NET).