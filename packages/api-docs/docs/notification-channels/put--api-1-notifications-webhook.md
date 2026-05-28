# PUT /api/1/notifications/webhook

Operation

Configuring Webhook integration

## Request Body

**Content-Type:** `application/json`

```json
{
  "enabled": true,
  "url": "string"
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
