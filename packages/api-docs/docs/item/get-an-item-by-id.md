# GET /api/1/item/{itemid}

Get an item (by ID)

`itemid` must be an item ID for an item in the project. These IDs are returned as the id field in other API calls.

Note that they are NOT found in in URLs like `https://rollbar.com/myaccount/myproject/items/456/` – that is the "counter", which can be used in the following API call.

## Parameters

### Path Parameters

| Name     | Type      | Required | Description           |
| -------- | --------- | -------- | --------------------- |
| `itemid` | `integer` | Yes      | Unique ID of the item |

`itemid` must be an item ID for an item in the project.
These IDs are returned as the id field in other API calls.

Note that they are NOT found in in URLs like
https://rollbar.com/myaccount/myproject/items/456/ – that
is the "counter", which can be used in the following API call.
|

## Responses

### 200 — OK

**Content-Type:** `application/json`

```json
{
    "err": 0,
    "result": "result": {}
  }
```
