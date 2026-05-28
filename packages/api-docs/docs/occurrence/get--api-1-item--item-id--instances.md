# GET /api/1/item/{item_id}/instances

List all occurrences in an item

Returns all occurrences of an item, in pages of 20. Order is descending by occurrence ID (which is approximately descending by timestamp).

## Parameters

### Path Parameters

| Name      | Type      | Required | Description |
| --------- | --------- | -------- | ----------- |
| `item_id` | `integer` | Yes      | The item ID |

## Responses

### 200 — success

**Content-Type:** `application/json; charset=utf-8`

```json
{
  "err": 0,
  "result": {
    "page": 0,
    "instances": [null]
  }
}
```
