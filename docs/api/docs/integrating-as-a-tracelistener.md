<!-- source: https://docs.rollbar.com/docs/integrating-as-a-tracelistener.md -->

# Integrating as a TraceListener

Absolutely any .NET-based application that already uses the TraceListeners

You can start quickly enjoying all the benefits of Rollbar API services if you are already actively using .NET's built-in tracing infrastructure (aka, TraceSources and TraceListeners).
And you do not even need to recompile your .NET Framework-based application - just configure RollbarTraceListener within your app.config file, drop the Rollbar.dll side-by-side with the config file and restart the application, so that all your traces will be forwarded to the Rollbar API from now on. Make sure your app.config file looks similar to this example:

[block:code]
{
  "codes": [
    {
      "code": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<configuration>\n\n  <system.diagnostics>\n    <trace autoflush=\"true\" indentsize=\"4\">\n      <listeners>\n        <add name=\"textFileListener\" \n             type=\"System.Diagnostics.TextWriterTraceListener\" \n             initializeData=\"TextTrace.log\" \n             traceOutputOptions=\"ProcessId, ThreadId, Timestamp, DateTime, Callstack,LogicalOperationStack\"\n             />\n        <add name=\"rollbarListener\" \n             type=\"Rollbar.NetStandard.RollbarTraceListener,Rollbar\" \n             traceOutputOptions=\"ProcessId, ThreadId, Timestamp, DateTime, Callstack,LogicalOperationStack\" \n             rollbarAccessToken=\"17965fa5041749b6bf7095a190001ded\" \n             rollbarEnvironment=\"RollbarNetSamples\"\n             />\n        <remove name=\"Default\"/>\n      </listeners>\n    </trace>\n  </system.diagnostics>\n\n  <startup> \n        <supportedRuntime version=\"v4.0\" sku=\".NETFramework,Version=v4.7.2\"/>\n  </startup>\n\n</configuration>",
      "language": "xml"
    }
  ]
}
[/block]

If you need more control over the Rollbar notifier's static instance that is used by the RollbarTraceListener - do not specify rollbarAccessToken and rollbarEnvironment attributes in the example above and just add Rollbar specific configuration elements/sections within the same app.config file, for example, add something like this:

[block:code]
{
  "codes": [
    {
      "code": "<configSections>\n    <section name=\"rollbar\" type=\"Rollbar.NetFramework.RollbarConfigSection, Rollbar\"/>\n    <section name=\"rollbarTelemetry\" type=\"Rollbar.NetFramework.RollbarTelemetryConfigSection, Rollbar\"/>\n  </configSections>\n\n  <rollbar\n    accessToken=\"17965fa5041749b6bf7095a190001ded\"\n    environment=\"unit-tests\"\n    enabled=\"true\"\n    scrubFields=\"ThePassword, Secret\"\n    scrubWhitelistFields=\"ThePassword\"\n    logLevel=\"Info\"\n    maxReportsPerMinute=\"160\"\n    reportingQueueDepth=\"120\"\n    personDataCollectionPolicies=\"Username, Email\"\n    ipAddressCollectionPolicy=\"CollectAnonymized\"\n    />\n\n<rollbarTelemetry\n    telemetryEnabled=\"true\"\n    telemetryQueueDepth=\"100\"\n    telemetryAutoCollectionTypes=\"Network, Log, Error\"\n    telemetryAutoCollectionInterval=\"00:00:00.3000000\"\n    />",
      "language": "xml"
    }
  ]
}
[/block]

However, if the flavor .NET Standard implementation used by your application does not support app.config files you can always configure Rollbar singleton in code as well as add a RollbarTraceListener instance (that will be using the just configured Rollbar singleton) to the tracing infrastructure in code (exactly as any other TraceListener). But in this case, you will have to recompile your application.