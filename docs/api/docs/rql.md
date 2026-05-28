<!-- source: https://docs.rollbar.com/docs/rql.md -->

# RQL

Rollbar Query Language (RQL) provides a rich SQL-like interface to the data in Rollbar. RQL is bundled with Rollbar Analyze, which also includes the [Metrics API](https://docs.rollbar.com/reference/post_api-1-metrics-items) and is only available to our Advanced and Enterprise packages.

RQL supports running `SELECT` queries on two logical tables, `item_occurrence` and `deploy`. Basic `GROUP BY`, `ORDER BY`, `LIMIT`, and aggregation functions are available, as are arbitrary expressions in the `WHERE` clause.

## Syntax

`SELECT` and `FROM`  are required. `WHERE`, `GROUP BY`, `ORDER BY`, and `LIMIT` are optional.

`SELECT *` may be used as long as there is no `GROUP BY` clause. It will return a list of columns similar to the Occurrences tab on the Item Detail pages.

You can reference a selected column using its index, e.g. `GROUP BY 1`.

SQL keywords and built-in function names are case-insensitive (i.e. `SELECT` and `select` are both fine).

Column names should start with a lowercase letter and may contain letters, numbers, and periods (for specifying a JSON path). If you need any other characters (i.e. a hyphen, or to start with an uppercase letter), escape with backticks (i.e. `request.headers.User-Agent`).

### Operators

* `+`, `-`, `/`, `*`, `DIV`, `MOD`
* `AND`, `OR`, `NOT`
* `=`, `!=`,\
  `<>`, `>`, `>=`, `<`, `<=`, `IN`, `NOT IN`, `BETWEEN`,\
  `NOT BETWEEN`, `LIKE`, `NOT LIKE`, `IS`, `IS NOT`

### Built-in Functions

* `count(*)`: counts all rows
* `count(foo)`: counts rows where `foo` is not `NULL`
* `count_distinct(foo)`: counts distinct rows where `foo` is not `NULL`
* `sum(foo)`: sums the value of `foo` (for rows where `foo` is not `NULL`)
* `avg(foo)`: average value of `foo` (for rows where `foo` is not `NULL`)
* `min(foo)`: minimum value of `foo`
* `max(foo)`: maximum value of `foo`
* `unix_timestamp()`: returns the current Unix timestamp, as an integer
* `concat(str1, str2, ...)`: returns the string resulting from concatenating all arguments
* `concat_ws(sep, str1, str2, ...)`: returns the string resulting from concatenating the second argument and beyond, separated by the first argument
* `lower(str)`: converts `str` to lowercase
* `upper(str)`: converts `str` to uppercase
* `left(str, len)`: returns the `len` leftmost characters of `str`
* `right(str, len)`: returns the `len` rightmost characters of `str`
* `substring(str, pos)`: returns the substring from `str` starting at `pos` (all characters from `pos` until the end)
* `substring(str, pos, len)`: returns a substring from str starting at `pos`, at most `len` characters
* `locate(substr, str)`: returns the position of the first occurrence of `substr` in `str`. (1-indexed)
* `locate(substr, str, pos)`: returns the position of the first occurrence of `substr` in `str`, starting the search at position `pos`
* `char_length(str)`: returns the length of `str` in characters
* `length(str)`: returns the length of `str` in bytes
* `if(boolean_expr, value_if_true, value_if_false)`: evaluates to `value_if_true` if the expression `boolean_expr` evalutes to true, `value_if_false` otherwise

## Performance considerations

RQL queries data from multiple databases and assembles the result set at the end. To optimize performance we moved the most frequently queried columns to a faster database. You can expect faster results in case your query uses the following columns *only*.

For further performance improvement, we suggest querying the necessary columns only and applying item (e.g., `WHERE item.counter = 123`) or timestamp (e.g., `WHERE timestamp > unix_timestamp() - 86400`) filters in each query.

> 📘
>
> Although RQL supports all operations and functions listed above, you might experience slowness when using the `GROUP BY`  statement.

| Optimized Column Name                     |
| :---------------------------------------- |
| `body.message.body`                       |
| `browser`                                 |
| `client.javascript.browser`               |
| `client.javascript.code_version`          |
| `client.javascript.guess_uncaught_frames` |
| `client.javascript.source_map_enabled`    |
| `code_version`                            |
| `context`                                 |
| `item.counter`                            |
| `item.environment`                        |
| `item.framework`                          |
| `item.hash`                               |
| `item.id`                                 |
| `item.level`                              |
| `item.platform`                           |
| `item.status`                             |
| `item.title`                              |
| `language`                                |
| `notifier.name`                           |
| `notifier.version`                        |
| `occurrence_id`                           |
| `os`                                      |
| `person`                                  |
| `person.email`                            |
| `person.id`                               |
| `person.username`                         |
| `project_id`                              |
| `project_slug`                            |
| `request.body`                            |
| `request.headers.*`                       |
| `request.method`                          |
| `request.query_string`                    |
| `request.url`                             |
| `request.user_ip`                         |
| `server.branch`                           |
| `server.cpu`                              |
| `server.host`                             |
| `server.pid`                              |
| `server.root`                             |
| `timestamp`                               |
| `uuid`                                    |

## Templates and Examples

To get great examples of RQL queries, we have included a tabbed section called Template.  These are our top 3 queries for finding occurrence trends, filtering items, and the impact of errors.  By clicking on the template, we will automatically fill in your RQL code editor and allow you to change factors like time stamps or item counters to personalize your query to your needs.

If you need more examples of RQL, here are eight more advanced samples to help you learn RQL.

To find all occurrences of item #47, grouped by `request.user_ip` with the total count, earliest timestamp, and most recent timestamp, ordered by total count descending and limited to the top 10 rows:

```sql
SELECT request.user_ip, min(timestamp), max(timestamp), count(*)
FROM item_occurrence
WHERE item.counter = 47
GROUP BY request.user_ip
ORDER BY count(*) DESC
LIMIT 10
```

To see the timestamp and message for all occurrences for Items #40 to #50:

```sql
SELECT timestamp, body.message.body
FROM item_occurrence
WHERE item.counter BETWEEN 40 AND 50
```

To see the occurrences of Items #1, 2, and 3:

```sql
SELECT *
FROM item_occurrence
WHERE item.counter IN (1,2,3)
```

To find items that affected the most IPs in the last 3 days, grouped by the item number and ordered by the distinct count of the number of user\_ips descending:

```sql
SELECT item.counter
FROM item_occurrence
WHERE timestamp > unix_timestamp() - 60 * 60 * 24 * 3
GROUP BY item.counter
ORDER BY count_distinct(request.user_ip) desc
```

To see all the items with the User-Agent string `python-requests/2.9.1` in a date range, ordered by timestamps descending:

```sql
SELECT * 
FROM item_occurrence 
WHERE `request.headers.User-Agent` = "python-requests/2.9.1"  
AND timestamp BETWEEN 1507566716 and 1510245116 
ORDER BY timestamp desc
```

To grab all the referrer domains Item #1234 came from, grouped by the domain and limited to the top 1000 rows:

```sql
SELECT substring(request.headers.Referer, locate('.', request.headers.Referer), locate('.', request.headers.Referer, locate('.', request.headers.Referer)) - locate('.', request.headers.Referer) - 1)
FROM item_occurrence
WHERE item.counter = 1234
GROUP BY 1
LIMIT 1000
```

To find all the occurrences of items that occurred on Safari version 9.x on the last day:

```sql
SELECT *
FROM item_occurrence
WHERE client.javascript.browser LIKE '%Version/9.%.% Safari/%'
AND timestamp > unix_timestamp() - 60 * 60 * 24
```

To grab the occurrence counts per item per day for the last three days:

```sql
SELECT timestamp div 86400, item.counter, count(*)
FROM item_occurrence
WHERE timestamp > unix_timestamp() - 60 * 60 * 24 * 3
GROUP BY 1, item.counter
```

## Good to know

* RQL sometimes timeout unless you put a date range, such as `WHERE timestamp > unix_timestamp() - 86400`.
* When using `GROUP BY` or `ORDER BY`, ensure the group/order clause is also present in the `SELECT` clause.
* You cannot `GROUP BY` a function unless the same expression is in the `SELECT` clause.
* You *can* reference a column by its index in a `GROUP BY` statement, for example `GROUP BY 1`.
* You can share the URL with a co-worker and they'll see the same results you do, without rerunning the query.
* After a query has been completed, press `Execute` again to re-run it.

## Limitations

* At most 1000 rows will be returned per query (though any number of rows may be examined). By default, 100 rows are returned if no `LIMIT` is specified
* `DISTINCT`, `HAVING`, subqueries, joins, or unions are unsupported
* `ANY`, `ALL`, and `EXISTS` clauses are unsupported
* `SELECT *` cannot be combined with `GROUP BY`
* You cannot `GROUP BY` a function unless the same expression is in the `SELECT` clause.
* You cannot run more than 2 RQL queries in parallel per account
* Querying more than 200K occurrences typically does not work.  It may be useful to narrow your query by `timestamp` or `item.counter` to stay under the 200K threshold.  For example:
* Filter by day: `WHERE unix_timestamp() - timestamp BETWEEN 60 * 60 * 24 * 0 and 60 * 60 * 24 * 1`
* Filter by hour: `WHERE unix_timestamp() - timestamp BETWEEN 60 * 60 * 0 and 60 * 60 * 1`
* Filter by item.counter: `WHERE item.counter = 800`
* Timeouts occur at 10 minutes of the[ RQL job](https://docs.rollbar.com/docs/rql#handling-rql-jobs) running.

## Schema

### item\_occurrence

`item_occurrence` is a table where each row contains data for a single occurrence and the item it is associated with. Column names starting with "item." reference the item, and all other column names reference the occurrence. Column names that do not exist in a particular occurrence evaluate to `NULL`.

The following columns exist for every row in `item_occurrence`:

| Name                              | Description                                                                       |
| --------------------------------- | --------------------------------------------------------------------------------- |
| `item.id`                         | System-wide Item ID                                                               |
| `item.counter`                    | Project-wide Item ID                                                              |
| `item.environment`                | Environment name                                                                  |
| `item.platform`                   | [Platform ID](#platform-ids)                                                      |
| `item.framework`                  | [Framework ID](#framework-ids)                                                    |
| `item.hash`                       | Computed fingerprint of the item (controls [grouping](/docs/grouping-algorithm/)) |
| `item.first_occurrence_id`        | ID of the first occurrence                                                        |
| `item.first_occurrence_timestamp` | Timestamp of the first occurrence                                                 |
| `item.activating_occurrence_id`   | ID of the first occurrence since the item was last resolved                       |
| `item.last_activated_timestamp`   | Timestamp the item was last activated                                             |
| `item.last_resolved_timestamp`    | Timestamp the item was last resolved                                              |
| `item.last_muted_timestamp`       | Timestamp the item was last muted                                                 |
| `item.last_occurrence_id`         | ID of the most recent occurrence                                                  |
| `item.last_occurrence_timestamp`  | Timestamp of the most recent occurrence                                           |
| `item.last_modified_by`           | ID of the user who last modified this item                                        |
| `item.assigned_user_id`           | ID of the user who this item is assigned to                                       |
| `item.level`                      | Item level (50=critical, 40=error, 30=warning, 20=info, 10=debug)                 |
| `item.resolved_in_version`        | The revision of the item was last marked as resolved                              |
| `item.status`                     | Status (as an integer: 1=active, 2=resolved, 3=muted)                             |
| `item.title`                      | Computed title                                                                    |
| `item.total_occurrences`          | The number of occurrences since the last time this item was resolved              |
| `occurrence_id`                   | System-wide Occurrence ID                                                         |
| `project_slug`                    | The project's slug                                                                |
| `timestamp`                       | Timestamp of the occurrence, as a Unix timestamp                                  |

Many virtual columns will also exist, depending on which Rollbar SDK you use and what custom data you send. Simply use the JSON path to the field you want to query. To see the JSON structure of one of your occurrences, click the "Raw JSON" button on an Occurrence page. The structure will follow the [Rollbar API Item Schema](https://docs.rollbar.com/reference/create-item).

> 📘
>
> When querying a virtual column, make sure to wrap it in backticks, e.g.
>
> ```
> `request.headers.User-Agent`="python-requests/2.9.1"  
> ```

Here are some common column names, all of which refer to data for the occurrence:

| Name                                      | Description                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------- |
| `body.crash_report.raw`                   | The raw crash report (if the occurrence is a crash report)                            |
| `body.message.body`                       | The primary message text (if the occurrence is a message)                             |
| `body.message.foo`                        | Any arbitrary keys of metadata you sent (if the occurrence is a message)              |
| `body.trace.exception.class`              | The exception class name (if the occurrence is a single exception)                    |
| `body.trace.exception.message`            | The exception message (if the occurrence is a single exception)                       |
| `body.trace_chain.0.exception.class`      | The first exception class (if the occurrence is a list of nested exceptions)          |
| `body.trace_chain.0.exception.message`    | The first exception message (if the occurrence is a list of nested exceptions)        |
| `client.javascript.browser`               | Raw user agent string (from [rollbar.js](/docs/javascript))                           |
| `client.javascript.code_version`          | The running code version in JavaScript                                                |
| `client.javascript.source_map_enabled`    | Whether or not source map deobfuscation is enabled                                    |
| `client.javascript.guess_uncaught_frames` | Whether or not frame guessing is enabled                                              |
| `client.runtime_ms`                       | How long the page was open before the event occurred ([rollbar.js](/docs/javascript)) |
| `code_version`                            | The version of the application code                                                   |
| `context`                                 | An identifier for which part of your application the error came from                  |
| `custom.foo`                              | Arbitrary metadata you sent                                                           |
| `custom.foo.bar`                          | Nested arbitrary metadata you sent                                                    |
| `language`                                | The name of the reported language for the event                                       |
| `notifier.name`                           | Name of the library that sent the item                                                |
| `notifier.version`                        | The version string of the library that sent the item                                  |
| `person.id`                               | A string identifying the user in your system                                          |
| `person.username`                         | A username string                                                                     |
| `person.email`                            | An email string                                                                       |
| `request.url`                             | Full URL where the error occurred                                                     |
| `request.method`                          | The request method                                                                    |
| `request.headers`                         | Object containing the request headers                                                 |
| `request.params`                          | Any routing parameters                                                                |
| `request.GET`                             | Query string parameters                                                               |
| `request.query_string`                    | The raw query string                                                                  |
| `request.POST`                            | POST parameters                                                                       |
| `request.body`                            | The raw POST body                                                                     |
| `request.user_ip`                         | The end user's IP address as a string                                                 |
| `server.host`                             | The server hostname                                                                   |
| `server.root`                             | Path to the application code root                                                     |
| `server.branch`                           | Name of the checked-out source control branch                                         |
| `server.code_version`                     | String describing the running code version on the server                              |
| `uuid`                                    | A string that uniquely identifies the occurrence. See [UUIDs](/docs/uuids/)           |

### deploy

`deploy` is a table where each row represents a single deploy. It contains the following columns:

| Name             | Description                                                       |
| ---------------- | ----------------------------------------------------------------- |
| `id`             | System-wide ID                                                    |
| `user_id`        | Rollbar user\_id of the rollbar\_username recorded for the deploy |
| `environment`    | Name of the deployed environment                                  |
| `revision`       | Revision (e.g., git SHA hash or version number) deployed          |
| `local_username` | Local username recorded for the deploy                            |
| `comment`        | The deploy comment                                                |
| `timestamp`      | Timestamp when the deployment was recorded                        |
| `project_slug`   | The project's slug                                                |

## Constants

### Framework IDs

The `item.framework` property is an integer value that maps as follows:

```
    'unknown': 0,
    'rails': 1,
    'django': 2,
    'pyramid': 3,
    'node-js': 4,
    'pylons': 5,
    'php': 6,
    'browser-js': 7,
    'rollbar-system': 8,  # system messages, like "over rate limit"
    'android': 9,
    'ios': 10,
    'mailgun': 11,
    'logentries': 12,
    'python': 13,
    'ruby': 14,
    'sidekiq': 15,
    'flask': 16,
    'celery': 17,
    'rq': 18,
    'java': 19,
    'dotnet': 20,
    'go': 21,
    'react-native': 22,
    'macos': 23,
    'apex': 24,
    'spring': 25,
    'bottle': 26,
    'twisted': 27,
    'asgi': 28,
    'starlette': 29,
    'fastapi': 30,
    'karafka': 31,
    'flutter': 32,
```

### Platform IDs

The `item.platform` property is an integer value which maps as follows:

```
    'unknown': 0,
    'browser': 1,
    'flash': 2,
    'android': 3,
    'ios': 4,
    'heroku': 5,
    'google-app-engine': 6,
    'client': 7,
```

### Handling RQL Jobs

When users submit a query, we initiate a specialized job to handle it. This approach is particularly beneficial for queries that might take longer to process. By creating a job, users can navigate away and return later to retrieve the results without being bound to await the query's completion in real-time or share the URL with a team member so they can view the query results without having to re-run the query.  Note Jobs will timeout after 10 minutes of running.  Please review our[ performance consideration](https://docs.rollbar.com/docs/rql#handling-rql-jobs) to reduce your query runtime.

These RQL jobs can be identified and tracked through specific URL query parameters: `prj` represents the project ID, and `jobId` is used for the unique RQL job ID. These parameters ensure that users can quickly locate and manage their queries.

It's essential to note that these jobs, queries, and results are stored for seven days. After this duration, the query and its corresponding results are purged from the system. However, a job record remains, marked with a status of `Deleted`, serving as a historical trail for auditing or review purposes.

In addition, RQL jobs are also available via a dedicated endpoint in the [Rollbar API](https://docs.rollbar.com/reference/check-an-rql-job). This feature provides an additional layer of convenience for working programmatically. Here is a cURL example on how to create an RQL request:

```curl
curl --location 'https://api.rollbar.com/api/1/rql/jobs/' \
--header 'X-Rollbar-Access-Token: ACCOUNT_READ_TOKEN' \
--form 'query_string=" SELECT *  
      FROM item_occurrence
      WHERE item.counter = 1
      ORDER BY timestamp DESC"'
```

This returns a job ID which you can use in the [Job Results endpoint](https://docs.rollbar.com/reference/get-rql-job-results) . Here is a cURL example on how to retrieve the results with an RQL job ID of `102914452`:

```
curl --location 'https://api.rollbar.com/api/1/rql/job/102914452/result' \
--header 'X-Rollbar-Access-Token: ACCOUNT_READ_TOKEN'
```

You can then retrieve

## AI Assistant

> 📘 This is an experimental feature

### Data Access Agreement

Since our AI assistant uses OpenAI's services, an account owner must accept our 3rd party data agreement in the account settings.  This agreement states that you understand anything you put into the prompt will be sent to OpenAI's API.   For accounts still needing approval, there are prompts on the AI Assistant for both team members and owners.

**Rollbar will not send PII, project names, or item information to OpenAI.**

### Using the AI Assistant.

Using the AI Assistant is easy.  Input your natural question into the input box and click the "Generate RQL" button.  The AI Assistant will return your query to the RQL query code editor.  This gives you the ability to edit your query to fit your needs.  When you are ready to submit your query, please select your project and click the "Run RQL" button under the code editors.

### Limits

During our experimental phase of the AI Assistant, we will be limiting accounts to 50 AI prompts per calendar month.  AI Assistant is only available to Advanced accounts.  For Enterprise accounts, please contact your Account Manager for access at no additional cost to your contract.

### Exporting RQL results

RQL results can be exported as a comma-separated values (CSV) file for use in other tools and systems to help you generate reports.