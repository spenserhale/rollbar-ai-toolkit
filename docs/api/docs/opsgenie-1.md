<!-- source: https://docs.rollbar.com/docs/opsgenie-1.md -->

# OpsGenie

Connecting Rollbar to OpsGenie

Rollbar can create Incidents in [OpsGenie](https://docs.opsgenie.com/docs/rollbar-integration).

## What does Opsgenie offer Rollbar users?

By using Opsgenie’s Genric API Integration, you can forward Rollbar incidents to Opsgenie. Opsgenie can determine the right people to notify based on on-call schedules, using email, text messages (SMS), phone calls, iOS & Android push notifications, and escalating alerts until the alert is acknowledged or closed.

## Functionality of the integration

When an item is created, reopened, repeated or reactivated in Rollbar, an alert is created in Opsgenie.

When the item is resolved in the Rollbar, the alert is closed in Opsgenie.

When the alert is closed in Opsgenie, the item is resolved in the Rollbar.

## In OpsGenie:

1. Go to the Project Page in Rollbar. Then, click the Project Access Token link on the left. Copy the token that allows access to all write calls, except POSTing items or deploys (write token).
2. Go to Settings > Integrations. Search for "API" and select Add.
3. Paste the "Project Access Token" to "Rollbar Write Access Token" field.
4. Specify who is notified of Rollbar alerts using the Responders field. Autocomplete suggestions are provided as you type.
5. Copy the URL.
6. Select Save Integration.

## In Rollbar:

1. Navigate to the project you want to integrate with OpsGenie
2. Click **Settings → Notifications → OpsGenie**
3. Paste the API key from OpsGenie and click **Save Settings**\
   ***NOTE**:  You can override the default Integration key in each of your Rollbar notification rules to control which escalation policy is triggered in OpsGenie.*\
   ***NOTE**: Example OpsGenie URL / API Key <https://api.opsgenie.com/v1/json/rollbar?apiKey=abcde-ffff-eeee>*
4. Click **Send Test Notification** to ensure that your configuration is correct
5. Click **Enable**
6. Configure your notification rules.  See [Notifications](https://docs.rollbar.com/docs/notifications) for details of the available configuration options.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/bdc4ba7-image.png",
        "image.png",
        1792
      ],
      "align": "center",
      "caption": "Native OpsGenie Notification Configuration"
    }
  ]
}
[/block]

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/5ef101b-image_1.png",
        "image (1).png",
        830
      ],
      "align": "center",
      "caption": "Sample OpsGenie Notification From Rollbar"
    }
  ]
}
[/block]

## Adding Custom Tags to Ops Genie

When the item is sent to OpsGenie, you can send up to 19 custom tags per item to your OpsGenie for better organization. Each tag can have up to 50 characters, and commas must separate tags.

On the OpsGenie settings page, you’ll find an input box for Custom Tags. To create a tag, you can use two versions:

* **Static Tags:** Static tags can be entered by including the static text ending in a comma.
* **Variable Tags:** Variable tags can be pulled from any key-value pair in the occurrence payload you are sending to Rollbar. To reference the value, you need to include the key in the handlebar format:

```Text javascript
// Key Value Pair
Enviroment: {{ environment }},

// Value only
{{enviroment}},

// Multiple Tags
lang:{{language}},
level: {{level}},
```

You can reference the params section on the item detail page to see values in your occurrence. For the full payload, visit our [createItem](https://docs.rollbar.com/reference/create-item#data-format) API documentation.