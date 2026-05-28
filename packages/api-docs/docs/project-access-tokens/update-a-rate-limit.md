# PATCH /api/1/project/{project_id}/access_token/{token_identifier}

Update a rate limit (token identifier in the path)

To update the rate limit, include either the legacy access token or the
secure public ID in the token_identifier field of the URL.

## Parameters

### Path Parameters

| Name               | Type      | Required | Description                                                                                                                 |
| ------------------ | --------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `project_id`       | `integer` | Yes      | -                                                                                                                           |
| `token_identifier` | `string`  | Yes      | For a legacy token, this field will be interpreted as the `access_token`; otherwise, it will be treated as the `public_id`. |

## Request Body

**Content-Type:** `application/json`

```json
{
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
