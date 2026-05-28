# GET /api/1/user/{user_id}/projects

List a user's projects

# Example response:

````json
{
  "err": 0,
  "result": {
    "projects": [
      {
        "status": 1,
        "slug": "mox",
        "id": 1,
        "account_id": 61
      },
      {
        "status": 1,
        "slug": "moxrts",
        "id": 25,
        "account_id": 61
      }
    ]
  }
}```


## Parameters

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `user_id` | `integer` | Yes | - |
## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
    "err": 0,
    "result": {
      "projects": [{
          "slug": "string",
          "id": 0,
          "account_id": 0,
          "status": 0
        }]
    }
  }
````
