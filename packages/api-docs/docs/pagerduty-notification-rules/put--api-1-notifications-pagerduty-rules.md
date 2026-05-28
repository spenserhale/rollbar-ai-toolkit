# PUT /api/1/notifications/pagerduty/rules

Replace existing notification rules

This endpoint replaces all existing rules for the channel with the ones
provided. To update a specific rule, use the `/api/1/notifications/slack/rule/{rule_id}`
endpoint instead. To add new rules, use the `POST` endpoint.

## Request Body

**Content-Type:** `application/json`

Array of items

## Responses

### 200 — Success

**Content-Type:** `application/json; charset=utf-8`

```json
{
  "err": 0,
  "result": null
}
```
