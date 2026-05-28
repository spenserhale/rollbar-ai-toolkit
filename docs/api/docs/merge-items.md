<!-- source: https://docs.rollbar.com/docs/merge-items.md -->

# Manually Merging Items

Item merging allows you to combine multiple items into one 'group' for easier management and more accurate metrics.  All past and future occurrences of any merged items will automatically be combined.

## Merge into a new item

The first time you encounter a duplicated error, you'll want to create a new group:

* Select one or more items from the same environment in the Items feed. A toolbar with a 'Merge' button will appear above them.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/5464d52-Screenshot_2024-03-01_at_5.05.29_PM.png",
        "Screen Shot 2019-01-10 at 2.13.10 PM.png",
        778
      ],
      "align": "center",
      "sizing": "80",
      "border": true
    }
  ]
}
[/block]

Selecting 'Merge' will display a pop-over allowing you to choose an existing or new group, name the group, as well as set various other attributes for the new item group. Once these are set, choose 'Merge' at the bottom.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/8c80c05-Screenshot_2024-03-01_at_5.07.04_PM.png",
        "Screen Shot 2019-01-23 at 10.53.45 AM.png",
        ""
      ],
      "align": "center",
      "border": true
    }
  ]
}
[/block]

## Un-merge items

If you want to remove items from a group (e.g. because you mistakenly merged the wrong items):

* Go to the group item and select the 'Members' tab at the bottom of the screen to view all items which have been merged into it.
* Select the items you want to remove and click 'Unmerge/Unmerge All'.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/5f5624f-Screenshot_2024-03-01_at_5.10.28_PM.png",
        null,
        ""
      ],
      "align": "center",
      "border": true
    }
  ]
}
[/block]

## Search for merged items

By default, items which have been merged into a group will no longer appear in the project item feed.

To filter the item feed to only show group items, you can search for `is:group`.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/dfd6934-Screenshot_2024-03-01_at_5.21.41_PM.png",
        "image (5).jpg",
        ""
      ],
      "align": "center",
      "border": true
    }
  ]
}
[/block]

## Automatically merge similar items

After you've merged to create a group item, all future occurrences with the same [fingerprint](/docs/grouping-algorithm/) as one of the member items will be included into the group.  You may also want to merge *similar* items that will have different fingerprints into the same group (e.g. all `TimeoutError` exceptions regardless of where they occur).

In order to do this, you can set up a [custom fingerprinting rule](/docs/custom-grouping/) that assigns future occurrences to the group item.  The following example will assign all future occurrences with exception class `TimeoutError` to the existing group item `#123`:

```json
[
  { "condition": {"path": "body.trace.exception.class", "eq": "TimeoutError"},
    "fingerprint": "group-item-123"
  }
]
```

## Fingerprint rule suggestions

If you merge items with a detectable pattern in common (e.g. same exception class and similar exception messages), Rollbar will suggest a new [custom fingerprinting rule](/docs/grouping-algorithm/) to automatically combine future occurrences into the group item that was just created.