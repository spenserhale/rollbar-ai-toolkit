# GET /api/1/reports/occurrence_counts

Get active occurrence counts

Analogous to "Hourly Error/Critical Occurrences" and "Daily Error/Critical Occurrences" on the Project Dashboard.

Returns an array of recent counts as `[timestamp, count]` pairs, where each count is the number of matching active occurrences in the time range `[timestamp, timestamp + bucket_size - 1]`.

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
| `bucket_size` | `string` | No | Size of each bucket, in seconds. Valid values are `60` (minute), `3600` (hour), and `86400` (day). Timezone for all buckets is GMT. |
| `environments` | `string` | No | Comma-separated list of environments to filter by.  Empty means "any environment". |
| `min_level` | `string` | No | Minimum item level to filter by. One of `debug`, `info`, `warning`, `error`, or `critical`. |
| `max_level` | `string` | No | Maximum item level to filter by. One of `debug`, `info`, `warning`, `error`, or `critical` |
| `item_id` | `integer` | No | Item ID to filter by. |
## Responses

### 200 — success

````
