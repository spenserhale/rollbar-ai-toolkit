<!-- source: https://docs.rollbar.com/docs/disabling-feature-flag.md -->

# Disabling Feature Flags

## Feature Flag

A Feature Flag is the ability in an application to turn a feature on and off.  Feature Flags are often used by teams to control access to a new feature and for feature experimentation.
Feature Flags are also used to reduce the risk of deploying software by disconnecting the deployment of the code from the enablement of the new feature.

## Disabling Feature Flags with Rollbar

Rollbar has an integration with LaunchDarkly to disable a Feature Flag if it is associated with errors in Rollbar. For more information see the  Rollbar [LaunchDarkly Notification](https://docs.rollbar.com/docs/launch-darkly) documentation.

Rollbar also supports disabling Feature Flags with other vendors and for home-grown Feature Flag solutions by using Rollbar's  [Webhook Notification](https://docs.rollbar.com/docs/webhooks).

## Disable Feature Flag using Rollbar's Webhook Notification

### Add a Custom Data Field

Configure the application so that the Feature Flag ID is included as a custom data field in the error payload sent to Rollbar when there is an error associated with a Feature Flag.

For detailed information on how and where to add custom data fields to the error payload see [Adding Custom Data](https://docs.rollbar.com/docs/custom-data).

This is an example of adding a custom data field named feature\_flag\_id to the error payload in a JavaScript application.

```javascript

try {
     // New feature logic
}
catch Exception ex {
    Rollbar.Error("Error in new feature", ex, {feature_flag_id: "new_feature"});
}
```

### Trigger Webhook Notification if error is associated with a Feature Flag

If an error contains a custom data field named feature\_flag\_id notify the Webhook endpoint. In the example below [Path](https://docs.rollbar.com/docs/path-filter) Notification filter is used to trigger the notification if the error contains the custom data field.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/2895410-webhook-configuration.png",
        "webhook-configuration.png",
        1168,
        1216,
        "#dcdee1"
      ],
      "sizing": "80"
    }
  ]
}
[/block]

## Disable the Feature Flag with custom Webhook logic

In the Webhook endpoint create custom logic to disable the feature flag. See the the [Rollbar Webhook Documentation](https://docs.rollbar.com/docs/webhooks#examples) for examples of the message format sent to the Webhook endpoint.

## YouTube Video

There is a [video walkthrough](https://www.youtube.com/watch?v=HUebdbNYKPc) explaining the LaunchDarkly integration on our YouTube channel, watch this video for more information.