# PUT /api/1/notifications/slack

Operation

Configuring Slack integration

## Request Body

**Content-Type:** `application/json`

```json
{
  "enabled": true,
  "service_account_id": 0,
  "channel": "string",
  "show_message_buttons": true
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
