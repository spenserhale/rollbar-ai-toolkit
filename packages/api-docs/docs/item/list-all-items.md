# GET /api/1/items

List all items

# Examples

Get the 101st through 199th active items:

```curl
curl -H "X-Rollbar-Access-Token: YOUR_ACCESS_TOKEN" 'https://api.rollbar.com/api/1/items/?status=active&page=2'
```

Get the first page of items that are error or critical, in the production environment:

```curl
curl -H "X-Rollbar-Access-Token: YOUR_ACCESS_TOKEN" 'https://api.rollbar.com/api/1/items/?level=error&level=critical&environment=production'
```

Note that the `total_count` in the `result` will return `null` if your project has more than 100,000 unique items.

## Parameters

### Query Parameters

| Name            | Type      | Required | Description                                                                                                                                                                                                                                             |
| --------------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assigned_user` | `string`  | No       | If not empty, only items assigned to the specified user will be returned. Must be a valid Rollbar username, or you can use the keywords `assigned` (items that are assigned to any user or team) or `unassigned` (items with no assigned user or team). |
| `assigned_team` | `array`   | No       | If not empty, only items assigned to the specified team will be returned. Must be a valid Rollbar team name. Specify multiple times to filter by multiple teams. Cannot be combined with `assigned_user`.                                               |
| `environment`   | `string`  | No       | If not empty, only items in the specified environment will be returned. Specify multiple times to filter by multiple environments.                                                                                                                      |
| `framework`     | `string`  | No       | If not empty, only items in the specified framework will be returned. Specify multiple times to filter by multiple frameworks.                                                                                                                          |
| `ids`           | `array`   | No       | (comma-separated list of integers) if not empty, list of item IDs to return, instead of using all items in the project                                                                                                                                  |
| `level`         | `string`  | No       | If not empty, only items with the specified level will be returned. Valid values: `debug`, `info`, `warning`, `error`, `critical`. Specifiy multiple times to filter by multiple levels.                                                                |
| `page`          | `integer` | No       | Page number, starting from 1. 100 items are returned per page by default.                                                                                                                                                                               |
| `query`         | `string`  | No       | A search string, using the same format as the search box on the Items page.                                                                                                                                                                             |
| `status`        | `string`  | No       | If not empty, only items with the specified status will be returned. Valid values: `active`, `resolved`, `muted`, `archived`. Specify multiple times to filter by multiple statuses.                                                                    |
| `is_snoozed`    | `boolean` | No       | If true, only snoozed items will be returned. If false, snoozed items will be excluded.                                                                                                                                                                 |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": {
    "page": 0,
    "total_count": 0,
    "items": [
      {
        "public_item_id": 0,
        "integrations_data": "string",
        "level_lock": 0,
        "controlling_id": 0,
        "last_activated_timestamp": 0,
        "assigned_user_id": 0,
        "assigned_team_id": 0,
        "group_status": 0,
        "hash": "string",
        "id": 0,
        "environment": "string",
        "title_lock": 0,
        "title": "string",
        "last_occurrence_id": 0,
        "platform": "string",
        "last_occurrence_timestamp": 0,
        "first_occurrence_timestamp": 0,
        "project_id": 0,
        "resolved_in_version": "string",
        "status": "string",
        "unique_occurrences": 0,
        "group_item_id": 0,
        "framework": "string",
        "level": "string",
        "total_occurrences": 0,
        "counter": 0,
        "last_modified_by": 0,
        "first_occurrence_id": 0,
        "activating_occurrence_id": 0,
        "last_resolved_timestamp": 0
      }
    ]
  }
}
```
