# GET /api/1/team/{team_id}/projects

List a team's projects

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
      "team_id": 272686,
      "project_id": 178030
    }
  ]
}
```

## Parameters

### Path Parameters

| Name      | Type      | Required | Description |
| --------- | --------- | -------- | ----------- |
| `team_id` | `integer` | Yes      | -           |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": {
    "team_id": 0,
    "project_id": 0
  }
}
```
