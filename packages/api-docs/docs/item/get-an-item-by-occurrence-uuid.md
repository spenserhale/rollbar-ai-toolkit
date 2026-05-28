# GET /api/1/item/

Get an item (by UUID)

The `UUID` must be an ocurrence UUID for an occurrence in the item. Occurrence UUIDs are part of the response in https://docs.rollbar.com/reference/create-item.

## Parameters

### Query Parameters

| Name   | Type     | Required | Description                       |
| ------ | -------- | -------- | --------------------------------- |
| `uuid` | `string` | Yes      | UUID of an occurrence in the item |
|        |

## Responses

### 200 — OK

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": {
    "id": 0,
    "project_id": 0,
    "counter": 0,
    "environment": "string",
    "platform": "string",
    "framework": "string",
    "hash": "string",
    "title": "string",
    "first_occurrence_id": 0,
    "first_occurrence_timestamp": 0,
    "activating_occurrence_id": 0,
    "last_activated_timestamp": 0,
    "last_resolved_timestamp": 0,
    "last_muted_timestamp": 0,
    "last_occurrence_id": 0,
    "last_occurrence_timestamp": 0,
    "total_occurrences": 0,
    "last_modified_by": "string",
    "status": "string",
    "level": "string",
    "integrations_data": null,
    "assigned_user_id": 0,
    "assigned_team_id": 0,
    "group_item_id": 0,
    "group_status": 0,
    "snooze_status": true,
    "snooze_type": "string",
    "snooze_expiration_threshold_seconds": 0,
    "snooze_expiration_datetime": 0
  }
}
```

### 400 — The format of the UUID is invalid.

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "message": "string"
}
```

### 404 — No occurrence matching the given UUID was found.

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "message": "string"
}
```
