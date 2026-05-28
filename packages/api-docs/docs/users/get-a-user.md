# GET /api/1/user/{user_id}

Get a user

Get user details for a given account

Returns basic information about the user, as relevant to the account your access token is for. This is the same information available on the "Members" page in the Rollbar UI.

# Sample Response

```json
{
  "err": 0,
  "result": {
    "id": 14,
    "username": "brian",
    "email": "brian@rollbar.com",
    "email_enabled": 1
  }
}
```

## Parameters

### Path Parameters

| Name      | Type      | Required | Description |
| --------- | --------- | -------- | ----------- |
| `user_id` | `integer` | Yes      | -           |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": null
}
```
