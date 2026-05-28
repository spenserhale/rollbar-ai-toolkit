# DELETE /api/1/team/{team_id}/project/{project_id}

Remove a team from a project

## Parameters

### Path Parameters

| Name         | Type      | Required | Description |
| ------------ | --------- | -------- | ----------- |
| `team_id`    | `integer` | Yes      | -           |
| `project_id` | `integer` | Yes      | -           |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
  "err": 0
}
```
