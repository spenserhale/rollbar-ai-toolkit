# GET /api/1/rql/jobs/

List all RQL jobs

If you use a project access token, all rql jobs for that project will be returned. If you use an account access token, all rql jobs for the account will be returned.

# Response

```json
{
  "err" 0,
  "result": [
    { ... }, // RQL job resource
      ...
  ]
}
```

## Parameters

### Query Parameters

| Name   | Type      | Required | Description                 |
| ------ | --------- | -------- | --------------------------- |
| `page` | `integer` | No       | Page number starting from 1 |

### Header Parameters

| Name                     | Type     | Required | Description                                                                                          |
| ------------------------ | -------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `X-Rollbar-Access-Token` | `string` | Yes      | Use either an Account Access Token with 'read' scope or a Project Access Token with the 'read' scope |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": [
    {
      "id": 0,
      "project_id": 0,
      "query_string": "string",
      "status": "string",
      "job_hash": "string",
      "date_created": 0,
      "date_modified": 0
    }
  ]
}
```
