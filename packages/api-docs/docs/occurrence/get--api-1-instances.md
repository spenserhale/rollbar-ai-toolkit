# GET /api/1/instances

List all occurrences in a project

Returns all occurrences in the project, in pages of 20. Order is descending by occurrence ID (which is approximately descending by timestamp).

## Parameters

### Query Parameters

| Name     | Type      | Required | Description                                                                                                                                                                                                               |
| -------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lastId` | `integer` | No       | Instead of using the page number, you can pass the ID of the last occurrence listed on the page and it will be return the next 20 instances after that last occurrence ID. Overrides the page number if both are present. |
| `page`   | `integer` | No       | Page number, starting from 1. The default number of elements returned per page is 20. Set the limit parameter to update that.                                                                                             |
| `limit`  | `integer` | No       | Sets the limit for number of items returned per page. Default is 20 and the max is 5000.                                                                                                                                  |

### Header Parameters

| Name                     | Type     | Required | Description                                  |
| ------------------------ | -------- | -------- | -------------------------------------------- |
| `X-Rollbar-Access-Token` | `string` | Yes      | Use a Project Access Token with 'read' scope |

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
