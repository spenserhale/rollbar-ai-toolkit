<!-- source: https://docs.rollbar.com/docs/selenium-integration.md -->

# Selenium

First we want to ensure that we have Rollbar instrumented in the application (View Rollbar SDK’s), if you already have Rollbar instrumented you are moments away from a debugging life-changing experience.

Next, we want to notify Rollbar when a selenium test is executing so we can link the test failure (when it occurs) to the Rollbar errors detected at the time of the test execution.

Here is a basic example of injecting the Selenium SessionId into the Rollbar SDK during the test execution. In this example we will fetch the selenium sessionid and inject it into the web application using the ExecuteScript function.

The sessionid comes from the selenium remote web driver object.

**The important line of code is this one:**

[block:code]
{
  "codes": [
    {
      "code": "_driver.ExecuteScript(\"Rollbar.configure({ payload: { 'seleniumsessionid' : '\" + _driver.SessionId + \"' } })\");",
      "language": "text"
    }
  ]
}
[/block]

**Example Test:**

[block:code]
{
  "codes": [
    {
      "code": "[Test]\npublic void InvalidLoginAuth()\n{\n    //Use driver to open Page\n    _driver.Navigate().GoToUrl(\"https://test.app.com/login\");\n    \n    _driver.ExecuteScript(\"Rollbar.configure({ payload: { 'seleniumsessionid' : '\" + _driver.SessionId + \"' } })\");\n\n    IWebElement emailInput = _driver.FindElement(By.Id(\"email\"));\n    IWebElement passwordInput = _driver.FindElement(By.Id(\"password\"));\n    IWebElement loginButton = _driver.FindElement(By.Id(\"btnLoginAuth\"));\n\n    emailInput.SendKeys(\"test@gmail.com\");\n    passwordInput.SendKeys(\"test1234\");\n    loginButton.Click();\n\n    var lastRollbaruuid = _driver.ExecuteScript(\"return _lastRollbaruuid;\");\n\n    _driver.ExecuteScript(\"browserstack_executor: {\\\"action\\\": \\\"setSessionStatus\\\", \\\"arguments\\\": {\\\"status\\\":\\\"failed\\\", \\\"reason\\\": \\\" View Error in Rollbar https://rollbar.com/occurrence/uuid/?uuid=\" + lastRollbaruuid + \" \\\"}}\");\n    Assert.Fail();\n}",
      "language": "text"
    }
  ]
}
[/block]

That is it! Your test executions can now continue normally without any modifications to your selenium scripts.

**Service Links To Test Automation Providers:**

We now have a much clearer understanding of the exact reason that this specific test failed without having to re-run the test, or try to debug it locally.

Rollbar can also link back to the test execution report in most popular cloud vendors like Browserstack, Perfecto, SauceLabs, Digital.ai and others using Service links from within Rollbar.

**Service Links Examples:**

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/652197a-Example-Service-Links-Setup.png",
        "Example-Service-Links-Setup.png",
        1838,
        604,
        "#f9f9f9"
      ]
    }
  ]
}
[/block]

**Use RQL To Find all errors with Selenium SessionId**

Using RQL you can now easily find all errors that occurred during a specific selenium session using this query.

[block:code]
{
  "codes": [
    {
      "code": "SELECT *\nFROM item_occurrence\nWHERE seleniumsessionid='XXXXXXX'",
      "language": "text"
    }
  ]
}
[/block]