<!-- source: https://docs.rollbar.com/docs/monitoring-the-sdk-internal-events.md -->

# Monitoring the SDK Internal Events

Do you want to know what's happening the inside and do you want to tap into it?

# Monitor any internal event regardless of the specific instance of the Logger

1. Get a reference to the `RollbarQueueController.Instance` singleton.
2. Subscribe to its `InternalEvent` event.
3. Implement the event handler as you desire. As the result of this subscription, at runtime, all the Rollbar internal events generated while using any instance of the Notifier will be reported into the event handler.

# Monitor internal events within any specific instance of the Logger

1. Get a reference to a specific instance of the Notifier.
2. Subscribe to its `InternalEvent` event.
3. Implement the event handler as you desire. As the result of this subscription, at runtime, all the Rollbar internal events generated while using this specific instance of the Notifier will be reported into the event handler.

# Code Sample

[block:code]
{
  "codes": [
    {
      "code": "static void Main(string[] args)\n{\n  ConfigureRollbarSingleton();\n\n  RollbarLocator.RollbarInstance\n    .Info(\"ConsoleApp sample: Basic info log example.\");\n  RollbarLocator.RollbarInstance\n    .Debug(\"ConsoleApp sample: First debug log.\");\n  RollbarLocator.RollbarInstance\n    .Error(new Exception(\"ConsoleApp sample: null reference exception.\"));\n  RollbarLocator.RollbarInstance\n    .Error(new Exception(\"ConsoleApp sample: outer\", new Exception(\"inner\")));\n\n  System.Threading.Thread.Sleep(TimeSpan.FromSeconds(10));\n}\n\n/// <summary>\n/// Configures the Rollbar singleton-like notifier.\n/// </summary>\nprivate static void ConfigureRollbarSingleton()\n{\n  const string rollbarAccessToken = \"POST_SERVER_ITEM_ACCESS_TOKEN\";\n  const string rollbarEnvironment = \"RollbarNetSamples\";\n\n  var config = new RollbarConfig(rollbarAccessToken) // minimally required\n  {\n    Environment = rollbarEnvironment,\n    ScrubFields = new string[]\n    {\n      \"pw\",\n      \"username\",\n    }\n  };\n  RollbarLocator.RollbarInstance\n    // minimally required Rollbar configuration:\n    .Configure(config)\n    // if you would like to monitor Rollbar internal events of this logger:\n    .InternalEvent += OnRollbarInternalEvent\n    ;\n\n  // Optional info about reporting Rollbar user:\n  SetRollbarReportingUser(\"007\", \"jbond@mi6.uk\", \"JBOND\");\n}\n\n/// <summary>\n/// Sets the rollbar reporting user.\n/// </summary>\n/// <param name=\"id\">The identifier.</param>\n/// <param name=\"email\">The email.</param>\n/// <param name=\"userName\">Name of the user.</param>\nprivate static void SetRollbarReportingUser(string id, string email, string userName)\n{\n  Person person = new Person(id);\n  person.Email = email;\n  person.UserName = userName;\n  RollbarLocator.RollbarInstance.Config.Person = person;\n}\n\n/// <summary>\n/// Called when rollbar internal event is detected.\n/// </summary>\n/// <param name=\"sender\">The sender.</param>\n/// <param name=\"e\">The <see cref=\"RollbarEventArgs\"/> instance containing the event data.</param>\nprivate static void OnRollbarInternalEvent(object sender, RollbarEventArgs e)\n{\n  Console.WriteLine(e.TraceAsString());\n\n  RollbarApiErrorEventArgs apiErrorEvent = e as RollbarApiErrorEventArgs;\n  if (apiErrorEvent != null)\n  {\n    //TODO: handle/report Rollbar API communication error event...\n    return;\n  }\n  CommunicationEventArgs commEvent = e as CommunicationEventArgs;\n  if (commEvent != null)\n  {\n    //TODO: handle/report Rollbar API communication event...\n    return;\n  }\n  CommunicationErrorEventArgs commErrorEvent = e as CommunicationErrorEventArgs;\n  if (commErrorEvent != null)\n  {\n    //TODO: handle/report basic communication error while attempting to reach \n    //      Rollbar API service... \n    return;\n  }\n  InternalErrorEventArgs internalErrorEvent = e as InternalErrorEventArgs;\n  if (internalErrorEvent != null)\n  {\n    //TODO: handle/report basic internal error... \n    return;\n  }\n}\n",
      "language": "csharp"
    }
  ]
}
[/block]