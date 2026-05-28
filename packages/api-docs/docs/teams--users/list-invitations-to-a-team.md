# GET /api/1/team/{team_id}/invites

List invitations to a team

Returns all invites ever sent for the team–pending, accepted, rejected, and canceled.

# Example response

```
{
  "err": 0,
  "result": [
    {
      "id": 71328,
      "from_user_id": 5325,
      "team_id": 272686,
      "to_email": "gilfoyle@pidepiper.com",
      "status": "pending",
      "date_created": 1519946545,
      "date_redeemed": null
    }
  ]
}
```

## Parameters

### Path Parameters

| Name      | Type      | Required | Description |
| --------- | --------- | -------- | ----------- |
| `team_id` | `integer` | Yes      | -           |

### Query Parameters

| Name   | Type      | Required | Description                                                                  |
| ------ | --------- | -------- | ---------------------------------------------------------------------------- |
| `page` | `integer` | No       | Returns up to 5000 results. Add `&page=2` to the URL to go to the next page. |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
    "err": 0,
    "result": ["result": {}]
  }
```
