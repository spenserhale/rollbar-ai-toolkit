# GET /api/1/reports/activated_counts

Get activated item counts

Analogous to "Daily New/Reactivated Items" graph on the Project Dashboard.

Returns an array of recent counts as `[timestamp, count]` pairs, where each count is the number of items that were first seen or reactivated in the time range `[timestamp, timestamp + bucket_size - 1]`.

Timestamps are UNIX timestamps, in whole seconds.

# Response

````json
{
  "err": 0,
  "result": [
    [
      // timestamp
      1728561200,
      // count (number of occurrences from time 1728561200 until time 1728564799)
      0
    ],
    [
      1728564800,
      0
    ],
    [
      1728568400,
      0
    ],
    [
      1728572000,
      6
    ]
  ]
}```


## Parameters

### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `bucket_size` | `integer` | No | Size of each bucket, in seconds. Only valid value is `86400` (day). Data wil be returned in the project timezone. |
| `buckets` | `integer` | No | Number of buckets to return. Must be in range `[2, 366]`. |
| `environments` | `string` | No | Comma-separated list of environments to filter by.  Empty means "any environment". |
## Responses

### 200 — success

````
