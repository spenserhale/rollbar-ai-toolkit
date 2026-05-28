<!-- source: https://docs.rollbar.com/docs/search-items.md -->

# Searching for Items

On the Items view, you can filter your Items by many different properties. Some properties are direct properties of the items themselves, while others are evaluated against the occurrences of the item.

In all cases, the Items search will return the matching items and the properties about those items. For filters that evaluate against occurrences the aggregate statistics shown for each Item describe the  subset of occurrences that match the search.

## Filters built into the UI

| Option      | Description                                                                                                                                                                              |
| :---------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Level       | Filters items by current level. `Critical`, `Error`, `Warning`, `Info`, `Debug`. Click on/off to choose  any or all levels.                                                              |
| Owner       | Filters items based on assigned owner. Find items assigned to a specific project member, *any* project member, or unassigned.                                                            |
| Status      | Filters items by current status. `Active`, `Resolved`, `Muted` or Any Status.                                                                                                            |
| Environment | Filters items by environment. Auto-populated based on the data in the project. Any Environment, or choose an environment.                                                                |
| Frameworks  | Filters items by source. Auto-populated based on the data in the project, and only appears when there is more than one source (i.e. language/framework). Any Source, or choose a source. |
| Date Range  | Finds items that had at least one occurrence in the specified date range. Aggregate counts reflect the occurrences in the specified date range.                                          |
| Activated   | Finds items that were activated (first seen, or reactivated after being resolved) in the specified date range.                                                                           |

## Search commands

Many more search options are available via the search text box at the upper right of the items view.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/eebb15a341194d0147ee26500039a0f0ca10a5be5b8b77161f8f8026a2c46142-Screenshot_2025-06-04_at_3.07.19_PM.png",
        "search.png",
        500
      ],
      "align": "center",
      "border": true,
      "caption": "Searching by context"
    }
  ]
}
[/block]

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/670550021559dc66fc0e33278c0516cb432756fee2de3946e9e2610de1f72436-2025-06-04_10_32_19_p.m.-Searching_Rollbar_using_wildcards_1.gif",
        "",
        "Searching using wild cards"
      ],
      "align": "center",
      "border": true,
      "caption": "Searching using wild cards"
    }
  ]
}
[/block]

### Search notes

* The default search type is a prefix search, for example:
  * `code_version:abc` will match the values `abc`, `abcdef`, and `abcxyz`.
* Wildcards searches using the LIKE syntax require the `%` or `_` character
  * `code_version:%c%` will match the values `abc`, `cdef`, and `abcxyz`.
  * `code_version:%c_t%` will match the values `a cat`, `cutting`
* For an exact match, rather than the default prefix query, use double quotes
  * `code_version:"abc"` will match the value `abc`.
* To escape a wildcard, use `\`
  * `request_url:%\%%` will match urls containing a `%` character

## Searchable Fields

Most fields sent to Rollbar are now indexed and searchable. A full search field listing is available\
in the [Searchable Fields Documentation](https://docs.rollbar.com/docs/searchable-fields), but some example search fields are listed below, with usage examples.

### Title

* `hello world` finds items whose title contains both "hello" and "world" (infix search).

### [Context](https://docs.rollbar.com/docs/sdk-configurations#context)

* `context:home#index` finds items with context matching "home#index" (prefix search).

### Comments

* `has:comments` finds items that have comments.

### IP Address

* `ip:101.102.103.104` finds items that were seen by the ip address "101.102.103.104" (exact match).

### [Issues](issue-tracking)

* `has:issue` finds items that have a linked issue.  (NOTE:  This command can be negated using `!has:issue`)

### [People](https://docs.rollbar.com/docs/person-tracking)

* `user_id:12345` finds items/people associated with the user id "12345".
* `username:snowden` finds items/people associated with the username "snowden".
* `email:dvader@theempire.org` finds items/people associated with the email "<dvader@theempire.org>".

`user_id:`, `username:` and `email:` searches default to prefix searches unless an explicit suffix\
search is made.

* e.g. searching for `username:alice` will return alice, alice1234, aliceasdf.
* e.g. searching for `username:%alice` will not return alice1234, aliceasdf.
* e.g. searching for `username:"alice"` will perform an exact match search.

### Stack Trace

* `file:index.php` finds items with stack traces with at least one filename containing "index.php".
* `method:foo` finds items with stack traces where at least one frame's method contains "foo" (case-insensitive, infix match)
* `topfile:mydomain.com` finds items where the topmost stack frame contains "mydomain.com".
* `bottomfile:mydomain.com` finds items where the bottommost stack frame contains "mydomain.com".
* `allfiles:mydomain.com` finds items where all stack trace filenames contain "mydomain.com".
* `nofiles:evildomain.com` finds items where no stack trace filenames contain "evildomain.com".
* `minfiles:2` finds items with at least 2 filenames in the stack trace.
* `maxfiles:10` finds items with at most 10 filenames in the stack trace.

### Exception

* `exception:TypeError` finds all items where the exception class is `TypeError`.

### Code Version

* `code_version:abcdef` finds items that have been seen in the code\_version `abcdef`.

### Item Number

* `#123` finds the item with counter number `123`

### Merging

* `is:group` finds group items that were created by merging similar items

### Fingerprint

* `fingerprint:my-custom-fingerprint` finds items that have the fingerprint `my-custom-fingerprint` (exact match, useful in conjunction with Custom Grouping or sending your own fingerprint string).

## Combining search terms

To combine search terms, separate each term with a space - for example `is:group has:comments`

## Searching Custom fields

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/40e54762dcb63ffc581f6fa82ae9152f63b786ab32017d862ac1d37dfc9b5b76-2025-06-04_10_46_16_p.m.-Searching_custom_fields_in_Rollbar.gif",
        "",
        "Searching custom fields"
      ],
      "align": "center",
      "border": true,
      "caption": "Searching custom fields"
    }
  ]
}
[/block]

Custom data fields are now searchable. Consider a custom field named "key". Custom fields can be searched as follows: `custom[key]:value`

For searches within custom entries that contain subfields, only include the top level field. For example, if the custom data is structured `custom.rollbar-log.server`, you would only include the term `rollbar_log` to query both  `rollbar-log` and all `rollbar-log.*` subfields\
`custom[rollbar-log]:%search_term%`

Note - the fields `request_get`,` request_header`, `request_param`, `request_post` and `traceframe_local` are all also searchable in the same `field[key]:value` format. To search for values that contain spaces, use an underscore (\_) in place of the space. For example, custom\[rollbar\_log]:Search\_term will match items where custom.rollbarLog is "Search Term".

## Searching based on specific item payload values

If you need to search for items based on additional data not outlined above, such as specific fields or values, you can utilize Rollbar's flexible RQL feature. You would be able to filter and search based on specific fields or values. For additional information and usage examples, please refer to our [RQL](rql) documentation.