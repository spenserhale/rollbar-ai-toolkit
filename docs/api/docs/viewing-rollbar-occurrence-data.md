<!-- source: https://docs.rollbar.com/docs/viewing-rollbar-occurrence-data.md -->

# Viewing Rollbar Occurrence Data

Rollbar ingests events called *occurrences* and groups them into single root-cause issues called *items*. It is usually sufficient to view the data in the item to identify the code culprit of the error, but it can also be helpful to drill down into the individual events to see the exact payload sent from the code to the Rollbar platform.

# Viewing your Occurrences

To see an individual occurrence, first click on an item from your Items menu to see the item details menu for a single item with the stack trace and other item information. From there, you can click on the **Occurrences** tab to view a list of all occurrences.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/9498a1285143f77762097fb734afef82add6190e5e64895cd9ebc41122771a1f-Screenshot_2024-08-30_at_2.37.18_PM.png",
        null,
        "The \"Traceback\" sub-menu is shown by default when viewing an item. Click the \"Occurrences\" sub-menu to view the table."
      ],
      "align": "center",
      "caption": "Notice that there are tabs listed to the right of the Detail tab (default page), including the Occurrences tab"
    }
  ]
}
[/block]

Once you click this sub-menu, you can see some of the occurrence data in the table, but not all of it. You need to then click on the timestamp shown in the left-most column to view a single occurrence and its data.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/e7d874efb7a0a56ac4104bf10cec35eb79a4b1465a877d45a8bd6fef63252235-Screenshot_2024-08-30_at_2.41.09_PM.png",
        null,
        "Click on the timestamp shown in the left column to view a single occurrence."
      ],
      "align": "center",
      "caption": "Click on the timestamp shown in the left column to view a single occurrence."
    }
  ]
}
[/block]

The item detail page will contain the data for the given occurrence. You can see the telemetry data for a single event as well since it will vary from one occurrence to the next. Below the stack trace, you will find a Params table that shows a number of important fields from the occurrence.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/9fb28d9-small-Screenshot_2023-05-04_at_2.14.15_PM.png",
        null,
        "The \"Params\" table and some of its contents."
      ],
      "align": "center",
      "caption": "The \"Params\" table and some of its contents."
    }
  ]
}
[/block]

To see the raw JSON payload, click on the **JSON** button on the top-right of the Item detail page. This is the ultimate source of truth for the given event, and shows the full JSON dot-notation to arrive at the given field. The Params table will sometimes remove the prefixes from a given field, so for proper field reference use the dot notation indicated by the JSON payload.

[block:image]{"images":[{"image":["https://files.readme.io/b005ed0945fb1547129a65352d1e4acf3cc49f7bb0f90697510ddb20c61224aa-Screenshot_2024-08-30_at_2.44.01_PM.png",null,null],"align":"center","caption":"JSON button on the top-right corner"}]}[/block]

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/5bc1238578aeab8b0b1e0808b5b8fa7252c6129df3d635898340ec8dd6d04947-Screenshot_2024-08-30_at_2.49.31_PM.png",
        "",
        ""
      ],
      "align": "center",
      "caption": "JSON payload displayed as a popup within the screen"
    }
  ]
}
[/block]

## [Custom data fields](https://docs.rollbar.com/docs/custom-data)

In many cases, it is helpful or necessary to add additional data fields to the Rollbar payload beyond what is automatically captured. These data fields will also be shown in both the "Params" table and the JSON payload.

# Deleting an Occurrence

Occurrences can be deleted using the Rollbar API.

> 📘 Item deletion not currently supported
>
> We have received feature requests for item deletion and will be incorporating this feature into the product soon.