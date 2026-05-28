<!-- source: https://docs.rollbar.com/docs/issue-tracking.md -->

# Issue Tracking Integration

Create issues in JIRA, Trello, Github, and more

Rollbar can integrate with many popular issue trackers so you can manage Rollbar-detected errors in your existing workflow.

> 📘
>
> For specific instructions for setting up your issue tracker, see the links to the left.

## Issue Tracking Options

When Rollbar is connected to your issue tracker you can *manually*:

* **Create** an issue to track a Rollbar error.
* **Link** a Rollbar error to an existing issue.

Additionally, Rollbar can be configured to *automatically*:

* **Create** an issue for new or frequently-occurring errors.
* **Reopen** a linked issue when a Rollbar error is reactivated or reopened by a user.
* **Resolve** a linked issue when a Rollbar error is resolved.

## Manual Issue Tracking

> 📘
>
> Screenshots below are for JIRA , but the same features/concepts apply to all issue tracker integrations.

When issue tracking is enabled for a project, users can manually create an issue for a Rollbar error by clicking the `Create` button at the top of the screen.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/3fb27cf534359f41bb21536ad2e5461d9b86b891ef576f13055f57e1d6b9ad8a-Screenshot_2024-09-03_at_11.16.06_AM.png",
        "create_issue.png",
        690
      ],
      "align": "center"
    }
  ]
}
[/block]

It's also possible to link a Rollbar error to an existing issue.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/a6a686a421618bd7a92db873ceb5e6d34faf90893b80b6db3234c1f5178fe0cd-Screenshot_2024-09-03_at_11.15.44_AM.png",
        "link_issue.png",
        559
      ],
      "align": "center"
    }
  ]
}
[/block]

When a Rollbar error is linked to an issue, the `Create` button is replaced with a `View` button that will take you directly to the issue in your tracker.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/8f8d00c17b15c49ce3cd8029b8294ed8c440f7d07cc15de1f09122b3797ca5b7-Screenshot_2024-09-03_at_11.16.44_AM.png",
        "view_issue.png",
        529
      ],
      "align": "center"
    }
  ]
}
[/block]

You can change or remove the link via the dropdown menu on the `View` button.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/f6bd610ecc4cdebad8d0e5c632e1883a7b022c55a70e2ffa261538175ca8d347-Screenshot_2024-09-03_at_11.17.10_AM.png",
        "unlink_issue.png",
        589
      ],
      "align": "center"
    }
  ]
}
[/block]

## Automatic Issue Tracking

Each Rollbar project can be configured to automatically create and update issues in response to triggering events.

To configure the rules for automatic issue tracking, go to **Settings**, then **Notifications** and select your issue tracker.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/6c65d0f3d480534ded5458a2f33c80cee699e417b6602910f48d32497838b887-Screenshot_2024-09-03_at_11.18.19_AM.png",
        "issues_add_rule.png",
        881
      ],
      "align": "center"
    }
  ]
}
[/block]

Rules can be filtered to only trigger in specific conditions (e.g. only create issues for items in production that have level error or higher).

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/d41b5c11e639ddf98e0d4caefc4bef158a3c0d073984de179da54850d164c6d0-Screenshot_2024-09-03_at_11.20.01_AM.png",
        "issues_edit_rule.png",
        571
      ],
      "align": "center",
      "sizing": "500px"
    }
  ]
}
[/block]