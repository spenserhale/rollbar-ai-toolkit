<!-- source: https://docs.rollbar.com/docs/using-rollbarjs-with-segment.md -->

# Segment

If you're using Rollbar via Segment, you will get automatic detection of uncaught errors, but Rollbar methods are not available unless you use the Device-based Connection Mode option. This is because Segment loads the Rollbar snippet asynchronously, so they may not be defined. If you use the Device-based Connection Mode option, Segment will be able to load the Rollbar script on the client and you can use Rollbar methods. To enable this, go to the destination settings pane in the app and select Device-based Connection Mode. Otherwise, in order to use Rollbar methods, you will need to include the Rollbar snippet directly in your `<head>`, rather than loading it through Segment.

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar.js, see the docs [here](https://docs.rollbar.com/docs/javascript)."
}
[/block]