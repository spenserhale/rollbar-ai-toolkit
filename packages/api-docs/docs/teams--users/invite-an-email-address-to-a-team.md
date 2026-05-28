# POST /api/1/team/{team_id}/invites

Invite an email address to a team

Invites a user to the specific team, using the user's email address.

If the email address belongs to an existing Rollbar user, they will be immediately added to the team, and sent an email notification. Otherwise, an invite email will be sent, containing a signup link that will allow the recipient to join the specified team.

# Example Response

```
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

| Name      | Type     | Required | Description |
| --------- | -------- | -------- | ----------- |
| `team_id` | `string` | Yes      | -           |

## Request Body

**Content-Type:** `application/json`

```json
{
  "email": "string"
}
```

## Responses

### 200 — Invited user to team

**Content-Type:** `application/json`

```json
{
    "err": 0,
    "result": "result": {}
  }
```
