# GET /api/1/deploys

List all deploys

Returns all deploys in the project, most recent first, in pages of 20.

## Parameters

### Query Parameters

| Name   | Type      | Required | Description                                                                    |
| ------ | --------- | -------- | ------------------------------------------------------------------------------ |
| `page` | `integer` | No       | Page number, starting from 1. Twenty deploys are returned per page by default. |

## Responses

### 200 — Success

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": {
    "page": 0,
    "deploys": [
      {
        "environment": "string",
        "revision": "string",
        "local_username": "string",
        "comment": "string",
        "status": "string",
        "id": 0,
        "project_id": 0,
        "user_id": 0,
        "start_time": 0,
        "finish_time": 0
      }
    ]
  }
}
```
