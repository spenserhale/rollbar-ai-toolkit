<!-- source: https://docs.rollbar.com/docs/auto-resolve-old-items.md -->

# Automatically Resolving Items

Resolve items based on age or deploys

You can configure Rollbar to automatically resolve active items to simplify your error management workflow.  The options are set per environment, and can be found by going to **Settings → Auto-Resolve** in each of your projects.

## Inactive Items

This option will automatically resolve items if they have not occurred in a certain number of days.  Items are checked for inactivity approximately every 30 minutes, and whenever you update your settings.

## On Deploy

This option allows you to resolve all active items whenever you report a [deploy](https://docs.rollbar.com/docs/deploy-tracking).

## Notification Rules

When items are automatically resolved; Email, Slack and DataDog notifications will not run. Webhook notifications however can be used and will execute for both manual and automated updates where an items status is set to Resolved.