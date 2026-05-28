<!-- source: https://docs.rollbar.com/docs/sdk-module-rollbaraul.md -->

# Apple Unified Logging

This module implements `RollbarNotifier` integration with Apple Unified Logging (AUL) and allows capture of the AUL entries as corresponding Rollbar Telemetry log events.

# Essential Components of the Module

## RollbarAulStoreMonitorOptions DTO

It implements configurational options for collecting relevant log entries from the Apple Unified Logging (AUL) store.
You can specify here lists of AUL subsystems and categories of interest. When these lists are empty, all the entries from the local AUL store related to the application process will be collected from the store.

## RollbarAulStoreMonitor Service

It implements a singleton-like component that monitors the AUL local store and retrieves relevant entries from it based on provided `RollbarAulStoreMonitorOptions` instance. These entries will be captured as Rollbar Telemetry log events. Hence, the Telemetry must be enabled as well as its capture of the log entries.
This component implements the following key protocols.

## RollbarAulStoreMonitoring Protocol

Allows to start and cancel the monitoring service as well as provides optional methods to configure the service with custom `RollbarAulStoreMonitorOptions` and/or a custom `RollbarLogger` instance.

## RollbarSingleInstancing Protocol

Defines access to the singleton of the type implementing this protocol.
Optionally, defines methods to test on the singleton instance existence and a method to define custom singleton deallocation logic.

# Example: using the RollbarAulStoreMonitor to capture the application AUL entries

1. Make sure you have properly configured `RollbarConfig` instance and the Telemetry and its log capture options are both enabled.
2. Setup a `RollbarLogger` instance with that `RolbarConfig` instance.
3. Configure the `RollbarAulStoreMonitor` service with that `RollbarLogger` instance.
4. Optionally, you can create a custom-configured `RollbarAulStoreMonitorOptions` instance and configure the `RollbarAulStoreMonitor` service with it.
5. Start the `RollbarAulStoreMonitor` service.
6. Any AUL entry made from your application process will be collected by the SDK as corresponding Telemetry log events according to the provided `RollbarAulStoreMonitorOptions`...

[block:code]
{
  "codes": [
    {
      "code": "// Create proper RollbarConfig instance making sure \n// the Telemetry and its log capture are enabled:\nlet config = RollbarConfig();\nconfig.destination.accessToken = \"<YOUR_PROJECT_ACCRSS_TOKEN>\";\nconfig.destination.environment = \"<YOUR_ENVIRONMENT_TAG>\";\nconfig.developerOptions.transmit = true;\nconfig.telemetry.enabled = true;\nconfig.telemetry.captureLog = true;\n\n// Setup shared RollbarLogger with the config:\nRollbar.initWithConfiguration(config);\n\n// Configure the AUL monitor with the logger:\nRollbarAulStoreMonitor.sharedInstance().configureRollbarLogger(Rollbar.currentLogger());\n\n// Optionally, configure the AUL monitoring options:\nlet aulOptions = RollbarAulStoreMonitorOptions();\naulOptions.addAulSubsystem(\"DataAccessLayer\");\naulOptions.addAulSubsystem(\"Model\");\naulOptions.addAulCategory(\"CompanyOrg\");\nRollbarAulStoreMonitor.sharedInstance().configure(with: aulOptions);\n\n// Start the AUL monitoring:\nRollbarAulStoreMonitor.sharedInstance().start();",
      "language": "swift",
      "name": "Swift"
    },
    {
      "code": "// Create proper RollbarConfig instance making sure \n// the Telemetry and its log capture are enabled:\nRollbarConfig *rollbarConfig = [[RollbarConfig alloc] init];\nrollbarConfig.destination.accessToken = @\"<YOUR_PROJECT_ACCRSS_TOKEN>\";\nrollbarConfig.destination.environment = @\"<YOUR_ENVIRONMENT_TAG>\";\nrollbarConfig.developerOptions.transmit = YES;\nrollbarConfig.telemetry.enabled = YES;\t\t\t\t// required for AUL capture\nrollbarConfig.telemetry.captureLog = YES;\t\t\t// required for AUL capture\nrollbarConfig.telemetry.maximumTelemetryData = 100;\n\n// Setup shared RollbarLogger with the config:\n[Rollbar initWithConfiguration:rollbarConfig];\n\n// Configure the AUL monitor with the logger:\n[RollbarAulStoreMonitor.sharedInstance configureRollbarLogger:Rollbar.currentLogger];\n\n// Optionally, configure the AUL monitoring options:\nRollbarAulStoreMonitorOptions *aulMonitorOptions =\n[[RollbarAulStoreMonitorOptions alloc] init];\n[aulMonitorOptions addAulSubsystem:@\"DataAccessLayer\"];\n[aulMonitorOptions addAulSubsystem:@\"Model\"];\n[aulMonitorOptions addAulCategory:@\"CompanyOrg\"];\n[RollbarAulStoreMonitor.sharedInstance configureWithOptions:aulMonitorOptions];\n\n// Start the AUL monitoring:\n[RollbarAulStoreMonitor.sharedInstance start];",
      "language": "objectivec"
    }
  ]
}
[/block]