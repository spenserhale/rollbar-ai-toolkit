<!-- source: https://docs.rollbar.com/docs/alertops.md -->

# AlertOps

AlertOps’ alert management system can be integrated with Rollbar to receive and respond to all (predefined status mappings) alerts through email, SMS, push notification or phone alerts. AlertOps would ensure that the alert/job status would reach the appropriate team by using proper workflows, escalation policies and schedules. Based on your ruleset, incidents can be automatically opened and closed, depending on what kind of event Rollbar reports.

The above scenario and scope for integration is due to the fact that AlertOps has a very flexible and simple API/Webhook configuration feature that can be leveraged with Rollbar's alert and notification capabilities.

[block:api-header]
{
  "title": "AlertOps - Inbound Integration"
}
[/block]

You can define rulesets in AlertOps so that Rollbar can send out real-time project/code alerts alerts to the AlertOps platform. AlertOps would ensure based on these notifications received, that it would always reach out and assign to the correct person/team by utilizing its escalation policies, schedules, and workflow features.

AlertOps provides Inbound Integrations to integrate with numerous monitoring, chat and ITSM tools. You can configure an inbound integration for Rollbar.

At a high level this is how the flow looks like, you define an API integration in the AlertOps platform by defining settings like Integration Name, Escalation rules, recipient users/groups. Once an integration is defined, a unique API URL is generated. This acts as webhook or the gateway through which notifications from Rollbar reach AlertOps and thus an incident/alert is created correspondingly. The API can be defined with various settings like URL mappings, filters, escalations etc. as required. Rollbar has to be configured with a webhook integration and rules.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/f532045-alertops_image1.png",
        "alertops_image1.png",
        738,
        230,
        "#efe6e0"
      ],
      "caption": ""
    }
  ]
}
[/block]

To configure an Inbound Integration in AlertOps to receive alerts from Rollbar,

* Under 'Integrations' select 'Inbound Integrations', select the category 'API' and then select add 'Add API Integration'
* There are numerous integration options available in AlertOps, select Rollbar
* Once you selected the integration, you can then specify basic settings like the integration name, escalation policy, names of the recipients/groups for which the alerts must be assigned to.
* Once you click save, the API Integration will be created, and you will be given a unique URL which acts as the access point and needs to be configured at the source (in this case Rollbar), to send alerts. You can find the integration you just created, and you can give advanced settings and define various configurations for the alerts to be received and processed. For example, you can define when to open and close alerts based on the payload obtained from the API call, filters etc.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/67d61db-alertops_image2.png",
        "alertops_image2.png",
        1918,
        738,
        "#c9cacc"
      ]
    }
  ]
}
[/block]

* Make a note of the API URL, which will be used in Rollbar, so it calls a HTTP POST request to this URL with the body in JSON format containing the alert specific information. AlertOps automatically creates an alert when the status variable (event\_name) contains 'new\_item'. The incident will also be closed automatically when the status 'resolved\_item' is received from Rollbar.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/3139e95-alertops_image3.png",
        "alertops_image3.png",
        1902,
        892,
        "#d3d3d5"
      ]
    }
  ]
}
[/block]

* You can similarly define URL mappings as you want, owing to the flexibility provided by AlertOps’ OpenAPI/Plug-and-Play integrations. You can provide other filters and match with regex expressions as well. You can also test the generated URL with the sample data provided.

**Configuration of Rollbar for the Integration:**

* In your Rollbar portal, select your project settings. Under Integrations > Notifications select Webhooks under Available Channels. The below screenshot shows Active since it is already configured.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/78c8cd9-alertops_image4.png",
        "alertops_image4.png",
        1913,
        885,
        "#e7e8ec"
      ]
    }
  ]
}
[/block]

* In the configuration, under URL, paste the AlertOps Inbound Integration API Endpoint.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/b266679-alertops_image5.png",
        "alertops_image5.png",
        1681,
        577,
        "#e2e5ea"
      ]
    }
  ]
}
[/block]

* Under Rules, makes sure rules are created for New Item, Item Reopened, Item Resolved. You can configure rules however you want and map it accordingly in AlertOps, since it is all customizable.
* For each rule, paste the AlertOps Inbound Integration API URL, and make sure format is selected as JSON. Add filters as required.
* Make sure the webhook is enabled, and save settings.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/cca4479-alertops_image6.png",
        "alertops_image6.png",
        1845,
        851,
        "#e4e5ea"
      ]
    }
  ]
}
[/block]

Thats it! You have configured a webhook integration. Any alert will be sent to AlertOps for incident management.

Message logs, alert specific information can be viewed in the “Inbound Log” section in AlertOps Dashboard. Alerts can be viewed in the ‘Alerts’ tab as well.

**Alert Triggering Information:**

AlertOps will automatically create an incident when a new alert is received from Rollbar when the event\_name contains "new\_item".

If an alert with status "new\_item" matches an existing Open Alert, AlertOps will recognize the new alert as a duplicate and ignore the alert.

The alert will be recorded in the Inbound Messages table as “Mapped Appended.”

AlertOps will automatically close the same incident when an alert with event\_name contains "resolved\_item".