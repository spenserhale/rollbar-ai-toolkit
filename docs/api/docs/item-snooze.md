<!-- source: https://docs.rollbar.com/docs/item-snooze.md -->

# Item Snooze

Pause notifications for an item for a specific period of time

# Overview

The Snooze option prevents notifications from being sent for a particular item for a specific period of time. After the time period has expired, notifications will be sent again.

During this time, occurrences will still be processed and count towards the occurrence limit, only notifications will be paused. Snoozing allows users to pause notifications while investigating and resolving issues, but mitigates the issue with the related Muted status where an item could be generating occurrences for an indefinite period of time.

The Snooze option offers the default periods 1-day, 1-week, 1-month, 3-months, or a custom period can be set. Items cannot be snoozed indefinitely.

# Snoozing Items

Items can be Snoozed on both the item list and item detail pages

## Item List

Items can be Snoozed individually using the inline option

![](https://files.readme.io/969e5fd-image.png)

Multiple items can be Snoozed using the batch action option.

![](https://files.readme.io/6b26b8f9b64b77d483a0d8112610a939b0bf73209db6623cd7e06f8b434b2ea0-image.png)

![](https://files.readme.io/63d7831feaae68687851268a27b186c018cd8c1b492fa330b7c7b25aacc892f7-image.png)

<br />

Items can also be unsnoozed from the same menu options.

Changes to the snooze state are recorded in the history sidebar.

### Filtering snoozed items

By default, snoozed items are filtered out from the item list page so that users can focus on active items. The Snooze filter allows users to include snoozed items in the item list results, as well as to only show snoozed items.

![](https://files.readme.io/3c07494583cd38d311ed3c8179c16ac3fa12035f5ba915dfd86bb878be4d0eba-image.png)

<br />

## Item Detail

In the item detail page, the option in the header allows users to choose the time period.

![](https://files.readme.io/eaf5421-image.png)

For Muted items, the Snooze dropdown offers the ability to unmute the item, or convert to a Snoozed item with an end date. The option to Mute an item has been removed from Item Detail page.

# Notes

* Snooze is available for all paid tiers - Essentials, Advanced & Enterprise