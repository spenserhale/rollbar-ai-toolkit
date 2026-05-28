# PATCH /api/1/item/{itemid}

Update an item

Used to modify an item's state. Currently supports:

- setting the status, level, title, assigned user
- when resolving, setting the "resolved in version"
- snoozing / unsnoozing an item (only available for paid accounts)
- setting the item owner to a team (only available for Advanced and Enterprise accounts)

Example -

```curl
curl -X PATCH 'https://api.rollbar.com/api/1/item/275123456' \
  --header "Content-Type: application/json" \
  --data '{"status": "resolved", "resolved_in_version": "aabbcc1"}'
```

## Parameters

### Path Parameters

| Name     | Type      | Required | Description                                                      |
| -------- | --------- | -------- | ---------------------------------------------------------------- |
| `itemid` | `integer` | Yes      | System-wide id (not project counter) of the item to be modified. |

## Request Body

**Content-Type:** `application/json`

```json
{
  "status": "string",
  "resolved_in_version": "string",
  "title": "string",
  "level": "string",
  "assigned_user_id": 0,
  "assigned_team_id": 0,
  "snooze_enabled": true,
  "snooze_expiration_in_seconds": 0
}
```

## Responses

### 200 — OK

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": {
    "status": "string",
    "resolved_in_version": "string",
    "title": "string",
    "level": "string",
    "assigned_user_id": 0,
    "assigned_team_id": 0,
    "snooze_enabled": true,
    "snooze_expiration_in_seconds": 0
  }
}
```

### 400 — Error

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "message": "string"
}
```
