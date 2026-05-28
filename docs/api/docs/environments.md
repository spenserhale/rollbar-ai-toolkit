<!-- source: https://docs.rollbar.com/docs/environments.md -->

# Environments

How to use `environment` and `host` properties when you deploy to multiple environments

Rollbar requires the `environment` property on all errors to indicate where they occurred (`production`, `staging` , `qa` , etc.).

The choice of which `environment` values to use is important due to the following considerations:

* Items are separated by environment
* Items cannot be merged if they are in different environments

## Handling multiple production systems

Many of our customers deploy their apps to multiple production systems, e.g. multiple zones in Amazon Web Services, Google Cloud Platform, Azure, etc.

In this case, you might want to see all the items and deploys to any of your production environments at once, but also be able to track which system a particular error occurred in.  You probably will want to merge items that occurred in different production environments if they have the same root cause.

## Recommended usage

* Use the environment value `production` for all errors from and deploys to any production environment, even if you have multiple production environments.
* Use the `host` property in your error payloads to include the 'full path' of the server where an error occurred, including the name of the region/zone, e.g. `us-east-1-web02` for the server `web-02`  that is hosted in the `us-east-1` region.

If you follow this approach, you can then merge any items that occur in a production environment, regardless of which region/host it occurred in.

To find the items that are only occurring in a particular region, you can use the host advanced search option, which supports prefix search:

`host:us-east-1 `

To find items that occurred on a specific server within the region, you can enter the fully-qualified host name:

`host:us-east-1-web02 `

## Access tokens & rate limits

It's likely that you care more about errors coming from your production environment than from non-production environments, and that you don't want a non-production error to consume too many Rollbar events.

In order to ensure that you can use Rollbar in all your environments but limit event consumption in non-production environments, we recommend the following:

* Create a set of access tokens for your non-production environments, and apply a rate limit that makes sense for you.
* Create a set of access tokens for your production environments, and don't apply rate limits, unless you can accept losing error data from production.