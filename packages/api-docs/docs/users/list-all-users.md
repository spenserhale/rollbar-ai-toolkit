# GET /api/1/users

List all users

List all users who are members of an account
#Response Format

```json
{
  "err": 0,
  "result": {
    "users": [
      {
        "username": "brianr",
        "id": 1,
        "email": "brian@rollbar.com"
      },
      {
        "username": "coryvirok",
        "id": 2,
        "email": "cory@rollbar.com"
      }
    ]
  }
}
```

## Parameters

### Query Parameters

| Name    | Type     | Required | Description                               |
| ------- | -------- | -------- | ----------------------------------------- |
| `email` | `string` | No       | Filter the list of users by email address |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": [
    {
      "username": "string",
      "id": 0,
      "email": "string"
    }
  ]
}
```
