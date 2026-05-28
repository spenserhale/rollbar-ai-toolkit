# GET /api/1/team/{team_id}/user/{user_id}

Check if a user is assigned to a team

## Parameters

### Path Parameters

| Name      | Type      | Required | Description |
| --------- | --------- | -------- | ----------- |
| `team_id` | `integer` | Yes      | -           |
| `user_id` | `integer` | Yes      | -           |

## Responses

### 200 — User is on team

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

### 404 — User not on team

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "message": "string"
}
```
