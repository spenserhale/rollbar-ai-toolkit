# POST /api/1/service_links

Operation

Create Service Links

## Parameters

### Header Parameters

| Name                     | Type     | Required | Description                                   |
| ------------------------ | -------- | -------- | --------------------------------------------- |
| `X-Rollbar-Access-Token` | `string` | Yes      | Use a Project Access Token with 'write' scope |

## Request Body

**Content-Type:** `application/json`

```json
{
  "id": 0,
  "name": "string",
  "template": "string"
}
```

## Responses

### 200 — Success

**Content-Type:** `application/json; charset=utf-8`

```json
{
  "err": 0,
  "result": {
    "id": 0,
    "name": "string",
    "template": "string"
  }
}
```
