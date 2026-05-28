<!-- source: https://docs.rollbar.com/docs/session-replay-search.md -->

# Session Replay Search

## Replay search

Replay search lets you filter session replays by fields on the replay span.

The search syntax matches the syntax used for **Advanced Item Search** in Rollbar, with a smaller set of fields and a few replay-specific behaviors.

> **Note:** Replay search does not use an fuzzy text query for titles, unlike item search.  A default search will search the Replay URL attribute for like matches.

***

## Available search fields

<br />

### Replay URL

Any unstructured text in the query that does not match a specific field is used as a substring filter on the replay URL.

For example, this query returns all replays where the URL contains `path/to/a/page`:

Example: `path/to/a/page`

<br />

### session\_id

The session identifier for the replay. A single session can contain multiple replays.\
Searching by `session_id` returns all replays that belong to that session.

Example: `session_id:19d2cab303ade48434babcca4e3c8785`

***

## Attributes

Replay attributes are stored as key/value pairs. There are:

* Aliases for common attributes.
* Custom attributes, which can be accessed using square bracket notation.

The following aliases are available as top-level search fields.

<br />

### ip\_address

Client IP address for the replay.

Example: `ip_address:100.6.173.229`

Prefix Eample:  `ip_address:100.6.173`

<br />

***

### replay\_id

Unique identifier for the replay.

Exact match: `replay_id:7575e97089b42dd0`

Prefix match: `replay_id:7575e9`

<br />

***

### user\_agent

User agent string for the client. Use `%` for substring matching (LIKE semantics).

Example: `user_agent:%Chrome/141%`

***

<br />

### occurrence\_uuid

UUID of the triggering occurrence, when the replay was started by an occurrence.

Exact match: `occurrence_uuid:2b8ed8a3-dcf3-4726-d544-4cea59531ca5`

Prefix match: `occurrence_uuid:2b8ed8a3`

***

<br />

### code\_version

Code version recorded for the replay, when available.

Exact match: `code_version:89b42ef07575e970`

Prefix match: `code_version:89b42e`

***

<br />

### user\_id

Identifier for the user, when present.

Example: `user_id:333623`

***

<br />

#### `user_email`

Email address for the user, when present.

Exact match: `user_email:jimmy@rollbar.com`

Prefix match: `user_email:jimmy`

Case-insensitive substring (ILIKE): `user_email:%gmail%`

***

#### user\_name

Username for the user, when present.

Exact match: `user_name:jimmyjames`

Prefix match: `user_name:jimmy`

Case-insensitive substring (ILIKE): `user_name:%james%`

***

<br />

## Custom attributes

Any replay attribute can be queried by its key using square bracket notation:

Example: `attribute[<escaped_key_name>]:<value>`

<br />

If the attribute key contains dots, escape them with a backslash so they are treated as part of the key instead of a JSON path.

Example:

To search for a replay where the `rollbar.browser` attribute equals `iTunes`:

Example: `attribute[rollbar\.browser]:iTunes`

This returns all replays whose `rollbar.browser` attribute has the value `iTunes`.