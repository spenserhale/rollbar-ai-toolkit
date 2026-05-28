# GET /api/1/environments

List all environments

Returns all environments in the project, in pages of 20.

A successful response looks like:

```
{
  'err': 0
  'result': {
    'page': 1,
    'environments': [
      // where each environment has the shape:
      {
        'id': 1,
        'project_id': 123,
        'environment': 'production',
        // visibility of the environment in the app (can either be 1 or 0)
        'visible': 1
      },
      ...
    ]
  }
}
```

## Parameters

### Query Parameters

| Name   | Type      | Required | Description                                                              |
| ------ | --------- | -------- | ------------------------------------------------------------------------ |
| `page` | `integer` | No       | Page number, starting from 1. Twenty environments are returned per page. |

## Responses

### 200 — Success

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": {
    "page": 0,
    "environments": [
      {
        "id": 0,
        "project_id": 0,
        "environment": "string",
        "visible": true
      }
    ]
  }
}
```
