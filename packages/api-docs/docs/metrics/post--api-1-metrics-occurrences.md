# POST /api/1/metrics/occurrences

Occurrences over a span of time

Get occurrences metrics over a span of time by filtering, grouping, and aggregating. The endpoint follows search/query semantics as a POST request using project read access token.

List of **columns/fields** that can be used with some components of your query:

- `project_id`
- `item_id`
- `environment`
- `browser_family`
- `browser_version`
- `os_family`
- `os_version`
- `device_brand`
- `device_model`
- `ip_address`
- `item_status`
- `item_level`
- `item_group_item_id`
- `item_title`
- `item_counter`
- `person_username`
- `person_email`
- `person_id`
- `code_version`
- `count`
- `occurrence_id`
- `uuid`
- `context`
- `platform`
- `framework`
- `platform_canonical`
- `framework_canonical`
- `language`
- `language_name`
- `notifier_name`
- `notifier_version`
- `occurrence_count`
- `message_body`
- `timestamp`
- `fingerprint`
- `server_host`
- `server_root`
- `server_pid`
- `server_cpu`
- `scm_branch`
- `request_url`
- `request_method`
- `request_query_string`
- `request_body`

## Request Body

**Content-Type:** `application/json`

```json
{
  "start_time": 0,
  "end_time": 0,
  "filters": [
    {
      "field": "string",
      "values": ["string"],
      "operator": "string"
    }
  ],
  "group_by": ["string"],
  "aggregates": [
    {
      "field": "string",
      "function": "string",
      "alias": "string"
    }
  ],
  "sort": {
    "order": "string",
    "field": "string"
  },
  "granularity": "string",
  "timezone": "string",
  "limit": 0,
  "offset": 0
}
```

## Responses

### 200 — List of timepoints for the provided occurences metrics query

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": {
    "last_occurrence_id": 0,
    "last_occurrence_timestamp": 0,
    "timepoints": null
  }
}
```
