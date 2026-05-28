# DELETE /api/1/team/{team_id}/user/{user_id}

Remove a user from a team

## Parameters

### Path Parameters

| Name      | Type     | Required | Description |
| --------- | -------- | -------- | ----------- |
| `team_id` | `string` | Yes      | -           |
| `user_id` | `string` | Yes      | -           |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
  "err": 0
}
```
