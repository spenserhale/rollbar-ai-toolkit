# GET /api/1/versions/{version}/items

List items by code version

List items that have occurrences for one specific code version.

https://docs.rollbar.com/docs/versions

## Parameters

### Query Parameters

| Name          | Type     | Required | Description                                                                                                                    |
| ------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `environment` | `string` | Yes      | For one code version list the items only for this environment                                                                  |
| `event`       | `string` | Yes      | Filter the list of items by the item event produced on the code version. One item can have one of these events in one version: |

- `new` for new items in the code version
- `repeated` for an item that already existed in preivous versions
- `reactivated` an item that was resolved but was reactivated in the code version
- `resolved` an item resolved in one specific version
  |
  | `level` | `array` | No | Filter the list of items by level. Multiple levels can be used, and all items for all levels will be returned if no one is specified. |

## Responses

### 200 — success

**Content-Type:** `application/json; charset=utf-8`

Type: `object`
