<!-- source: https://docs.rollbar.com/docs/shortcut.md -->

# Shortcut

Create stories in Shortcut for Rollbar items

[block:callout]
{
  "type": "info",
  "body": "For general information about Rollbar's issue tracking features, check out the [Issue Tracking guide](/docs/issue-tracking/)."
}
[/block]

[Shortcut](https://shortcut.com/) is a project management tool for software development teams that can be used to track Rollbar items.

## In Shortcut

* Go to **Settings → API Tokens**, generate a new API token named 'Rollbar', and copy it to your clipboard.

## In Rollbar

* Go to **User Settings → Connected Account → Shortcut** and save your Shortcut API token.
* In your Rollbar project, go to **Settings → Notifications** and then select Shortcut from the list of available channels.
* In the Shortcut configuration screen enter/select the following:
  * API Token:  Token to use as the default for automatic rules.
  * Organization:  Name of your organization, found at `https://app.shortcut.com/{organization}/`.
  * Shortcut project:  The project where stories will be created.
  * Shortcut epic: Epic where the stories will be created. *(Optional)*
  * Initial state:  Shortcut workflow state in which stories will be placed when created.
  * Reactivated state:  Shortcut workflow state in which stories will be placed if a linked Rollbar item is reactivated.
  * Resolved state: Shortcut workflow state in which stories will be placed if a linked Rollbar item is resolved.
  * Labels: Labels to apply to stories when created. *(Optional)*
* Click **Save Settings**, then click **Send Test Notification** to verify that stories can be created with the correct configuration.
* Configure your automated rules, as described in the [Issue Tracking guide](/docs/issue-tracking/).
* Click the toggle to set the integration to **Enabled**.