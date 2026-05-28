<!-- source: https://docs.rollbar.com/docs/datadog.md -->

# Datadog

Create Datadog events from Rollbar

Rollbar users can syndicate exceptions, errors, and code deployments as 'Events' in [Datadog](https://www.datadoghq.com/).

## Setup

Configuration is per project in Rollbar.

### 1. Enable the Rollbar integrations in Datadog

1. In Datadog, go to **Integrations → Integrations** and search for `Rollbar`. Pick the **Rollbar by Datadog Integration**.\
   ![](https://files.readme.io/8c4bc10-image.png)
2. Alternatively, you can use the corresponding link to navigate to the Rollbar integration on your [Datadog site](https://docs.datadoghq.com/getting_started/site/) directly: [US1](https://app.datadoghq.com/integrations/rollbar), [US3](https://us3.datadoghq.com/integrations/rollbar), [US5](https://us5.datadoghq.com/integrations/rollbar), [EU1](https://app.datadoghq.eu/integrations/rollbar), [US1-FED,](https://app.ddog-gov.com/integrations/rollbar) [AP1](https://ap1.datadoghq.com/integrations/rollbar).
3. Click **Install**.
4. Click **Install Integration** on the next screen.
5. **Choose** or **Create a New** API key. You'll need it in the next step.

### 2. Configure Datadog integration in Rollbar

1. In Rollbar, navigate to **Settings**
2. Choose **Projects** in the **Setup** section.
3. Click the **+** button to add a new integration to your project.\
   ![](https://files.readme.io/55b1e6c-image.png)
4. Choose **Datadog** from the list.
5. Pick the site of your Datadog account.
6. Paste your Datadog API key.
7. Click **Enable Datadog Integration**

### 3. Validate the integration

1. In Rollbar, click the **Send Test Notification** button.
2. In Datadog, open the **Events Explorer** and check if the test Event arrived:\
   ![](https://files.readme.io/4524b96-image.png)

Congrats! Datadog is now integrated with Rollbar. Once integrated, the default notification 'Rules' will be activated and sent to your Datadog account.

## Customizing Datadog Notification Rules

The Datadog event created by each notification rule can be customized using [notification variables](/docs/notifications#section-notification-variables) and filters.  Additionally, you may specify a different API key for each notification rule if you wish to send the events to a different Datadog account.

### Customizing Datadog tags

You can set Datadog tags as part of sending customized Rollbar data. These tags would be linked to the Datadog events to filter the logs. Datadog allows tags with the format of `<key>` or   `<key>:<value>`. You would need to use the `<key>:<value>` format to optimally utilize Datadog's filters.

You can use existing Datadog tags or have Rollbar automatically create new tags on your behalf (as long as your Datadog settings allow new tags to be created).. You can review Datadog's default tag filters [here](https://docs.datadoghq.com/getting_started/tagging/#overview).

#### Datadog tagging example

My Rollbar item has the value of `production` in the `environment` data key. I would like that to show up in Datadog properly. Let's go through a quick example of properly tagging a Datadog event:

* Navigate to your Datadog settings
  * Click Projects
  * Click the Datadog logo next to your project name
* Now either edit your existing rule or configure a new rule. This will show the configuration popup.
* Scroll down to the `Tags` section.
* In the field I will place `env:{{environment}}`

  * This is because I want to pass the Rollbar item environment and use Datadog's default `env` key. This would need to be formatted as `<key>:<value>`.
  * Rollbar would then send `env:production` to Datadog.

  ![](https://files.readme.io/61128c4-image.png)
* Click `Save Rule`
* Your notification rule should now show the environment tag being sent

![](https://files.readme.io/6214116-image.png)

* Now all future Datadog messages in that project will send the environment.

![](https://files.readme.io/84e5a86-image.png)

## Automatic Event Priority

When creating an event in Datadog from Rollbar, you can explicitly set the priority (`low`, `normal`) or allow Rollbar to automatically determine the priority.  Here's how priority is automatically determined:

| Rollbar Notification Rule | Datadog Priority |
| ------------------------- | ---------------- |
| Item resolved             | `low`            |
| *Everything else*         | `normal`         |

### Automatic Event Type

When creating an event in Datadog from Rollbar, you can explicitly set the type (`error`, `warning`, `info`, `success`) or allow Rollbar to automatically determine the type.  Here's how type is automatically determined:

| Rollbar Notification Rule | Datadog Event Type                 |
| ------------------------- | ---------------------------------- |
| Deploy                    | `info`                             |
| Item resolved             | `success`                          |
| *Everything else*         | *determined by Rollbar item level* |

Rollbar item levels are mapped to Datadog event types as follows:

| Rollbar Item Level  | Datadog Event Type |
| ------------------- | ------------------ |
| `critical`, `error` | `error`            |
| `warning`           | `warning`          |
| `info`, `debug`     | `info`             |