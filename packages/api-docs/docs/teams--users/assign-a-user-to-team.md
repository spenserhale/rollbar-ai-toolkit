# PUT /api/1/team/{team_id}/user/{user_id}

Assign a user to team

## Parameters

### Path Parameters

| Name      | Type      | Required | Description |
| --------- | --------- | -------- | ----------- |
| `team_id` | `integer` | Yes      | -           |
| `user_id` | `integer` | Yes      | -           |

## Responses

### 200 — User added to team

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": {
    "team_id": 0,
    "user_id": 0
  }
}
```
