<!-- source: https://docs.rollbar.com/docs/status-active-resolved-muted.md -->

# Item Status (The Rollbar Workflow)

Active / Resolved / Muted / Archived items

In Rollbar, all Items have a *status* that determines where they appear and how they behave. There are four statuses: Active, Resolved, Muted, and Archived.

<h3>Overview</h3>

<p>Chances are you have multiple incoming occurrences in your Rollbar projects, grouped into items, appearing in your Item list, one after another. You also start to receive notifications pouring in your inbox. Now, you might as well keep your incoming items organized and clean by Rollbar’s useful options of:</p>
<ul>
<li>Setting up statuses for your items, that determine how they appear and behave,</li>
<li>Triaging and rating them based on their severity level.</li>
</ul>
<p>This way you can make sure your item list is transparent, you will not be spammed by irrelevant notifications, provide clear visibility for your teams who manage the same project by appropriately triaging your errors and setting up the relevant severity level and status, to speed up the process of debugging, making sure everyone focuses their attention on the relevant things!</p>
<iframe width="720" height="405" src="https://www.youtube.com/embed/Eedkzgd9s1c" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Active

All items start as Active. In the Active state:

* The item can appear on the Dashboard
* Notifications will be triggered on the first occurrence and when thresholds are crossed (according to notification rules)
* Occurrences count for billing purposes

The Active state is intended to represent an ongoing type of event happening in your application. It could represent a bug that has not yet been fixed, or an intermittent ongoing backend issue.

Items can change from Active to Resolved in these ways:

* Manually changed by a user in the Rollbar UI (by pressing "Resolve" or "Set Status" -> "Resolved")
* Set via the [Rollbar API](https://docs.rollbar.com/reference/update-an-item)
* [Resolved via commit message](https://rollbar.com/docs/resolve-via-commits/) when that commit is deployed
* Autoresolved on deploy, when enabled (see Settings -> Deploys)
* Autoresolved after not occurring for a period of time, when enabled (see Settings -> Inactive Items)

Items can change from Active to Muted in these ways:

* Manually changed by a user in the Rollbar UI (by pressing "Mute" or "Set Status" -> "Muted")
* Set via the [Rollbar API](https://docs.rollbar.com/reference/update-an-item)

## Resolved

Resolved items represent issues that are believed to be fixed. In the Resolved state:

* The item won't appear on the Dashboard
* If the item occurs again in a newer version of the code (or no version was specified), it will be "Reactivated". This will trigger a notification.
* Occurrences count for billing purposes

When you believe you have fixed a bug, or if you want to be notified the next time it happens, mark it as Resolved.

If possible, you should include the version that it is resolved in: this will prevent it from being reactivated before you deploy the new code, or from being reactivated by clients that are still running the old code (this is especially important for mobile apps). Note that this functionality requires the 'code\_version' to be configured in the SDK. More details in [this post](https://rollbar.com/blog/resolving-rollbar-items-in-versions).

Items can change from Resolved to Active in these ways:

* Manually changed by a user in the Rollbar UI (by pressing "Reopen" or "Set Status" -> "Active")
* Set via the [Rollbar API](https://docs.rollbar.com/reference/update-an-item)
* Automatically on the next occurrence of the same item (subject to the version constraint described above)

Items can change from Resolved to Muted in these ways:

* Manually changed by a user in the Rollbar UI (by pressing "Reopen" then "Mute")
* Set via the [Rollbar API](https://docs.rollbar.com/reference/update-an-item)

## Muted

Muted items represent issues that are not currently worth investigating. In the Muted state:

* The item won't appear on the Dashboard
* If the item occurs again, it will remain Muted
* Occurrences count for billing purposes

If you have an item that you consider a non-issue, or otherwise don't plan to do anything about soon, you can Mute it so it stays out of sight.

Muted items are still indexed, searchable, etc. and can be changed back to Active at any time. For this reason, occurrences of Muted items do count for billing purposes. If you need to reduce your usage, you should set a [rate limit](https://rollbar.com/docs/rate-limits/) or filter it before it is sent to Rollbar.

Items can change from Muted to Active in these ways:

* Manually changed by a user in the Rollbar UI (by pressing "Unmute" or "Set Status" -> "Muted")
* Set via the [Rollbar API](https://docs.rollbar.com/reference/update-an-item)

Items can change from Muted to Resolved in these ways:

* Manually changed by a user in the Rollbar UI (by pressing "Set Status" -> "Resolved")
* Set via the [Rollbar API](https://docs.rollbar.com/reference/update-an-item)

## Archived

Archived items are group items that have had all of their member items unmerged from the group. Since the member items are all reassigned to their original item number, the group item is no longer needed.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/bbe1e1a-small-Screenshot_2023-05-04_at_2.40.42_PM.png",
        null,
        "An example of an archived item's history, showing the merge that created the group item and the unmerge that archived it."
      ],
      "align": "center",
      "caption": "An example of an archived item's history, showing the merge that created the group item and the unmerge that archived it."
    }
  ]
}
[/block]

An archived item is essentially dead, but the item is retained for its historical information. Re-merging the same member items will not reactivate the archived item, a new group item will be created.