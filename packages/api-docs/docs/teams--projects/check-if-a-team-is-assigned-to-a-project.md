# GET /api/1/team/{team_id}/project/{project_id}

Check if a team is assigned to a project

Returns `200` if the team is assigned to a project, `404` if the team is not assigned to the project.

# Example responses

```json
{
  "err": 0,
  "result": {
    "team_id": 272686,
    "project_id": 165090
  }
}
```

```json
{
  "err": 1,
  "message": "Project is not in this Team."
}
```

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
  "err": 0,
  "result": {
    "team_id": 0,
    "user_id": 0
  }
}
```

### 404 — Project not on team

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "message": "string"
}
```
