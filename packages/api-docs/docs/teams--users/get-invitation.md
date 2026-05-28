# GET /api/1/invite/{invite_id}

Get invitation

# Example Response

```json
{
  "err": 0,
  "result": {
    "id": 71328,
    "from_user_id": 5325,
    "team_id": 272686,
    "to_email": "gilfoyle@piedpiper.com",
    "status": "pending",
    "date_created": 1519946545,
    "date_redeemed": null
  }
}
```

## Parameters

### Path Parameters

| Name        | Type     | Required | Description |
| ----------- | -------- | -------- | ----------- |
| `invite_id` | `string` | Yes      | -           |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": {
    "id": 0,
    "from_user_id": 0,
    "team_id": 0,
    "to_email": "string",
    "status": "string",
    "date_created": 0,
    "date_redeeemd": 0
  }
}
```
