# DELETE /api/1/project/{project_id}/access_token

Delete a project access token (token identifier in the body)

To delete a project access token, provide either the
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
  "project_access_token": "string"
}
```

## Responses

### 200 — success

**Content-Type:** `application/json`
