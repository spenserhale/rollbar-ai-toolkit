<!-- source: https://docs.rollbar.com/docs/versions.md -->

# Version Tracking

Version tracking

Rollbar allows you to see which versions of your code are throwing exceptions.  This is particularly helpful if you are continuously deploying your apps/services because you can see if recent occurrences are coming from the latest deployed version.  With the information provided by Rollbar Versions, you can determine whether to proceed with a full deployment after a canary deploy, or if you should roll back to a previous stable version.

![](https://files.readme.io/34fb7c9-image_6.png "image (6).png")

By clicking through to view the details of a version, you can see exactly which items were introduced, reactivated, or resolved in each version, as well as a list of the commits that were merged since the previously deployed version.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/53de6fb-Screen_Shot_2018-07-17_at_1.24.44_PM.png",
        "Screen Shot 2018-07-17 at 1.24.44 PM.png",
        1200
      ],
      "align": "center",
      "sizing": "100"
    }
  ]
}
[/block]

# Enabling Versions

In order to fully utilize Versions, you should do the following:

* Make sure that your Rollbar item occurrences include the `code_version` property.  This is typically a Git SHA for web apps, but you may choose to use a semantic version, datestamp, or other unique indicator.  See the documentation for your Rollbar SDK or the [Rollbar API docs](https://docs.rollbar.com/reference/getting-started-1) if you are calling the Rollbar REST API directly.
* Report each deploy of your apps/services, including the same values for `environment` and `revision` as in your item occurrences.  (NOTE:  `code_version` and `revision` represent the same thing.).  See our [Deploy Tracking](https://docs.rollbar.com/docs/deploy-tracking) docs for more details.
* To view the list of commits that were introduced in each new version, set up  [Source Control Integration](https://docs.rollbar.com/docs/source-control) with your project's Git repositories.

## Code example of code version being added to a Go application

Code snippet of code version being configured in a Go application. Each [Rollbar SDK](https://docs.rollbar.com/docs) has similar functionality.

```go

// Rollbar configuration of  environment and code version
rollbar.SetToken(config.accessToken)
rollbar.SetEnvironment(config.environment) 
rollbar.SetCodeVersion(config.codeVersion)   

```

# New Version notifications

Rollbar can notify you of newly detected versions via email or Slack.

## Email

* Go to **Settings → Notifications → Email**
* In the **Add Rule** section, choose **New Version → Send Email**

## Slack

* Go to **Settings → Notifications → Slack**, select either **Email**
* In the **Add Rule** section, choose **New Version → Post Message**

# Non-Git versions (Semantic Versioning, numeric versions, etc.)

Rollbar accepts any string as a value for `code_version`, but most customers use the SHA value provided by Git when a new commit is made. There are cases when other values are needed, and some considerations are included below.

For any value of `code_version` used that is **not** a Git SHA, the code context feature will behave differently. As part of the Git integration for code context, Rollbar will check Git for a revision with the value set in `code_version`. If that value is not found, the code context will show the "resource not found" error mentioned on the [Code Context](https://docs.rollbar.com/docs/code-context) guide.

In order to get code context to work properly with non-SHA values, make sure the given value is set as a tag in Git. One way to add a tag is when creating a new release.