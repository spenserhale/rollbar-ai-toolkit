# GET /api/1/user/{user_id}/teams

List a user's teams

## Parameters

### Path Parameters

| Name      | Type     | Required | Description |
| --------- | -------- | -------- | ----------- |
| `user_id` | `string` | Yes      | -           |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
    "err": 0,
    "result": {
      "teams": ["result": {}]
    }
  }
```
