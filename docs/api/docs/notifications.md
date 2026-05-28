<!-- source: https://docs.rollbar.com/docs/notifications.md -->

# Notifications / Alerting

Rollbar provides real-time alerts through the project-level Notifications menu.

Rollbar supports email and many messaging and incident management tools where your team can get notified about errors and important events by real-time alerts.

Notifications can be triggered only in specific conditions using filters, and the message format can be customized using variables.

Notifications are a project-level configuration. They are found in Projects > \[Project Name] > Notifications, and each different integration has its own set of rules.

## Notification Types

* [`Adaptive Alerts`](https://docs.rollbar.com/docs/adaptive-alerts) - Zero conf, reliable alerts about high crash rates using Anomaly Detection in  Email or Slack
* `New Item` - An error/ message is seen for the first time.
* `Every Occurrence` - Every time an error/ message occurs (use wisely!).
* `10^th Occurrence` - 10th, 100th, 1,000th, 10,000th, … occurrence
* `High Occurrence Rate` - `{x}` occurrences seen in `{y}` minutes (configurable).
* `Item Resolved` - An error/message is marked Resolved.
* `Item Reopened` - An error/message is marked Active by a user.
* `Item Reactivated` - An error/message occurs again after being marked Resolved.
* `Deploy` - A new deploy is reported.
* `Daily Summary` - *(Available in email only)* Summary of daily error/message activity in a project

## Notification Filters

To keep your notifications relevant, you'll want to apply filters to limit when they send messages or create incidents. (especially if using an Every Occurrence  filter.)

The following filters can be applied to notification rules:

### Item and Occurrence Notifications

* `Environment`
* `Level`
* `Title`
* `Filename` - Matches the name of any file in the stack trace
* `Context` - Matches context value (if included in payload)
* `Method` - Matches any method in the stack trace.
* `Framework` - Platform/language of the error
* [`Path`](https://docs.rollbar.com/docs/path-filter) - Allows for filtering based on any data in the JSON payload, e.g. `body.body.trace.exception.message`.  To view the JSON structure of your errors, check out the **Raw JSON** section of any occurrence.
* `Unique IPs Affected`

## Notification Status

Through our API or [Terraform](https://github.com/rollbar/terraform-provider-rollbar), this optional parameter will change the state of an individual notification to turn noisy notifications on or off without deleting and reinstating them.   The option will default to true when a new notification is created, and the status is omitted.

* `enabled` - Notifications will be sent as normal.
* `disabled` - Notifications are disabled and will not send

> 📘 UI Notes
>
> Notifications are displayed as disabled in the UI but states can only be changed in the API/Terraform

<br />

### Deploy Notifications

* `Environment`
* `Comment` - Matches optional comment sent with deploy

Certain filter criteria support regex matching.  You can test your regexes using [Pythex](https://pythex.org/).

## Notification Variables

Rollbar supports variables in notifications using a familiar {{VARIABLE\_NAME}} syntax. Different variable values are available depending on the type of event that triggers the notification.

### Usage Examples

Default Deploy Message to Slack:

```
[##{{project_slug}}] ##{{username}} deployed revision ##{{revision}} to ##{{environment}} ##{{link}}
```

Default Event title for Datadog:

```
[##{{project_slug}}] ##{{environment}} - ##{{trigger_description}} ##{{level}}: ##{{title}}
```

<br />

### Items

When an item has changed and triggered a notification, the following variables are available:

* `{{link}}`  - Item URL
* `{{project_slug}}`  - Project name
* `{{title}}`  - Item title
* `{{summary}}`  - Item summary
* `{{markdown_summary}}`  - Items summary including markdown
* `{{environment}}`  - Environment reported in item (e.g. production, staging, etc.)
* `{{body.framework}}`  - Framework reported in item (e.g., Rails, browser-js, etc.)
* `{{level}}`  - Critical, Error, Warning, Info, Debug
* `{{status}}`  - Active, Resolved, Muted
* `{{trigger_description}}`  - Description of event that triggered the notification
* `{{username}}`  - Rollbar user that triggered the notification (if any)
* `{{last_occurrence_time}}`  - Friendly-formatted timestamp of last occurrence (e.g. 1 minute ago)
* `{{last_occurrence_link}}`  - Last occurrence URL

<br />

### Occurrences

When occurrences of an item trigger a notification, the following variables are available:

* `{{project_slug}}`  - Project name
* `{{environment}}`  - Environment reported in item (e.g. production, staging, etc.)
* `{{title}}`  - Item title
* `{{level}}`  - Critical, Error, Warning, Info, Debug
* `{{status}}`  - Active, Resolved, Muted
* `{{occurrence_title}}`  - Same as item title
* `{{occurrence_link}}`  - Occurrence URL

Additionally, any data nested under `body` is available. The notification variable must have an additional `body` prefix. For example, an occurrence's `body.message.body` is available as `{{body.body.message.body}}`

<br />

### Deploys

When a deploy triggers a notification, the following variables are available:

* `{{project_slug}}`  - Project name
* `{{username}}`  - Rollbar user who triggered the deploy, or unknown
* `{{revision}}`  - Deployed revision
* `{{environment}}`  - Environment to which the deploy occurred (e.g. production, staging, etc.)
* `{{link}}`  - URL of deploy details in Rollbar
* `{{start_time}}`  - Deploy start time (formatted based on project timezone setting)
* `{{finish_time}}`  - Deploy finish time (formatted based on project timezone setting)
* `{{comment}}`  - Deploy comment

## Notification Channels

Rollbar supports integrations with many popular services (check the sections under this page in the sidebar). In addition, there's an email notification channel that's enabled by default, and supports many of the above features.

## Notification Deliverability

### Webhook Auto-Shutoff

Rollbar detects and notifies you when your Webhook notification rules have stopped working. See: [Webhook Auto-shutoff](https://docs.rollbar.com/docs/webhooks#auto-shutoff).

### Email Deliverability

Not getting notification emails? Please reach out to <support@rollbar.com> and we'll be glad to help troubleshoot!