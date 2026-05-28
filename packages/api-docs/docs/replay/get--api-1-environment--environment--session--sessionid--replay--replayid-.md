# GET /api/1/environment/{environment}/session/{sessionId}/replay/{replayId}

Get a session replay

Retrieves the replay payload for a recorded session in the specified environment. Requires a project access token with `read` scope.

## Parameters

### Path Parameters

| Name          | Type     | Required | Description                                             |
| ------------- | -------- | -------- | ------------------------------------------------------- |
| `environment` | `string` | Yes      | The environment slug for the session replay             |
| `sessionId`   | `string` | Yes      | The session identifier provided in the replay payload   |
| `replayId`    | `string` | Yes      | The replay identifier generated for the session payload |

## Responses

### 200 — success

**Content-Type:** `application/json; charset=utf-8`

```json
{
  "err": 0,
  "result": {
    "events": [
      {
        "project_id": 0,
        "environment": "string",
        "session_id": "string",
        "span_id": "string",
        "name": "string",
        "start_time": "string",
        "duration": 0,
        "span_count": null,
        "attributes": [
          {
            "name": "string",
            "value": "string"
          }
        ],
        "timeline_events": [
          {
            "name": "string",
            "time": "string",
            "attributes": [
              {
                "name": "string",
                "value": "string"
              }
            ]
          }
        ],
        "rrweb_replay_events": [
          {
            "time": "string",
            "type": "string",
            "data": null
          }
        ]
      }
    ]
  }
}
```
