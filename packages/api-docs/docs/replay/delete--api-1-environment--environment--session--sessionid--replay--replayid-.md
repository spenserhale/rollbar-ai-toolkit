# DELETE /api/1/environment/{environment}/session/{sessionId}/replay/{replayId}

Delete a session replay

Deletes a replay for a recorded session in the specified environment. Requires a project access token with `write` scope.

## Responses

### 200 — Success

**Content-Type:** `application/json; charset=utf-8`

```json
{
  "err": 0,
  "result": null
}
```
