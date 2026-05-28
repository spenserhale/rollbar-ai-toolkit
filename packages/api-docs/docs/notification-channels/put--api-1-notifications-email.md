# PUT /api/1/notifications/email

Operation

Configuring Email Notifications integration

## Request Body

**Content-Type:** `application/json`

```json
{
  "enabled": true,
  "include_request_params": true
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
