# GET /api/1/project/{project_id}

Get a project

## Parameters

### Path Parameters

| Name         | Type      | Required | Description |
| ------------ | --------- | -------- | ----------- |
| `project_id` | `integer` | Yes      | -           |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": {
    "id": 0,
    "account_id": 0,
    "status": "string",
    "settings_data": {
      "time_format": "string",
      "timezone": "string",
      "integrations": null,
      "encryption_at_rest": {
        "enabled": true,
        "enabled_at": 0
      },
      "grouping": {
        "auto_upgrade": true,
        "recent_versions": ["string"]
      }
    },
    "date_created": 0,
    "date_modified": 0,
    "name": "string"
  }
}
```
