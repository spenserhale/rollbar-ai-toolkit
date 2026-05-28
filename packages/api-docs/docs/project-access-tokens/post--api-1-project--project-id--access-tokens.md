# POST /api/1/project/{project_id}/access_tokens

Create a project access token

## Parameters

### Path Parameters

| Name         | Type      | Required | Description    |
| ------------ | --------- | -------- | -------------- |
| `project_id` | `integer` | Yes      | The project ID |

### Header Parameters

| Name                     | Type     | Required | Description                                    |
| ------------------------ | -------- | -------- | ---------------------------------------------- |
| `X-Rollbar-Access-Token` | `string` | Yes      | Use an Account Access Token with 'write' scope |

## Request Body

**Content-Type:** `application/json`

```json
{
  "name": "string",
  "scopes": ["string"],
  "status": "string",
  "rate_limit_window_size": 0,
  "rate_limit_window_count": 0,
  "token_type": "string"
}
```

## Responses

### 200 — Response data for slack notification configuration

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": null
}
```
