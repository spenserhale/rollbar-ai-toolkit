<!-- source: https://docs.rollbar.com/docs/searchable-fields.md -->

# Searchable Fields

List of searchable fields within Rollbar occurrences _(* denotes new fields introduced with Search changes)_

**Search notes**

Search fields can take two forms - *String* and *Exact Match*. For *string* search fields, the search tips below are valid.  For the *exact match* fields, the quotes syntax is not necessary - and where these fields are numeric, the wildcard syntax for strings will not apply.

* The default search type is a prefix search, for example:
  * `code_version:abc` will match the values `abc`, `abcdef`, and `abcxyz`.
* Wildcards searches using the LIKE syntax require the `%` or `_` character
  * `code_version:%c%` will match the values `abc`, `cdef`, and `abcxyz`.
  * `code_version:%c_t%` will match the values `a cat`, `cutting`
* For an exact match, rather than the default prefix query, use double quotes
  * `code_version:"abc"` will match the value `abc`.
* To escape a wildcard, use `\`
  * `request_url:%\%%` will match urls containing a `%` character

<br />

| Field                        | Field Type  | Description                                                                                                                                                 |
| :--------------------------- | :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| has:comments                 | String      | finds items that have comments                                                                                                                              |
| has:issue                    | String      | finds items that have a linked issue. (NOTE: This command can be negated using !has:issue)                                                                  |
| is:group                     | String      | finds group items that were created by merging similar items                                                                                                |
| title                        | String      | the default search option if no prefixes are added, searches the titles of items                                                                            |
| host                         | String      | finds items that occurred at least once on a host whose name matches the host search term                                                                   |
| context                      | String      | finds items with context matching the search term                                                                                                           |
| ip                           | String      | exact match for the entered IP address                                                                                                                      |
| user\_id                     | String      | finds items/people associated with the user id                                                                                                              |
| username                     | String      | finds items/people associated with the username                                                                                                             |
| email                        | String      | finds items/people associated with the email address                                                                                                        |
| code\_version                | String      | finds items that have been seen in the specified code\_version                                                                                              |
| # (item\_counter)            | Exact Match | finds the item with the specified counter number - note use the '#' prefix to search for an item counter (`#123`)                                           |
| fingerprint                  | String      | finds items that have the fingerprint specified (exact match, useful in conjunction with Custom Grouping or sending your own fingerprint string)            |
| os\_family\*                 | String      | finds items that have occurrences containing the specified OS family                                                                                        |
| os\_version\*                | String      | finds items that have occurrences containing the specified OS version                                                                                       |
| device\_brand\*              | String      | finds items that have occurrences containing the specified device brand                                                                                     |
| device\_model\*              | String      | finds items that have occurrences containing the specified device model                                                                                     |
| platform\_canonical\*        | String      | finds items that have occurrences containing the specified platform                                                                                         |
| framework\_canonical\*       | String      | finds items that have occurrences containing the specified framework                                                                                        |
| message\_body\*              | String      | finds items with matching text in the message body                                                                                                          |
| uuid\*                       | Exact Match | finds items that have an occurrence that matches the specified UUID value                                                                                   |
| platform\*                   | String      | finds items that have occurrences containing the specified platform                                                                                         |
| language\*                   | String      | finds items that have occurrences containing the specified language                                                                                         |
| notifier\_name\*             | String      | finds items that have occurrences containing the specified notifier name                                                                                    |
| notifier\_version\*          | String      | finds items that have occurrences containing the specified notifier version                                                                                 |
| server\_root\*               | String      | finds items that have occurrences containing the specified server root value                                                                                |
| server\_pid\*                | Exact Match | finds items that have occurrences containing the specified server PID value - note - do not surround the PID value with quotation marks - `server_pid:1234` |
| server\_cpu\*                | String      | finds items that have occurrences containing the specified server CPU                                                                                       |
| scm\_branch\*                | String      | finds items that have occurrences containing the specified SCM branch                                                                                       |
| request\_url\*               | String      | finds items that have occurrences containing the specified request URL                                                                                      |
| request\_method\*            | String      | finds items that have occurrences containing the specified request method                                                                                   |
| request\_query\_string\*     | String      | finds items that have occurrences containing the specified query string                                                                                     |
| request\_body\*              | String      | finds items with matching text in the request body                                                                                                          |
| language\_name\*             | String      | finds items with the specified language name                                                                                                                |
| request\_headers\_name\*     | String      | finds items that have occurrences containing the specified request header name                                                                              |
| request\_headers\_value\*    | String      | finds items that have occurrences containing the specified request header value                                                                             |
| request\_params\_name\*      | String      | finds items that have occurrences containing the specified request param name                                                                               |
| request\_params\_value\*     | String      | finds items that have occurrences containing the specified request param value                                                                              |
| request\_gets\_name\*        | String      | finds items that have occurrences containing the specified get request name                                                                                 |
| request\_gets\_value\*       | String      | finds items that have occurrences containing the specified get request value                                                                                |
| request\_posts\_name\*       | String      | finds items that have occurrences containing the specified post request name                                                                                |
| request\_posts\_value\*      | String      | finds items that have occurrences containing the specified post request value                                                                               |
| customs\_name\*              | String      | find items with custom data containing the specified name parameter                                                                                         |
| customs\_value\*             | String      | finds items with custom data containing the specified value                                                                                                 |
| file (traceframe\_filename)  | String      | finds items with stack traces with at least one filename containing the search term                                                                         |
| method (traceframe\_method)  | String      | finds items with stack traces where at least one frame's method contains the search term                                                                    |
| exception\_class             | String      | finds items with occurrences with the specified exception class                                                                                             |
| exception\_description\*     | String      | finds items with occurrences with the specified exception description                                                                                       |
| exception\_message           | String      | finds items with occurrences with the specified exception message                                                                                           |
| telemetry\_level             | Exact Match | finds items with the specified telemetry level, for example `telemetry_level:error`                                                                         |
| telemetry\_type              | Exact Match | finds items with the specified telemetry type, for example `telemetry_type:error`                                                                           |
| telemetry\_body\_message     | String      | finds items with the specified telemetry message, for example `telemetry_body_message:"%Context%"`                                                          |
| telemetry\_body\_subtype     | Exact Match | finds items with the specified telemetry subtype, for example `telemetry_body_subtype:fetch`                                                                |
| telemetry\_body\_method      | Exact Match | finds items with the specified telemetry method, for example `telemetry_body_method:get`                                                                    |
| traceframe\_colno\*          | Exact Match | finds items with occurrences with the specified column number in the stack trace                                                                            |
| traceframe\_index\*          | Exact Match | finds items with occurrences with the specified index in the stack trace                                                                                    |
| traceframe\_lineno\*         | Exact Match | finds items with occurrences with the specified line number in the stack trace                                                                              |
| traceframe\_reverse\_index\* | Exact Match | finds items with occurrences with the specified reverse index in the stack trace                                                                            |
| traceframe\_stack\_level\*   | Exact Match | finds items with occurrences with the specified stack level in the stack trace                                                                              |
| traceframe\_filename\*       | String      | finds items with occurrences with the specified filename in the stack trace                                                                                 |
| traceframe\_method\*         | String      | finds items with occurrences with the specified method in the stack trace                                                                                   |
| traceframe\_class\_name\*    | String      | finds items with occurrences with the specified class name in the stack trace                                                                               |
| traceframe\_locals\_name\*   | String      | finds items with occurrences with the specified locals name in the stack trace                                                                              |
| traceframe\_locals\_value\*  | String      | finds items with occurrences with the specified locals value in the stack trace                                                                             |
| traceframe\_in\_project\*    | String      | finds items with occurrences with the specified project in the stack trace                                                                                  |

The following fields work with the given usage format - *field\[key]:value*

| Field               | Field Type | Description                                                                                                                       |
| :------------------ | :--------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| custom\*            | String     | *custom\[key]:value* searches for occurrences that contain matching values within the specified custom key field                  |
| request\_get\*      | String     | *request\_get\[key]:value* searches for occurrences that contain matching values within the specified request get field           |
| request\_header\*   | String     | *request\_header\[key]:value* searches for occurrences that contain matching values within the specified request header field     |
| request\_param\*    | String     | *request\_param\[key]:value* searches for occurrences that contain matching values within the specified request param field       |
| request\_post\*     | String     | *request\_post\[key]:value* searches for occurrences that contain matching values within the specified request post field         |
| traceframe\_local\* | String     | *traceframe\_local\[key]:value* searches for occurrences that contain matching values within the specified traceframe local field |