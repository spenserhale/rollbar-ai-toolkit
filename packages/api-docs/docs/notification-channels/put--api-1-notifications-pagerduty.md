# PUT /api/1/notifications/pagerduty

Operation

Configuring PagerDuty integration

## Request Body

**Content-Type:** `application/json`

```json
{
  "enabled": true,
  "service_key": "string"
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
