# GET /api/1/deploy/{deploy_id}

Get a deploy

`deploy_id` must be an ID for a deploy in the project. These IDs are returned as the id field in other API calls, and can be found in the Rollbar UI on URLs like `https://rollbar.com/deploy/12345/` (`12345` is the Deploy ID).

## Parameters

### Path Parameters

| Name        | Type      | Required | Description                  |
| ----------- | --------- | -------- | ---------------------------- |
| `deploy_id` | `integer` | Yes      | System-wide id of the deploy |

## Responses

### 200 — Success

**Content-Type:** `application/json`

```json
{
    "err": 0,
    "result": "items": {}
  }
```
