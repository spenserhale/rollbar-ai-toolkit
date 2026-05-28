<!-- source: https://docs.rollbar.com/docs/metrics-api-examples.md -->

# Metrics API Code Examples

The Rollbar Metrics API provides the ability to retrieve important metrics about the data that is sent to Rollbar to help teams to make decisions about their SDLC

Here are some example scripts that utilize the Rollbar Metrics API:

### Best-practice for access tokens used for Metrics API calls

It is recommended that you use separate project access tokens and a separate account access token for Metrics API calls, with an appropriate rate limit.
Access tokens used for Metrics API calls should be named in way that makes it clear that they are being used for Metrics API calls

Access tokens that access the Metrics API require Read scope

### Metrics API Documentation.

<https://docs.rollbar.com/reference/post_api-1-metrics-items>
<https://docs.rollbar.com/reference/post_api-1-metrics-occurrences>

### For all Rollbar Projects, get the top 10 occurring items in the last 24 hours

Gets top 10 occurring items in the last 24 hours for all projects in a Rollbar account.
This looks at all environments, all item statuses, and all item levels.

<https://github.com/RollbarCustomerEng/metrics-scripts/blob/main/scripts/projects_dashboard.py>

### Get Item counts in the last 24 hours for all Rollbar Projects

This example script iterates through all Rollbar projects in an account and returns the occurrence counts for each Item in a time period

This script could be used to help teams to see which errors should be prioritized across all Rollbar projects in and organization

<https://github.com/RollbarCustomerEng/metrics-scripts/blob/main/scripts/get_account_item_metrics.py>

### Get Muted Items

Get occurrence counts of Muted Items.
Muted Items are often not visible to the development team. This example can be used to give visibility into Muted Items that are occurring at a high rate.

<https://github.com/RollbarCustomerEng/metrics-scripts/blob/main/scripts/get_muted_items.py>

### Get common Item metrics

Get details of commonly used metrics for Items, including:

* Occurrence counts
* IP addresses impacted by item occurrences
* Count of different people impacted by item occurrences

<https://github.com/RollbarCustomerEng/metrics-scripts/blob/main/scripts/get_common_item_metrics.py>