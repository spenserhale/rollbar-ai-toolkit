# PUT /api/1/team/{team_id}/project/{project_id}

Assign a team to a project

# Example Response

```json
{
  "err": 0,
  "result": {
    "team_id": 272686,
    "project_id": 165090
  }
}
```

## Parameters

### Path Parameters

| Name         | Type      | Required | Description |
| ------------ | --------- | -------- | ----------- |
| `team_id`    | `integer` | Yes      | -           |
| `project_id` | `string`  | Yes      | -           |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
    "err": 0,
    "result": "result": {}
  }
```
