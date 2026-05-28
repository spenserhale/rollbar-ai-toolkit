# PATCH /api/1/project/{project_id}/access_token

Update a rate limit (token identifier in the body)

To update a rate limit for a project access token, provide either the
project_access_token value or the token’s public_id in the body
parameters.

## Parameters

### Path Parameters

| Name         | Type      | Required | Description |
| ------------ | --------- | -------- | ----------- |
| `project_id` | `integer` | Yes      | -           |

## Request Body

**Content-Type:** `application/json`

```json
{
  "public_id": "string",
  "project_access_token": "string",
  "rate_limit_window_count": 0,
  "rate_limit_window_size": 0
}
```

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
  "err": 0
}
```
