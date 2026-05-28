# GET /api/1/teams

List all teams

## Parameters

### Header Parameters

| Name                     | Type     | Required | Description                                   |
| ------------------------ | -------- | -------- | --------------------------------------------- |
| `X-Rollbar-Access-Token` | `string` | Yes      | Use an Account Access Token with 'read' scope |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
    "err": 0,
    "result": ["result": {}]
  }
```
