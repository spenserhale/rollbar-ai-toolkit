# GET /api/1/project/{project_id}/access_tokens

List all project access tokens

## Parameters

### Path Parameters

| Name         | Type     | Required | Description |
| ------------ | -------- | -------- | ----------- |
| `project_id` | `string` | Yes      | -           |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": [
    {
      "project_id": 0,
      "access_token": "string",
      "public_id": "string",
      "name": "string",
      "status": "string",
      "rate_limit_window_size": 0,
      "rate_limit_window_count": 0,
      "cur_rate_limit_window_start": 0,
      "cur_rate_limit_window_count": 0,
      "date_created": 0,
      "date_modified": 0,
      "scopes": ["string"],
      "token_type": "string"
    }
  ]
}
```
