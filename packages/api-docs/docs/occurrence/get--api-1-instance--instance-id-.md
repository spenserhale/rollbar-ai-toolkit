# GET /api/1/instance/{instance_id}

Get an occurrence

Returns a JSON object describing the occurrence. This is similar to the "Raw JSON" section of the occurrence detail page.

`instance_id` must be an Occurrence ID for an occurrence in the project. These IDs are returned as the `id`
field in other occurrence API calls, and can be found in the Rollbar UI on URLs like
`https://rollbar.com/Rollbar/demo/items/54/occurrences/3209095494/` (`3209095494` is the Occurrence ID).

## Parameters

### Path Parameters

| Name          | Type      | Required | Description       |
| ------------- | --------- | -------- | ----------------- |
| `instance_id` | `integer` | Yes      | The occurrence ID |

## Responses

### 200 — success

**Content-Type:** `application/json; charset=utf-8`

```json
{
  "err": 0,
  "result": {
    "id": 0,
    "project_id": 0,
    "item_id": 0,
    "timestamp": 0,
    "version": 0,
    "data": null,
    "billable": 0
  }
}
```
