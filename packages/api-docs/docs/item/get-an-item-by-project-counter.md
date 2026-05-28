# GET /api/1/item_by_counter/{counter}

Get an item (by project counter)

`counter` must be an item counter for an item in the project. The counter can be found in URLs like `https://rollbar.com/myaccount/myproject/items/456/` (456 is the counter).

The success response is a 301 redirect like this:

```
HTTP/1.1 301 Moved Permanently
Location: /api/1/item/272505123

{
  "err": 0,
  "result": {
    "itemId": 272505123,
    "path": "/api/1/item/272505123",
    "uri": "/api/1/item/272505123"
  }
}
```

## Parameters

### Path Parameters

| Name      | Type      | Required | Description                             |
| --------- | --------- | -------- | --------------------------------------- |
| `counter` | `integer` | Yes      | item counter for an item in the project |

`counter` must be an item counter for an item in the project.
The counter can be found in URLs like https://rollbar.com/myaccount/myproject/items/456/
(456 is the counter).
|

## Responses

### 301 — OK

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": {
    "itemId": 0,
    "path": "string",
    "uri": "string"
  }
}
```
