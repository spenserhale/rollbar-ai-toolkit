<!-- source: https://docs.rollbar.com/docs/reporting-uncaught-errors.md -->

# Reporting Uncaught Errors

Rollbar automatically reports uncaught Apex exceptions and Flow and Process errors when these options are enabled in the configuration. (To confirm your settings, navigate to Installed Packages -> Rollbar -> Post Install Instructions -> View.)

### Troubleshooting

Salesforce uses email to report these errors, and Rollbar's handler is set up to parse the error data from these emails.

For uncaught Apex exceptions\*, Salesforce does not send exception emails for errors that appear to be duplicates of errors seen previously.

[block:callout]
{
  "type": "info",
  "body": "If duplicate exceptions occur in Apex code that runs synchronously or asynchronously, subsequent exception emails are suppressed and only the first email is sent. This email suppression prevents flooding of the developer’s inbox with emails about the same error.\n\n[help.salesforce.com](https://help.salesforce.com/articleView?id=code_apex_exceptions.htm&type=5)",
  "title": "From the Salesforce doc:"
}
[/block]

*\*For Flow and Process errors, it appears that all errors are reported whether duplicate or not.*

If it appears that Rollbar isn't reporting some errors, you may add an email address to the list of addresses at Setup > Apex Exception Email -> External Email Addresses, being careful not to remove or alter the Rollbar Email Service address. All addresses in this list receive the Salesforce exception emails.

If you receive Salesforce exception emails for errors that were not reported by Rollbar, please forward the email to Rollbar Support to investigate the reporting issue.