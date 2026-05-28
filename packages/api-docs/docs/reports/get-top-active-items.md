# GET /api/1/reports/top_active_items

Get top active items

# Response

```json
{
  "err": 0,
  "result": [
    // each element in the list is an object with an "item" object and a "counts" list
    {
      // data describing the item (similar to that returned by GET /api/1/item/:id)
      "item": {
        "id": 2071,
        "counter": 1007,
        "environment": "production",
        "framework": 0,
        "last_occurrence_timestamp": 1728410581,
        "level": 40,
        "occurrences": 54,
        "project_id": 12345,
        "title": "Something went wrong",
        "unique_occurrences": 5
      },
      // list of occurrence counts in the past 24 hours. Oldest first.
      "counts": [12, 10, 7, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 8, 5, 6]
    },
    {
      /* more elements ... */
    }
  ]
}
```

By default, the sort of the top items is by the level of severity, then the number of occurrences. E.g. an item with a `warning` level and 300 occurrences will be below an item with an `error` level and 150 occurrences. This behavior can be changed by passing `sort=occurrences` in the query parameters, which will sort only by the number of occurrences in the time period.

Note that the level and framework are returned as integers here. `10`, `20`, `30`, `40`, and `50` representing the `debug`, `info`, `warning`, `error`, and `critical` levels, respectively. For the full integer-framework mapping, please see the [Framework IDs](https://docs.rollbar.com/docs/rql#framework-ids) section in our docs.

## Parameters

### Query Parameters

| Name           | Type      | Required | Description                                                                                                                                                             |
| -------------- | --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hours`        | `integer` | No       | Number of recent hours to consider. Min `1`, max `168`.                                                                                                                 |
| `environments` | `string`  | No       | Comma-separated list of environments to consider. If empty, then returns results for "any environment".                                                                 |
| `sort`         | `string`  | No       | To sort by occurrences only and not by item level, add `sort=occurrences`. This is the only accepted value for sort at this time, any other value will return an error. |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": [
    {
      "item": {
        "id": 0,
        "environment": "string",
        "title": "string",
        "last_occurrence_timestamp": 0,
        "project_id": 0,
        "unique_occurrences": 0,
        "occurrences": 0,
        "framework": 0,
        "level": 0,
        "counter": 0,
        "group_status": 0
      },
      "counts": [0]
    }
  ]
}
```
