# GET /api/1/team/{team_id}/users

List a team's users

## Parameters

### Path Parameters

| Name      | Type     | Required | Description |
| --------- | -------- | -------- | ----------- |
| `team_id` | `string` | Yes      | -           |

### Query Parameters

| Name   | Type      | Required | Description                                                                            |
| ------ | --------- | -------- | -------------------------------------------------------------------------------------- |
| `page` | `integer` | No       | Results are returned in sets of 5000. Access more results by specifying `page=2`, etc. |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
    "err": 0,
    "result": ["result": {}]
  }
```
