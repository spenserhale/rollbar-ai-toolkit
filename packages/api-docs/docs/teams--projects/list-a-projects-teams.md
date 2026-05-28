# GET /api/1/project/{project_id}/teams

List a project's teams

# Example Response

```json
{
  "err": 0,
  "result": [
    {
      "team_id": 272686,
      "project_id": 178029
    },
    {
      "team_id": 272687,
      "project_id": 178029
    }
  ]
}
```

## Parameters

### Path Parameters

| Name         | Type      | Required | Description |
| ------------ | --------- | -------- | ----------- |
| `project_id` | `integer` | Yes      | -           |

### Query Parameters

| Name                    | Type      | Required | Description                                                                             |
| ----------------------- | --------- | -------- | --------------------------------------------------------------------------------------- |
| `exclude_builtin_teams` | `integer` | No       | When true ('1' or 'true'), excludes built-in teams (Owners, Everyone) from the response |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
    "err": 0,
    "result": "result": {}
  }
```
