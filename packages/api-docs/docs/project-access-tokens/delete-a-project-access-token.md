# DELETE /api/1/project/{project_id}/access_token/{token_identifier}

Delete a project access token (token identifier in the path)

To delete a project access token, include either the legacy access token or the
secure public ID in the token_identifier field of the URL.

## Parameters

### Path Parameters

| Name               | Type      | Required | Description                                                                                                                 |
| ------------------ | --------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `project_id`       | `integer` | Yes      | -                                                                                                                           |
| `token_identifier` | `string`  | Yes      | For a legacy token, this field will be interpreted as the `access_token`; otherwise, it will be treated as the `public_id`. |

## Responses

### 200 — success

**Content-Type:** `application/json`
