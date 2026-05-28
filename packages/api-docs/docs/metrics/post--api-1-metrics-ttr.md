# POST /api/1/metrics/ttr

Get resolution time metrics for a list of projects

Get resolution time metrics for a provided list of project IDs. It can be filtered by environments, levels and frameworks.

## Parameters

### Header Parameters

| Name                     | Type     | Required | Description                                                                                                   |
| ------------------------ | -------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `X-Rollbar-Access-Token` | `string` | Yes      | Use a Project or Account Access Token with 'read' scope (Account tokens require a project_id to be specified) |

## Request Body

**Content-Type:** `application/json`

```json
{
  "start_time": 0,
  "end_time": 0,
  "granularity": "string",
  "function": "string",
  "project_ids": [0],
  "environments": ["string"],
  "levels": ["string"],
  "frameworks": ["string"],
  "timezone": "string"
}
```

## Responses

### 200 — List of metrics for the requested project IDs

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": {
    "data": [
      {
        "timestamp": 0,
        "ttr": 0
      }
    ],
    "params": {
      "start_time": 0,
      "end_time": 0,
      "granularity": "string",
      "function": "string",
      "project_ids": null,
      "environments": null,
      "levels": null,
      "frameworks": null,
      "timezone": "string"
    }
  }
}
```
