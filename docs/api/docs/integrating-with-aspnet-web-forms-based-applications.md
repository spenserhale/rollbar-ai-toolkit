<!-- source: https://docs.rollbar.com/docs/integrating-with-aspnet-web-forms-based-applications.md -->

# Integrating with ASP.NET Web Forms based Applications

# Application-wide Error Handling

From the application error handler in the `Global.asax` file:

[block:code]
{
  "codes": [
    {
      "code": "void Application_Error(object sender, EventArgs e)\n{\n  Exception exception = Server.GetLastError();\n\n  // Let's report to Rollbar on the Application/Global Level:\n  var metaData = new Dictionary<string, object>();\n  metaData.Add(\"reportLevel\", \"GlobalLevel\");\n  RollbarLocator.RollbarInstance.Error(exception, metaData);\n\n  if (exception is HttpUnhandledException)\n  {\n    // Pass the error on to the error page.\n    Server.Transfer(\n      \"ErrorPage.aspx?handler=Application_Error%20-%20Global.asax\", \n      true\n    );\n  }\n}",
      "language": "csharp"
    }
  ]
}
[/block]

# Page Level Error Handling

From a page error handler in its code-behind file/class:

[block:code]
{
  "codes": [
    {
      "code": "private void Page_Error(object sender, EventArgs e)\n  {\n    // Get last error from the server.\n    Exception exception = Server.GetLastError();\n\n    // Let's report to Rollbar on the Page Level:\n    var metaData = new Dictionary<string, object>();\n    metaData.Add(\"reportLevel\", \"PageLevel\");\n    metaData.Add(\"failedPage\", this.AppRelativeVirtualPath);\n    RollbarLocator.RollbarInstance.Error(exception, metaData);\n\n    // Handle specific exception.\n    if (exception is InvalidOperationException)\n    {\n      // Pass the error on to the error page.\n      Server.Transfer(\n        \"ErrorPage.aspx?handler=Page_Error%20-%20Default.aspx\", \n        true\n      );\n    }\n  }",
      "language": "csharp"
    }
  ]
}
[/block]

# Code Level Error Handling

From the catch block:

[block:code]
{
  "codes": [
    {
      "code": "try\n{\n  // Let's simulate an error:\n  throw new NullReferenceException(\"WebForms.Site sample: simulated exception\");\n}\ncatch (Exception exception)\n{\n  // Let's report to Rollbar on the Code Level:\n  var metaData = new Dictionary<string, object>();\n  metaData.Add(\"reportLevel\", \"CodeLevel\");\n  metaData.Add(\"failedPage\", this.AppRelativeVirtualPath);\n  RollbarLocator.RollbarInstance.Error(exception, metaData);\n  throw exception;\n}",
      "language": "csharp"
    }
  ]
}
[/block]