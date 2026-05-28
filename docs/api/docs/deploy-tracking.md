<!-- source: https://docs.rollbar.com/docs/deploy-tracking.md -->

# Deploy Tracking

If you notify Rollbar every time you deploy or release your app, you'll unlock several features that will help your debugging process.

**NOTE:** Deploy tracking is enabled by config changes made outside of Rollbar; you will need to send [API calls](https://docs.rollbar.com/reference/post-deploy) from your CICD tool to the Rollbar API to notify the platform of your deploy actions. They will not be detected automatically.

> 📘 Setup instructions
>
> Instructions for reporting deploys in specific tools are in the links to the left.

## Deploys Screen

The deploy screen shows a detailed view of all deployments made to a particular environment.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/bf97d86-image_3.png",
        "image (3).png",
        1280
      ],
      "align": "center",
      "border": true,
      "caption": "Deploy history for a project and environment including undeployed commits."
    }
  ]
}
[/block]

The entry for each deploy includes:

* Start & finish time
* Deploy status
* Deploying user (if known)
* Target environment
* Code version (typically a Git SHA or a version number)
* Deploy comments
* List of commits included (if you've [connected Rollbar to a git repository](/docs/source-control/))

### Undeployed Changes

If you've [connected Rollbar to a git repository](/docs/source-control/), then your deploys page will show all commits that have not yet been deployed to production.

## Suspect Deploy

When deploys are reported to Rollbar, we'll attempt to identify a 'Suspect Deploy' for each error.

![](https://files.readme.io/91bcc4c-Screenshot_2019-03-27_16.07.06.png "Screenshot 2019-03-27 16.07.06.png")

The suspect deploy is one of the following:

* The last deploy prior to the first occurrence of the error *(if the item has never been resolved)*.
* The last deploy prior to the reactivation of the error *(if the item was previously resolved)*.

We are planning to improve our suspect deploy algorithm in the future to improve its accuracy.

## Deploys in Item Feed

Deploys will appear in your live item feed so you can quickly see whether a recent deploy might be responsible for new errors.

![](https://files.readme.io/7eccb6a-image_4.png "image (4).png")

## Auto-Resolve on Deploy

You may want to resolve all active items every time you deploy, so that only new occurrences of errors and messages will appear in your live feed.  This can be configured via the instructions [here](https://docs.rollbar.com/docs/auto-resolve-old-items).

## Deploy timeout

If a deploy is reported with `status`=`started`, the deploy must be updated to have status of `succeeded`, `failed`, or `timed_out` within a certain time period (default is 60 minutes), otherwise the system will set the status to `timed_out`.  The timeout period for each project can be set at **Settings → Deploys**.