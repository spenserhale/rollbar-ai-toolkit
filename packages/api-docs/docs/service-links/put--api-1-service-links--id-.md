# PUT /api/1/service_links/{id}

Operation

Replace existing Service Link

## Parameters

### Path Parameters

| Name | Type      | Required | Description         |
| ---- | --------- | -------- | ------------------- |
| `id` | `integer` | Yes      | The service link ID |

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
  "result": null
}
```
